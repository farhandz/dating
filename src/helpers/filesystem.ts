import { existsSync, mkdirSync } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import { createWriteStream, unlinkSync } from 'fs';

export const createRecDirectory = (target: string) => {
  if (!existsSync(target)) {
    mkdirSync(target, { recursive: true });
  }
};

export const uploadS3 = async (files: File[]) => {
  const execAsync = promisify(exec);
  await execAsync(
    `aws --profile awss3 configure set aws_access_key_id "${process.env.AWS_ACCESS_KEY_ID}"`,
  );
  await execAsync(
    `aws --profile awss3 configure set aws_secret_access_key "${process.env.AWS_SECRET_ACCESS_KEY}"`,
  );
  await execAsync(
    `aws --profile awss3 configure set region "${process.env.AWS_DEFAULT_REGION}"`,
  );

  const endpoint = process.env.AWS_ENDPOINT
    ? `--endpoint-url ${process.env.AWS_ENDPOINT}`
    : '';

  for (let index = 0; index < files.length; index++) {
    const writableStream = createWriteStream(files[index].name);
    const bufferData = Buffer.from(await files[index].arrayBuffer());
    writableStream.write(bufferData);
    writableStream.end();

    await execAsync(
      `aws s3 cp --profile awss3 --acl public-read "${files[index].name}" ${endpoint} s3://${process.env.AWS_BUCKET}/${process.env.AWS_FOLDER}/"${files[index].name}"`,
    );

    unlinkSync(files[index].name);
  }
  await execAsync('rm -rf ~/.aws');
};
