export interface GeneratorOptions {
  quiet: boolean;
  force: boolean;
  cwd: string;
}

export interface GeneratorInterface {
  generate(opts?: GeneratorOptions): Promise<void>;
}

export default abstract class Generator<T extends object>
  implements GeneratorInterface {
  options: GeneratorOptions & T;
  abstract readonly defaultConfig: T;

  async generate(opts: GeneratorOptions & T) {
    // do something
  }
}
