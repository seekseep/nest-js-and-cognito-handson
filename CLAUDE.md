# CLAUDE.md

- 返答は日本語で書く
- commit や PR に `Co-Authored-By` や「Generated with Claude Code」を付けない
- 秘密情報（ユーザープール ID・クライアント ID・AWS アカウント ID・キー・`.env` の実値）はコミットしない。
  `git add .` は使わず、何を add するかを `git status` で確かめてからファイルを指定して add する
- このリポジトリでは、PR の作成と自分でのマージをしてよい
- 方針は [.claude/AGENTS.md](.claude/AGENTS.md)、計画は GitHub のイシュー #1 を読むこと
