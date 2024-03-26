import styled from '@emotion/styled';
import { Input as InputOrigin } from './Input';

const Input = styled(InputOrigin)`
  margin: 0;
  width: 100%;
  max-width: 200px;
`;

export function NumberInput({
  value,
  onChange = () => {
    //
  },
  onBlur = () => {
    //
  },
}: {
  value: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
}) {
  return (
    <Input
      placeholder="0.00"
      inputMode="decimal"
      autoComplete='="off'
      autoCorrect="off"
      type="text"
      pattern="^[0-9]*[.,]?[0-9]*$"
      minLength={1}
      maxLength={79}
      spellCheck={false}
      value={value}
      onBlur={onBlur}
      onInput={(evt) => {
        // @ts-ignore
        const valid = evt.target.validity?.valid;
        if (valid) {
          // @ts-ignore
          const input = evt.target?.value as string;
          if (input.includes(',')) {
            onChange(input.replace(',', '.'));
            return;
          }
          onChange(input);
        }
      }}
    />
  );
}
