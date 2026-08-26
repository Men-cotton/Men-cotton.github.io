---
name: Akimasa Watanuki
name_secondary: 綿貫 晃雅
role: Making AI computing beyond GPUs fast, easy to use, and verifiable.
affiliation: Department of Mathematical and Computing Science, School of Computing, Institute of Science Tokyo
lab: AC2 Lab
lab_url: https://www.ac2.scrc.iir.isct.ac.jp/
advisor: Ryohei Kobayashi
advisor_url: https://sites.google.com/site/ryokbya/
year: First-year master's student
summary: I study the performance of heterogeneous AI accelerators and contribute to compiler development in the LLVM Project.
fields_label: Fields
fields: High-Performance Computing (HPC) / Performance Analysis for Machine Learning / AI for Science / Compilers / AI Safety
keywords_label: Keywords
keywords: Cerebras WSE / GPU / GNN / Digital Twins / LLVM / MLIR / ClangIR / OpenCL / Compute governance
email: watanuki@ac2.scrc.iir.isct.ac.jp
github: https://github.com/Men-cotton
linkedin: https://www.linkedin.com/in/mencotton/
x: https://x.com/men_cotton
atcoder: https://atcoder.jp/users/mencotton
contact_before: For research, open-source, or internship inquiries, contact me at
contact_after: .
casual_contact: For short questions or informal conversation,
casual_contact_link: feel free to mention me on X
---

# Akimasa Watanuki

## Research Projects

### GNN Training and Performance Analysis on Cerebras CS-3
I implemented a GraphSAGE training workflow on Cerebras CS-3, a system built around the Wafer-Scale Engine (WSE), which spans an entire silicon wafer. The project began as my undergraduate thesis and now continues through performance analysis and implementation work.

