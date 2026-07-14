---
name: 綿貫 晃雅
name_secondary: Akimasa Watanuki
role: 高性能計算・コンパイラ
affiliation: 東京科学大学 情報理工学院 数理・計算科学系
lab: AC2 Lab
lab_url: https://www.ac2.scrc.iir.isct.ac.jp/
advisor: 小林諒平先生
advisor_url: https://sites.google.com/site/ryokbya/home-japanese
year: 修士1年
summary: 大規模AIアクセラレータ上の機械学習の高速化を研究しています。LLVM projectのコンパイラ開発にも携わっています。
keywords_label: 分野
keywords: 高性能計算（HPC） / Cerebras WSE / GNN / GPU / 機械学習の高速化 / AI for Science / デジタルツイン / コンパイラ / LLVM / MLIR / ClangIR / OpenCL
email: watanuki@ac2.scrc.iir.isct.ac.jp
github: https://github.com/Men-cotton
linkedin: https://www.linkedin.com/in/mencotton/
x: https://x.com/men_cotton
atcoder: https://atcoder.jp/users/mencotton
contact_before: 研究、OSS、インターンシップに関する連絡は
contact_after: へお願いします。
casual_contact: 雑談や短い質問には、
casual_contact_link: Xのメンションもどうぞ
---

# Akimasa Watanuki

## 研究実績

### SWoPP 2026での研究発表
SWoPP 2026 HPC-4（2026年8月6日）で「高水準ワークフローを用いたCerebras CS-3上の不規則GNN学習の実行特性分析」を発表します。指導教員の小林諒平先生との共同発表です。
[プログラム](https://swopp.github.io/2026/program/)

### Cerebras WSE向けGNN実装
ウェハスケールプロセッサ上でGNN学習パイプラインを実装しました。学部卒業研究から継続して性能分析と高速化を行い、将来的にはWSE向けカーネルを高水準言語から生成するコンパイラの開発を目指しています。
[リポジトリ](https://github.com/Men-cotton/gnn-modelzoo-fork)

## 開発実績

### LLVM projectでの開発実績
OpenCLコードをClangIRで扱うため、カーネル引数メタデータをCIR関数へ付与し、LLVM IRへloweringする処理に取り組んでいます。MLIRとClangIRのクラッシュ修正、issueの整理、テストコードのレビューにも参加しています。
[マージ済みPR](https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3AMen-cotton+is%3Amerged+sort%3Aupdated-desc)

### ClangIRによるPolyBenchの変換
PolyBenchのプログラムをClangIRでloweringし、CPU対応の状況と生成コードを調査しました。
[リポジトリ](https://github.com/Men-cotton/llvm-test-suite-clangir)

## 経歴

### AC2 Lab（2026年–現在）
リサーチアシスタントとして勤務しています。

### チームラボ（2024年8月）
OpenCVとC++を用い、コンピュータビジョン関連アプリを開発しました。

### いい生活（2024年8月）
Reactと物件APIを用いた物件比較アプリを、ハッカソン形式で開発しました。

### Fixstars（2024年3月–4月）
CUDAを用いたステレオマッチングのパイプラインを構築しました。Nsight SystemsとNsight Computeで処理時間を測定し、ボトルネックとなる処理を高速化しました。

### ロボ団 北浦和校（2023年2月–現在）
プログラミング講師として勤務しています。

## 受賞・成績

- [LLVM projectのcommit権限](https://github.com/llvm/llvm-project/issues/176158)
- [AtCoder Algorithm部門 最高レート2202](https://atcoder.jp/users/mencotton)
- [日本情報オリンピック2021 春季トレーニング合宿参加](https://www2.ioi-jp.org/joi/2020/2021-ho-press_release.pdf)
- [SuperComputingContest 2019 3位](https://www.titech.ac.jp/english/news/2019/045321)
- [学生向けFixstars高速化コンテスト2026 23位](https://news.fixstars.com/6306/)

## 関心

- AI for Scienceと研究開発の自動化
- MLIRを利用するプログラミング言語
- 自律ロボット
- ダンスゲーム
- 蒙古タンメン中本
- ウイスキー
