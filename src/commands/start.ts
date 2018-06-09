import { Command, flags } from "@oclif/command";
import BaseCommand from "./internal/base-command";
import EosProject from "../lib/eos-project";
import * as death from "death";

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Start extends BaseCommand {
  static flags = BaseCommand.flags;

  async run() {
    const project = await EosProject.load(this.flags.cwd);
    await project.start();

    death(async () => {
      console.log("exit");
      await project.stop();
      process.exit();
    });

    while (true) {
      await sleep(1000);
      console.log("tst");
    }
  }
}
