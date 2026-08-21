# Akimasa Watanuki — Portfolio

Markdown をコンテンツ源にした、JavaScriptを配信しない静的ポートフォリオです。

## Content

日本語は `content/profile.md`、英語は `content/profile.en.md` にまとめています。文章を更新して `pnpm build` を実行すると、HTMLへ反映されます。

## Development

```sh
pnpm install
pnpm dev
```

公開用の生成は `pnpm build` です。出力は `dist/client`、Sites用Workerは `dist/server/index.js` に生成されます。
