import styled from '@emotion/styled';
import { BaseButton } from '../components/BaseButton';

export const Title = styled.div`
  color: ${(props) => props.color};
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
`;

export const Description = styled.div`
  color: ${(props) => props.color};
  font-size: 12px;
  font-weight: 500;
  line-height: 17px;
`;

export const OptButton = styled(BaseButton)`
  width: 24px;
  height: 24px;

  &:hover {
    cursor: pointer;
  }

  & > svg > circle {
    fill-opacity: 0.1;
    &:hover {
      fill-opacity: 0.3;
    }
  }
`;
