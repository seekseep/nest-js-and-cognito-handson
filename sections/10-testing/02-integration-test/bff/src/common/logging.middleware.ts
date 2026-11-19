import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import type { User } from '../auth/user.js';

/**
 * リクエストごとに「メソッド・パス・ステータス・かかった時間・誰か」をログに出す。
 * 応答を返し終わった（finish）ときに書くので、Guard が入れた request.user も読める。
 */
@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request & { user?: User }, res: Response, next: NextFunction) {
    const start = performance.now();

    res.on('finish', () => {
      const ms = Math.round(performance.now() - start);
      const user = req.user?.sub ?? '-';
      const message = `${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms user=${user}`;
      // 5xx はエラー、4xx は注意、それ以外はふつうのログにする
      if (res.statusCode >= 500) this.logger.error(message);
      else if (res.statusCode >= 400) this.logger.warn(message);
      else this.logger.log(message);
    });

    next();
  }
}
