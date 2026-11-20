---
docs: true
title: Podman を入れる
---

# Podman を入れる

![01 章 Podman を入れる](./images/00-thumbnail.svg)

**Podman** は、コンテナを作って動かすためのツールです。Docker とほぼ同じコマンドで使えて、常駐するデーモン（バックグラウンドで動き続ける管理プロセス）を持たないのが特徴です。

この節では Podman のコマンドを入れるところまでを行います。コンテナを動かす環境（Podman マシン）を作り、実際にアプリを動かすのは [03 章](../../03-podman/01-setup/LECTURE.md) です。

## コンテナを使う理由

02 章では、Next.js と NestJS を手元の Node.js で直接動かします。これでも開発はできますが、人によって Node.js のバージョンや OS が違うと「自分の環境では動くのに」が起きます。コンテナを使うと、Node.js のバージョンや必要なファイルを `Containerfile` に書いて、誰の手元でも同じ環境で動かせます。

## インストール

:::::platform
::::macos
macOS では、コンテナは Linux の仮想マシン（**Podman マシン**）の中で動きます。仮想マシンは 03 章で作ります。

Homebrew で入れます。

```bash
brew install podman
```

画面で操作したい人は [Podman Desktop](https://podman-desktop.io/) を入れてもかまいません。Podman Desktop は Podman 本体もいっしょに入れてくれます。
::::
::::windows
Windows でも、コンテナは Linux の仮想マシン（**Podman マシン**）の中で動きます。Podman は、この仮想マシンに **WSL**（Windows Subsystem for Linux）を使います。仮想マシンは 03 章で作ります。

まず WSL を入れます。PowerShell を **管理者として実行** し、次のコマンドを実行して、パソコンを再起動します。

```powershell
wsl --install
```

再起動したら、WSL のバージョンが 2.5.1 以上かを確かめます。古いときは `wsl --update` で新しくします。

```powershell
wsl --version
```

次に、[Podman の GitHub のリリースのページ](https://github.com/containers/podman/releases) から、Windows 用のインストーラー（`podman-installer-windows-amd64.msi`。Arm の Windows なら `arm64`）をダウンロードして開きます。

- 入れる範囲は、既定の「自分だけ」（管理者の権限が要らない）のままでかまいません
- 仮想マシンの種類（プロバイダ）を聞かれたら、**WSL** を選びます

入れ終わったら、PowerShell 7 を開き直します。

画面で操作したい人は [Podman Desktop](https://podman-desktop.io/) を入れてもかまいません。
::::
::::linux
apt で入れます。コンテナは、仮想マシンを作らずにそのまま動きます。

```bash
sudo apt update
sudo apt install -y podman
```
::::
:::::

## 確かめる

```bash
podman --version
```

```text
podman version 6.2.0
```

Homebrew（macOS）や Windows のインストーラーで入れると 6 系が入ります。Ubuntu の apt で入れると、Ubuntu のバージョンによっては 4 系や 5 系になりますが、このハンズオンの範囲ではどれでも動きます。

## Docker との違い

| | Docker | Podman |
|---|---|---|
| コマンド | `docker run ...` | `podman run ...`（ほぼ同じ） |
| デーモン | 常駐する（Docker Engine） | 常駐しない |
| 権限 | 既定は root で動く | 既定は一般ユーザーで動く（rootless） |
| 定義ファイル | `Dockerfile` | `Containerfile`（`Dockerfile` も読める） |
| 複数コンテナ | `docker compose` | `podman compose`（03 章で設定する） |

Docker を使ったことがある人は、`docker` を `podman` に読み替えればほとんどそのまま使えます。

## 参考にした公式ドキュメント

この節は、次の公式ドキュメントをもとに書いています。

- [Podman: Installation](https://podman.io/docs/installation) … macOS・Linux への入れ方
- [Podman for Windows](https://github.com/containers/podman/blob/main/docs/tutorials/podman-for-windows.md) … Windows で必要なもの（Windows 11・WSL 2.5.1 以上・仮想化）と、インストーラーでの入れ方
- [Microsoft Learn: WSL のインストール](https://learn.microsoft.com/ja-jp/windows/wsl/install) … `wsl --install`

:::faq

### Docker Desktop が入っていても大丈夫？

共存できます。ただし、どちらもポートを使うので、同じポート（たとえば 3000 番）で両方からコンテナを動かすとぶつかります。このハンズオンの間は Docker 側のコンテナを止めておくと安心です。

### `brew: command not found` と出る

Homebrew が入っていません。[Homebrew の公式サイト](https://brew.sh/ja/) のコマンドで入れるか、Podman Desktop のインストーラーを使ってください。

:::
