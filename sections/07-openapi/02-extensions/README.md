# 07-02 VS Code 拡張機能の紹介

`openapi.yaml` を書くための VS Code の拡張機能を `.vscode/extensions.json` で勧め、Redocly CLI で確かめられるようにした状態です。教材: `LECTURE.md`

## 動かし方

```bash
npm install            # my-app/ 直下。Redocly CLI が入る
npm run lint:api       # openapi.yaml を確かめる

cp ui/.env.example ui/.env.local   # 自分のユーザープールの値に書き換える
cp api/.env.example api/.env                   # 同じく
podman compose up --build --watch
```
