import Generator from "./generator";

export interface ContractGeneratorConfig {}

export class ContractGenerator extends Generator<ContractGeneratorConfig> {
  defaultConfig: ContractGeneratorConfig;
  install(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  prompt(): Promise<ContractGeneratorConfig> {
    throw new Error("Method not implemented.");
  }
}
