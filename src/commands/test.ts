import { Command, flags } from "@oclif/command";
import BaseCommand from "./internal/base-command";
import * as Mocha from "mocha";
import * as globby from "globby";
import * as path from "path";
import EosProject from "../lib/eos-project";

async function sleep(sec: number) {
  return new Promise(resolve => setTimeout(resolve, sec * 1000));
}

export default class Test extends BaseCommand {
  static flags = BaseCommand.flags;

  async run() {
    const { args, flags } = this;

    const project = await EosProject.load(flags.cwd);

    await project.start();
    const mocha = new Mocha();
    const tests = await globby("test/**/*.test.js", {
      cwd: flags.cwd
    });

    tests.forEach(test => {
      mocha.addFile(path.resolve(flags.cwd, test));
    });

    await sleep(1);
    mocha.timeout(20000);

    try {
      mocha.run(async failures => {
        await project.stop();
        process.exitCode = failures ? -1 : 0; // exit with non-zero status if there were failures
      });
    } catch (e) {
      require("signale").fatal(e);
      await project.stop();
      process.exitCode = -1;
    }
  }
}
