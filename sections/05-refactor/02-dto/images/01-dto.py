"""05-02「入力を dto/ に分ける」の図。

DTO は、API の外（画面・curl・Try it）から届いた本文を、入力チェックを通したあとの形で
コントローラーに渡すためのもの。応答は Note で返す。
スキーマ: CONTAINER（API）+ SOURCE-PATH-GOAL（受け取り）+ CYCLE（応答）。
"""

import os
import sys

sys.path.insert(0, os.path.expanduser("~/.claude/skills/genfig"))
from genfig import Canvas  # noqa: E402

c = Canvas(960, 340)

client = c.node(90, 160, "クライアント\n画面・curl など", emoji_cp="1f310", label_scale="label")  # 🌐

c.sticky(200, 50, 740, 220, color="gray", dash="dashed", weight="thin")
c.text(224, 86, "API", scale="heading", align="left")

check = c.node(335, 160, "入力チェック", shape="hexagon",
               color="purple", w=185, h=80, label_scale="label")
dto = c.node(590, 160, "CreateNoteDto", shape="parallelogram",
             color="yellow", w=220, h=70, label_scale="label")
ctrl = c.node(830, 160, "Notes\nController", shape="square",
              color="blue", w=170, h=80, label_scale="label")

c.link(client, check, label="JSON")
c.link(check, dto)
c.link(dto, ctrl)
c.link(ctrl, client, label="Note（応答）", primary=False, route="elbow",
       start="s", end="s")

c.save("01-dto.svg")
