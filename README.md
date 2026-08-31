# Akimasa Watanuki — Portfolio

Markdown をコンテンツ源にした、JavaScriptを配信しない静的ポートフォリオです。

## Content

日本語は `content/profile.md`、英語は `content/profile.en.md` にまとめています。文章を更新して `pnpm build` を実行すると、HTMLへ反映されます。

公開する CV はルート直下の `cv-llt.pdf` です。ビルド時に `dist/cv-llt.pdf` へコピーされ、日本語・英語のプロフィール欄の「CV (PDF)」リンクから閲覧できます。更新時はこのファイルを差し替えてください。他のルート直下の PDF は引き続き Git の除外対象です。

## Development

```sh
pnpm install
pnpm dev
```

公開用の生成は `pnpm build` です。GitHub Pagesへそのまま配置できる静的ファイルが `dist` に生成され、`main` へのpush時にGitHub Actionsが自動で公開します。
