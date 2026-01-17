import { alpha, Box, Button, useTheme, RotatingIcon } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React from 'react';
import { IntroSettingsType, Types } from '../reducers';
import Dialog from '../../../../components/Dialog';
import { Warn } from '@dodoex/icons';
import { useSaveCPIntro } from '../hooks/useSaveCPIntro';
import { useUploadImages } from '../hooks/useUploadImages';
import { useSignMessage } from '../../../../hooks/contract/useSignMessage';
import { PageType, useRouterStore } from '../../../../router';
import { ReactComponent as WebsiteIcon } from '../../../../assets/soical/website.svg';
import { ReactComponent as TwitterIcon } from '../../../../assets/soical/twitter.svg';
import { ReactComponent as DiscordIcon } from '../../../../assets/soical/website.svg';
import { ReactComponent as TelegramIcon } from '../../../../assets/soical/telegram.svg';

interface IntroSettingsConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  cpAddress: string;
  introSettings: IntroSettingsType;
  chainId: number | undefined;
  dispatch: (action: { type: Types; payload: any }) => void;
}

// Social icon wrapper component
const SocialIconWrapper = ({
  enabled,
  href,
  children,
}: {
  enabled: boolean;
  href: string | undefined;
  children: React.ReactNode;
}) => {
  const theme = useTheme();
  if (!enabled) return null;
  return (
    <Box
      component="a"
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        backgroundColor: alpha(theme.palette.text.primary, 0.1),
        color: 'text.primary',
        '&:hover': {
          opacity: 0.5,
        },
      }}
    >
      {children}
    </Box>
  );
};

const dataURLtoFile = (dataURL: string, filename: string): File => {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};

