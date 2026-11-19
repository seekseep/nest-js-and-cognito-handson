"use client";

import { Authenticator, translations } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import { I18n } from "aws-amplify/utils";

// .env.local に書いた Cognito の ID。NEXT_PUBLIC_ で始まるので、ビルドのときに埋め込まれる。
const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID;
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID;

if (userPoolId && userPoolClientId) {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        // メールアドレスでサインインする（ユーザープールの設定に合わせる）
        loginWith: { email: true },
      },
    },
  });
}

// Authenticator の文言を日本語にする
I18n.putVocabularies(translations);
I18n.setLanguage("ja");

// E2E テストのときだけ入る、決め打ちのトークン（playwright.config.ts が渡す）
const fakeToken = process.env.NEXT_PUBLIC_FAKE_TOKEN;

/** サインインしていれば children を、していなければサインインの画面を出す。 */
export function Auth({ children }: { children: React.ReactNode }) {
  // 決め打ちのトークンがあれば、Cognito でのサインインを飛ばす
  if (fakeToken) {
    return (
      <div className="flex flex-col gap-6">
        <p className="text-sm">
          テスト用のトークン（{fakeToken}）で動いています
        </p>
        {children}
      </div>
    );
  }

  if (!userPoolId || !userPoolClientId) {
    return (
      <p role="alert" className="text-red-600">
        Cognito の設定がありません。frontend/.env.example をコピーして
        .env.local を作り、ユーザープール ID とクライアント ID
        を書いてください。
      </p>
    );
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span>{user?.signInDetails?.loginId} でサインイン中</span>
            <button onClick={signOut} className="underline">
              サインアウト
            </button>
          </div>
          {children}
        </div>
      )}
    </Authenticator>
  );
}
