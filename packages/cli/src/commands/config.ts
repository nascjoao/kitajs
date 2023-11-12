import { Flags } from '@oclif/core';
import { inspect } from 'util';
import { BaseKitaCommand } from '../util/base';

export default class Config extends BaseKitaCommand {
  static override description = 'Prints the full resolved configuration file';

  static override examples = [
    {
      command: `<%= config.bin %> <%= command.id %> -c kita.config.js`,
      description: 'Builds your backend with a custom config file.'
    }
  ];

  static override flags = {
    raw: Flags.boolean({
      char: 'r',
      description: 'Prints a JSON string instead of a pretty printed object.',
      default: false,
      allowNo: true
    })
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Config);
    const { config, compilerOptions } = this.parseConfig(flags);

    //@ts-expect-error - Just to allow the compilerOptions to be printed
    config.compilerOptions = compilerOptions;
    //@ts-expect-error - Just to allow the compilerOptions to be pretty printed
    delete compilerOptions.rootNames;

    if (flags.raw || !process.stdout.isTTY) {
      this.log(JSON.stringify(config, null, 2));
    } else {
      this.log(
        inspect(config, {
          colors: true,
          depth: Infinity,
          maxArrayLength: Infinity,
          maxStringLength: Infinity
        })
      );
    }
  }
}
