import Generator from "./generator";

export interface ProjectGeneratorConfig {
  name: string;
  description: string;
  withBuiltin: boolean;
}

export class ProjectGenerator extends Generator<ProjectGeneratorConfig> {
  defaultConfig: ProjectGeneratorConfig;
}
