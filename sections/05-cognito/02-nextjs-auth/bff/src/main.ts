import { StandardSchemaValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Next.js の画面（http://localhost:3000）からの呼び出しを許可する
  app.enableCors({ origin: 'http://localhost:3000' });
  // `schema` を指定した @Body() / @Param() / @Query() の値を検証する
  app.useGlobalPipes(new StandardSchemaValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
