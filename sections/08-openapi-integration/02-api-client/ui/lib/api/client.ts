// openapi.yaml から作った型（paths）を使う、型付きの API クライアント。

import { fetchAuthSession } from "aws-amplify/auth";
import createClient, { type Middleware } from "openapi-fetch";
import type { paths } from "./schema";

// API の URL。ブラウザから呼ぶので、Mac から見た localhost:3001 になる。
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

/**
 * すべてのリクエストに、サインイン中のユーザーのアクセストークンを付ける。
 * fetchAuthSession は、トークンの期限が切れていれば自動で取り直す。
 */
const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const { tokens } = await fetchAuthSession();
    const accessToken = tokens?.accessToken.toString();
    if (accessToken) {
      request.headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return request;
  },
};

export const client = createClient<paths>({ baseUrl: API_URL });
client.use(authMiddleware);