export default function IntroSettingsConfirmDialog({
  open,
  onClose,
  cpAddress,
  introSettings,
  chainId,
  dispatch,
}: IntroSettingsConfirmDialogProps) {
  const theme = useTheme();
  const saveCPIntroMutation = useSaveCPIntro();
  const { mutateAsync: saveCPIntro, isPending: isSaving } = saveCPIntroMutation;
  const { signHeader } = useSignMessage();
  const uploadImagesMutation = useUploadImages();
  const { mutateAsync: uploadImages, isPending: isUploading } =
    uploadImagesMutation;
  const router = useRouterStore();

  const handleSave = async () => {
    const { coverImageUrl, description } = introSettings;
    const header = await signHeader();

    const filesToUpload: File[] = [];
    const urlToIndexMap = new Map<string, number>();

    let fileIndex = 0;

    const isCoverBase64 = coverImageUrl?.startsWith('data:');
    if (isCoverBase64) {
      const file = dataURLtoFile(coverImageUrl, `cover-${Date.now()}.jpg`);
      filesToUpload.push(file);
      urlToIndexMap.set(coverImageUrl, fileIndex);
      fileIndex++;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    const images = doc.querySelectorAll('img');
    const base64ImageUrls = new Set<string>();

    images.forEach((img) => {
      const src = img.getAttribute('src');
      if (src?.startsWith('data:')) {
        base64ImageUrls.add(src);
      }
    });

    base64ImageUrls.forEach((base64Url) => {
      const file = dataURLtoFile(
        base64Url,
        `image-${Date.now()}-${urlToIndexMap.size}.jpg`,
      );
      filesToUpload.push(file);
      urlToIndexMap.set(base64Url, fileIndex);
      fileIndex++;
    });

    let uploadedUrls: string[] = [];
    if (filesToUpload.length > 0) {
      uploadedUrls = await uploadImages({
        files: filesToUpload,
        crowdpoolingAddress: cpAddress,
        header,
      });
    }

    let updatedCoverImageUrl = coverImageUrl;
    if (isCoverBase64 && urlToIndexMap.has(coverImageUrl)) {
      const index = urlToIndexMap.get(coverImageUrl)!;
      updatedCoverImageUrl = uploadedUrls[index] || coverImageUrl;
    }

    let updatedDescription = description;
    base64ImageUrls.forEach((base64Url) => {
      const index = urlToIndexMap.get(base64Url);
      if (index !== undefined && uploadedUrls[index]) {
        updatedDescription = updatedDescription.replace(
          new RegExp(base64Url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          uploadedUrls[index],
        );
      }
    });

    await saveCPIntro({
      introSettings: {
        ...introSettings,
        coverImageUrl: updatedCoverImageUrl,
        description: updatedDescription,
      },
      cpAddress,
      header,
    });

    dispatch({
      type: Types.UpdateIntroSettings,
      payload: {
        coverImageUrl: updatedCoverImageUrl,
        // description: updatedDescription,
      },
    });

    onClose();
    router.push({
      type: PageType.CrowdpoolingDetail,
      params: {
        address: cpAddress,
        chainId: chainId!,
      },
    });
  };

  const {
    projectName,
    coverImageUrl,
    description,
    websiteUrl,
    twitterUrl,
    telegramUrl,
    discordUrl,
    enabledSocialLinks,
  } = introSettings;

  return (
    <Dialog
      modal
      open={open}
      onClose={onClose}
      title={<Trans>Confirm Project Intro</Trans>}
    >
      <Box
        sx={{
          px: 20,
          width: {
            mobile: '100%',
            tablet: 420,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Warning Message */}
          <Box
            sx={{
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              p: '12px',
              borderRadius: '8px',
              color: 'warning.main',
              typography: 'body2',
              lineHeight: 1.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
              }}
            >
              <Warn />
            </Box>
            <Trans>
              Please review your information carefully. It cannot be changed
              after submission. Contact our team if needed.
            </Trans>
          </Box>

          {/* Project Name */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <Box
              sx={{
                typography: 'body2',
                color: 'text.secondary',
                textTransform: 'capitalize',
              }}
            >
              <Trans>Project name</Trans>
            </Box>
            <Box
              sx={{
                typography: 'h5',
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {projectName || '-'}
            </Box>
          </Box>

          {/* Cover Image */}
          {coverImageUrl && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                  textTransform: 'capitalize',
                }}
              >
                <Trans>Cover image</Trans>
              </Box>
              <Box
                component="img"
                src={coverImageUrl}
                alt="Cover"
                sx={{
                  width: '100%',
                  height: '95px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: 'solid 1px',
                  borderColor: 'border.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </Box>
          )}

          {/* Social Links */}
          {(enabledSocialLinks.website ||
            enabledSocialLinks.twitter ||
            enabledSocialLinks.discord ||
            enabledSocialLinks.telegram) && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                }}
              >
                <Trans>Social Links</Trans>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <SocialIconWrapper
                  enabled={enabledSocialLinks.website}
                  href={websiteUrl}
                >
                  <WebsiteIcon />
                </SocialIconWrapper>
                <SocialIconWrapper
                  enabled={enabledSocialLinks.twitter}
                  href={twitterUrl}
                >
                  <TwitterIcon />
                </SocialIconWrapper>
                <SocialIconWrapper
                  enabled={enabledSocialLinks.discord}
                  href={discordUrl}
                >
                  <DiscordIcon />
                </SocialIconWrapper>
                <SocialIconWrapper
                  enabled={enabledSocialLinks.telegram}
                  href={telegramUrl}
                >
                  <TelegramIcon />
                </SocialIconWrapper>
              </Box>
            </Box>
          )}

          {/* Project Intro */}
          {description && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.secondary',
                }}
              >
                <Trans>Project Intro</Trans>
              </Box>
              <Box
                sx={{
                  typography: 'body2',
                  color: 'text.primary',
                  '& h2': {
                    typography: 'body1',
                    fontWeight: 600,
                  },
                  '& img': {
                    width: '100%',
                  },
                  '& p': {
                    margin: 0,
                  },
                  '& blockquote': {
                    borderLeft: `4px solid ${theme.palette.border.main}`,
                    my: 5,
                    ml: 0,
                    pl: 16,
                  },
                }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </Box>
          )}
        </Box>

        {/* Footer Buttons */}
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            py: 20,
          }}
        >
          <Button
            onClick={onClose}
            size={Button.Size.big}
            variant={Button.Variant.second}
            sx={{
              flex: 1,
            }}
          >
            <Trans>Back</Trans>
          </Button>
          <Button
            onClick={handleSave}
            size={Button.Size.big}
            disabled={isSaving || isUploading}
            isLoading={isSaving || isUploading}
            sx={{
              flex: 1,
            }}
          >
            <Trans>Save</Trans>
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
