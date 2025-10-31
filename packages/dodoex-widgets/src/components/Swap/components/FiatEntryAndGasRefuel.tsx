import { Box, ButtonBase } from '@dodoex/components';
import { useState } from 'react';
import Dialog from '../../Dialog';

export default function FiatEntryAndGasRefuel() {
  const [showGasRefuel, setShowGasRefuel] = useState(false);

  const iframeUrl = `https://smolrefuel.com/?partner=0x1271CAba4bf23f8Fb31F97448605d65EE302CA51`;

  return (
    <>
      <ButtonBase
        sx={{
          mt: 16,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          typography: 'body2',
          fontWeight: 600,
          color: 'text.link',
          '&:hover': {
            color: 'text.primary',
          },
        }}
        onClick={() => {
          // setShowGasRefuel(true);
          window.open(iframeUrl, '_blank');
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
        >
          <path
            d="M3.5 16.25V4.25C3.5 3.8375 3.64687 3.48438 3.94063 3.19063C4.23438 2.89687 4.5875 2.75 5 2.75H9.5C9.9125 2.75 10.2656 2.89687 10.5594 3.19063C10.8531 3.48438 11 3.8375 11 4.25V9.5H11.75C12.1625 9.5 12.5156 9.64688 12.8094 9.94063C13.1031 10.2344 13.25 10.5875 13.25 11V14.375C13.25 14.5875 13.3219 14.7656 13.4656 14.9094C13.6094 15.0531 13.7875 15.125 14 15.125C14.2125 15.125 14.3906 15.0531 14.5344 14.9094C14.6781 14.7656 14.75 14.5875 14.75 14.375V8.975C14.6375 9.0375 14.5188 9.07813 14.3938 9.09688C14.2688 9.11563 14.1375 9.125 14 9.125C13.475 9.125 13.0312 8.94375 12.6688 8.58125C12.3063 8.21875 12.125 7.775 12.125 7.25C12.125 6.85 12.2344 6.49063 12.4531 6.17188C12.6719 5.85313 12.9625 5.625 13.325 5.4875L11.75 3.9125L12.5375 3.125L15.3125 5.825C15.5 6.0125 15.6406 6.23125 15.7344 6.48125C15.8281 6.73125 15.875 6.9875 15.875 7.25V14.375C15.875 14.9 15.6938 15.3438 15.3313 15.7063C14.9688 16.0688 14.525 16.25 14 16.25C13.475 16.25 13.0312 16.0688 12.6688 15.7063C12.3063 15.3438 12.125 14.9 12.125 14.375V10.625H11V16.25H3.5ZM5 8H9.5V4.25H5V8ZM14 8C14.2125 8 14.3906 7.92813 14.5344 7.78438C14.6781 7.64062 14.75 7.4625 14.75 7.25C14.75 7.0375 14.6781 6.85938 14.5344 6.71563C14.3906 6.57188 14.2125 6.5 14 6.5C13.7875 6.5 13.6094 6.57188 13.4656 6.71563C13.3219 6.85938 13.25 7.0375 13.25 7.25C13.25 7.4625 13.3219 7.64062 13.4656 7.78438C13.6094 7.92813 13.7875 8 14 8Z"
            fill="currentColor"
          />
        </svg>
        Gas Refuel&gt;
      </ButtonBase>

      <Dialog
        open={showGasRefuel}
        onClose={() => setShowGasRefuel(false)}
        title="Gas refuel"
        modal
      >
        <Box
          sx={{
            maxWidth: 540,
            minHeight: 600,
            px: 20,
            pb: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Box
            sx={{
              pt: 20,
              borderTopWidth: 1,
              borderTopStyle: 'solid',
              borderColor: 'border.main',
              typography: 'body2',
              color: 'text.secondary',
            }}
          >
            A solution for gas refueling that allows you to refill your wallet
            anonymously and gas-free.
          </Box>

          <Box
            component="iframe"
            src={iframeUrl}
            width="100%"
            sx={{
              borderRadius: 12,
              overflow: 'hidden',
              flex: 1,
              border: 'none',
            }}
          />
        </Box>
      </Dialog>
    </>
  );
}
