import styled from '@emotion/styled';
import { BaseButton } from '../components/BaseButton';

export const Container = styled.div`
  height: 100%;
`;

export const AmountInputContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const InputSectionWrapper = styled.div<{ borderColor?: string }>`
  border: 1px solid ${({ borderColor }) => borderColor || '#2a2a2d'};
  flex: 1 0 50%;

  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #606066;

  & + & {
    border-left: none;
  }
`;

export const PriceImpactWrapper = styled.span`
  color: #85858d;
`;

export const OptButtonGroup = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  margin-bottom: 9px;
`;

export const OptButton = styled(BaseButton)`
  border-radius: 13px;
  background-color: #373739;
  width: 24px;
  height: 24px;
  font-size: 18px;
  color: #85858d;
  line-height: 0;
  & + & {
    margin-left: 10px;
  }
  &:first-child,
  &:last-child {
    font-size: 20px;
  }

  &:hover {
    color: #fff;
  }
`;
