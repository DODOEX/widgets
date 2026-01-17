import {
  alpha,
  Box,
  Button,
  Checkbox,
  Input,
  useTheme,
} from '@dodoex/components';
import { Trans } from '@lingui/macro';
import React, { useRef, useState } from 'react';
import { StateProps, Types, StepStatus } from '../reducers';
import Title from './Title';
import { DoneFilled, Plus, Warn } from '@dodoex/icons';
import { useIntroSettingsValidation } from '../hooks/useIntroSettingsValidation';
import ErrorTip from './ErrorTip';
import RichTextEditor from './RichTextEditor';
import { useCreateCrodpooling } from '../hooks/useCreateCrowdpooling';
import IntroSettingsConfirmDialog from './IntroSettingsConfirmDialog';
import { compressImage } from '../utils/imageCompression';

interface IntroSettingsProps {
  state: StateProps;
  dispatch: (action: { type: Types; payload: any }) => void;
  onChangeStep?: (step: StepStatus) => void;
  mutationCreate: ReturnType<typeof useCreateCrodpooling>;
}

export default function IntroSettings({
  state,
  dispatch,
  mutationCreate,
}: IntroSettingsProps) {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const cpAddress =
    mutationCreate.data || '0xfd222aab79f6db94e71479a66003051e52ee3d35';

  const { enabledSocialLinks } = state.introSettings;

  const {
    projectName,
    coverImageUrl,
    description,
    websiteUrl,
    twitterUrl,
    telegramUrl,
    discordUrl,
  } = state.introSettings;

  const isCreating = mutationCreate.isPending;
  const isCreated = mutationCreate.isSuccess;

  // Use validation hook
  const { errorKey, isValid, reCheck } = useIntroSettingsValidation(state);

  const handleSubmit = () => {
    if (!isValid) {
      reCheck();
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError('');
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Only JPG and PNG formats are supported');
        return;
      }

      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          dispatch({
            type: Types.UpdateIntroSettings,
            payload: { coverImageUrl: base64 },
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setUploadError('Failed to compress image');
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    setUploadError('');
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Only JPG and PNG formats are supported');
        return;
      }

      try {
        const compressedFile = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          dispatch({
            type: Types.UpdateIntroSettings,
            payload: { coverImageUrl: base64 },
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        setUploadError('Failed to compress image');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDeleteImage = () => {
    dispatch({
      type: Types.UpdateIntroSettings,
      payload: { coverImageUrl: '' },
    });
  };

  const handleChangeImage = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <Box
        sx={{
          pt: 40,
          pb: {
            tablet: 20,
          },
          px: {
            tablet: 110,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 28,
          }}
        >
          {isCreated ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                typography: 'h3',
              }}
            >
              <Box
                component={DoneFilled}
                sx={{
                  width: 32,
                  height: 32,
                  color: theme.palette.primary.contrastText,
                }}
              />
              <Trans>Create successfully!</Trans>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                typography: 'h3',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  animation: 'loadingRotate 1.1s infinite linear',
                  '@keyframes loadingRotate': {
                    '0%': {
                      transform: 'rotate(0deg)',
                    },
                    '100%': {
                      transform: 'rotate(359deg)',
                    },
                  },
                }}
              >
                {' '}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <circle
                    cx="16"
                    cy="16"
                    r="14.5"
                    stroke={theme.palette.text.primary}
                    strokeOpacity="0.1"
                    strokeWidth="3"
                  />
                  <path
                    d="M30.5 16C30.5 7.99187 24.0081 1.5 16 1.5"
                    stroke={theme.palette.success.main}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Box>
              <Trans>Creating pool...</Trans>
            </Box>
          )}
          <Box
            sx={{
              mt: 8,
              fontSize: 18,
              lineHeight: '27px',
            }}
          >
            {isCreated ? (
              <Trans>Add project intro to boost participation.</Trans>
            ) : (
              <Trans>
                You can add project intro after creation to boost participation.
              </Trans>
            )}
          </Box>
          <Box
            sx={{
              mt: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              p: 20,
              borderRadius: 16,
              backgroundColor: alpha(theme.palette.warning.main, 0.1),
              color: theme.palette.warning.main,
            }}
          >
            <Warn />
            <Trans>
              Please wait and do not leave this page until the project intro is
              submitted. If you leave this page, changes can only be made by
              contacting our team.
            </Trans>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
            position: 'relative',
            ...(isCreating
              ? {
                  opacity: 0.3,
                }
              : undefined),
          }}
        >
          {isCreating && (
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                zIndex: 1,
              }}
            />
          )}

          {/* Project name */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <Title>
              <Trans>Project name</Trans>
            </Title>
            <Input
              height={48}
              fullWidth
              sx={{
                backgroundColor: 'background.paperContrast',
              }}
              value={projectName}
              onChange={(e) => {
                dispatch({
                  type: Types.UpdateIntroSettings,
                  payload: { projectName: e.target.value },
                });
              }}
              placeholder="Enter project name"
            />
          </Box>

          {/* Cover Image (Optional) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <Box>
              <Title>
                <Trans>Cover Image (Optional)</Trans>
              </Title>
              <Box
                sx={{
                  mt: 4,
                  typography: 'body2',
                  color: 'text.secondary',
                }}
              >
                <Trans>Supports JPG/PNG (2000×500 px recommended)</Trans>
              </Box>
            </Box>
            <Box
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              sx={{
                height: '96px',
                borderRadius: '8px',
                border: 'dashed 1px',
                borderColor: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: 'primary.main',
                  color: 'primary.main',
                },
                position: 'relative',
              }}
            >
              {coverImageUrl ? (
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    color: 'primary.main',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Box
                    component="img"
                    src={coverImageUrl}
                    alt="Cover"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '20px',
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: alpha(theme.palette.text.primary, 0.6),
                    }}
                  >
                    {/* Delete Button */}
                    <Box
                      onClick={handleDeleteImage}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        px: '12px',
                        py: '8px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: theme.palette.primary.contrastText,
                        cursor: 'pointer',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: alpha(
                            theme.palette.primary.contrastText,
                            0.1,
                          ),
                        },
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6H4V4H9V3H15V4H20V6H19V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM17 6H7V19H17V6ZM9 17H11V8H9V17ZM13 17H15V8H13V17Z"
                          fill="currentColor"
                        />
                      </svg>
                      <Box
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        <Trans>Delete</Trans>
                      </Box>
                    </Box>

                    {/* Change Button */}
                    <Box
                      onClick={handleChangeImage}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        px: '12px',
                        py: '8px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: theme.palette.primary.contrastText,
                        cursor: 'pointer',
                        color: 'primary.contrastText',
                        '&:hover': {
                          backgroundColor: alpha(
                            theme.palette.primary.contrastText,
                            0.1,
                          ),
                        },
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11 21.9498C9.73333 21.8165 8.55417 21.4706 7.4625 20.9123C6.37083 20.354 5.42083 19.629 4.6125 18.7373C3.80417 17.8456 3.16667 16.8248 2.7 15.6748C2.23333 14.5248 2 13.2998 2 11.9998C2 10.4831 2.30417 9.08314 2.9125 7.7998C3.52083 6.51647 4.35 5.41647 5.4 4.4998H3V2.4998H9V8.4998H7V5.7748C6.08333 6.50814 5.35417 7.4123 4.8125 8.4873C4.27083 9.5623 4 10.7331 4 11.9998C4 14.0498 4.67083 15.8206 6.0125 17.3123C7.35417 18.804 9.01667 19.6748 11 19.9248V21.9498ZM15 21.4998V15.4998H17V18.2248C17.9167 17.4748 18.6458 16.5665 19.1875 15.4998C19.7292 14.4331 20 13.2665 20 11.9998C20 9.9498 19.3292 8.17897 17.9875 6.6873C16.6458 5.19564 14.9833 4.3248 13 4.0748V2.0498C15.5333 2.2998 17.6667 3.36647 19.4 5.2498C21.1333 7.13314 22 9.38314 22 11.9998C22 13.5165 21.6958 14.9165 21.0875 16.1998C20.4792 17.4831 19.65 18.5831 18.6 19.4998H21V21.4998H15Z"
                          fill="currentColor"
                        />
                      </svg>
                      <Box
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        <Trans>Change</Trans>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ) : (
                <>
                  <Box component={Plus} />
                  <Box
                    sx={{
                      fontWeight: 600,
                    }}
                  >
                    <Trans>Upload</Trans>
                  </Box>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleFileUpload}
                style={{
                  display: 'none',
                  opacity: 0,
                  cursor: 'pointer',
                }}
              />
            </Box>
            {uploadError && (
              <Box
                sx={{
                  mt: 1,
                  typography: 'body2',
                  color: 'error.main',
                }}
              >
                {uploadError}
              </Box>
            )}
          </Box>

          {/* Social Links */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '16px',
              }}
            >
              <Trans>Social Links</Trans>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              {/* Website */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '120px',
                    cursor: 'pointer',
                  }}
                >
                  <Checkbox
                    checked={enabledSocialLinks.website}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: Types.UpdateIntroSettings,
                        payload: {
                          enabledSocialLinks: {
                            ...enabledSocialLinks,
                            website: e.target.checked,
                          },
                        },
                      });
                    }}
                    sx={{ top: -1 }}
                  />
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '16px',
                    }}
                  >
                    <Trans>Website</Trans>
                  </Box>
                </Box>
                {enabledSocialLinks.website && (
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Input
                      height={48}
                      fullWidth
                      sx={{
                        backgroundColor: 'background.paperContrast',
                      }}
                      value={websiteUrl}
                      onChange={(e) => {
                        dispatch({
                          type: Types.UpdateIntroSettings,
                          payload: { websiteUrl: e.target.value },
                        });
                      }}
                      placeholder="Add URL"
                    />
                  </Box>
                )}
              </Box>

              {/* X (Twitter) */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '120px',
                    cursor: 'pointer',
                  }}
                >
                  <Checkbox
                    checked={enabledSocialLinks.twitter}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: Types.UpdateIntroSettings,
                        payload: {
                          enabledSocialLinks: {
                            ...enabledSocialLinks,
                            twitter: e.target.checked,
                          },
                        },
                      });
                    }}
                    sx={{ top: -1 }}
                  />
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '16px',
                    }}
                  >
                    <Trans>X (Twitter)</Trans>
                  </Box>
                </Box>
                {enabledSocialLinks.twitter && (
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Input
                      height={48}
                      fullWidth
                      sx={{
                        backgroundColor: 'background.paperContrast',
                      }}
                      value={twitterUrl}
                      onChange={(e) => {
                        dispatch({
                          type: Types.UpdateIntroSettings,
                          payload: { twitterUrl: e.target.value },
                        });
                      }}
                      placeholder="Add URL"
                    />
                  </Box>
                )}
              </Box>

              {/* Discord */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '120px',
                    cursor: 'pointer',
                  }}
                >
                  <Checkbox
                    checked={enabledSocialLinks.discord}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: Types.UpdateIntroSettings,
                        payload: {
                          enabledSocialLinks: {
                            ...enabledSocialLinks,
                            discord: e.target.checked,
                          },
                        },
                      });
                    }}
                    sx={{ top: -1 }}
                  />
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '16px',
                    }}
                  >
                    <Trans>Discord</Trans>
                  </Box>
                </Box>
                {enabledSocialLinks.discord && (
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Input
                      height={48}
                      fullWidth
                      sx={{
                        backgroundColor: 'background.paperContrast',
                      }}
                      value={discordUrl}
                      onChange={(e) => {
                        dispatch({
                          type: Types.UpdateIntroSettings,
                          payload: { discordUrl: e.target.value },
                        });
                      }}
                      placeholder="Add URL"
                    />
                  </Box>
                )}
              </Box>

              {/* Telegram */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <Box
                  component="label"
                  sx={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    width: '120px',
                    cursor: 'pointer',
                  }}
                >
                  <Checkbox
                    checked={enabledSocialLinks.telegram}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      dispatch({
                        type: Types.UpdateIntroSettings,
                        payload: {
                          enabledSocialLinks: {
                            ...enabledSocialLinks,
                            telegram: e.target.checked,
                          },
                        },
                      });
                    }}
                    sx={{ top: -1 }}
                  />
                  <Box
                    sx={{
                      typography: 'body1',
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '16px',
                    }}
                  >
                    <Trans>Telegram</Trans>
                  </Box>
                </Box>
                {enabledSocialLinks.telegram && (
                  <Box
                    sx={{
                      flex: 1,
                    }}
                  >
                    <Input
                      height={48}
                      fullWidth
                      sx={{
                        backgroundColor: 'background.paperContrast',
                      }}
                      value={telegramUrl}
                      onChange={(e) => {
                        dispatch({
                          type: Types.UpdateIntroSettings,
                          payload: { telegramUrl: e.target.value },
                        });
                      }}
                      placeholder="Add URL"
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          {/* Error Display */}
          <ErrorTip errorKey={errorKey} />

          {/* Project Intro (Optional) */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <Box
              sx={{
                typography: 'body1',
                fontWeight: 600,
                color: 'text.primary',
                fontSize: '16px',
              }}
            >
              <Trans>Project Intro (Optional)</Trans>
            </Box>
            <RichTextEditor
              value={description}
              onChange={(value) => {
                dispatch({
                  type: Types.UpdateIntroSettings,
                  payload: { description: value },
                });
              }}
              placeholder="Project Overview"
            />
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              pt: '28px',
              position: {
                mobile: 'sticky',
                tablet: 'relative',
              },
              bottom: 0,
              backgroundColor: 'background.paper',
              pb: 20,
            }}
          >
            <Button
              onClick={handleSubmit}
              size={Button.Size.big}
              disabled={!!errorKey || !!uploadError}
              sx={{
                width: {
                  mobile: '100%',
                  tablet: 280,
                },
              }}
            >
              <Trans>Save</Trans>
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Confirmation Dialog */}
      <IntroSettingsConfirmDialog
        open={showConfirmDialog}
        onClose={handleCloseConfirmDialog}
        cpAddress={cpAddress}
        introSettings={state.introSettings}
        chainId={state.priceSettings.baseToken?.chainId}
        dispatch={dispatch}
      />
    </>
  );
}
