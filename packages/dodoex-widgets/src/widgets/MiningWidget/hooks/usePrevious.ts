import { useEffect, useRef } from 'react';

export function usePrevious<Value>(value: Value) {
  const ref = useRef<Value>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
