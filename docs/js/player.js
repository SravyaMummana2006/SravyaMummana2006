/**
 * LofiPlayer - Romantic Lo-Fi Music Player Controller
 * Features:
 * - Strict no-autoplay policy (only begins when visitor explicitly clicks Play)
 * - Play / Pause state handling
 * - Scrubbable progress bar with time stamps (current & total)
 * - Volume control + quick mute/unmute
 * - Vinyl disc spinning animation with emerald ambient glow
 * - Dynamic waveform visualizer bars
 * - Web Audio API generative chord fallback if audio file is not present or blocked
 * (c) Sravya Mummana Portfolio
 */

class LofiPlayer {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.audioSrc = options.audioSrc || 'audio/romantic-lofi.mp3';
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.8;
    this.duration = 138; // Default to 2:18 if metadata is still loading
    this.currentTime = 0;
    this.useSynthFallback = false;
    this.audioEl = null;
    this.synthInterval = null;
    this.audioCtx = null;

    this.render();
    this.initAudioElement();
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  initAudioElement() {
    this.audioEl = new Audio();
    this.audioEl.src = this.audioSrc;
    this.audioEl.preload = 'metadata';
    this.audioEl.volume = this.volume;

    this.audioEl.addEventListener('loadedmetadata', () => {
      if (this.audioEl.duration && !isNaN(this.audioEl.duration)) {
        this.duration = this.audioEl.duration;
        this.updateTimeDisplay();
      }
    });

    this.audioEl.addEventListener('timeupdate', () => {
      if (!this.isScrubbing) {
        this.currentTime = this.audioEl.currentTime;
        this.updateProgressBar();
        this.updateTimeDisplay();
      }
    });

    this.audioEl.addEventListener('ended', () => {
      this.isPlaying = false;
      this.updatePlayState();
    });

    this.audioEl.addEventListener('error', (e) => {
      console.warn("Audio file could not be loaded directly. Switching to generative Lo-Fi synth fallback.", e);
      this.useSynthFallback = true;
    });
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="lofi-player-card">
        <!-- Vinyl Art Visualizer -->
        <div class="vinyl-showcase">
          <div class="vinyl-disc-wrap">
            <div class="vinyl-disc" id="lofi-vinyl-disc">
              <div class="vinyl-groove"></div>
              <div class="vinyl-groove groove-inner"></div>
              <div class="vinyl-center-label">
                <div class="vinyl-pin"></div>
                <span class="vinyl-code">SM-2006</span>
              </div>
            </div>
            <div class="vinyl-tone-arm" id="lofi-tone-arm"></div>
          </div>
          <!-- Ambient Emerald Glow Behind Vinyl -->
          <div class="vinyl-ambient-glow" id="lofi-ambient-glow"></div>
        </div>

        <!-- Player Controls & Info -->
        <div class="lofi-details-wrapper">
          <div class="lofi-meta-top">
            <span class="lofi-badge">Personal Lo-Fi Lounge</span>
            <span class="lofi-stream-pill">
              <span class="stream-dot" id="lofi-stream-dot"></span>
              <span id="lofi-stream-status">Paused</span>
            </span>
          </div>

          <div class="lofi-song-info">
            <h4 class="lofi-song-title">Midnight Solitude</h4>
            <p class="lofi-artist">Romantic Lo-Fi • Sravya's Code &amp; Study Sessions</p>
          </div>

          <!-- Waveform Visualizer -->
          <div class="lofi-waveform" id="lofi-waveform-bars">
            <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
          </div>

          <!-- Progress Bar & Time -->
          <div class="lofi-progress-container">
            <div class="progress-bar-bg" id="lofi-progress-bar-bg">
              <div class="progress-bar-fill" id="lofi-progress-fill"></div>
              <div class="progress-bar-thumb" id="lofi-progress-thumb"></div>
            </div>
            <div class="lofi-time-row">
              <span class="lofi-time-curr" id="lofi-time-curr">0:00</span>
              <span class="lofi-time-dur" id="lofi-time-dur">2:18</span>
            </div>
          </div>

          <!-- Controls Row -->
          <div class="lofi-controls-row">
            <!-- Play/Pause Button -->
            <button class="lofi-play-btn" id="lofi-play-toggle" aria-label="Play Track" title="Play romantic lo-fi music">
              <svg class="play-icon" width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg class="pause-icon" width="22" height="22" fill="currentColor" viewBox="0 0 24 24" style="display:none;">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
              </svg>
            </button>

            <!-- Volume Controls -->
            <div class="lofi-volume-wrap">
              <button class="lofi-vol-btn" id="lofi-mute-toggle" aria-label="Mute / Unmute" title="Mute audio">
                <svg class="vol-icon" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                <svg class="muted-icon" width="18" height="18" fill="currentColor" viewBox="0 0 24 24" style="display:none;">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              </button>
              <input type="range" class="lofi-volume-slider" id="lofi-vol-slider" min="0" max="1" step="0.02" value="0.8" aria-label="Volume level" />
            </div>

            <!-- Licensing Indicator Note -->
            <div class="lofi-license-tag" title="Licensing note: Strict privacy & explicit play trigger">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span>No Autoplay • CC Attribution</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const playBtn = document.getElementById('lofi-play-toggle');
    const muteBtn = document.getElementById('lofi-mute-toggle');
    const volSlider = document.getElementById('lofi-vol-slider');
    const progressBg = document.getElementById('lofi-progress-bar-bg');

    if (playBtn) {
      playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', () => this.toggleMute());
    }

    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        this.volume = parseFloat(e.target.value);
        if (this.audioEl) this.audioEl.volume = this.volume;
        if (this.volume === 0) {
          this.isMuted = true;
        } else {
          this.isMuted = false;
        }
        this.updateVolumeIcons();
      });
    }

    if (progressBg) {
      progressBg.addEventListener('click', (e) => {
        const rect = progressBg.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        const targetTime = Math.max(0, Math.min(this.duration, pos * this.duration));
        this.seek(targetTime);
      });
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.useSynthFallback) {
      this.startSynth();
      this.isPlaying = true;
      this.updatePlayState();
      return;
    }

    if (this.audioEl) {
      const playPromise = this.audioEl.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.isPlaying = true;
            this.updatePlayState();
          })
          .catch((err) => {
            console.warn("Direct MP3 playback failed, switching to synth ambient engine:", err);
            this.useSynthFallback = true;
            this.startSynth();
            this.isPlaying = true;
            this.updatePlayState();
          });
      }
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    this.updatePlayState();
  }

  seek(seconds) {
    this.currentTime = seconds;
    if (this.audioEl && !this.useSynthFallback) {
      this.audioEl.currentTime = seconds;
    }
    this.updateProgressBar();
    this.updateTimeDisplay();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.audioEl) {
      this.audioEl.muted = this.isMuted;
    }
    this.updateVolumeIcons();
  }

  updateVolumeIcons() {
    const muteBtn = document.getElementById('lofi-mute-toggle');
    const volSlider = document.getElementById('lofi-vol-slider');
    if (!muteBtn) return;
    const volIcon = muteBtn.querySelector('.vol-icon');
    const mutedIcon = muteBtn.querySelector('.muted-icon');

    if (this.isMuted || this.volume === 0) {
      if (volIcon) volIcon.style.display = 'none';
      if (mutedIcon) mutedIcon.style.display = 'block';
    } else {
      if (volIcon) volIcon.style.display = 'block';
      if (mutedIcon) mutedIcon.style.display = 'none';
    }

    if (volSlider) {
      volSlider.value = this.isMuted ? 0 : this.volume;
    }
  }

  updatePlayState() {
    const playBtn = document.getElementById('lofi-play-toggle');
    const vinyl = document.getElementById('lofi-vinyl-disc');
    const toneArm = document.getElementById('lofi-tone-arm');
    const glow = document.getElementById('lofi-ambient-glow');
    const streamDot = document.getElementById('lofi-stream-dot');
    const streamStatus = document.getElementById('lofi-stream-status');
    const waveform = document.getElementById('lofi-waveform-bars');

    if (!playBtn) return;
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');

    if (this.isPlaying) {
      if (playIcon) playIcon.style.display = 'none';
      if (pauseIcon) pauseIcon.style.display = 'block';
      if (vinyl) vinyl.classList.add('spinning');
      if (toneArm) toneArm.classList.add('engaged');
      if (glow) glow.classList.add('active');
      if (streamDot) streamDot.classList.add('live');
      if (streamStatus) streamStatus.textContent = "Playing";
      if (waveform) waveform.classList.add('animating');
    } else {
      if (playIcon) playIcon.style.display = 'block';
      if (pauseIcon) pauseIcon.style.display = 'none';
      if (vinyl) vinyl.classList.remove('spinning');
      if (toneArm) toneArm.classList.remove('engaged');
      if (glow) glow.classList.remove('active');
      if (streamDot) streamDot.classList.remove('live');
      if (streamStatus) streamStatus.textContent = "Paused";
      if (waveform) waveform.classList.remove('animating');
    }
  }

  updateProgressBar() {
    const fill = document.getElementById('lofi-progress-fill');
    const thumb = document.getElementById('lofi-progress-thumb');
    if (!fill || !thumb) return;

    const pct = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    fill.style.width = `${pct}%`;
    thumb.style.left = `${pct}%`;
  }

  updateTimeDisplay() {
    const currEl = document.getElementById('lofi-time-curr');
    const durEl = document.getElementById('lofi-time-dur');
    if (currEl) currEl.textContent = this.formatTime(this.currentTime);
    if (durEl) durEl.textContent = this.formatTime(this.duration);
  }

  // Generative Lo-Fi Ambient Synth Fallback (Web Audio API)
  startSynth() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!this.audioCtx) this.audioCtx = new AudioContext();
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    // Romantic lo-fi chords: Fmaj7 (F3, A3, C4, E4), Em7 (E3, G3, B3, D4), Dm7, Cmaj7
    const chords = [
      [174.61, 220.00, 261.63, 329.63],
      [164.81, 196.00, 246.94, 293.66],
      [146.83, 174.61, 220.00, 261.63],
      [130.81, 164.81, 196.00, 246.94]
    ];
    let chordIdx = 0;

    const playChord = (freqs) => {
      if (!this.isPlaying || this.isMuted) return;
      freqs.forEach((freq) => {
        try {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          const filter = this.audioCtx.createBiquadFilter();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

          // Warm low-pass filter
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(550, this.audioCtx.currentTime);

          const baseGain = (this.volume * 0.04) / freqs.length;
          gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
          gain.gain.linearRampToValueAtTime(baseGain, this.audioCtx.currentTime + 0.8);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 3.8);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start();
          osc.stop(this.audioCtx.currentTime + 3.9);
        } catch (e) {}
      });
    };

    playChord(chords[chordIdx]);
    chordIdx = (chordIdx + 1) % chords.length;

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying) return;
      this.currentTime = (this.currentTime + 4) % this.duration;
      this.updateProgressBar();
      this.updateTimeDisplay();
      playChord(chords[chordIdx]);
      chordIdx = (chordIdx + 1) % chords.length;
    }, 4000);
  }
}

// Global export
window.LofiPlayer = LofiPlayer;
