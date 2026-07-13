---
name: 綿貫 晃雅
name_secondary: Akimasa Watanuki
role: 高性能計算・コンパイラ
affiliation: 東京科学大学 情報理工学院 数理・計算科学系
lab: AC2 Lab
lab_url: https://www.ac2.scrc.iir.isct.ac.jp/
year: 修士1年
summary: AC2 Labで、Cerebras WSE上のグラフニューラルネットワーク学習の高速化を研究しています。LLVM projectでは、MLIRとClangIRの不具合修正に加え、ClangIRのOpenCL対応に取り組んでいます。
email: watanuki@ac2.scrc.iir.isct.ac.jp
github: https://github.com/Men-cotton
linkedin: https://www.linkedin.com/in/mencotton/
x: https://x.com/men_cotton
atcoder: https://atcoder.jp/users/mencotton
contact: 研究、OSS、インターンシップに関する連絡はメールでお願いします。
casual_contact: 雑談や短い質問には、
casual_contact_link: Xのメンションも利用できます
---

# Akimasa Watanuki

## 現在の研究・活動

### Cerebras WSE上のGNN学習
Cerebras WSEを用いたGNN学習を題材に、計算、通信、メモリの処理時間を分析し、学習パイプラインの高速化に取り組んでいます。

### LLVM projectでのコンパイラ開発
MLIRとClangIRを中心に、クラッシュの修正、テストの追加、loweringの実装を行っています。最近は、OpenCLカーネルの引数メタデータをCIR関数へ付与し、LLVM IRへloweringする処理に取り組んでいます。

## 主な実績

### LLVM projectでの開発実績
MLIRとClangIRのクラッシュ修正に加え、OpenCLコードをClangIRで扱うための実装に取り組んでいます。issueの整理とテストコードのレビューにも参加しています。
[マージ済みPR](https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3AMen-cotton+is%3Amerged+sort%3Aupdated-desc)

### Cerebras WSE向けGNN実装
ウェハスケールプロセッサ上でGNN学習パイプラインを実装しました。学部卒業研究から継続して、性能分析と高速化を行っています。
[リポジトリ](https://github.com/Men-cotton/gnn-modelzoo-fork)

### ClangIRによるPolyBenchの変換
PolyBenchのプログラムをClangIRでloweringし、CPU対応の状況と生成コードを調査しました。
[リポジトリ](https://github.com/Men-cotton/llvm-test-suite-clangir)

### Fixstarsインターンシップ
CUDAを用いたステレオマッチングのパイプラインを構築しました。Nsight SystemsとNsight Computeで処理時間を測定し、ボトルネックとなる処理を高速化しました。

### SWoPP 2026での研究発表
SWoPP 2026 HPC-4（2026年8月6日）の発表題目は「高水準ワークフローを用いたCerebras CS-3上の不規則GNN学習の実行特性分析」です。共同発表者は小林諒平氏です。
[プログラム](https://swopp.github.io/2026/program/)

## 受賞・成績

- LLVM projectのcommit権限
- AtCoder Algorithm部門 最高レート2202
- 日本情報オリンピック2021 春季トレーニング合宿参加
- SuperComputingContest 2019 3位
- 学生向けFixstars高速化コンテスト2026 23位

## 関心

- AI for Scienceと研究開発の自動化
- MLIRを利用するプログラミング言語
- 自律ロボット
- ダンスゲーム、蒙古タンメン中本、ウイスキー
