declare module '*.avif' {
  const src: string;
  export default src;
}

declare module '*.bmp' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.webp' {
  const src: string;
  export default src;
}
declare module '*.svg' {
  import * as React from 'react';

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;

  const src: string;
  export default src;
}

// Reducer types
type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? { type: Key }
    : { type: Key; payload: M[Key] };
};

type PartialDeep<T> = T extends
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol
  | Date
  ? T | undefined
  : // Arrays, Sets and Maps and their readonly counterparts have their items made
  // deeply partial, but their own instances are left untouched
  T extends Array<infer ArrayType>
  ? Array<PartialDeep<ArrayType>>
  : T extends ReadonlyArray<infer ArrayType>
  ? ReadonlyArray<ArrayType>
  : T extends Set<infer SetType>
  ? Set<PartialDeep<SetType>>
  : T extends ReadonlySet<infer SetType>
  ? ReadonlySet<SetType>
  : T extends Map<infer KeyType, infer ValueType>
  ? Map<PartialDeep<KeyType>, PartialDeep<ValueType>>
  : T extends ReadonlyMap<infer KeyType, infer ValueType>
  ? ReadonlyMap<PartialDeep<KeyType>, PartialDeep<ValueType>>
  : // ...and finally, all other objects.
    {
      [K in keyof T]?: PartialDeep<T[K]>;
    };
