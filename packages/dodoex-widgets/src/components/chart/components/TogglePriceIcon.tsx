import styled from '@emotion/styled';

interface ISwtichBtn extends React.HTMLProps<HTMLInputElement> {
  shouldSwitch?: boolean;
  variant?: 'dark' | 'light';
}

type SVGProps = {
  shouldSwitch?: boolean;
  defaultBg: string;
  hoverBg: string;
};

const Svg = styled.svg<SVGProps>`
  cursor: pointer;
  user-select: none;
  color: ${(props) => props.defaultBg};

  /* // ${(props) => props.shouldSwitch && `color: ${props.hoverBg};`} */

  path {
    fill: white;
  }

  &:hover {
    color: ${(props) => props.hoverBg};
    path {
      fill: #fff;
    }
  }
`;

export const TogglePriceIcon = ({ shouldSwitch, variant }: ISwtichBtn) => {
  const defaultBg = variant === 'light' ? '#EEEEEE' : '#373739';
  const hoverBg = variant === 'light' ? '#E4E4E4' : '#414143';

  return (
    <Svg
      shouldSwitch={shouldSwitch}
      defaultBg={defaultBg}
      hoverBg={hoverBg}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <g transform="translate(5 5)">
        <path d="M7.762,10.057a.226.226,0,0,1-.034-.121V9.045H3.368A3.449,3.449,0,0,1,0,5.57V3.921a.368.368,0,0,1,.736-.009v1.6a2.721,2.721,0,0,0,2.588,2.8h4.4V7.416a.226.226,0,0,1,.346-.192l2.009,1.261a.226.226,0,0,1,.071.311.218.218,0,0,1-.071.072l-2.009,1.26a.226.226,0,0,1-.312-.071ZM9.426,6.251v-1.6a2.721,2.721,0,0,0-2.588-2.8H2.689v.893a.226.226,0,0,1-.227.226.229.229,0,0,1-.121-.034L.334,1.679a.225.225,0,0,1-.071-.311A.218.218,0,0,1,.334,1.3L2.342.035a.227.227,0,0,1,.347.192v.892h4.1a3.45,3.45,0,0,1,3.368,3.475V6.242a.368.368,0,0,1-.735.009Z" />
      </g>
    </Svg>
  );
};

export const ToggleIconWithoutBg = () => {
  return (
    <svg
      id="arrow-left-right"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
    >
      <g transform="translate(5 5)" fill="currentColor">
        <path d="M7.762,10.057a.226.226,0,0,1-.034-.121V9.045H3.368A3.449,3.449,0,0,1,0,5.57V3.921a.368.368,0,0,1,.736-.009v1.6a2.721,2.721,0,0,0,2.588,2.8h4.4V7.416a.226.226,0,0,1,.346-.192l2.009,1.261a.226.226,0,0,1,.071.311.218.218,0,0,1-.071.072l-2.009,1.26a.226.226,0,0,1-.312-.071ZM9.426,6.251v-1.6a2.721,2.721,0,0,0-2.588-2.8H2.689v.893a.226.226,0,0,1-.227.226.229.229,0,0,1-.121-.034L.334,1.679a.225.225,0,0,1-.071-.311A.218.218,0,0,1,.334,1.3L2.342.035a.227.227,0,0,1,.347.192v.892h4.1a3.45,3.45,0,0,1,3.368,3.475V6.242a.368.368,0,0,1-.735.009Z" />
      </g>
    </svg>
  );
};
