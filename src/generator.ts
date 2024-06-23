import { execSync } from 'child_process';
import { Command } from 'commander';
import {
  createController,
  createEntity,
  createPipe,
  createRoute,
  createService,
  createSubscriber,
  createType,
  createValidation,
  preChecker,
  rollBack,
} from './helpers/stub';

const program = new Command();

program
  .name('module-generator')
  .description('CLI to generate base module')
  .version('0.0.1');

program
  .command('migration')
  .description('generate migration file based on latest change of schema')
  .argument('<string>', 'module name')
  .option(
    '-ds, --datasource <string>',
    'datasource location',
    './src/database.ts',
  )
  .action((str, options) => {
    if (!/[a-zA-Z]/.test(str) || !/[A-Z]/.test(str[0]))
      throw new Error(`argument ${str} not a valid value`);

    const migrateLoc = `./src/migrations/${str}Migration`;
    const genMigration = `typeorm-ts-node-commonjs -d ${options.datasource} migration:generate ${migrateLoc}`;
    const eslintFixing = `bun run eslint --fix 'src/migrations/*.ts'`;

    execSync(genMigration, { stdio: 'inherit' });
    execSync(eslintFixing, { stdio: 'inherit' });
  });

program
  .command('module')
  .description('generate module')
  .argument('<string>', 'module name (CamelCase)')
  .option('-sd, --softdelete <0, 1>', 'softdelete entity', '1')
  .action((str, options) => {
    if (!/[a-zA-Z]/.test(str) || !/[A-Z]/.test(str[0]))
      throw new Error(`argument ${str} not a valid value`);

    preChecker(str);
    createEntity(str, options);
    createController(str);
    createService(str);
    createPipe(str);
    createValidation(str);
    createType(str);
    createRoute(str);
    createSubscriber(str);

    // fix space error on eslint
    const eslintFixing = `bun run eslint --fix 'src/connection/*.ts'`;
    execSync(eslintFixing, { stdio: 'inherit' });
  });

program
  .command('rollback')
  .description('rollback module')
  .argument('<string>', 'module name (CamelCase)')
  .action((str) => {
    if (!/[a-zA-Z]/.test(str) || !/[A-Z]/.test(str[0]))
      throw new Error(`argument ${str} not a valid value`);

    rollBack(str);

    // fix space error on eslint
    const eslintFixing = `bun run eslint --fix 'src/connection/*.ts'`;
    execSync(eslintFixing, { stdio: 'inherit' });
  });

program.parse();
