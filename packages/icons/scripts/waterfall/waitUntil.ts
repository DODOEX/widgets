import sleep from './sleep';

export default async function waitUntil(
  test: {
    (): { predicate: boolean; result: any };
    ():
      | PromiseLike<{ predicate: any; result: any }>
      | { predicate: any; result: any };
  },
  options: {
    delay?: number;
    tries?: number;
  } = {},
): Promise<any> {
  const { delay = 5e3, tries = -1 } = options;
  const { predicate, result } = await test();

  if (predicate) {
    return result;
  }

  if (tries - 1 === 0) {
    throw new Error('tries limit reached');
  }

  await sleep(delay);
  return waitUntil(test, { ...options, tries: tries > 0 ? tries - 1 : tries });
}
