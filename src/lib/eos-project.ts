import * as path from "path";
import * as fs from "fs-extra";
import * as globby from "globby";

export interface EosProjectConfig {
  name: string;
  version: string;
  description: string;
  tests: string;
  migrations: string;
  contracts: { [name: string]: EosContractConfig };
}

export interface EosContractConfig {
  name: string;
  version: string;
  description: string;
  entry: string;
  checksum?: string;
}

export class EosContract {
  root: string;
  configuration: EosContractConfig;

  constructor(root: string, config: EosContractConfig) {
    if (!path.isAbsolute(root)) {
      throw new Error("Path should be absolute");
    }

    this.configuration = config;
    this.root = root;
  }

  async digest(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      resolve("md5goeshereinafuture");
    });
  }
}

export type EosContractsCollection = { [name: string]: EosContract };

export default class EosProject {
  root: string;
  configuration: EosProjectConfig;
  private contracts: EosContractsCollection = {};

  constructor(root: string, config: EosProjectConfig) {
    if (!path.isAbsolute(root)) {
      throw new Error("Path should be absolute");
    }

    this.configuration = config;
    this.root = root;
  }

  static async load(root: string): Promise<EosProject> {
    const configPath = path.resolve(path.join(root, "eosic.json"));
    const configContent = await fs.readFile(configPath, "utf8");
    const config = <EosProjectConfig>JSON.parse(configContent);
    return new EosProject(root, config);
  }

  get configPath() {
    return path.resolve(this.root, "eosic.json");
  }

  get contractsPath() {
    return path.resolve(this.root, "contracts");
  }

  private sanitizeContractConfig(
    original: EosContractConfig
  ): EosContractConfig {
    const { name, version, description, entry, checksum } = original;
    return {
      name,
      version,
      description,
      entry,
      checksum
    };
  }

  async addContract(_config: EosContractConfig) {
    const config: EosContractConfig = this.sanitizeContractConfig(_config);
    const { name } = config;
    const contractRoot = path.join(this.contractsPath, name);
    if (!await fs.pathExists(contractRoot)) {
      throw new Error("Contract not found in project");
    }

    this.configuration.contracts[name] = config;
    this.contracts[name] = new EosContract(contractRoot, config);

    await this.save();
  }

  getContract(name: string): EosContract {
    if (!this.configuration.contracts[name]) {
      throw new Error(`Contract ${name} not found in project`);
    }

    if (!this.contracts[name]) {
      this.contracts[name] = new EosContract(
        path.join(this.contractsPath, name),
        this.configuration.contracts[name]
      );
    }

    return this.contracts[name];
  }

  async save() {
    const json = JSON.stringify(this.configuration, null, 2);
    await fs.writeFile(this.configPath, json);
  }
}
