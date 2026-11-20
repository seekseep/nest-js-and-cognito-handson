import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

/**
 * リクエストごとに「メソッド・パス・ステータス・かかった時間」をログに出す。
 * ステータスは応答を返し終わる（finish）まで決まらないので、そのときに書く。
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now();

    res.on('finish', () => {
      const ms = Math.round(performance.now() - start);
      const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`;
      // 5xx はエラー、4xx は注意、それ以外はふつうのログにする
      if (res.statusCode >= 500) this.logger.error(message);
      else if (res.statusCode >= 400) this.logger.warn(message);
      else this.logger.log(message);
    });

    next();
  }
}
