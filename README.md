<div align="center">

  <!-- Header Banner (SMIL Animated) -->
  <a href="https://sravyamummana2006.github.io/SravyaMummana2006/">
    <img src="./assets/header-banner.svg" alt="Sravya Mummana - AI/ML Engineer & Systems Developer" width="100%" />
  </a>

  <!-- Animated Typing Headline -->
  <a href="https://sravyamummana2006.github.io/SravyaMummana2006/">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=18&duration=2800&pause=1200&color=10B981&center=true&vCenter=true&width=680&lines=Computer+Science+%26+Engineering+Student;Investigating+Biometric+Media+Authenticity+%26+rPPG;Engineering+High-Throughput+Systems+in+Rust+%26+Java;Developing+Verifiable%2C+Cryptographic+Architectures" alt="Typing SVG" />
  </a>

  <p align="center">
    <b>AI/ML Engineer</b> &nbsp;&bull;&nbsp; <b>Systems Developer</b> &nbsp;&bull;&nbsp; <b>Research Enthusiast</b>
  </p>

  <!-- Interactive Portfolio & Lounge Quick Link -->
  <p align="center">
    <a href="https://sravyamummana2006.github.io/SravyaMummana2006/">
      <img src="https://img.shields.io/badge/Live_Interactive_Portfolio-05080c?style=for-the-badge&logo=googlechrome&logoColor=10b981&labelColor=05080c" alt="Live Portfolio" />
    </a>
    &nbsp;
    <a href="https://sravyamummana2006.github.io/SravyaMummana2006/#chess">
      <img src="https://img.shields.io/badge/Play_Live_Chess-05080c?style=for-the-badge&logo=lichess&logoColor=34d399&labelColor=05080c" alt="Play Live Chess" />
    </a>
    &nbsp;
    <a href="https://sravyamummana2006.github.io/SravyaMummana2006/#lofi">
      <img src="https://img.shields.io/badge/Romantic_Lo--Fi_Lounge-05080c?style=for-the-badge&logo=applepodcasts&logoColor=10b981&labelColor=05080c" alt="Romantic Lo-Fi Lounge" />
    </a>
  </p>

  <p align="center">
    <img src="./assets/divider.svg" alt="Section Divider" width="100%" />
  </p>

</div>

---

## 01. Personal Introduction

Hi, I am **Sravya Mummana**, a Computer Science and Engineering student focused on applied machine learning, systems programming, and empirical research.

I enjoy exploring the boundary where theoretical machine learning models intersect with production systems engineering. Rather than treating artificial intelligence as a disconnected black box, I am interested in understanding how models behave under strict evaluation constraints—such as verifying media authenticity through physiological pulse signals, eliminating judge bias in platforms using cryptographic primitives, and squeezing maximum throughput out of bare-metal hardware using zero-dependency Rust.

When I am not writing code or analyzing benchmark distributions, you will usually find me playing chess, listening to romantic lo-fi beats, or exploring open-source repositories.

<div align="center">
  <img src="./assets/divider.svg" alt="Section Divider" width="100%" />
</div>

---

## 02. Interactive Web Suite: Playable Chess & Lo-Fi Lounge

GitHub READMEs cannot execute custom JavaScript, so I built an accompanying static portfolio application with live interactive features:

<div align="center">
  <a href="https://sravyamummana2006.github.io/SravyaMummana2006/">
    <img src="./assets/interactive-lounge.svg" alt="Interactive Chess & Lo-Fi Lounge Banner" width="100%" />
  </a>
</div>

<br />

- ♟️ **Native Playable Chess Game**: Full legal move validation (castling, en passant, promotion, checkmate, stalemate), click-to-move square highlights, SAN move streaming, move undo, captured material trays, and a lightweight minimax AI opponent to test your skills.
- 🎵 **Romantic Lo-Fi Music Player**: An ambient, non-intrusive listening space with tactile vinyl disc animations, live audio waveforms, seekable progress scrubbing, volume controls, and a strict no-autoplay policy.

