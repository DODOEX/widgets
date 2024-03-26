import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const Input = styled.input<{ error?: boolean }>`
  margin: 4px 10px 4px 6px;
  border-radius: 10px;
  border: 1px solid #373739;
  padding: 4px 9px;
  background-color: #1a1a1b;
  color: #ffffff;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  outline: none;
  width: 96px;
  &:focus {
    border-color: #fff;

    ${({ error }) =>
      error &&
      css`
        border-color: red;
      `}
  }
`;
