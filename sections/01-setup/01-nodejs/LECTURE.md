---
docs: true
title: Node.js と VS Code を入れる
---

# Node.js と VS Code を入れる

![01 章 Node.js と VS Code を入れる](./images/00-thumbnail.svg)

このハンズオンで使うのは、**Node.js 26（LTS）** と、エディタの **VS Code** だけです。この節では、この 2 つと、OpenAPI を扱う VS Code の拡張機能を入れます。

## お使いの OS を選ぶ

手順が OS で分かれるところでは、選んだ OS の手順だけを表示します。あとから、ページの上のナビゲーションバーの選択欄でも変えられます。

::platform-choice

:::::platform
::::macos
macOS では、ターミナル（「アプリケーション」→「ユーティリティ」→「ターミナル」）で進めます。
::::
::::windows
Windows（10 または 11、64 ビット）では、**PowerShell 7** で進めます。最初から入っている Windows PowerShell 5.1 では、`&&` や `curl` がこのハンズオンのとおりに動かないためです。

スタートメニューから「Windows PowerShell」を開き、PowerShell 7 を入れます。

```powershell
winget install --id Microsoft.PowerShell --source winget
```

入れたら、スタートメニューから **PowerShell 7**（`pwsh`）を開きます。以降のコマンドは、すべて PowerShell 7 で実行します。

```powershell
$PSVersionTable.PSVersion
```

`7.` から始まる番号が出れば大丈夫です。
::::
::::linux
Linux では、ふだんのターミナルで進めます。パッケージを入れる手順は、Ubuntu のコマンド（`apt`）で書いています。
::::
:::::

## Node.js を入れる

[Node.js のダウンロードのページ](https://nodejs.org/ja/download) を開き、バージョンに **v26（LTS）** を選びます。

:::::platform
::::macos
macOS 用のインストーラー（`.pkg`）をダウンロードして開き、画面の案内に従って進めます。
::::
::::windows
Windows 用のインストーラー（`.msi`）をダウンロードして開き、画面の案内に従って進めます。
::::
::::linux
OS に **Linux** を選び、表示されたコマンドをターミナルで実行します（`apt install nodejs` で入る Node.js は古いので使いません）。
::::
:::::

入れたら、ターミナル（Windows では PowerShell 7）を開き直して確かめます。

```bash
node -v
npm -v
npx --version
```

```text
v26.13.1
11.12.1
11.12.1
```

`node -v` が `v26.` から始まっていれば大丈夫です（細かい番号は入れた日によって違います）。npm はライブラリを入れるパッケージマネージャーで、`npx` はパッケージを入れずに一度だけ実行するコマンドです。02 章で NestJS のプロジェクトを作るときに使います。

## VS Code を入れる

エディタには [Visual Studio Code](https://code.visualstudio.com/)（VS Code）を使います。[ダウンロードのページ](https://code.visualstudio.com/download) から、お使いの OS 用をダウンロードして入れます。

:::::platform
::::macos
ダウンロードしたファイルを開き、できた **Visual Studio Code** を「アプリケーション」フォルダに移します。VS Code を開き、コマンドパレット（Cmd + Shift + P）で **Shell Command: Install 'code' command in PATH** を実行すると、ターミナルから `code` で開けるようになります。
::::
::::windows
ダウンロードしたインストーラーを開いて進めます。インストーラーが `code` コマンドを `PATH` に足すので、入れたあとに開いた PowerShell から使えます。
::::
::::linux
Ubuntu なら `.deb` をダウンロードして入れます。

```bash
sudo apt install ./code_*.deb
```
::::
:::::

ターミナルで確かめます。

```bash
code --version
```

番号が出れば大丈夫です。フォルダを VS Code で開くときは、そのフォルダで `code .` を実行します。VS Code の中では、`` Ctrl + ` ``（バッククォート）でターミナルが開きます。

## OpenAPI の拡張機能を入れる

03 章から書く `openapi.yaml`（API の設計）を、VS Code で見て、そこから API にリクエストを送るために、42Crunch の [OpenAPI (Swagger) Editor](https://marketplace.visualstudio.com/items?itemName=42Crunch.vscode-openapi) を入れます。編集・プレビュー・リクエストを送る機能（Try it）は、登録なしで使えます。

```bash
code --install-extension 42Crunch.vscode-openapi
```

`was successfully installed` と出れば大丈夫です。VS Code の左の拡張機能のビューで、`OpenAPI (Swagger) Editor` が入っていることも確かめられます。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [Node.js: ダウンロード](https://nodejs.org/ja/download) … インストーラーでの入れ方
- [Microsoft Learn: Windows への PowerShell のインストール](https://learn.microsoft.com/ja-jp/powershell/scripting/install/installing-powershell-on-windows) … winget で PowerShell 7 を入れる方法
- [npm Docs: npx](https://docs.npmjs.com/cli/v11/commands/npx) … `npx` の働き
- [VS Code: Visual Studio Code on macOS](https://code.visualstudio.com/docs/setup/mac) … macOS での入れ方と、`code` コマンドを `PATH` に足す方法
- [VS Code: Visual Studio Code on Windows](https://code.visualstudio.com/docs/setup/windows) … Windows のインストーラーと `PATH`
- [VS Code: Visual Studio Code on Linux](https://code.visualstudio.com/docs/setup/linux) … `.deb` パッケージでの入れ方
- [VS Code: Command Line Interface](https://code.visualstudio.com/docs/configure/command-line) … `code --install-extension`
- [42Crunch: OpenAPI (Swagger) Editor（README）](https://github.com/42Crunch/vscode-openapi#readme) … 拡張機能でできること（プレビュー・Try it）と、登録なしで使えること

:::faq

### `node -v` で 26 ではないバージョンが出る

前から別の方法（Homebrew・nvm など）で入れた Node.js が先に使われています。`which node`（Windows の PowerShell では `Get-Command node`）で場所を確かめ、使わないほうをアンインストールしてから、ターミナルを開き直してください。

:::
