---
name: Akimasa Watanuki
name_secondary: 綿貫 晃雅
role: High-Performance Computing and Compilers
affiliation: Department of Mathematical and Computing Science, Institute of Science Tokyo
lab: AC2 Lab
lab_url: https://www.ac2.scrc.iir.isct.ac.jp/
advisor: Ryohei Kobayashi
advisor_url: https://sites.google.com/site/ryokbya/
year: First-year master's student
summary: Fast, accessible, and verifiable AI computation—beyond GPUs.
keywords_label: Fields
keywords: High-Performance Computing (HPC) / Cerebras WSE / GNN / GPU Computing / Machine Learning Performance Analysis / AI for Science / AI Safety / Digital Twins / Compilers / LLVM / MLIR / ClangIR / OpenCL
email: watanuki@ac2.scrc.iir.isct.ac.jp
github: https://github.com/Men-cotton
linkedin: https://www.linkedin.com/in/mencotton/
x: https://x.com/men_cotton
atcoder: https://atcoder.jp/users/mencotton
contact_before: For research, open-source software, and internship inquiries, contact me at
contact_after: .
casual_contact: For casual conversation or short questions,
casual_contact_link: X mentions are also welcome
---

# Akimasa Watanuki

## Research projects and presentations

### GNN training and performance analysis on Cerebras CS-3
As part of my undergraduate thesis research, I implemented a training workflow for GraphSAGE, a representative graph neural network, on Cerebras CS-3, which uses an entire silicon wafer as one processor. I continue to analyze its performance. Although the GPU machine-learning ecosystem is mature, GNN training is not composed solely of the regular, dense matrix operations at which that ecosystem excels. It also requires sparse and irregular aggregation over a different number of neighbors for each vertex. Prior work has reported GPU utilization of only about 10% in a representative DGL training job on a large graph.

I investigated whether the WSE's fine-grained distribution of compute and memory across the wafer could reduce the data movement involved in GNN training. In a comparison of CS-3 and NVIDIA H100 on the same dataset, both reached similar validation accuracy, while CS-3 delivered substantially lower training throughput with the current high-level workflow. The results also suggested that the workflow does not yet expose enough control or visibility over data placement and sparse aggregation on the WSE. I presented this work at SWoPP 2026 and am now working to separate the potential of the hardware itself from limitations in its software stack. Through that distinction, I aim to identify concrete improvements for GNN accelerators and their programming environments.
[Technical report (not peer-reviewed)](https://ipsj.ixsq.nii.ac.jp/records/2010658)
[Implementation](https://github.com/Men-cotton/gnn-modelzoo-fork)
[Presentation program](https://swopp.github.io/2026/program/)

## Personal projects and OSS contributions

### ClangIR and MLIR development in the LLVM Project
Separately from my academic research, I contribute to the LLVM Project as an independent open-source activity. In languages for high-performance computing, losing information about types, address spaces, or kernel arguments during intermediate-representation transformations can prevent later optimizations and code generation from working correctly.

ClangIR (CIR) is an intermediate representation between Clang, which analyzes C and C++ family source languages, and the lower-level LLVM IR used near machine-code generation. CIR retains more of the source language's semantics. MLIR, the framework on which CIR is built, lets developers define intermediate representations for different domains and hardware and transform them in stages. I am implementing mechanisms that preserve OpenCL kernel-argument metadata in CIR and carry it through MLIR's LLVM dialect into LLVM IR. I also continue to replace crashes on invalid input with diagnostics and expand regression tests.

This shared foundation makes it possible not only to maintain implementations for multiple accelerators in one transformation system, but also to track the meaning of an operation and its associated information through each stage. In the future, I want to connect that information with execution records produced by runtimes and hardware, developing it into a foundation for verifying AI computation across heterogeneous accelerators.
[Merged PRs](https://github.com/llvm/llvm-project/pulls?q=is%3Apr+author%3AMen-cotton+is%3Amerged+sort%3Aupdated-desc)

## Research interests

My research interest is making AI computation fast, accessible, and verifiable beyond GPUs. I am working toward connecting performance analysis and compiler development for heterogeneous accelerators with a common way to represent and observe execution, and ultimately with AI safety.

### Making it fast—performance analysis of heterogeneous AI accelerators
For all three years of high school, I qualified for the finals of SuperCon, a supercomputing contest co-hosted by Tokyo Institute of Technology and Osaka University, and placed third in my first year. Writing supercomputer programs over several days showed me how the same algorithm can have very different runtimes depending on work distribution, communication, and memory access. I made this experience central to explaining my research motivation in the university's holistic admissions process, and high-performance computing has remained the axis of my work since entering university.

I now study AI accelerators with very different structures, including GPUs and WSEs. Rather than stopping at a speed comparison, I aim to decompose performance limits across hardware and software layers and help turn new machines into platforms that researchers can use in practice. Ultimately, I want to reduce the compute and energy required for AI and scientific computing and enable research that is currently out of reach because of scale.

### Making it accessible—compilers and programming models
GPUs and WSEs differ greatly in their memory structures and units of parallel execution, so running the same GNN on each can require different low-level implementations. In the CS-3 project, I encountered a gap: high-level workflows based on Python and PyTorch do not expose enough control over data placement and sparse aggregation, while writing everything in the low-level CSL language increases development effort and hardware dependence.

I therefore aim to build an MLIR-based compiler that progressively transforms a high-level representation preserving the meaning of a GNN into the placement, communication, and parallelism required by each accelerator. This would let researchers try new machines without rewriting an entire model. Using the same intermediate representation as a common point for performance analysis and execution management would also make it possible to compare and track operation structure and associated information across different hardware.

### Making it verifiable—AI safety
As advanced AI automates scientific research and software development, models will do more than generate text: they will use computing resources to run code and modify research environments. Even without a complete understanding of a model's internals, the programs it uses, computing resources, inputs and outputs, and environmental changes can be observed through external interfaces.

I am interested in connecting the meaning retained by compilers with execution records produced by runtimes and hardware, then using the same approach to verify AI execution across different accelerators such as GPUs and WSEs. My goal is a foundation that preserves the benefits of AI for Science while detecting unauthorized computation or changes to research environments and establishing the provenance and reproducibility of experimental results.

## Experience

### AC2 Lab (2026–present)
I work as a research assistant on a JSPS KAKENHI Grant-in-Aid for Scientific Research (B) project.
[“Wafer-scale computing to accelerate graph-structured data processing” (26K02920)](https://kaken.nii.ac.jp/en/grant/KAKENHI-PROJECT-26K02920/)

### teamLab (August 2024)
I developed a computer vision application in C++ using OpenCV.

### e-Seikatsu (August 2024)
I built a property comparison app with React and a real-estate API in a team hackathon.

### Fixstars (March–April 2024)
I built a CUDA stereo-matching pipeline, measured its runtime with Nsight Systems and Nsight Compute, and optimized bottleneck operations.

### Robodan Kita-Urawa School (February 2023–present)
I teach programming.

## Recognition

- [Commit access to the LLVM Project](https://github.com/llvm/llvm-project/issues/176158)
- [AtCoder Algorithm highest rating: 2202](https://atcoder.jp/users/mencotton)
- [Participant in the 2021 Japanese Olympiad in Informatics spring training camp](https://www2.ioi-jp.org/joi/2020/2021-ho-press_release.pdf)
- [Third place, SuperComputingContest 2019](https://www.titech.ac.jp/english/news/2019/045321)
- [23rd place, Fixstars Speed-Up Contest for Students 2026](https://news.fixstars.com/en/890/)

## Interests

- Autonomous robots
- Dance games
- Mongolian Tanmen Nakamoto
