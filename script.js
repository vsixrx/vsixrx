document.addEventListener('DOMContentLoaded', () => {
  const profileName = document.getElementById('profile-name');
  const profileBio = document.getElementById('profile-bio');
  const profileBlock = document.getElementById('profile-block');
  const profilePicture = document.querySelector('.profile-picture');
  const profileContainer = document.querySelector('.profile-container');

  const name = "vsixrx";

  // ─── Dynamic Background System ───
  // Change this to any .mp4, .webm, .gif, .png, or .jpg in your assets folder
  const BACKGROUND_MEDIA = 'assets/bgvideo.mp4';
  const bgContainer = document.getElementById('media-background');
  let bgMediaElement = null;

  if (bgContainer && BACKGROUND_MEDIA) {
    const ext = BACKGROUND_MEDIA.split('.').pop().toLowerCase();
    if (ext === 'mp4' || ext === 'webm') {
      bgMediaElement = document.createElement('video');
      bgMediaElement.src = BACKGROUND_MEDIA;
      bgMediaElement.autoplay = true;
      bgMediaElement.loop = true;
      bgMediaElement.muted = true;
      bgMediaElement.playsInline = true;
      bgMediaElement.oncanplay = () => { /* wait for reveal */ };
      bgContainer.appendChild(bgMediaElement);
    } else {
      bgMediaElement = document.createElement('img');
      bgMediaElement.src = BACKGROUND_MEDIA;
      bgMediaElement.onload = () => { /* wait for reveal */ };
      bgContainer.appendChild(bgMediaElement);
    }

    // Subtle Mouse Parallax
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      bgContainer.style.transform = `translate(${-x}px, ${-y}px)`;
    });
  }

  // ─── Music Player ─────────────────────────────────
  const audio = document.getElementById('bg-audio');
  const musicPlayer = document.getElementById('music-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const eqBars = document.getElementById('eq-bars');
  const mpArtwork = document.getElementById('mp-artwork');
  const mpProgressFill = document.getElementById('mp-progress-fill');
  const mpProgressBar = document.getElementById('mp-progress-bar');
  const mpTime = document.getElementById('mp-time');

  // Format seconds to m:ss
  function formatTime(sec) {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function setPlaying(playing) {
    if (playing) {
      playPauseBtn.innerHTML = '&#9646;&#9646;';
      eqBars.classList.add('playing');
      musicPlayer.classList.remove('idle');
      if (mpArtwork) mpArtwork.classList.add('spinning');
    } else {
      playPauseBtn.innerHTML = '&#9654;';
      eqBars.classList.remove('playing');
      musicPlayer.classList.add('idle');
      if (mpArtwork) mpArtwork.classList.remove('spinning');
    }
  }

  // Update progress bar and time display
  function updateProgress() {
    if (audio && audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      if (mpProgressFill) mpProgressFill.style.width = pct + '%';
      if (mpTime) mpTime.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration);
    }
    requestAnimationFrame(updateProgress);
  }
  updateProgress();

  // Click progress bar to seek
  if (mpProgressBar) {
    mpProgressBar.addEventListener('click', (e) => {
      if (!audio.duration) return;
      const rect = mpProgressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });
  }

  function startPlayer() {
    audio.volume = 0;
    audio.play().catch(() => { });
    let vol = 0;
    const fade = setInterval(() => {
      vol = Math.min(vol + 0.05, 1);
      audio.volume = vol;
      if (vol >= 1) clearInterval(fade);
    }, 50);
    setPlaying(true);
  }

  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) { audio.play(); setPlaying(true); }
    else { audio.pause(); setPlaying(false); }
  });

  let idleTimer;
  musicPlayer.addEventListener('mouseenter', () => { clearTimeout(idleTimer); musicPlayer.classList.remove('idle'); });
  musicPlayer.addEventListener('mouseleave', () => { if (audio.paused) idleTimer = setTimeout(() => musicPlayer.classList.add('idle'), 2000); });

  const revealScreen = document.getElementById('reveal-screen');
  const mainContent = document.getElementById('main-content');

  if (revealScreen && mainContent) {
    revealScreen.addEventListener('click', () => {
      revealScreen.classList.add('hidden');
      mainContent.classList.remove('content-hidden');
      mainContent.classList.add('content-revealed');

      // Fade in the background
      setTimeout(() => {
        if (bgMediaElement) bgMediaElement.classList.add('loaded');
      }, 300);

      // Auto-start player after reveal transition
      setTimeout(() => {
        musicPlayer.classList.add('visible');
        startPlayer();
      }, 600);

      // Visual punch effect
      setTimeout(() => {
        mainContent.classList.add('shake-effect');
        setTimeout(() => {
          mainContent.classList.remove('shake-effect');
        }, 400);
      }, 700);

      // Remove overlay completely after transition
      setTimeout(() => {
        revealScreen.remove();
      }, 800);
    });
  }

  // Badges Rendering
  const badgesContainer = document.getElementById('badges-container');
  const badges = [
    { name: "uzi", icon: "assets/uziyee.gif", desc: "uzi" },
    { name: "Nitro", icon: "assets/rnitro.gif", desc: "Nitro Boost" },
    { name: "Diamond", icon: "assets/diamond.gif", desc: "Diamond Tier" },
    { name: "gengar", icon: "assets/gengar.png", desc: "gengar" },
    { name: "kawaii", icon: "assets/kawaii.gif", desc: "kawaii" },
    { name: "blackv", icon: "assets/blackv.gif", desc: "blackv" }
  ];

  if (badgesContainer) {
    badges.forEach((badge, index) => {
      const img = document.createElement('img');
      img.src = badge.icon;
      img.alt = badge.name;
      img.title = badge.desc || badge.name; /* Native tooltip describing meaning */
      img.className = 'badge-icon';
      img.style.animationDelay = `${index * 0.12}s`; /* Staggered fade/scale entrance */
      badgesContainer.appendChild(img);
    });
  }

  function typeWriterName() {
    profileName.textContent = name;

    // Keep the random glitch effect
    setInterval(() => {
      if (Math.random() < 0.1) {
        profileName.classList.add('glitch');
        setTimeout(() => profileName.classList.remove('glitch'), 200);
      }
    }, 500);
  }

  const bioMessages = [
    "Justice cannot exist. Justice cannot be proven."
  ];

  function typeWriterBio() {
    // Static — no animation, no glitch
    profileBio.textContent = bioMessages[0];
  }

  // Typewriter Quote
  const quoteEl = document.getElementById('profile-quote');
  const quoteText = "Someone who tends to observe more than react. They notice patterns, subtle shifts in tone, and small details in people and situations that often go unspoken. Because of this, they rarely take things at face value and instinctively look for what lies beneath the surface, even when they’re not consciously trying to. There’s a constant awareness running in the background. It doesn’t always switch off, which makes them thoughtful, but can also keep them a little removed from what’s happening in the moment. They can be fully present, yet a part of them is always watching, analyzing, and making sense of things. They value authenticity and depth, naturally drawn to meaning rather than surface-level interaction. This way of seeing the world can create a quiet distance, not out of disinterest, but because they process experiences differently. They think independently, are not easily influenced, and are more focused on understanding than following. They may not need much from others, but when something is genuine, they recognize it instantly. Overall, they experience life both directly and from a step back, trying to understand it as much as they live it.";
  // Quote Typewriter Configuration
  const QUOTE_OPTIONS = {
    typingSpeed: 0.5, // milliseconds per character (lower is faster)
  };

  function typeWriterQuote() {
    if (!quoteEl) return;
    quoteEl.textContent = '';
    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    quoteEl.appendChild(cursor);
    let i = 0;
    const interval = setInterval(() => {
      if (i < quoteText.length) {
        quoteEl.insertBefore(document.createTextNode(quoteText[i]), cursor);
        i++;
      } else {
        clearInterval(interval);
      }
    }, QUOTE_OPTIONS.typingSpeed);
  }

  function handleTilt(e, element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    let clientX, clientY;

    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    const maxTilt = 15;
    const tiltX = (mouseY / rect.height) * maxTilt;
    const tiltY = -(mouseX / rect.width) * maxTilt;

    requestAnimationFrame(() => {
      gsap.to(element, {
        rotationX: tiltX,
        rotationY: tiltY,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    });
  }

  if (profileBlock) {
    profileBlock.addEventListener('mousemove', (e) => handleTilt(e, profileBlock));
    profileBlock.addEventListener('touchmove', (e) => {
      e.preventDefault();
      handleTilt(e, profileBlock);
    });

    profileBlock.addEventListener('mouseleave', () => {
      gsap.to(profileBlock, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
    profileBlock.addEventListener('touchend', () => {
      gsap.to(profileBlock, {
        rotationX: 0,
        rotationY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  }

  if (profilePicture) {
    profilePicture.addEventListener('click', () => {
      profileContainer.classList.remove('fast-orbit');
      profileContainer.classList.remove('orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('fast-orbit');
      setTimeout(() => {
        profileContainer.classList.remove('fast-orbit');
        void profileContainer.offsetWidth;
        profileContainer.classList.add('orbit');
      }, 500);
    });

    profilePicture.addEventListener('touchstart', (e) => {
      e.preventDefault();
      profileContainer.classList.remove('fast-orbit');
      profileContainer.classList.remove('orbit');
      void profileContainer.offsetWidth;
      profileContainer.classList.add('fast-orbit');
      setTimeout(() => {
        profileContainer.classList.remove('fast-orbit');
        void profileContainer.offsetWidth;
        profileContainer.classList.add('orbit');
      }, 500);
    });
  }

  // Lanyard Discord Presence
  const DISCORD_USER_ID = '572050910524473374';
  const avatarStatusEl = document.getElementById('avatar-status');
  const discordStatusTextEl = document.getElementById('discord-status-text');

  async function fetchDiscordStatus() {
    if (!avatarStatusEl && !discordStatusTextEl) return;

    try {
      const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
      const data = await res.json();

      let newClass = 'offline';
      let statusText = 'Offline';

      if (data.success) {
        const status = data.data.discord_status;
        if (['online', 'idle', 'dnd', 'offline'].includes(status)) {
          newClass = status;
          statusText = status.charAt(0).toUpperCase() + status.slice(1);
          if (status === 'dnd') statusText = 'Do Not Disturb';
        }
      }

      if (avatarStatusEl) avatarStatusEl.className = `status-dot ${newClass}`;

      if (discordStatusTextEl) {
        if (discordStatusTextEl.innerText !== statusText) {
          discordStatusTextEl.style.opacity = '0';
          setTimeout(() => {
            discordStatusTextEl.innerText = statusText;
            discordStatusTextEl.className = newClass;
            discordStatusTextEl.style.opacity = '1';
          }, 300);
        } else {
          discordStatusTextEl.className = newClass;
        }
      }

      if (profilePicture) {
        profilePicture.classList.remove('online', 'idle', 'dnd', 'offline');
        profilePicture.classList.add(newClass);
      }

      if (profileContainer) {
        profileContainer.classList.remove('online', 'idle', 'dnd', 'offline');
        profileContainer.classList.add(newClass);
      }

    } catch (err) {
      console.error('Failed to fetch Discord status:', err);
      if (avatarStatusEl) avatarStatusEl.className = 'status-dot offline';
      if (discordStatusTextEl) {
        discordStatusTextEl.innerText = 'Offline';
        discordStatusTextEl.className = 'offline';
      }
    }
  }

  fetchDiscordStatus();
  setInterval(fetchDiscordStatus, 30000); // Update every 30 seconds

  typeWriterName();
  typeWriterBio();
  typeWriterQuote();

  // ─── Page Navigation System (supports N pages) ───
  const pagesTrack = document.getElementById('pages-track');
  const navBtns = document.querySelectorAll('.nav-btn');

  // Re-trigger the competitive-body fade animation each time page 1 is entered
  function resetCompetitiveFade() {
    const body = document.querySelector('.competitive-body');
    if (!body) return;
    body.style.animation = 'none';
    void body.offsetWidth; // Force reflow
    body.style.animation = '';
  }

  // Re-trigger heritage entry animations each time page 2 is entered
  function resetHeritageFade() {
    // trigger content fade-in
    const fades = document.querySelectorAll('.hrt-fade-in');
    fades.forEach(f => {
      f.classList.remove('hrt-fade-active');
      void f.offsetWidth; // Force reflow
      f.classList.add('hrt-fade-active');
    });
  }

  let activePage = 0;

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.page, 10);
      if (target === activePage) return;

      activePage = target;

      // Remove all page-N classes, then set the target
      pagesTrack.classList.remove('page-0', 'page-1', 'page-2', 'slide-left', 'slide-right');
      pagesTrack.classList.add('page-' + target);

      // Re-trigger fade animations for the target page
      if (target === 1) setTimeout(resetCompetitiveFade, 50);
      if (target === 2) setTimeout(resetHeritageFade, 50);

      // Update active button
      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Sync the Heritage global background slide
      const hrtGlobalBg = document.getElementById('heritage-global-bg');
      if (hrtGlobalBg) {
        if (target === 2) {
          hrtGlobalBg.classList.add('active');
        } else {
          hrtGlobalBg.classList.remove('active');
        }
      }

    });
  });

  // ─── Heritage: Expand Bar Toggle ───
  const hrtExpandBar = document.getElementById('hrt-expand-bar');
  const hrtTextPanel = document.getElementById('hrt-text-panel');
  const hrtContentScroll = document.querySelector('.hrt-content-scroll');
  const hrtBarLabel = hrtExpandBar ? hrtExpandBar.querySelector('span:first-child') : null;

  if (hrtExpandBar && hrtTextPanel && hrtContentScroll) {
    hrtExpandBar.addEventListener('click', () => {
      const isOpen = hrtTextPanel.classList.contains('open');
      if (isOpen) {
        // Collapse: show image, hide text
        hrtTextPanel.classList.remove('open');
        hrtExpandBar.classList.remove('expanded');
        hrtContentScroll.classList.remove('hrt-reading');
        if (hrtBarLabel) hrtBarLabel.textContent = 'Read More';
      } else {
        // Expand: hide image, center text
        hrtTextPanel.classList.add('open');
        hrtExpandBar.classList.add('expanded');
        hrtContentScroll.classList.add('hrt-reading');
        if (hrtBarLabel) hrtBarLabel.textContent = 'Show Image';
      }
    });
  }

  // ─── Customizable Mouse Trail Effect (Canvas) ───
  // Fully self-contained, performant, zero-GC particle system
  const canvas = document.getElementById('mouse-trail');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // --- Configuration ---
    const TRAIL_OPTIONS = {
      length: 120,             // Number of trailing dots
      baseSize: 2,            // Normal size of particles
      hoverSize: 2,           // Size when hovering interactive elements
      smoothing: 1.0,         // How fast the head follows the cursor
      followSpeed: 0.99,      // How fast the tail catches up to the head
      baseColor: { r: 255, g: 255, b: 255 }, // Normal color
      glow: true              // Adds subtle blur/glow effect
    };

    let mouse = { x: -100, y: -100 };
    let targetSize = TRAIL_OPTIONS.baseSize;
    let currentSize = TRAIL_OPTIONS.baseSize;
    let targetColor = { ...TRAIL_OPTIONS.baseColor };
    let currentColor = { ...TRAIL_OPTIONS.baseColor };

    // Pre-allocate fixed array for particles (Zero GC overhead during animation)
    const points = Array.from({ length: TRAIL_OPTIONS.length }, () => ({ x: mouse.x, y: mouse.y }));
    let initialized = false;

    // Handle Resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    // Handle Movement
    const updateMouse = (x, y) => {
      if (!initialized) {
        // First movement snaps all points to the mouse to prevent a weird streak from corner
        for (let i = 0; i < TRAIL_OPTIONS.length; i++) {
          points[i].x = x;
          points[i].y = y;
        }
        initialized = true;
      }
      mouse.x = x;
      mouse.y = y;
    };
    document.addEventListener('mousemove', (e) => updateMouse(e.clientX, e.clientY));
    document.addEventListener('touchmove', (e) => updateMouse(e.touches[0].clientX, e.touches[0].clientY), { passive: true });

    // Handle Hover Dynamics
    const interactiveSelectors = 'a, button, .profile-picture, .badge-icon, .social-icon, .reveal-screen';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        targetSize = TRAIL_OPTIONS.hoverSize;
        // Check for specific profile picture states to match colors
        const profilePic = e.target.closest('.profile-picture');
        if (profilePic) {
          if (profilePic.classList.contains('online')) targetColor = { r: 35, g: 165, b: 90 };
          else if (profilePic.classList.contains('idle')) targetColor = { r: 240, g: 178, b: 50 };
          else if (profilePic.classList.contains('dnd')) targetColor = { r: 255, g: 47, b: 47 };
          else targetColor = { r: 200, g: 200, b: 255 };
        } else {
          targetColor = { r: 200, g: 200, b: 255 }; // Light blueish for general hover
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        targetSize = TRAIL_OPTIONS.baseSize;
        targetColor = { ...TRAIL_OPTIONS.baseColor };
      }
    });

    // Lerp helper
    const lerp = (start, end, factor) => start + (end - start) * factor;

    function animateTrail() {
      ctx.clearRect(0, 0, width, height);

      // Smoothly transition size and color
      currentSize = lerp(currentSize, targetSize, 0.1);
      currentColor.r = lerp(currentColor.r, targetColor.r, 0.1);
      currentColor.g = lerp(currentColor.g, targetColor.g, 0.1);
      currentColor.b = lerp(currentColor.b, targetColor.b, 0.1);

      // Head point follows mouse with smoothing
      points[0].x += (mouse.x - points[0].x) * TRAIL_OPTIONS.smoothing;
      points[0].y += (mouse.y - points[0].y) * TRAIL_OPTIONS.smoothing;

      if (TRAIL_OPTIONS.glow) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${Math.round(currentColor.r)}, ${Math.round(currentColor.g)}, ${Math.round(currentColor.b)}, 0.4)`;
      }

      for (let i = 1; i < TRAIL_OPTIONS.length; i++) {
        // Tail points catch up to the previous point
        points[i].x += (points[i - 1].x - points[i].x) * TRAIL_OPTIONS.followSpeed;
        points[i].y += (points[i - 1].y - points[i].y) * TRAIL_OPTIONS.followSpeed;
      }

      // If the trail has been initialized by movement, draw it
      if (initialized) {
        for (let i = 0; i < TRAIL_OPTIONS.length; i++) {
          const progress = i / TRAIL_OPTIONS.length; // 0 (head) to 1 (tail)
          const opacity = 1 - progress; // Fades out
          const size = currentSize * (1 - progress * 0.6); // Shrinks slightly towards the end

          ctx.beginPath();
          ctx.arc(points[i].x, points[i].y, Math.max(0, size), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${Math.round(currentColor.r)}, ${Math.round(currentColor.g)}, ${Math.round(currentColor.b)}, ${opacity})`;
          ctx.fill();
          ctx.closePath();
        }
      }

      requestAnimationFrame(animateTrail);
    }
    animateTrail();
  }

});

