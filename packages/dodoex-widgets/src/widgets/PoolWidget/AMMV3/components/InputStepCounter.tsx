import { Box, Button, useTheme } from '@dodoex/components';
import { Trans } from '@lingui/macro';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { NumberInput } from '../../../../components/Swap/components/TokenCard/NumberInput';
import { FeeAmount } from '../sdks/v3-sdk';

interface StepCounterProps {
  value: string;
  onUserInput: (value: string) => void;
  decrement: () => string;
  increment: () => string;
  decrementDisabled?: boolean;
  incrementDisabled?: boolean;
  feeAmount?: FeeAmount;
  label?: string;
  locked?: boolean; // disable input
  title: ReactNode;
  tokenA?: string;
  tokenB?: string;
}

const StepCounter = ({
  value,
  decrement,
  increment,
  decrementDisabled = false,
  incrementDisabled = false,
  locked,
  onUserInput,
  title,
  tokenA,
  tokenB,
}: StepCounterProps) => {
  const theme = useTheme();

  //  for focus state, styled components doesnt let you select input parent container
  const [active, setActive] = useState(false);

  // let user type value and only update parent value on blur
  const [localValue, setLocalValue] = useState('');
  const [useLocalValue, setUseLocalValue] = useState(false);

  // animation if parent value updates local value
  const [pulsing, setPulsing] = useState<boolean>(false);

  const handleOnFocus = () => {
    setUseLocalValue(true);
    setActive(true);
  };

  const handleOnBlur = useCallback(() => {
    setUseLocalValue(false);
    setActive(false);
    onUserInput(localValue); // trigger update on parent value
  }, [localValue, onUserInput]);

  // for button clicks
  const handleDecrement = useCallback(() => {
    setUseLocalValue(false);
    onUserInput(decrement());
  }, [decrement, onUserInput]);

  const handleIncrement = useCallback(() => {
    setUseLocalValue(false);
    onUserInput(increment());
  }, [increment, onUserInput]);

  useEffect(() => {
    if (localValue !== value && !useLocalValue) {
      setTimeout(() => {
        setLocalValue(value); // reset local value to match parent
        setPulsing(true); // trigger animation
        setTimeout(function () {
          setPulsing(false);
        }, 1800);
      }, 0);
    }
  }, [localValue, useLocalValue, value]);

  return (
    <Box
      onFocus={handleOnFocus}
      onBlur={handleOnBlur}
      sx={{
        width: '100%',
        py: 12,
        px: 20,
        borderRadius: 16,
        backgroundColor: theme.palette.background.cardInput,
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <Box
            sx={{
              typography: 'body2',
              fontWeight: 600,
              color: theme.palette.text.primary,
            }}
          >
            {title}
          </Box>
          <Box
            sx={{
              mt: 4,
              typography: 'h6',
              fontWeight: 500,
              color: theme.palette.text.secondary,
            }}
          >
            <Trans>
              {tokenB} per {tokenA}
            </Trans>
          </Box>
          <NumberInput
            sx={{
              mt: 12,
              backgroundColor: theme.palette.background.cardInput,
            }}
            value={localValue}
            onChange={(val) => {
              setLocalValue(val);
            }}
            readOnly={locked}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {!locked && (
            <Button
              size={Button.Size.small}
              onClick={handleIncrement}
              disabled={incrementDisabled}
              sx={{
                px: 4,
                backgroundColor: theme.palette.background.paper,
                '&[disabled]': {
                  cursor: 'default',
                },
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.25 9.75H9.75V14.25H8.25V9.75H3.75V8.25H8.25V3.75H9.75V8.25H14.25V9.75Z"
                  fill={
                    decrementDisabled
                      ? theme.palette.text.disabled
                      : theme.palette.text.primary
                  }
                />
              </svg>
            </Button>
          )}
          {!locked && (
            <Button
              size={Button.Size.small}
              onClick={handleDecrement}
              disabled={decrementDisabled}
              sx={{
                px: 4,
                backgroundColor: theme.palette.background.paper,
                '&[disabled]': {
                  cursor: 'default',
                },
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="3.75"
                  y="8.25"
                  width="10.5"
                  height="1.5"
                  fill={
                    decrementDisabled
                      ? theme.palette.text.disabled
                      : theme.palette.text.primary
                  }
                />
              </svg>
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StepCounter;
