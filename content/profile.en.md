---
name: Akimasa Watanuki
name_secondary: 綿貫 晃雅
role: High-Performance Computing and Compilers
affiliation: Department of Mathematical and Computing Science, Institute of Science Tokyo
lab: AC2 Lab
lab_url: https://www.ac2.scrc.iir.isct.ac.jp/
year: First-year master's student
summary: I study the performance of graph neural network training on the Cerebras WSE at AC2 Lab. I also contribute to MLIR and ClangIR in the LLVM Project, including recent work on OpenCL support in ClangIR.
keywords_label: Fields
keywords: HPC / GPU Computing / AI Acceleration / Heterogeneous Computing / Offloading / Digital Twins / Compilers / LLVM / MLIR / ClangIR / OpenCL / Cerebras WSE / GNN
email: watanuki@ac2.scrc.iir.isct.ac.jp
github: https://github.com/Men-cotton
linkedin: https://www.linkedin.com/in/mencotton/
x: https://x.com/men_cotton
atcoder: https://atcoder.jp/users/mencotton
contact: Please use email for research, open-source software, and internship inquiries.
casual_contact: For casual conversation or short questions,
casual_contact_link: X mentions are also welcome
---

# Akimasa Watanuki

## Research and current work

### GNN training on Cerebras WSE
I analyze computation, communication, and memory behavior in GNN training on the Cerebras WSE and work on improving the performance of the training pipeline. My long-term goal is to build a compiler that generates WSE kernels from a high-level language.

### Contributions to the LLVM Project
I work primarily on MLIR and ClangIR, including crash fixes, tests, and lowering implementations. My recent work connects OpenCL with ClangIR by attaching kernel argument metadata to CIR functions and lowering it to LLVM IR.

## Selected work

### Contributions to the LLVM Project
I contribute fixes and implementations to MLIR and ClangIR, including support for processing OpenCL code through ClangIR. I also help triage issues and review tests.
[Merged PRs](https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3AMen-cotton+is%3Amerged+sort%3Aupdated-desc)

### GNN implementation for Cerebras WSE
I implemented a GNN training pipeline for a wafer-scale processor. The project began as my undergraduate thesis and continues through my master's research.
[Repository](https://github.com/Men-cotton/gnn-modelzoo-fork)

### Lowering PolyBench with ClangIR
I lowered PolyBench programs with ClangIR to examine its current CPU support and generated code.
[Repository](https://github.com/Men-cotton/llvm-test-suite-clangir)

### Fixstars internship
I built a CUDA stereo-matching pipeline, measured its runtime with Nsight Systems and Nsight Compute, and optimized bottleneck operations.

### SWoPP 2026 presentation
I will present “Execution Characteristics Analysis of Irregular GNN Training on Cerebras CS-3 Using a High-Level Workflow” in the SWoPP 2026 HPC-4 session on August 6, 2026. This is joint work with my advisor, Prof. Ryohei Kobayashi.
[Program](https://swopp.github.io/2026/program/)

## Recognition

- [Commit access to the LLVM Project](https://github.com/llvm/llvm-project/issues/176158)
- [AtCoder Algorithm highest rating: 2202](https://atcoder.jp/users/mencotton)
- [Participant in the 2021 Japanese Olympiad in Informatics spring training camp](https://www2.ioi-jp.org/joi/2020/2021-ho-press_release.pdf)
- [Third place, SuperComputingContest 2019](https://www.titech.ac.jp/english/news/2019/045321)
- [23rd place, Fixstars Speed-Up Contest for Students 2026](https://news.fixstars.com/en/890/)

## Interests

- AI for Science and research automation
- Programming languages built with MLIR
- Autonomous robots
- Dance games, Mongolian Tanmen Nakamoto, and whisky
