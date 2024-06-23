import {
  appendFileSync,
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { createRecDirectory } from './filesystem';
import { execSync } from 'child_process';

const dataSourceLoc = `${__dirname.replace(/\/helpers/, '')}/connection`;
const entityStubLoc = `${__dirname.replace(/\/helpers/, '')}/stubs/entity.stub`;
const entityTargetLoc = `${__dirname.replace(/\/helpers/, '')}/entities`;
const controllerStubLoc = `${__dirname.replace(/\/helpers/, '')}/stubs/controller.stub`;
const serviceStubLoc = `${__dirname.replace(/\/helpers/, '')}/stubs/service.stub`;
const moduleTargetLoc = `${__dirname.replace(/\/helpers/, '')}/modules`;
const pipeStubLoc = `${__dirname.replace(/\/helpers/, '')}/stubs/pipe.stub`;
const pipeTargetLoc = `${__dirname.replace(/\/helpers/, '')}/pipes`;
const validationStubLoc = `${__dirname.replace(/\/helpers/, '')}/stubs/validation.stub`;
const validationTargetLoc = `${__dirname.replace(/\/helpers/, '')}/validations`;
const typeStubLoc = `${__dirname.replace(/\/helpers/, '')}/stubs/type.stub`;
const typeTargetLoc = `${__dirname.replace(/\/helpers/, '')}/types`;
const routeStubLoc = `${__dirname.replace(/\/helpers/, '')}/stubs/route.stub`;
const routeTargetLoc = `${__dirname.replace(/\/helpers/, '')}/routes`;
const subscriberStubLoc = `${__dirname.replace(/\/helpers/, '')}/stubs/subscriber.stub`;
const subscriberTargetLoc = `${__dirname.replace(/\/helpers/, '')}/subscribers`;

export const preChecker = (module_name: string) => {
  const commonName = module_name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '-');

  if (existsSync(`${moduleTargetLoc}/${commonName}`)) {
    throw new Error(`folder ${moduleTargetLoc}/${commonName} already exist`);
  }

  if (existsSync(`${pipeTargetLoc}/${commonName}`)) {
    throw new Error(`folder ${pipeTargetLoc}/${commonName} already exist`);
  }

  if (existsSync(`${validationTargetLoc}/${commonName}`)) {
    throw new Error(
      `folder ${validationTargetLoc}/${commonName} already exist`,
    );
  }

  if (existsSync(`${typeTargetLoc}/${commonName}.ts`)) {
    throw new Error(`file ${typeTargetLoc}/${commonName}.ts already exist`);
  }

  if (existsSync(`${entityTargetLoc}/${module_name}Entity.ts`)) {
    throw new Error(
      `file ${entityTargetLoc}/${module_name}Entity.ts already exist`,
    );
  }

  if (existsSync(`${routeTargetLoc}/${commonName}.ts`)) {
    throw new Error(`file ${routeTargetLoc}/${commonName}.ts already exist`);
  }

  if (existsSync(`${subscriberTargetLoc}/${module_name}Subscriber.ts`)) {
    throw new Error(
      `file ${subscriberTargetLoc}/${module_name}Subscriber.ts already exist`,
    );
  }
};

export const createEntity = (
  module_name: string,
  opts: { softdelete: string },
) => {
  const entityName = `${module_name}Entity`;
  const underscoreN = module_name
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '_');
  const nameArr = underscoreN.split('');
  const getLastString = nameArr[nameArr.length - 1];
  const cLastName =
    getLastString === 'y'
      ? 'ies'
      : getLastString === 's'
        ? `${getLastString}es`
        : `${getLastString}s`;

  nameArr[nameArr.length - 1] = cLastName;

  const tableName = nameArr.join('');

  copyFileSync(entityStubLoc, `${entityTargetLoc}/${entityName}.ts`);

  const content = readFileSync(`${entityTargetLoc}/${entityName}.ts`)
    .toString()
    .replace(/__TABLE_NAME__/g, tableName)
    .replace(/__ENTITY_NAME__/g, entityName)
    .replace(
      /__ENTITY_MODE__/g,
      parseInt(opts.softdelete) ? 'GeneralSoftdeleteEntity' : 'GeneralEntity',
    );

  writeFileSync(`${entityTargetLoc}/${entityName}.ts`, content);
  importEntityToIndex(entityName);
  importEntityToDataSource(entityName);
};

export const importEntityToIndex = (entity_file: string) => {
  let content = readFileSync(`${entityTargetLoc}/index.ts`).toString();
  const regex = new RegExp(`'./${entity_file}'`);

  if (!regex.test(content)) {
    content += `export * from './${entity_file}';\n`;
    writeFileSync(`${entityTargetLoc}/index.ts`, content);
  }
};

