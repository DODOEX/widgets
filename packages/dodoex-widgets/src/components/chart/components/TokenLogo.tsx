import styled from '@emotion/styled';

const Image = styled.img``;

export function TokenLogo({ src, width }: { src: string; width: number }) {
  return <Image src={src} width={width} />;
}
