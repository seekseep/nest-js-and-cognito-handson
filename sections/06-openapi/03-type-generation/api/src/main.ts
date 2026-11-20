import { StandardSchemaValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // api/public/ のファイルを、そのままのパスで配る（/ には index.html）
  app.useStaticAssets(join(import.meta.dirname, '..', 'public'));
  // `schema` を指定した @Body() / @Param() / @Query() の値を検証する
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