export const importEntityToDataSource = (entity_file: string) => {
  const dataSources = readdirSync(dataSourceLoc);

  dataSources.forEach((connection) => {
    const content = readFileSync(`${dataSourceLoc}/${connection}`).toString();
    const regex = new RegExp(`'../entities/${entity_file}'`);

    if (!regex.test(content)) {
      const importContent = `import { ${entity_file} } from '../entities/${entity_file}';\n//NEXT_GEN_IMPORT_ENTITY`;
      const entityContent = `${entity_file},\n//NEXT_GEN_ENTITY`;

      const contentMod = content
        .replace(/\/\/NEXT_GEN_IMPORT_ENTITY/, importContent)
        .replace(/\/\/NEXT_GEN_ENTITY/, entityContent);

      writeFileSync(`${dataSourceLoc}/${connection}`, contentMod);
    }
  });
};

export const createController = (module_name: string) => {
  const folderName = module_name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '-');
  const nameArr = module_name.split('');
  nameArr[0] = nameArr[0].toLowerCase();
  const moduleNameLower = nameArr.join('');

  createRecDirectory(`${moduleTargetLoc}/${folderName}`);

  copyFileSync(
    controllerStubLoc,
    `${moduleTargetLoc}/${folderName}/controller.ts`,
  );

  const content = readFileSync(`${moduleTargetLoc}/${folderName}/controller.ts`)
    .toString()
    .replace(/__MODULE_NAME__/g, module_name)
    .replace(/__MODULE_NAME_LOWER__/g, moduleNameLower);

  writeFileSync(`${moduleTargetLoc}/${folderName}/controller.ts`, content);
};

export const createService = (module_name: string) => {
  const folderName = module_name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '-');
  const nameArr = module_name.split('');
  nameArr[0] = nameArr[0].toLowerCase();
  const moduleNameLower = nameArr.join('');

  createRecDirectory(`${moduleTargetLoc}/${folderName}`);

  copyFileSync(serviceStubLoc, `${moduleTargetLoc}/${folderName}/service.ts`);

  const content = readFileSync(`${moduleTargetLoc}/${folderName}/service.ts`)
    .toString()
    .replace(/__MODULE_NAME__/g, module_name)
    .replace(/__MODULE_NAME_LOWER__/g, moduleNameLower)
    .replace(/__ENTITY_NAME__/g, `${module_name}Entity`);

  writeFileSync(`${moduleTargetLoc}/${folderName}/service.ts`, content);
};

export const createPipe = (module_name: string) => {
  const folderName = module_name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '-');

  createRecDirectory(`${pipeTargetLoc}/${folderName}`);

  copyFileSync(pipeStubLoc, `${pipeTargetLoc}/${folderName}/sample.ts`);

  const content = readFileSync(`${pipeTargetLoc}/${folderName}/sample.ts`)
    .toString()
    .replace(/__MODULE_NAME_FOLDER__/g, folderName);

  writeFileSync(`${pipeTargetLoc}/${folderName}/sample.ts`, content);

  const indexContent = `export * from './sample';\n`;
  appendFileSync(`${pipeTargetLoc}/${folderName}/index.ts`, indexContent);
};

export const createValidation = (module_name: string) => {
  const folderName = module_name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '-');

  createRecDirectory(`${validationTargetLoc}/${folderName}`);

  copyFileSync(
    validationStubLoc,
    `${validationTargetLoc}/${folderName}/sample.ts`,
  );

  const indexContent = `export * from './sample';\n`;
  appendFileSync(`${validationTargetLoc}/${folderName}/index.ts`, indexContent);
};

export const createType = (module_name: string) => {
  const fileName = module_name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '-');

  copyFileSync(typeStubLoc, `${typeTargetLoc}/${fileName}.ts`);

  const content = readFileSync(`${typeTargetLoc}/${fileName}.ts`)
    .toString()
    .replace(/__MODULE_NAME_FOLDER__/g, fileName);

  writeFileSync(`${typeTargetLoc}/${fileName}.ts`, content);
  importTypeToIndex(fileName);
};

export const importTypeToIndex = (type_file: string) => {
  let content = readFileSync(`${typeTargetLoc}/index.ts`).toString();
  const regex = new RegExp(`'./${type_file}'`);

  if (!regex.test(content)) {
    content += `export * from './${type_file}';\n`;
    writeFileSync(`${typeTargetLoc}/index.ts`, content);
  }
};

export const createRoute = (module_name: string) => {
  const fileName = module_name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '-');
  const nameArr = module_name.split('');
  nameArr[0] = nameArr[0].toLowerCase();
  const moduleNameLower = nameArr.join('');

  copyFileSync(routeStubLoc, `${routeTargetLoc}/${fileName}.ts`);

  const content = readFileSync(`${routeTargetLoc}/${fileName}.ts`)
    .toString()
    .replace(/__MODULE_NAME_FOLDER__/g, fileName)
    .replace(/__MODULE_NAME__/g, module_name)
    .replace(/__MODULE_NAME_LOWER__/g, moduleNameLower);

  writeFileSync(`${routeTargetLoc}/${fileName}.ts`, content);
  importRouteToIndex(`${moduleNameLower}Route`, fileName);
};

