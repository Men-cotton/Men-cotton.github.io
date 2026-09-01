---
name: 綿貫 晃雅
name_secondary: Akimasa Watanuki
handle: Men-cotton
title: 綿貫晃雅（Men-cotton）| AIアクセラレータと高性能計算
description: 綿貫晃雅（Men-cotton、東京科学大学 数理・計算科学系／AC2 Lab）のポートフォリオ。Cerebras WSE上のGNN学習・性能解析を研究し、LLVM ProjectのClangIRでOpenCL対応に貢献しています。
role: GPU以外でも、AI計算を高速・簡単・検証可能に。
affiliation: 東京科学大学 情報理工学院 数理・計算科学系
institution: 東京科学大学
lab: AC2 Lab
lab_url: https://www.ac2.scrc.iir.isct.ac.jp/
advisor: 小林諒平先生
advisor_url: https://sites.google.com/site/ryokbya/home-japanese
year: 修士1年
summary: 異種AIアクセラレータの性能分析と、LLVM Projectにおけるコンパイラ開発に取り組んでいます。
fields_label: 分野
fields: 高性能計算（HPC） / 機械学習の性能分析 / AI for Science / コンパイラ / AI Safety
keywords_label: キーワード
keywords: Cerebras WSE / GPU / GNN / デジタルツイン / LLVM / MLIR / ClangIR / OpenCL / Compute governance
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

## 研究プロジェクト・発表

### Cerebras CS-3上のGNN学習・性能分析
シリコンウェハ全体を一つのプロセッサとして使うWafer-Scale Engine（WSE）を搭載したCerebras CS-3上に、代表的なグラフニューラルネットワークであるGraphSAGEの学習ワークフローを実装しました。学部卒業研究として始め、現在は性能分析と実装改善の両面から発展させています。