Although the GPU machine-learning ecosystem is mature, GNN training does not reduce to the regular dense-matrix operations that GPUs handle well. Each vertex can have a different number of neighbors, producing sparse and irregular aggregation. [Prior work](https://ar5iv.labs.arxiv.org/html/2112.08541) has reported GPU utilization of only about 10% in a typical large-graph training workload using DGL.

I therefore compared CS-3 with an NVIDIA H100 on the same dataset to evaluate whether wafer-scale resources benefit GNN training in an end-to-end workflow. The two systems reached similar validation accuracy, but CS-3 delivered substantially lower training throughput under the current Python/PyTorch-based workflow. The results also suggest that this workflow does not expose enough control or visibility over data placement and sparse aggregation on the WSE.

I presented these results at SWoPP 2026. I am now determining how much of the observed performance gap comes from the hardware and how much from the software stack, while improving the implementation. My goal is to identify the conditions under which sparse, irregular workloads run efficiently on emerging architectures and to turn those findings into improvements in both hardware and programming environments.
[Technical report (not peer-reviewed)](https://ipsj.ixsq.nii.ac.jp/records/2010658)
[Implementation repository](https://github.com/Men-cotton/gnn-modelzoo-fork)

## Independent Development and Open-Source Contributions

### ClangIR and MLIR Development in the LLVM Project
Outside my academic research, I contribute independently to the LLVM Project.

In accelerator-oriented languages such as OpenCL C, information including types, address spaces, and kernel arguments must survive compilation; otherwise, later code-generation and runtime components cannot use it.

ClangIR (CIR) is a source-oriented intermediate representation between Clang’s frontend for C, C++, and related languages and LLVM IR, the lower-level representation used closer to machine-code generation. CIR is built on MLIR, a framework for defining intermediate representations for different domains and hardware targets and transforming them in stages.

Using this infrastructure, I implemented support for representing and generating OpenCL kernel-argument metadata in CIR and carrying it through MLIR’s LLVM dialect into LLVM IR. These changes have been merged into the LLVM Project. I also contribute fixes that replace crashes on invalid input with diagnostics and expand regression-test coverage.

This staged compiler infrastructure lets developers maintain support for multiple accelerators within one transformation framework while preserving and tracking program semantics and metadata throughout lowering. Longer term, I want to connect this compiler-level information with execution records from runtimes and hardware as a basis for verifying AI computation across heterogeneous accelerators.
[Merged PRs](https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3AMen-cotton+is%3Amerged+sort%3Aupdated-desc)

## Research Interests

My research focuses on making AI computing beyond GPUs fast, easy to use, and verifiable. Today I work on performance analysis and compiler development for heterogeneous accelerators. Longer term, I aim to connect this work to AI safety by representing computation in a common form and observing how it executes.

### Making It Fast—Performance Analysis of Heterogeneous AI Accelerators
I reached the SuperCon finals in all three years of high school and placed third as a first-year student. The contest, co-hosted by Tokyo Institute of Technology and Osaka University, gives finalists several days to optimize programs for a supercomputer, unlike ordinary programming contests that typically allow only a few seconds of CPU time. I became fascinated by how work distribution, communication, and memory access can radically change the runtime of the same algorithm. I made this experience the centerpiece of my admissions application to Tokyo Institute of Technology, now Institute of Science Tokyo, and have continued to pursue high-performance computing there.

I now study AI accelerators with very different architectures, including GPUs and WSEs. Rather than treating performance as a single benchmark number, I decompose bottlenecks across hardware and software layers and work toward making new machines usable for researchers. Ultimately, I want to run larger AI and scientific workloads within the same compute and energy budgets, enabling research that is currently limited by scale.
[SuperCon](https://www.supercon.cii.isct.ac.jp/attwiki/index.php)

### Making It Easier to Program—Compilers and Programming Models
GPUs and WSEs differ greatly in memory organization and parallel execution, so the same computation often requires architecture-specific low-level code. In the CS-3 project, I encountered a gap: Python- and PyTorch-based workflows do not expose enough control over data placement and sparse aggregation, while writing everything in Cerebras Software Language (CSL) greatly increases implementation effort and ties the code to one architecture.

I therefore aim to build an MLIR-based compiler that lowers a high-level representation of a GNN into code that specifies the data placement, communication, and parallelism required by each accelerator. This would let researchers try new machines without rewriting an entire model. Using the same intermediate representation as a shared basis for performance analysis and execution management would also let us compare and track program structure and metadata across hardware.
[ClangIR](https://llvm.github.io/clangir/)
[MLIR](https://mlir.llvm.org/)

### Making It Verifiable—AI Safety
Compute governance seeks to make advanced AI development more accountable by monitoring how large-scale computing resources are used. I am interested in inferring workloads from external signals such as resource use and execution patterns—for example, detecting large-scale LLM training—without inspecting model weights or data. The goal is not to restrict research or software development indiscriminately, but to verify that computation follows agreed policies.

Many current technical proposals focus on GPUs. As AI hardware diversifies, monitoring and verification methods designed around GPUs may not transfer directly. I want to explore how compute governance can extend to WSEs and other accelerators, so that workloads can still be identified and verified as the underlying hardware changes.
[AI risk overview (MIRI)](https://intelligence.org/briefing/)
[GPU training detection](https://arxiv.org/abs/2606.19262)
[AI 2027 race scenario](https://ai-2027.com/race)

## Education

### Institute of Science Tokyo, Master’s Program (April 2026–expected March 2028)
I am enrolled in the master’s program in the Department of Mathematical and Computing Science and continue the research I began in AC2 Lab as an undergraduate. I also work as a research assistant on a JSPS KAKENHI Grant-in-Aid for Scientific Research (B) project.
[“Wafer-scale computing to accelerate graph-structured data processing” (26K02920)](https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-26K02920/)

### Institute of Science Tokyo, Bachelor’s Program (April 2022–March 2026)
I entered Tokyo Institute of Technology and completed the bachelor’s program in the Department of Mathematical and Computing Science at Institute of Science Tokyo following the university merger. In April 2025, I joined AC2 Lab, led by Professor Ryohei Kobayashi.

## Work Experience

### teamLab (August 2024)
I developed a computer vision application in C++ using OpenCV.

### e-Seikatsu (August 2024)
I built a property comparison app with React and a real-estate API in a team hackathon.

### Fixstars (March–April 2024)
I built a CUDA stereo-matching pipeline, measured its runtime with Nsight Systems and Nsight Compute, and optimized bottleneck operations.

### TSUKURIUM (February 2023–present)
I teach programming, helping children develop computational thinking through Python.

## Recognition

- [LLVM Project commit access](https://github.com/llvm/llvm-project/issues/176158)
- [Peak AtCoder Algorithm rating: 2202](https://atcoder.jp/users/mencotton)
- [Selected for the 2021 JOI Spring Training Camp](https://www2.ioi-jp.org/joi/2020/2021-ho-press_release.pdf)
- [3rd place, SuperCon 2019](https://www.titech.ac.jp/english/news/2019/045321)
- [23rd place, Fixstars Speed-Up Contest for Students 2026](https://news.fixstars.com/en/890/)

## Interests

- AI-driven social transformation
  - Creating a sense of purpose through entertainment
  - Digital Nature
  - Autonomous robots
  - Explosive economic growth
- Dance games
  - Dance Dance Revolution
  - DANCERUSH STARDOM
- Mouko Tanmen Nakamoto
