import { Box, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { useUserOptions } from '../../../../components/UserOptionsProvider';
import { SectionStatusT, VersionItem } from '../types';

export function VersionChartExample({
  versionItem,
  status,
}: {
  versionItem: VersionItem;
  status: SectionStatusT;
}) {
  const theme = useTheme();
  const { noDocumentLink } = useUserOptions();

  const isLight = theme.palette.mode === 'light';
  if (status === 'completed') {
    return (
      <Box
        sx={{
          backgroundColor: theme.palette.background.paper,
          borderRadius: 8,
          width: '50%',
          padding: 16,
        }}
      >
        <Box
          sx={{
            typography: 'h5',
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {versionItem.title}
        </Box>
        <Box
          sx={{
            typography: 'h6',
            fontWeight: 500,
            mt: 8,
            color: theme.palette.text.secondary,
          }}
        >
          {versionItem.description}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            typography: 'h4',
            fontWeight: 600,
          }}
        >
          {versionItem.title}
        </Box>

        {!noDocumentLink && (
          <Box
            sx={{
              ml: 8,
              display: 'flex',
              padding: '2px 8px',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '2px',
              color: theme.palette.text.disabled,
              backgroundColor: theme.palette.background.paperDarkContrast,
              borderRadius: 4,
              typography: 'h6',
            }}
            component="a"
            href={versionItem.docUrl}
            target="_blank"
            rel="noreferrer"
          >
            <Trans>Doc</Trans>
            <svg
              width="14"
              height="15"
              viewBox="0 0 14 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.91667 3.41667V11.5833H11.0833V7.5H12.25V11.5833C12.25 12.225 11.725 12.75 11.0833 12.75H2.91667C2.26917 12.75 1.75 12.225 1.75 11.5833V3.41667C1.75 2.775 2.26917 2.25 2.91667 2.25H7V3.41667H2.91667ZM8.16667 3.41667V2.25H12.25V6.33333H11.0833V4.23917L5.34917 9.97333L4.52667 9.15083L10.2608 3.41667H8.16667Z"
                fill="currentColor"
              />
            </svg>
          </Box>
        )}
      </Box>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          minHeight: 220,
        }}
      >
        <Box
          component={
            isLight ? versionItem.exampleImgUrl : versionItem.exampleDarkImgUrl
          }
          sx={{
            marginTop: 20,
            width: '100%',
          }}
        />
      </Box>
    </>
  );
}