export const importRouteToIndex = (
  route_name: string,
  route_file_name: string,
) => {
  const content = readFileSync(`${routeTargetLoc}/index.ts`).toString();
  const regex = new RegExp(`'./${route_file_name}'`);

  if (!regex.test(content)) {
    const importContent = `import { ${route_name} } from './${route_file_name}';\n//NEXT_GEN_IMPORT_ROUTE_MODULE`;
    const routeContent = `app.route('/${route_file_name}', ${route_name});\n//NEXT_GEN_ROUTE_MODULE`;

    const contentMod = content
      .replace(/\/\/NEXT_GEN_IMPORT_ROUTE_MODULE/, importContent)
      .replace(/\/\/NEXT_GEN_ROUTE_MODULE/, routeContent);

    writeFileSync(`${routeTargetLoc}/index.ts`, contentMod);
  }
};

export const createSubscriber = (module_name: string) => {
  const subscriberName = `${module_name}Subscriber`;
  copyFileSync(
    subscriberStubLoc,
    `${subscriberTargetLoc}/${subscriberName}.ts`,
  );

  const content = readFileSync(`${subscriberTargetLoc}/${subscriberName}.ts`)
    .toString()
    .replace(/__MODULE_NAME__/g, module_name)
    .replace(/__ENTITY_NAME__/g, `${module_name}Entity`);

  writeFileSync(`${subscriberTargetLoc}/${subscriberName}.ts`, content);
  importSubscriberToDataSource(subscriberName);
};

export const importSubscriberToDataSource = (subscriber_file: string) => {
  const dataSources = readdirSync(dataSourceLoc);

  dataSources.forEach((connection) => {
    const content = readFileSync(`${dataSourceLoc}/${connection}`).toString();
    const regex = new RegExp(`'../subscribers/${subscriber_file}'`);

    if (!regex.test(content)) {
      const importContent = `import { ${subscriber_file} } from '../subscribers/${subscriber_file}';\n//NEXT_GEN_IMPORT_SUBSCRIBER`;
      const subscriberContent = `${subscriber_file},\n//NEXT_GEN_SUBSCRIBER`;

      const contentMod = content
        .replace(/\/\/NEXT_GEN_IMPORT_SUBSCRIBER/, importContent)
        .replace(/\/\/NEXT_GEN_SUBSCRIBER/, subscriberContent);

      writeFileSync(`${dataSourceLoc}/${connection}`, contentMod);
    }
  });
};

export const rollBack = (module_name: string) => {
  const commonName = module_name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .trim()
    .replace(/ /, '-');

  if (existsSync(`${moduleTargetLoc}/${commonName}`))
    execSync(`rm -rf ${moduleTargetLoc}/${commonName}`, { stdio: 'inherit' });

  if (existsSync(`${pipeTargetLoc}/${commonName}`))
    execSync(`rm -rf ${pipeTargetLoc}/${commonName}`, { stdio: 'inherit' });

  if (existsSync(`${validationTargetLoc}/${commonName}`))
    execSync(`rm -rf ${validationTargetLoc}/${commonName}`, {
      stdio: 'inherit',
    });

  if (existsSync(`${typeTargetLoc}/${commonName}.ts`)) {
    unlinkSync(`${typeTargetLoc}/${commonName}.ts`);
    const content = readFileSync(`${typeTargetLoc}/index.ts`)
      .toString()
      .split('\n')
      .filter((line) => !line.includes(`'./${commonName}'`))
      .join('\n');

    writeFileSync(`${typeTargetLoc}/index.ts`, content);
  }

  if (existsSync(`${entityTargetLoc}/${module_name}Entity.ts`)) {
    unlinkSync(`${entityTargetLoc}/${module_name}Entity.ts`);
    const content = readFileSync(`${entityTargetLoc}/index.ts`)
      .toString()
      .split('\n')
      .filter((line) => !line.includes(`'./${module_name}Entity'`))
      .join('\n');

    writeFileSync(`${entityTargetLoc}/index.ts`, content);
  }

  if (existsSync(`${routeTargetLoc}/${commonName}.ts`)) {
    unlinkSync(`${routeTargetLoc}/${commonName}.ts`);
    const content = readFileSync(`${routeTargetLoc}/index.ts`)
      .toString()
      .split('\n')
      .filter(
        (line) =>
          !line.includes(`'./${commonName}'`) &&
          !line.includes(`'/${commonName}'`),
      )
      .join('\n');

    writeFileSync(`${routeTargetLoc}/index.ts`, content);
  }

  if (existsSync(`${subscriberTargetLoc}/${module_name}Subscriber.ts`))
    unlinkSync(`${subscriberTargetLoc}/${module_name}Subscriber.ts`);

  if (existsSync(dataSourceLoc)) {
    const dataSources = readdirSync(dataSourceLoc);

    dataSources.forEach((connection) => {
      const content = readFileSync(`${dataSourceLoc}/${connection}`)
        .toString()
        .split('\n')
        .filter(
          (line) =>
            !line.includes(`'../subscribers/${module_name}Subscriber'`) &&
            !line.includes(` ${module_name}Subscriber`) &&
            !line.includes(`'../entities/${module_name}Entity'`) &&
            !line.includes(` ${module_name}Entity`),
        )
        .join('\n');

      writeFileSync(`${dataSourceLoc}/${connection}`, content);
    });
  }
};
