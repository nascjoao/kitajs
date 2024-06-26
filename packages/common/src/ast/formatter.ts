import type { AstCollector } from './collector';
import type { Route } from './route';

export interface SourceFormatter {
  /** Called each time a route needs to be generated */
  generateRoute(r: Route, collector: AstCollector): void;

  /** Called after all routes have been generated. This is the place to generate the runtime and everything it may needs. */
  generateRuntime(collector: AstCollector): void;

  /**
   * Writes all collected string files to disk.
   *
   * @returns The number of written files
   */
  flush(): number;
}
