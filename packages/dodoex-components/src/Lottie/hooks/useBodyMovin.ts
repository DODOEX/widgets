import type { LottiePlayer } from 'lottie-web';
import { SetStateAction, useCallback, useEffect, useState } from 'react';

export function useBodyMovin({
  BodymovinJson,
  loop = false,
  name,
}: {
  BodymovinJson: Promise<any>;
  loop?: boolean;
  name: string;
}) {
  const [animationIconEle, setAnimationIconEle] = useState<HTMLElement>();
  const [bodymovin, setBodymovin] = useState<LottiePlayer>();
  const [animationData, setAnimationData] = useState();

  useEffect(() => {
    async function dynamicImportBodymovin() {
      const { default: bodymovin } = await import('lottie-web');
      setBodymovin(bodymovin);
    }
    dynamicImportBodymovin();
  }, []);

  useEffect(() => {
    async function dynamicImportJson() {
      const { default: data } = await BodymovinJson;
      setAnimationData(data);
    }
    dynamicImportJson();
  }, [BodymovinJson]);

  const ref = useCallback(
    (node: SetStateAction<HTMLElement | undefined> | null) => {
      if (node !== null) {
        setAnimationIconEle(node);
      }
    },
    [],
  );
  useEffect(() => {
    if (animationIconEle) {
      try {
        bodymovin?.loadAnimation({
          loop,
          name,
          container: animationIconEle,
          renderer: 'svg',
          autoplay: true,
          animationData,
        });
      } catch (error) {
        console.error('[bodymovin loadAnimation]', error);
      }
    }
  }, [animationData, animationIconEle, bodymovin, loop, name]);

  return {
    ref,
    destroy: () => bodymovin?.destroy(name),
  };
}
