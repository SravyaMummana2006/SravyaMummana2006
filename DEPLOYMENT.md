# GitHub Pages Deployment & Audio Hosting Guide

This guide explains how to deploy your interactive portfolio (including the playable chess game and romantic lo-fi music player) to GitHub Pages in minutes.

---

## Architecture Overview

Your repository is now structured to support both your GitHub Profile README and your interactive portfolio website simultaneously:

```
├── .github/workflows/snake.yml       # Automated contribution snake generation
├── assets/                           # High-resolution SVG banners and metrics
│   ├── header-banner.svg             # Animated header banner
│   ├── interactive-lounge.svg        # Chess & Lo-Fi Lounge showcase banner
│   ├── divider.svg                   # Emerald section divider
│   ├── github-metrics.svg            # Architecture benchmarks
│   └── contribution-telemetry.svg    # Telemetry graph
├── docs/                             # Static Web Application for GitHub Pages
│   ├── index.html                    # Complete interactive portfolio
│   ├── css/style.css                 # Dark emerald custom theme
│   ├── js/chess.js                   # Chess game engine (validation, AI, audio)
│   ├── js/player.js                  # Lo-fi music player controller
│   ├── js/main.js                    # Navigation, filters, and lifecycle
│   └── audio/
│       ├── romantic-lofi.mp3         # Your romantic lo-fi audio file
│       └── README.md                 # Licensing & attribution details
├── README.md                         # Profile README shown on github.com/SravyaMummana2006
└── DEPLOYMENT.md                     # This deployment guide
```

---

## Deployment Options

### Option A: Deploy Directly from this Repository (`SravyaMummana2006/SravyaMummana2006`) — *Recommended*

You can enable GitHub Pages on this profile repository without affecting how GitHub renders your `README.md` profile:

1. Push your changes to your `main` branch on GitHub:
   ```bash
   git add .
   git commit -m "feat: complete profile README and interactive chess & lo-fi portfolio"
   git push origin main
   ```
2. On GitHub, navigate to **https://github.com/SravyaMummana2006/SravyaMummana2006/settings/pages**
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main`
   - **Folder**: Select `/docs`
4. Click **Save**.
5. Within 1-2 minutes, your website will be live at:
   **`https://sravyamummana2006.github.io/SravyaMummana2006/`**

---

### Option B: Deploy as Your Root User Site (`https://sravyamummana2006.github.io/`)

If you want your website to live directly at the top-level URL `https://sravyamummana2006.github.io/`:

1. Create a new repository on your GitHub account named:
   **`SravyaMummana2006.github.io`**
2. Copy the contents of the `docs/` folder into the root of that new repository:
   - `index.html`
   - `css/`
   - `js/`
   - `audio/`
3. Push to `main`. GitHub Pages will automatically deploy your site at **`https://sravyamummana2006.github.io/`**.

---

## Audio Licensing & Public Redistribution Checklist

Before committing or pushing the audio file `docs/audio/romantic-lofi.mp3` to a public GitHub repository, please review this licensing checklist:

1. **License Verification**:
   - Verify whether the audio track was obtained from a royalty-free library (such as Pixabay Music, Free Music Archive, YouTube Audio Library, or Incompetech) or is licensed under **Creative Commons (CC0 or CC-BY)**.
   - If licensed under **CC-BY**, include the composer's name and track title in `docs/audio/README.md`.
2. **If License / Copyright is Unclear**:
   - You can exclude the MP3 file from git by adding `docs/audio/*.mp3` to `.gitignore`.
   - The interactive portfolio includes a **built-in generative Web Audio API ambient engine**. If the MP3 file is omitted or blocked, clicking "Play" automatically transitions to warm, synthesized romantic lo-fi chords in real time, so your music lounge remains functional without copyright risks.
3. **Strict No-Autoplay Compliance**:
   - Browsers strictly prohibit autoplaying audio with sound. The music player is engineered to start **only** after the visitor explicitly clicks the Play button.
