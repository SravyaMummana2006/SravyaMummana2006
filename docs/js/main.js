/**
 * Main Application Script for Sravya Mummana's Interactive Portfolio
 * Initializes:
 * - Chess Engine UI
 * - Romantic Lo-Fi Music Player
 * - Filterable Project Showcase
 * - Dynamic Status Indicators
 * - Mobile Navigation & Smooth Scroll
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Chess Game
  if (document.getElementById('chess-interactive-container')) {
    window.chessApp = new ChessUI('chess-interactive-container', { vsAI: false });
  }

  // 2. Initialize Lo-Fi Music Player
  if (document.getElementById('lofi-interactive-container')) {
    window.lofiApp = new LofiPlayer('lofi-interactive-container', {
      audioSrc: 'audio/romantic-lofi.mp3'
    });
  }

  // 3. Project Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        if (category === 'all' || card.dataset.category.includes(category)) {
          card.style.display = 'flex';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 4. Mobile Menu Navigation Toggle
  const navToggle = document.getElementById('nav-toggle-btn');
  const navMenu = document.getElementById('primary-nav-links');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !expanded);
      navMenu.classList.toggle('nav-open');
    });

    // Close menu when clicking any nav link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 5. Dynamic Year & Timestamp
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  console.log("Sravya Mummana Portfolio Initialized • Dark Emerald Theme Active");
});
