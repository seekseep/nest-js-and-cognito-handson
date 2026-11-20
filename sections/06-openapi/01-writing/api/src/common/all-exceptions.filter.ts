import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { STATUS_CODES } from 'node:http';

/** この API が返すエラーの形。どのエラーもこの形にそろえる。 */
export interface ErrorBody {
  /** HTTP のステータスコード */
  statusCode: number;
  /** ステータスの名前（Bad Request・Not Found など） */
  error: string;
  /** エラーの説明。入力チェックのエラーでは、項目ごとに 1 つずつ入る */
  messages: string[];
  /** リクエストのパス */
  path: string;
  /** エラーが起きた日時（ISO 8601） */
  timestamp: string;
}

/**
 * すべての例外を受け取り、ErrorBody の形にそろえて返す。
 * APP_FILTER でアプリ全体に登録するので、どのコントローラーの例外もここに来る。
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const body: ErrorBody = {
      statusCode,
      error: STATUS_CODES[statusCode] ?? 'Error',
      messages: toMessages(exception),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      timestamp: new Date().toISOString(),
    };

    // 思いがけない例外（500）は、中身を返さずにログにだけ残す
    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    httpAdapter.reply(ctx.getResponse(), body, statusCode);
  }
}

/** 例外から、利用者に見せる説明の配列を取り出す。 */
function toMessages(exception: unknown): string[] {
  if (!(exception instanceof HttpException)) {
    return ['Internal server error'];
  }
  // NestJS の例外の中身は、文字列か { message: string | string[] } の形
  const response = exception.getResponse();
  if (typeof response === 'string') return [response];
  const message = (response as { message?: unknown }).message;
  if (Array.isArray(message)) return message.map(String);
  if (typeof message === 'string') return [message];
  return [exception.message];
}
