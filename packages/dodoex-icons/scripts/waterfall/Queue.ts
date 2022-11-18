import waitUntil from './waitUntil';

class Queue {
  pendingEntries = [];

  inFlight = 0;

  err: any = null;
  worker: any;
  concurrency: any;

  constructor(
    worker: (svgPath: string) => Promise<void>,
    options: {
      concurrency?: number;
    } = {},
  ) {
    this.worker = worker;
    this.concurrency = options.concurrency || 1;
  }

  push = (entries: ConcatArray<never>) => {
    this.pendingEntries = this.pendingEntries.concat(entries);
    this.process();
  };

  process = () => {
    const scheduled = this.pendingEntries.splice(
      0,
      this.concurrency - this.inFlight,
    );
    this.inFlight += scheduled.length;
    scheduled.forEach(async (task) => {
      try {
        await this.worker(task);
      } catch (err) {
        this.err = err;
      } finally {
        this.inFlight -= 1;
      }

      if (this.pendingEntries.length > 0) {
        this.process();
      }
    });
  };

  wait = (
    options: {
      empty?: boolean;
    } = {},
  ) =>
    waitUntil(
      () => {
        if (this.err) {
          this.pendingEntries = [];
          throw this.err;
        }

        return {
          predicate: options.empty
            ? this.inFlight === 0 && this.pendingEntries.length === 0
            : this.concurrency > this.pendingEntries.length,
        };
      },
      {
        delay: 50,
      },
    );
}

export default Queue;
