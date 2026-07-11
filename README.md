# 腰痛タイプ別セルフチェック・ナビ

理学療法士監修の「腰痛タイプ別セルフチェック」静的Webアプリです。
5〜8問の質問に答えると、腰痛タイプの目安（教育的セルフチェック）と、タイプ別のセルフケア記事（note）への案内が表示されます。

- 完全クライアントサイド（バックエンドなし・外部へのデータ送信なし・localStorage不使用）
- 本ツールは教育目的のセルフチェックであり、医学的診断ではありません

公開URL: https://ryuta-pt.github.io/youtsu-navi/

## 文言の編集方法（監修者向け）

**すべての文言は `src/data/flow.ts` の1ファイルにあります。**

- 質問文・選択肢 … `step0` / `q1` / `q2` / `q2b` / `q3`
- 結果ページ（7タイプ）… `r1`〜`r7`
  - `typeName` = タイプ名（画面では「〜の可能性があります」が自動で付きます）
  - `mechanism` = 仕組みの解説（`\n` で改行）
  - `selfCare` = 今日からできるセルフケア
  - `guideUrl` = note記事のURL。`{NOTE_GUIDE_URL_x}` のままのものは
    記事公開後にファイル冒頭の定数を実URLへ書き換えてください
    （未設定の間は「関連記事を読む」としてnoteトップへ誘導されます）
- 受診案内 … `exitA`（危険サイン）/ `exitA_urgent`（緊急）/ `exitB`（判定困難）/ `exitC`（血管性疑い）
- 監修表記・免責文・メンバーシップURLなど … ファイル冒頭の定数

編集して `main` ブランチへ push すると、自動でビルド・公開されます（下記）。

## ローカルで動かす（開発者向け）

Node.js 20以上が必要です（未インストールの場合: https://nodejs.org/ からLTS版を導入）。

```bash
npm install
npm run dev      # http://localhost:5173/youtsu-navi/ で起動
npm run build    # 型チェック＋本番ビルド（dist/ に出力）
```

## GitHub Pages へのデプロイ

このリポジトリは GitHub Actions（`.github/workflows/deploy.yml`）で自動デプロイされます。

1. GitHubリポジトリの Settings → Pages → Build and deployment → Source を
   「GitHub Actions」に設定する（初回のみ）
2. `main` ブランチに push すると、自動でビルドされ公開されます
3. 公開URL: `https://<ユーザー名>.github.io/youtsu-navi/`

※ リポジトリ名を変える場合は `vite.config.ts` の `base` と
`index.html` のOGP URL（`og:url` / `og:image` / `twitter:image`）も合わせて変更してください。

## 安全設計のメモ

- Step0で危険サイン（レッドフラグ）を必ず確認し、該当者はセルフケアに進ませず受診案内へ
- 受診案内ページには販促リンク（note CTA）を置かない
- 「診断」という語をUIで使わない／断定・効果保証の表現を使わない
- 回答データはメモリ上のみで、送信・保存は一切行わない