👉 **[Launch the Interactive Portfolio & Play Live &rarr;](https://sravyamummana2006.github.io/SravyaMummana2006/)**

<div align="center">
  <img src="./assets/divider.svg" alt="Section Divider" width="100%" />
</div>

---

## 03. Featured Engineering & Research Projects

Every project here represents real software I designed, benchmarked, and implemented:

### 1. 🔬 [BIOTrace: Biological Intelligence & Multimodal Media Authenticity](https://github.com/SravyaMummana2006/BioTrace)
`[FLAGSHIP RESEARCH]` `[PROTOCOL C ISOLATED]` `[344 TESTS PASSING]`

* **1. Problem Solved**: Standard deepfake detectors rely on spatial artifact detection in facial images, which easily breaks under video compression, noise, or modern diffusion generators.
* **2. Why I Built It**: To build an evasion-resistant forensic detector that looks beyond superficial pixels into true biological vitality—subcutaneous blood circulation and involuntary eye mechanics—which synthetic generators struggle to replicate coherently.
* **3. How It Works Technically**: Evaluated on the HiDF benchmark with strict Protocol C bipartite actor isolation (zero identity overlap between 6,106 training and 1,308 test videos). Combines EfficientNet-B0 visual representations with remote photoplethysmography (rPPG via CHROM & POS algorithms) and Eye Aspect Ratio (EAR) kinematics. Features a decoupled Java 21 Swing Forensic Workstation with live JFreeChart pulse telemetry paired with a Python FastAPI inference service.
* **4. Technologies Used**: `Java 21 LTS`, `Python 3.11`, `PyTorch 2.6`, `FastAPI`, `OpenCV`, `MediaPipe`, `SQLite JDBC`, `FlatLaf`, `Maven`.
* **5. What Makes It Unique**: Achieved **0.7952 ROC-AUC** and **0.7799 PR-AUC** under rigorous zero-identity-leakage actor partitioning, with 104 recovered visual failure cases and 344 automated test assertions.

---

### 2. ⚡ [SPEED_DEMON: High-Throughput Log Ingestion Engine](https://github.com/SravyaMummana2006/SPEED_DEMON)
`[SYSTEMS PROGRAMMING]` `[ZERO-CRATE RUST]` `[PARALLEL LOG ENGINE]`

* **1. Problem Solved**: Telemetry pipelines frequently suffer from high heap allocation overhead, thread lock contention, and excessive memory bloat when ingesting large log volumes.
* **2. Why I Built It**: To test how far zero-dependency systems optimizations in pure Rust can push throughput using only the standard library.
* **3. How It Works Technically**: Implements multithreaded chunk newline alignment using `std::thread::scope`, reusable 1 MiB streaming buffers per thread, custom byte-slice dictionary interning, and packed 64-bit composite group keys (`(hour_key << 32) | endpoint_id`). Zero external crates and zero `unsafe` blocks.
* **4. Technologies Used**: `Rust 1.80+`, `std::thread::scope`, `Streaming I/O`, `Zero External Dependencies`, `Cargo LTO`.
* **5. What Makes It Unique**: Parsed and aggregated **3.1 million log records (238 MB)** on an Intel Core i5-13420H (12 logical cores) in **~437 ms** (1.81x speedup over single-threaded baseline) while keeping peak working set strictly below 270 MB.

---

### 3. 🛡️ [DOGFOOD 2026: Verifiable Hackathon Judging & Evaluation Platform](https://github.com/SravyaMummana2006/dogfood)
`[CRYPTOGRAPHIC INTEGRITY]` `[ED25519 SIGNATURES]` `[ARGON2ID]`

* **1. Problem Solved**: Hackathon and competition evaluation often suffers from uncalibrated judge scoring, score leaks, and unverified winner certifications.
* **2. Why I Built It**: To build a self-hosted evaluation backend that ensures mathematical fairness in rubric scoring and cryptographic auditability for every submission and decision.
* **3. How It Works Technically**: Features salted Argon2id password hashing, high-entropy session management, server-side Min-Max rubric score normalization across independent criteria to eliminate judge bias, immutable PostgreSQL audit logs, and native Ed25519 digital keypair signing for tamper-proof winner certificates.
* **4. Technologies Used**: `TypeScript`, `Node.js`, `PostgreSQL`, `Argon2id`, `Ed25519 Cryptography`, `Docker Compose`.
* **5. What Makes It Unique**: Combines server-side statistical score normalization with asymmetric digital signatures, mathematically preventing judge bias and producing tamper-evident winner certificates.

---

### 4. 🛰️ [AI Land Use & Deforestation Analysis](https://github.com/SravyaMummana2006/AI-LAND-USE-AND-DEFORESTRATION-ANALYSIS)
`[GEOSPATIAL REMOTE SENSING]` `[TEMPORAL CNN]` `[GEMINI REASONING]`

* **1. Problem Solved**: Illegal logging and rapid land degradation often go unaddressed due to manual satellite inspection delays and lack of automated ecological impact scoring.
* **2. Why I Built It**: To automate temporal change detection across satellite image pairs and translate raw vision telemetry into human-readable policy assessments.
* **3. How It Works Technically**: Analyzes temporal satellite pairs using deep convolutional networks (CNN) and OpenCV structural change detection. Performs 5-class land segmentation (Forest, Water, Urban, Agriculture, Barren), computes an Environmental Impact Score (EIS), and connects with Google Gemini API for structured ecological risk assessments.
* **4. Technologies Used**: `Python`, `TensorFlow / Keras`, `OpenCV`, `Google Gemini API`, `Streamlit`.
* **5. What Makes It Unique**: Bridges pixel-level surface canopy reduction metrics with multimodal generative AI reasoning to generate actionable environmental risk summaries.

---

### 5. 👁️ [AI Eye Health & Fatigue Monitor](https://github.com/SravyaMummana2006/AI-EYE-MONITOR)
`[EDGE COMPUTER VISION]` `[OCULAR KINEMATICS]` `[GLASSES-OPTIMIZED]`

* **1. Problem Solved**: Commercial blink and drowsiness detectors generate persistent false alarms for individuals wearing prescription glasses due to reflection glare and lens distortions.
* **2. Why I Built It**: To provide a reliable, edge-friendly ocular fatigue monitor tailored specifically for continuous real-world use and glasses wearers.
* **3. How It Works Technically**: Tracks 468 facial mesh landmarks in real time via MediaPipe Face Mesh. Computes dual-eye Eye Aspect Ratio (EAR) combined with an adaptive baseline threshold calibration algorithm and temporal moving-average smoothing. Monitors blink velocity, frequency per minute, prolonged closure alerts, and ergonomic screen distance.
* **4. Technologies Used**: `Python`, `MediaPipe Face Mesh`, `OpenCV`, `NumPy`.
* **5. What Makes It Unique**: Dynamic glasses-friendly baseline calibration that eliminates false positive blink misclassifications caused by specular frame reflections.

---

### 6. ✋ [AirCanvas: Touchless Gesture Canvas](https://github.com/SravyaMummana2006/AirWriting)
`[HUMAN-COMPUTER INTERACTION]` `[GESTURE STATE MACHINE]` `[OPENCV]`

* **1. Problem Solved**: Interactive digital whiteboard presentations and touchless sketching typically require proprietary hardware or active digitizer tablets.
* **2. Why I Built It**: To enable natural, in-air drawing and gesture interaction using standard laptop webcams without requiring specialized sensors, markers, or physical screens.
* **3. How It Works Technically**: Tracks 21 3D hand landmarks using MediaPipe Hands. Isolates fingertip motion trajectories and integrates an intuitive finite state machine (pinch to draw, flat palm for tool selection/palette selection). Renders continuous Bezier smoothed strokes on a transparent OpenCV canvas overlay.
* **4. Technologies Used**: `Python`, `MediaPipe Hands`, `OpenCV`, `NumPy`.
* **5. What Makes It Unique**: Intuitive gesture state-machine allowing real-time color picking, variable brush sizing, and zero-latency stroke rendering with standard laptop webcams.

---

### 7. 📈 [Intelligent Investment Decision Engine](https://github.com/SravyaMummana2006/invest-engine)
`[FINANCIAL MODELING]` `[FISHER INFLATION LOGIC]` `[SCENARIO TELEMETRY]`

* **1. Problem Solved**: Common retail investment calculators project nominal portfolio growth while ignoring inflation-adjusted purchasing power erosion and downside volatility.
* **2. Why I Built It**: To provide personal investors with realistic macroeconomic portfolio telemetry that calculates true post-inflation real capital longevity.
* **3. How It Works Technically**: Applies the Fisher equation to model real vs. nominal returns. Simulates SIP compounding, multi-asset risk allocation (equities, debt, gold), and stress-tests conservative, realistic, and aggressive market trajectories with interactive Plotly telemetry and structured CSV exports.
* **4. Technologies Used**: `Python`, `Streamlit`, `Plotly`, `Pandas`, `Financial Modeling`.
* **5. What Makes It Unique**: Transparent real purchasing-power erosion modeling and scenario-based drawdown stress testing instead of oversimplified compounding curves.

<div align="center">
  <img src="./assets/divider.svg" alt="Section Divider" width="100%" />
</div>

---

## 04. Technical Skills & Toolkit

Technologies verified through production implementations, research pipelines, and systems code across my public repositories:

<table>
  <tr>
    <td width="28%" valign="top"><b>Languages</b></td>
    <td width="72%">
      <img src="https://img.shields.io/badge/Python-0d1117?style=flat-square&logo=python&logoColor=10b981" alt="Python" />
      <img src="https://img.shields.io/badge/Rust-0d1117?style=flat-square&logo=rust&logoColor=10b981" alt="Rust" />
      <img src="https://img.shields.io/badge/Java_21_LTS-0d1117?style=flat-square&logo=openjdk&logoColor=10b981" alt="Java 21" />
      <img src="https://img.shields.io/badge/TypeScript-0d1117?style=flat-square&logo=typescript&logoColor=10b981" alt="TypeScript" />
      <img src="https://img.shields.io/badge/C++-0d1117?style=flat-square&logo=cplusplus&logoColor=10b981" alt="C++" />
      <img src="https://img.shields.io/badge/SQL-0d1117?style=flat-square&logo=postgresql&logoColor=10b981" alt="SQL" />
      <img src="https://img.shields.io/badge/Bash-0d1117?style=flat-square&logo=gnubash&logoColor=10b981" alt="Bash" />
    </td>
  </tr>
  <tr>
    <td valign="top"><b>AI, ML &amp; Vision</b></td>
    <td>
      <img src="https://img.shields.io/badge/PyTorch-0d1117?style=flat-square&logo=pytorch&logoColor=10b981" alt="PyTorch" />
      <img src="https://img.shields.io/badge/TensorFlow-0d1117?style=flat-square&logo=tensorflow&logoColor=10b981" alt="TensorFlow" />
      <img src="https://img.shields.io/badge/OpenCV-0d1117?style=flat-square&logo=opencv&logoColor=10b981" alt="OpenCV" />
      <img src="https://img.shields.io/badge/MediaPipe-0d1117?style=flat-square&logo=google&logoColor=10b981" alt="MediaPipe" />
      <img src="https://img.shields.io/badge/scikit--learn-0d1117?style=flat-square&logo=scikitlearn&logoColor=10b981" alt="scikit-learn" />
      <img src="https://img.shields.io/badge/rPPG_CHROM/POS-0d1117?style=flat-square&logo=signal&logoColor=10b981" alt="rPPG" />
      <img src="https://img.shields.io/badge/NumPy-0d1117?style=flat-square&logo=numpy&logoColor=10b981" alt="NumPy" />
      <img src="https://img.shields.io/badge/Pandas-0d1117?style=flat-square&logo=pandas&logoColor=10b981" alt="Pandas" />
    </td>
  </tr>
  <tr>
    <td valign="top"><b>Backend &amp; Systems</b></td>
    <td>
      <img src="https://img.shields.io/badge/FastAPI-0d1117?style=flat-square&logo=fastapi&logoColor=10b981" alt="FastAPI" />
      <img src="https://img.shields.io/badge/Node.js-0d1117?style=flat-square&logo=nodedotjs&logoColor=10b981" alt="Node.js" />
      <img src="https://img.shields.io/badge/std::thread::scope-0d1117?style=flat-square&logo=rust&logoColor=10b981" alt="Multithreading" />
      <img src="https://img.shields.io/badge/Argon2id-0d1117?style=flat-square&logo=auth0&logoColor=10b981" alt="Argon2id" />
      <img src="https://img.shields.io/badge/Ed25519_Crypto-0d1117?style=flat-square&logo=securityscorecard&logoColor=10b981" alt="Ed25519" />
      <img src="https://img.shields.io/badge/PostgreSQL-0d1117?style=flat-square&logo=postgresql&logoColor=10b981" alt="PostgreSQL" />
      <img src="https://img.shields.io/badge/SQLite_JDBC-0d1117?style=flat-square&logo=sqlite&logoColor=10b981" alt="SQLite" />
    </td>
  </tr>
  <tr>
    <td valign="top"><b>Tools &amp; Infrastructure</b></td>
    <td>
      <img src="https://img.shields.io/badge/Git-0d1117?style=flat-square&logo=git&logoColor=10b981" alt="Git" />
      <img src="https://img.shields.io/badge/GitHub_Actions-0d1117?style=flat-square&logo=githubactions&logoColor=10b981" alt="GitHub Actions" />
      <img src="https://img.shields.io/badge/Docker-0d1117?style=flat-square&logo=docker&logoColor=10b981" alt="Docker" />
      <img src="https://img.shields.io/badge/Apache_Maven-0d1117?style=flat-square&logo=apachemaven&logoColor=10b981" alt="Maven" />
      <img src="https://img.shields.io/badge/Cargo-0d1117?style=flat-square&logo=rust&logoColor=10b981" alt="Cargo" />
      <img src="https://img.shields.io/badge/Linux-0d1117?style=flat-square&logo=linux&logoColor=10b981" alt="Linux" />
    </td>
  </tr>
</table>

<div align="center">
  <img src="./assets/divider.svg" alt="Section Divider" width="100%" />
</div>

---

## 05. Open Source Engagement

I actively engage in open-source software and security research:
* **[DIPY (Diffusion Imaging in Python)](https://github.com/dipy/dipy)**: Participant in 3D/4D medical imaging algorithms and open-source scientific Python workflows.
* **[OWASP / OpenCRE](https://github.com/OWASP/OpenCRE)**: Contributing to security standard mappings, requirements engineering, and verification schemas.
* **[OWASP Nettacker](https://github.com/OWASP/Nettacker)**: Community vulnerability scanner investigations and penetration testing tools.

<div align="center">
  <img src="./assets/divider.svg" alt="Section Divider" width="100%" />
</div>

---

## 06. GitHub Activity & Telemetry

<div align="center">

  <!-- Verified Repository Benchmarks & Language Distribution -->
  <a href="https://github.com/SravyaMummana2006">
    <img src="./assets/github-metrics.svg" alt="Sravya's Engineering Benchmarks & Language Distribution" width="100%" />
  </a>

  <br /><br />

  <!-- Live Contribution Streak Telemetry -->
  <a href="https://github.com/SravyaMummana2006">
    <img src="https://streak-stats.demolab.com?user=SravyaMummana2006&theme=dark&background=0d1117&ring=10b981&fire=10b981&currStreakLabel=10b981&border=21262d" alt="GitHub Contribution Streak" width="100%" />
  </a>

  <br /><br />

  <!-- Live SMIL Animated Contribution Snake Console -->
  <a href="https://github.com/SravyaMummana2006">
    <img src="./assets/contribution-telemetry.svg" alt="Continuous Integration & Live Contribution Telemetry" width="100%" />
  </a>

</div>

<div align="center">
  <img src="./assets/divider.svg" alt="Section Divider" width="100%" />
</div>

---

## 07. Connect & Professional Inquiries

I welcome technical discussions, research collaborations, and software engineering opportunities:

<div align="center">

  <a href="https://github.com/SravyaMummana2006">
    <img src="https://img.shields.io/badge/GitHub_Profile-0d1117?style=for-the-badge&logo=github&logoColor=10b981&labelColor=0d1117" alt="GitHub Profile" />
  </a>
  &nbsp;
  <a href="https://www.linkedin.com/in/sravya-mummana/">
    <img src="https://img.shields.io/badge/LinkedIn_Connect-0d1117?style=for-the-badge&logo=linkedin&logoColor=10b981&labelColor=0d1117" alt="LinkedIn Profile" />
  </a>
  &nbsp;
  <a href="https://sravyamummana2006.github.io/SravyaMummana2006/">
    <img src="https://img.shields.io/badge/Interactive_Portfolio-0d1117?style=for-the-badge&logo=googlechrome&logoColor=10b981&labelColor=0d1117" alt="Interactive Portfolio" />
  </a>

</div>

<br />

<div align="center">
  <sub>Engineered with precision &bull; Deep Charcoal &amp; Emerald Palette &bull; &copy; Sravya Mummana</sub>
</div>
