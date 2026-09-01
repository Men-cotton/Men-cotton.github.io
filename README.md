# Akimasa Watanuki — Portfolio

Markdown をコンテンツ源にした、実行用JavaScriptを配信しない静的ポートフォリオです。構造化データは実行されない JSON-LD としてHTMLに埋め込みます。

## Content

日本語は `content/profile.md`、英語は `content/profile.en.md` にまとめています。文章を更新して `pnpm build` を実行すると、HTMLへ反映されます。

公開する CV はルート直下の `cv-llt.pdf` です。ビルド時に `dist/cv-llt.pdf` へコピーされ、日本語・英語のプロフィール欄の「CV (PDF)」リンクから閲覧できます。更新時はこのファイルを差し替えてください。他のルート直下の PDF は引き続き Git の除外対象です。

## Search metadata

公開するプロフィールは英語 `/` と日本語 `/ja/` の各1ページです。旧 `/ja.html` は canonical と即時 meta refresh を持つ小さな転送ページのみ残し、プロフィール本文は重複生成しません。404・転送用HTMLはコンテンツページには数えず、sitemapにも載せません。

各Markdownのfrontmatterで次を管理します。

- `title` / `description`: 検索用メタデータ・Open Graph・X・ProfilePageに共通で使用します。本文のキャッチコピーは `role` のままです。
- `handle` / `institution`: 本文の実在する別名・所属と一致させます。架空の外部プロフィールは追加しません。

更新日時はMarkdownへ手入力しません。ビルド時にGit履歴から、各言語のMarkdown・共通のHTML生成処理・プロフィール画像のうち最後に変更されたコミット日時を取得します。画面には日付部分だけを表示し、ProfilePageの `dateModified` とsitemapの `lastmod` にはタイムゾーン付きISO 8601の完全な日時を使用します。このため、内容が変わらない再ビルドだけでは更新日時が変わりません。GitHub Actionsはファイル別の履歴を参照できるよう、全履歴をcheckoutします。

ビルドで `dist/sitemap.xml` と `dist/robots.txt` を生成します。sitemapには2つの正規URLだけを記載し、robotsは全クローラーを許可してsitemapの絶対URLを通知します。検索bot・学習botの個別制限は設けていません。

各ページには自己参照を含む `en`・`ja`・`x-default` のhreflangと、`WebSite`・`ProfilePage`・`Person` のJSON-LDを生成します。両言語で同じPerson IDを使い、既存のGitHub・LinkedIn・AtCoder・Xを `sameAs` に指定します。正規URLの定義は `scripts/build-static.mjs` にまとめています。

`lastmod` は実質的な更新日を使い、hreflangは自分自身と別言語を相互に列挙する、という[Googleのsitemap仕様](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)と[多言語ページの仕様](https://developers.google.com/search/docs/specialty/international/localized-versions)に沿っています。

## Development

```sh
pnpm install
pnpm dev
```

公開用の生成は `pnpm build` です。GitHub Pagesへそのまま配置できる静的ファイルが `dist` に生成され、`main` へのpush時にGitHub Actionsが自動で公開します。

`pnpm test` でビルドとローカル配信の回帰テストを実行できます。テストは一時ディレクトリ内のコピーを使用し、作業中のコンテンツや `dist` を変更しません。GitHub Actionsでも公開前に実行します。
