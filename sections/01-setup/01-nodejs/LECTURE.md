---
docs: true
title: Node.js を入れる
---

# Node.js を入れる

![01 章 Node.js を入れる](./images/00-thumbnail.svg)

Next.js も NestJS も Node.js の上で動きます。この節では、Node.js をバージョン管理ツール **nvm** を通して入れます。

Node.js を公式サイトのインストーラーで直接入れることもできますが、プロジェクトごとに必要なバージョンが違うことはよくあります。nvm を使うと、`nvm use 26` のように 1 行でバージョンを切り替えられます。このハンズオンでは **Node.js 26（LTS）** を使います。

:::notice
LTS（Long Term Support）は長期サポート版のことです。偶数番号のバージョンが毎年 10 月ごろに LTS になり、約 3 年間セキュリティ修正が届きます。仕事で使うなら LTS を選びます。
:::

## お使いの OS を選ぶ

手順が OS で分かれるところでは、選んだ OS の手順だけを表示します。最初に、お使いの OS を選んでください。あとから、ページの上のナビゲーションバーの選択欄でも変えられます。

::platform-choice

:::::platform
::::macos
macOS では、ターミナル（「アプリケーション」→「ユーティリティ」→「ターミナル」）で進めます。
::::
::::windows
このハンズオンのコマンドは、macOS と Linux のターミナルを前提にしています。Windows の人は、WSL2（Windows Subsystem for Linux）で Ubuntu を入れ、その中で進めてください。PowerShell を **管理者として実行** し、次のコマンドを実行して再起動します。

```powershell
wsl --install
```

再起動すると Ubuntu が起動します。ユーザー名とパスワードを決めると、Linux のターミナルが使えるようになります。以降の手順は、Ubuntu のターミナルで進めます。
::::
::::linux
Linux では、ふだんのターミナルで進めます。パッケージを入れる手順は、Ubuntu のコマンド（`apt`）で書いています。
::::
:::::

## nvm を入れる

ターミナルで nvm のインストールスクリプトを実行します。

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh | bash
```

スクリプトは、nvm を読み込む設定を、シェルの設定ファイルに書き足します。

:::::platform
::::macos
書き足す先は `~/.zshrc` です。
::::
::::windows-linux
書き足す先は `~/.bashrc` です。
::::
:::::

設定を反映するため、**ターミナルを開き直して** から確かめます。

```bash
nvm --version
```

```text
0.41.0
```

:::warning
`nvm: command not found` と出るときは、ターミナルを開き直したか確かめてください。それでも出るときは、`~/.zshrc` か `~/.bashrc` の末尾に `NVM_DIR` から始まる行が書き足されているか確かめます。
:::

## Node.js 26 を入れる

```bash
nvm install 26
nvm alias default 26
```

`nvm alias default 26` で、新しくターミナルを開いたときに Node.js 26 が使われるようにします。

```bash
node -v
npm -v
```

```text
v26.13.1
11.12.1
```

`v26.` から始まっていれば大丈夫です（細かい番号は入れた日によって違います）。npm は Node.js といっしょに入るパッケージマネージャーで、Next.js や NestJS のライブラリを入れるときに使います。

## npx を確かめる

npm には、パッケージをインストールせずに一度だけ実行する `npx` というコマンドが付いています。02 章で Next.js と NestJS のプロジェクトを作るときに使います。

```bash
npx --version
```

`npm -v` と同じ番号が出れば大丈夫です。

:::faq

### Homebrew や公式サイトのインストーラーで入れた Node.js が既にある

そのままでもかまいませんが、nvm で入れた Node.js と混ざると、どちらが使われているか分かりにくくなります。`which node` を実行して、`~/.nvm/` の下を指していれば nvm の Node.js が使われています。指していないときは、先に入れた Node.js をアンインストールするか、`PATH` の順番を見直してください。

### 会社のネットワークで `curl` が失敗する

プロキシの設定が必要なことがあります。社内の案内に従って `HTTPS_PROXY` を設定してから実行してください。

### Node.js 26 ではなく 24 でも動く？

このハンズオンで使う Next.js 16 と NestJS 12 は Node.js 24 でも動きます。ただし、手順やエラーメッセージは Node.js 26 で確かめています。迷ったら 26 を使ってください。

:::
