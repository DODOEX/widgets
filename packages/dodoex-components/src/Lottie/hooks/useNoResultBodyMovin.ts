import { useEffect } from 'react';
import { useBodyMovin } from './useBodyMovin';

export function useNoResultBodyMovin() {
  const { ref, destroy } = useBodyMovin({
    BodymovinJson: import('./json/no-result.json'),
    loop: false,
    name: 'failed-list-animation',
  });

  useEffect(() => destroy, []);
  return ref;
}