GPU向けの機械学習基盤は成熟していますが、GNN学習は、GPU基盤が得意な規則的な密行列演算だけでは完結しません。頂点ごとに異なる数の近傍をたどり、疎で不規則な集約を行うためです。[先行研究](https://ar5iv.labs.arxiv.org/html/2112.08541)では、大規模グラフを用いる典型的なDGL学習で、GPU利用率が約10%にとどまった例も報告されています。

そこで、WSEのウェハスケールな計算資源をGNN学習に生かせるかを、CS-3とNVIDIA H100の比較を通じて検証しました。同じデータセットで同程度の検証精度に到達した一方、現行の高水準ワークフローではCS-3の学習スループットが大きく下回りました。分析からは、このワークフローがWSE上のデータ配置や疎集約を十分に制御・観測できていない可能性も見えました。

成果をSWoPP 2026で発表し、現在は性能差の原因をハードウェア側とソフトウェアスタック側に切り分けながら、実装を改善しています。疎で不規則なワークロードを新しいアーキテクチャで効率よく実行する条件を明らかにし、ハードウェアとプログラミング環境の双方の改善につなげることを目指しています。
[研究報告（査読なし）](https://ipsj.ixsq.nii.ac.jp/records/2010658)
[実装リポジトリ](https://github.com/Men-cotton/gnn-modelzoo-fork)

## 個人開発・OSS貢献

### LLVM ProjectにおけるClangIR・MLIR開発
研究とは別に、個人のOSS活動としてLLVM Projectの開発に参加しています。commit権限を取得し、現在もClangIRやMLIRへの貢献を続けています。

私は、OpenCLカーネル引数のメタデータをClangIR（CIR）で表現・生成し、MLIRのLLVM dialectを経てLLVM IRまで伝える機構を実装しました。これらの変更はLLVM Projectへマージされています。

OpenCL Cのようなアクセラレータ向け言語では、型、アドレス空間、カーネル引数などの情報を変換途中でも保持する必要があります。これらの情報が失われると、後段のコード生成や実行時処理で、カーネル引数が指すメモリ領域を正しく判断できない等の問題が生じます。CIRは、Clangが扱うC/C++系のソース表現と、機械語生成に近いLLVM IRの間に置かれ、ソース言語の意味をより多く保つ中間表現です。CIRはMLIRの仕組みを活用し、段階的に中間表現を変換します。

この段階的な変換基盤により、複数のアクセラレータ向け実装を一つの仕組みで保守しながら、変換される処理の意味と付随情報も追跡できます。将来は、コンパイラが保持する情報をランタイムやハードウェアが残す実行記録と結び、異種アクセラレータ上のAI処理を検証する基盤へつなげたいと考えています。
[マージ済みPR](https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3AMen-cotton+is%3Amerged+sort%3Aupdated-desc)
[commit権限の付与記録](https://github.com/llvm/llvm-project/issues/176158)

## 研究の関心

私の研究関心は、GPU以外でもAI計算を高速・簡単・検証可能にすることです。現在は、異種アクセラレータの性能分析とコンパイラ開発に取り組んでいます。将来は、その知見を生かし、AIの実行を共通形式で表現・観測するAI Safety研究へ展開することを目指しています。

### 高速にする――異種AIアクセラレータの性能分析
高校3年間、東京工業大学と大阪大学が共催するSuperConの本選に毎年出場し、高校1年時には3位に入賞しました。通常の競技プログラミングがCPU上で数秒以内に終わる問題を扱うのに対し、SuperConでは、スーパーコンピュータ上でも実行に数分から数時間かかるプログラムを高速化します。その中で、同じアルゴリズムでも、仕事の分け方や通信、メモリアクセスによって実行時間が大きく変わることに惹かれました。この経験を軸に総合型選抜で東京工業大学（現：東京科学大学）へ進学し、大学でも高性能計算を研究してきました。

現在は、GPUとWSEのように構造の異なるAIアクセラレータへ対象を広げています。単なる速度比較ではなく、性能を制限する要因をハードウェアとソフトウェアの各層へ分解して示すことで、新しい計算機を利用者が効果的かつ容易に使える基盤へ育てることを目指しています。
[SuperCon](https://www.supercon.cii.isct.ac.jp/attwiki/index.php)

### 簡単にする――コンパイラとプログラミングモデル
GPUとWSEでは、メモリの構造も並列実行の単位も大きく異なり、同じ計算を動かす場合にも、それぞれに合わせた低水準実装が必要です。CS-3の研究では、PythonやPyTorchを使う高水準ワークフローからはデータ配置や疎集約を十分に指定できず、反対に低水準言語のCSLですべてを書けば、開発量とハードウェア依存性が増えるという隔たりを経験しました。

そこで、GNNの意味を保つ高水準表現から、各アクセラレータに適したデータ配置・通信・並列化を表す低水準コードへ段階的に変換するMLIRベースのコンパイラを目指しています。実現すれば、研究者はモデル全体を書き直さずに新しい計算機を試せます。また、同じ中間表現を性能分析と実行管理の共通基盤にすることで、ハードウェアが変わっても処理の構造と付随情報を比較・追跡できます。
[ClangIR](https://llvm.github.io/clangir/)
[MLIR](https://mlir.llvm.org/)

### 検証可能にする――AI Safety
高度なAI開発を安全に管理する方法の一つに、計算資源の利用を観測するcompute governanceがあります。私は、資源利用や実行パターンなど外部に現れる情報からワークロードを推定し、承認された計算資源量を超えるLLM学習を検知する技術に関心があります。目的は科学研究やソフトウェア開発を一律に制限することではなく、計算が定められた方針に沿っているかを、モデル内部へ立ち入らず確認できるようにすることです。

現在のワークロード検知研究では、GPUを対象とした実証が先行しています。一方、AI向けハードウェアは多様化しており、GPU向けの監視・検証手法をそのまま適用できるとは限りません。そこで、compute governanceをWSEなどGPU以外のアクセラレータへ拡張し、基盤が変わっても同じ方針でワークロードを識別・検証できる方法を探りたいと考えています。
[AIリスク概要（MIRI）](https://intelligence.org/briefing/)
[GPU学習検知](https://arxiv.org/abs/2606.19262)
[AI 2027のraceシナリオ](https://ai-2027.com/race)

## 学歴

### 東京科学大学 数理・計算科学系 修士課程（2026年4月–2028年3月修了予定）
情報理工学院 数理・計算科学系の修士課程に在籍し、学士課程に引き続き小林諒平先生の指導のもと、AC2 Labで研究に取り組んでいます。科研費 基盤研究(B)の研究課題に、リサーチアシスタントとして従事しています。
[「グラフ構造データ処理を加速するウェハースケール・コンピューティング」（26K02920）](https://kaken.nii.ac.jp/ja/grant/KAKENHI-PROJECT-26K02920/)

### 東京科学大学 学士（理学）・数理・計算科学系（2022年4月–2026年3月）
東京工業大学へ入学し、大学統合後の東京科学大学で情報理工学院 数理・計算科学系の学士課程を修了しました。2025年4月から、小林諒平先生の指導のもとAC2 Labに所属しました。卒業研究では、前述のCerebras CS-3上のGraphSAGE学習プロジェクトに取り組みました。

## 職歴

### チームラボ（2024年8月）
OpenCVとC++を用い、コンピュータビジョン関連アプリを開発しました。

### いい生活（2024年8月）
Reactと物件APIを用いた物件比較アプリを、ハッカソン形式で開発しました。

### Fixstars（2024年3月–4月）
CUDAを用いたステレオマッチングのパイプラインを構築しました。Nsight SystemsとNsight Computeで処理時間を測定し、ボトルネックとなる処理を高速化しました。

### ツクリウム（2023年2月–現在）
プログラミング講師として勤務しています。子供たちが Python を通じてプログラミング的思考を獲得できるように指導しています。

## 受賞・成績

- [LLVM projectのcommit権限](https://github.com/llvm/llvm-project/issues/176158)
- [AtCoder Algorithm部門 最高レート2202](https://atcoder.jp/users/mencotton)
- [日本情報オリンピック2021 春季トレーニング合宿参加](https://www2.ioi-jp.org/joi/2020/2021-ho-press_release.pdf)
- [SuperComputingContest 2019 3位](https://www.titech.ac.jp/english/news/2019/045321)
- [学生向けFixstars高速化コンテスト2026 23位](https://news.fixstars.com/6306/)

## 関心

- AIによる社会変革
  - エンタメによる生きがい作り
  - デジタルネイチャー
  - 自律ロボット
  - 産業爆発
- ダンスゲーム
  - Dance Dance Revolution
  - DANCERUSH STARDOM
- 蒙古タンメン中本
