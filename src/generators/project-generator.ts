import * as path from "path";
import Generator from "./generator";

export interface ProjectGeneratorConfig {
  name: string;
  description: string;
  withBuiltin: boolean;
}

export class ProjectGenerator extends Generator<ProjectGeneratorConfig> {
  get defaultConfig(): ProjectGeneratorConfig {
    const slugName = path.basename(this.options.cwd);
    return {
      name: slugName,
      description: "Generic EOSIC project",
      withBuiltin: true
    };
  }

  async install(): Promise<void> {
    await this.clone("project", ".");
    if (this.options.withBuiltin) {
      await this.clone("builtin", ".", "builtin");
    }
    await this.prepare();
  }

  async prompt(): Promise<ProjectGeneratorConfig> {
    throw new Error("Method not implemented.");
  }
}
