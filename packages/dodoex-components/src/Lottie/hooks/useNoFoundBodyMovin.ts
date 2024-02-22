import { useEffect } from 'react';
import { useBodyMovin } from './useBodyMovin';

export function useNoFoundBodyMovin() {
  const { ref, destroy } = useBodyMovin({
    BodymovinJson: import('./json/no-found.json'),
    loop: false,
    name: 'failed-list-animation',
  });

  useEffect(() => destroy, []);
  return ref;
}
