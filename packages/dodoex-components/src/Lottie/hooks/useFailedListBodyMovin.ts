import { useEffect } from 'react';
import { useBodyMovin } from './useBodyMovin';

export function useFailedListBodyMovin() {
  const { ref, destroy } = useBodyMovin({
    BodymovinJson: import('./json/failed-list.json'),
    loop: false,
    name: 'failed-list-animation',
  });

  useEffect(() => destroy, []);
  return ref;
}
