import { INestApplication, StandardSchemaValidationPipe } from '@nestjs/common';

/**
 * main.ts と結合テストの両方で使う、アプリの設定。
 * テストでも本番と同じ設定で動かすために、1 か所にまとめる。
 */
export function setupApp(app: INestApplication): void {
  // Next.js の画面（http://localhost:3000）からの呼び出しを許可する
  app.enableCors({ origin: 'http://localhost:3000' });
  // `schema` を指定した @Body() / @Param() / @Query() の値を検証する
  app.useGlobalPipes(new StandardSchemaValidationPipe());
}
