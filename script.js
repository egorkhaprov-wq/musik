const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
});
function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  cursorRing.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();
document.querySelectorAll('a, button, .app-link, .app-card, .case-header, .case-toggle, .client-chip, .music-toggle, .price-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width = '60px';
    cursorRing.style.height = '60px';
    cursorRing.style.marginTop = '-10px';
    cursorRing.style.marginLeft = '-10px';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width = '40px';
    cursorRing.style.height = '40px';
    cursorRing.style.marginTop = '0';
    cursorRing.style.marginLeft = '0';
  });
});
const navEl = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navEl.classList.add('scrolled');
  else navEl.classList.remove('scrolled');
});
const navBurger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link, .mobile-menu-cta');
if (navBurger) {
  navBurger.addEventListener('click', () => {
    navBurger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}
mobileMenuLinks.forEach(link => {
  link.addEventListener('click', () => {
    navBurger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    navBurger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
});
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('v');
  });
}, { threshold: 0.1 });
document.querySelectorAll('.sr, .sr-l, .sr-r, .sr-s').forEach(el => revealObserver.observe(el));
document.querySelectorAll('nav a[href^="#"], a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
const counters = document.querySelectorAll('[data-target]');
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1500;
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));
document.querySelectorAll('.app-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});
const musicToggle = document.getElementById('musicToggle');
const audio = document.getElementById('phonkAudio');
const fallingBlocks = document.getElementById('fallingBlocks');
const miniPlayer = document.getElementById('miniPlayer');
const mpTracks = document.getElementById('mpTracks');
const mpPause = document.getElementById('mpPause');
const TRACKS = [
  {
    name: 'Yara Yara Ya Phonk',
    artist: 'MC WM, MC LAN',
    url: 'https://raw.githubusercontent.com/egorkhaprov-wq/musik/main/MC_WM_MC_LAN_-_Yara_Yara_Ya_Phonk_-_Sua_Amiga_Eu_Vou_Pegar_%28SkySound.cc%29.mp3'
  },
  {
    name: 'Body',
    artist: 'Don Toliver',
    url: 'https://raw.githubusercontent.com/egorkhaprov-wq/musik/main/Don%20Toliver%20-%20Body.mp3'
  },
  {
    name: 'EVA LONELY (Hardstyle)',
    artist: 'azrxel',
    url: 'https://raw.githubusercontent.com/egorkhaprov-wq/musik/main/azrxel_-_EVA_LONELY_LONELY_HARDSTYLE_%28SkySound.cc%29.mp3'
  }
];
let currentTrackIndex = 0;
function renderTracks() {
  mpTracks.innerHTML = '';
  TRACKS.forEach((track, i) => {
    const trackEl = document.createElement('button');
    trackEl.className = 'mp-track' + (i === currentTrackIndex && isPlaying ? ' active' : '');
    trackEl.innerHTML = `
      <div class="mp-track-icon">
        ${i === currentTrackIndex && isPlaying ?
          '<div class="mp-bars"><span></span><span></span><span></span></div>' :
          '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>'
        }
      </div>
      <div class="mp-track-info">
        <div class="mp-track-name">${track.name}</div>
        <div class="mp-track-artist">${track.artist}</div>
      </div>
    `;
    trackEl.addEventListener('click', (e) => {
      e.stopPropagation();
      selectTrack(i);
    });
    mpTracks.appendChild(trackEl);
  });
}
function selectTrack(index) {
  currentTrackIndex = index;
  audio.src = TRACKS[index].url;
  audio.load();
  if(index !== 1) stopFight();
  playMusic();
}
function openMiniPlayer() {
  miniPlayer.classList.add('open');
  renderTracks();
}
function closeMiniPlayer() {
  miniPlayer.classList.remove('open');
}
let isPlaying = false;
let audioCtx = null;
let analyser = null;
let dataArray = null;
let beatCheckRAF = null;
let fallbackTimer = null;
let lastBeatTime = 0;
let beatsDetected = 0;
let startTime = 0;
let vampireTimer = null;
const energyHistory = [];
const HISTORY_SIZE = 20; // быстрее адаптация
const BEAT_THRESHOLD = 1.02; // ОЧЕНЬ низкий порог - ловит практически каждый удар
const MIN_BEAT_GAP_MS = 120; // ещё чаще биты разрешены
const FALLBACK_BPM = 140;
const cracksContainer = document.getElementById('cracksContainer');
const contentWrapper = document.getElementById('contentWrapper');
function createFuturisticBlock() {
  const types = ['hexagon', 'cube', 'diamond', 'orb', 'glitch', 'ring'];
  const type = types[Math.floor(Math.random() * types.length)];
  const colors = [
    { primary: '#c4a47c', secondary: '#d4b896', glow: 'rgba(196,164,124,0.6)' },
    { primary: '#fff', secondary: '#aaa', glow: 'rgba(255,255,255,0.5)' },
    { primary: '#8be9fd', secondary: '#50fa7b', glow: 'rgba(139,233,253,0.5)' },
    { primary: '#ff79c6', secondary: '#bd93f9', glow: 'rgba(255,121,198,0.5)' }
  ];
  const c = colors[Math.floor(Math.random() * colors.length)];
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '-50 -50 100 100');
  svg.style.filter = `drop-shadow(0 0 12px ${c.glow}) drop-shadow(0 0 24px ${c.glow})`;
  switch(type) {
    case 'hexagon': {
      const outer = document.createElementNS(svgNS, 'polygon');
      outer.setAttribute('points', '0,-40 35,-20 35,20 0,40 -35,20 -35,-20');
      outer.setAttribute('fill', 'none');
      outer.setAttribute('stroke', c.primary);
      outer.setAttribute('stroke-width', '2');
      svg.appendChild(outer);
      const inner = document.createElementNS(svgNS, 'polygon');
      inner.setAttribute('points', '0,-22 19,-11 19,11 0,22 -19,11 -19,-11');
      inner.setAttribute('fill', 'none');
      inner.setAttribute('stroke', c.secondary);
      inner.setAttribute('stroke-width', '1');
      inner.setAttribute('opacity', '0.6');
      svg.appendChild(inner);
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('cx', '0'); dot.setAttribute('cy', '0'); dot.setAttribute('r', '3');
      dot.setAttribute('fill', c.primary);
      svg.appendChild(dot);
      break;
    }
    case 'cube': {
      const top = document.createElementNS(svgNS, 'polygon');
      top.setAttribute('points', '0,-35 30,-18 0,-1 -30,-18');
      top.setAttribute('fill', c.primary);
      top.setAttribute('opacity', '0.35');
      top.setAttribute('stroke', c.primary);
      top.setAttribute('stroke-width', '1.5');
      svg.appendChild(top);
      const left = document.createElementNS(svgNS, 'polygon');
      left.setAttribute('points', '-30,-18 0,-1 0,35 -30,18');
      left.setAttribute('fill', c.primary);
      left.setAttribute('opacity', '0.15');
      left.setAttribute('stroke', c.primary);
      left.setAttribute('stroke-width', '1.5');
      svg.appendChild(left);
      const right = document.createElementNS(svgNS, 'polygon');
      right.setAttribute('points', '30,-18 0,-1 0,35 30,18');
      right.setAttribute('fill', c.primary);
      right.setAttribute('opacity', '0.25');
      right.setAttribute('stroke', c.primary);
      right.setAttribute('stroke-width', '1.5');
      svg.appendChild(right);
      break;
    }
    case 'diamond': {
      const outer = document.createElementNS(svgNS, 'polygon');
      outer.setAttribute('points', '0,-42 28,0 0,42 -28,0');
      outer.setAttribute('fill', c.primary);
      outer.setAttribute('opacity', '0.2');
      outer.setAttribute('stroke', c.primary);
      outer.setAttribute('stroke-width', '2');
      svg.appendChild(outer);
      const l1 = document.createElementNS(svgNS, 'line');
      l1.setAttribute('x1','0');l1.setAttribute('y1','-42');l1.setAttribute('x2','0');l1.setAttribute('y2','42');
      l1.setAttribute('stroke', c.secondary); l1.setAttribute('stroke-width', '1');
      svg.appendChild(l1);
      const l2 = document.createElementNS(svgNS, 'line');
      l2.setAttribute('x1','-28');l2.setAttribute('y1','0');l2.setAttribute('x2','28');l2.setAttribute('y2','0');
      l2.setAttribute('stroke', c.secondary); l2.setAttribute('stroke-width', '1');
      svg.appendChild(l2);
      break;
    }
    case 'orb': {
      const grad = document.createElementNS(svgNS, 'radialGradient');
      const gradId = 'orbGrad' + Math.random().toString(36).slice(2,8);
      grad.setAttribute('id', gradId);
      const s1 = document.createElementNS(svgNS,'stop');
      s1.setAttribute('offset','0%'); s1.setAttribute('stop-color', c.primary); s1.setAttribute('stop-opacity','0.8');
      const s2 = document.createElementNS(svgNS,'stop');
      s2.setAttribute('offset','100%'); s2.setAttribute('stop-color', c.primary); s2.setAttribute('stop-opacity','0');
      grad.appendChild(s1); grad.appendChild(s2);
      const defs = document.createElementNS(svgNS,'defs');
      defs.appendChild(grad); svg.appendChild(defs);
      const sphere = document.createElementNS(svgNS, 'circle');
      sphere.setAttribute('cx','0'); sphere.setAttribute('cy','0'); sphere.setAttribute('r','25');
      sphere.setAttribute('fill', `url(#${gradId})`);
      svg.appendChild(sphere);
      const ring = document.createElementNS(svgNS, 'ellipse');
      ring.setAttribute('cx','0'); ring.setAttribute('cy','0');
      ring.setAttribute('rx','40'); ring.setAttribute('ry','12');
      ring.setAttribute('fill','none'); ring.setAttribute('stroke', c.primary);
      ring.setAttribute('stroke-width','1.5');
      svg.appendChild(ring);
      break;
    }
    case 'glitch': {
      const square = document.createElementNS(svgNS, 'rect');
      square.setAttribute('x','-35'); square.setAttribute('y','-35');
      square.setAttribute('width','70'); square.setAttribute('height','70');
      square.setAttribute('fill','none'); square.setAttribute('stroke', c.primary);
      square.setAttribute('stroke-width','2');
      svg.appendChild(square);
      for (let i = 0; i < 4; i++) {
        const y = -30 + Math.random() * 60;
        const x1 = -35 + Math.random() * 20;
        const x2 = 15 + Math.random() * 20;
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', x1); line.setAttribute('y1', y);
        line.setAttribute('x2', x2); line.setAttribute('y2', y);
        line.setAttribute('stroke', c.secondary);
        line.setAttribute('stroke-width', 1 + Math.random() * 2);
        line.setAttribute('opacity', 0.4 + Math.random() * 0.4);
        svg.appendChild(line);
      }
      break;
    }
    case 'ring': {
      for (let i = 0; i < 3; i++) {
        const r = 15 + i * 12;
        const c2 = document.createElementNS(svgNS, 'circle');
        c2.setAttribute('cx','0'); c2.setAttribute('cy','0'); c2.setAttribute('r', r);
        c2.setAttribute('fill','none');
        c2.setAttribute('stroke', c.primary);
        c2.setAttribute('stroke-width', 2 - i * 0.4);
        c2.setAttribute('opacity', 1 - i * 0.25);
        c2.setAttribute('stroke-dasharray', i === 0 ? 'none' : '3 4');
        svg.appendChild(c2);
      }
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('cx','0'); dot.setAttribute('cy','0'); dot.setAttribute('r', '4');
      dot.setAttribute('fill', c.primary);
      svg.appendChild(dot);
      break;
    }
  }
  return svg;
}
function buildCrackPath(startX, startY, angle, length, depth, jitter) {
  let pathData = `M ${startX.toFixed(1)} ${startY.toFixed(1)} `;
  const segments = 5 + Math.floor(Math.random() * 4);
  const segLen = length / segments;
  let cx = startX, cy = startY;
  let currentAngle = angle;
  const branches = [];
  for (let s = 1; s <= segments; s++) {
    currentAngle += (Math.random() - 0.5) * jitter;
    cx += Math.cos(currentAngle) * segLen;
    cy += Math.sin(currentAngle) * segLen;
    pathData += `L ${cx.toFixed(1)} ${cy.toFixed(1)} `;
    if (depth > 0 && s > 1 && s < segments && Math.random() < 0.45) {
      const branchAngle = currentAngle + (Math.random() > 0.5 ? 1 : -1) * (Math.PI/5 + Math.random() * Math.PI/4);
      const branchLength = (length - segLen * s) * (0.35 + Math.random() * 0.35);
      branches.push({ x: cx, y: cy, angle: branchAngle, length: branchLength, depth: depth - 1 });
    }
  }
  return { mainPath: pathData, branches, endX: cx, endY: cy };
}
function spawnCrack(intensity = 0.7) {
  if (!isPlaying) return;
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  const size = 120 + Math.random() * 200 + intensity * 150;
  const numMain = 5 + Math.floor(Math.random() * 4);
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'crack');
  svg.setAttribute('viewBox', `-${size} -${size} ${size*2} ${size*2}`);
  svg.style.left = (x - size) + 'px';
  svg.style.top = (y - size) + 'px';
  svg.style.width = (size * 2) + 'px';
  svg.style.height = (size * 2) + 'px';
  const isGold = Math.random() > 0.6;
  const strokeColor = isGold ? 'rgba(196,164,124,0.95)' : 'rgba(255,255,255,0.9)';
  const haloColor = isGold ? 'rgba(196,164,124,0.3)' : 'rgba(255,255,255,0.25)';
  const haloId = 'haloGrad' + Math.random().toString(36).slice(2,8);
  const defs = document.createElementNS(svgNS,'defs');
  const grad = document.createElementNS(svgNS, 'radialGradient');
  grad.setAttribute('id', haloId);
  const s1 = document.createElementNS(svgNS,'stop');
  s1.setAttribute('offset','0%'); s1.setAttribute('stop-color', haloColor); s1.setAttribute('stop-opacity','0.7');
  const s2 = document.createElementNS(svgNS,'stop');
  s2.setAttribute('offset','100%'); s2.setAttribute('stop-color', haloColor); s2.setAttribute('stop-opacity','0');
  grad.appendChild(s1); grad.appendChild(s2);
  defs.appendChild(grad);
  svg.appendChild(defs);
  const halo = document.createElementNS(svgNS, 'circle');
  halo.setAttribute('cx','0'); halo.setAttribute('cy','0');
  halo.setAttribute('r', (size * 0.35).toFixed(1));
  halo.setAttribute('fill', `url(#${haloId})`);
  svg.appendChild(halo);
  for (let i = 0; i < numMain; i++) {
    const angle = (i / numMain) * Math.PI * 2 + (Math.random() - 0.5) * 0.7;
    const mainLength = size * (0.55 + Math.random() * 0.4);
    const stack = [{ x: 0, y: 0, angle, length: mainLength, depth: 2, isMain: true }];
    while (stack.length > 0) {
      const cur = stack.pop();
      const result = buildCrackPath(cur.x, cur.y, cur.angle, cur.length, cur.depth, 0.35);
      const strokeWidth = cur.isMain ? (1.8 + Math.random() * 0.8) : (0.5 + Math.random() * 0.8);
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', result.mainPath);
      path.setAttribute('stroke', strokeColor);
      path.setAttribute('stroke-width', strokeWidth.toFixed(2));
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('opacity', cur.isMain ? '0.95' : '0.7');
      svg.appendChild(path);
      for (const b of result.branches) {
        stack.push({ x: b.x, y: b.y, angle: b.angle, length: b.length, depth: b.depth, isMain: false });
      }
    }
  }
  const numChips = 8 + Math.floor(Math.random() * 8);
  for (let i = 0; i < numChips; i++) {
    const dist = 5 + Math.random() * (size * 0.25);
    const ang = Math.random() * Math.PI * 2;
    const cx2 = Math.cos(ang) * dist;
    const cy2 = Math.sin(ang) * dist;
    const r = 0.5 + Math.random() * 1.8;
    const chip = document.createElementNS(svgNS, 'circle');
    chip.setAttribute('cx', cx2.toFixed(1));
    chip.setAttribute('cy', cy2.toFixed(1));
    chip.setAttribute('r', r.toFixed(1));
    chip.setAttribute('fill', strokeColor);
    chip.setAttribute('opacity', (0.4 + Math.random() * 0.5).toFixed(2));
    svg.appendChild(chip);
  }
  const center = document.createElementNS(svgNS, 'circle');
  center.setAttribute('cx', '0'); center.setAttribute('cy', '0');
  center.setAttribute('r', (3 + intensity * 5).toFixed(1));
  center.setAttribute('fill', strokeColor);
  svg.appendChild(center);
  const coreColor = isGold ? '#fff5dd' : '#fff';
  const core = document.createElementNS(svgNS, 'circle');
  core.setAttribute('cx', '0'); core.setAttribute('cy', '0');
  core.setAttribute('r', (1 + intensity * 2).toFixed(1));
  core.setAttribute('fill', coreColor);
  svg.appendChild(core);
  cracksContainer.appendChild(svg);
  setTimeout(() => svg.remove(), 700);
}
function initAudioContext() {
  if (audioCtx) return true;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.3;
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
    return true;
  } catch(e) {
    console.warn('AudioContext init failed:', e);
    return false;
  }
}
function detectBeat() {
  if (!isPlaying) return;
  if (!analyser) {
    startFallbackTimer();
    return;
  }
  analyser.getByteFrequencyData(dataArray);
  let energy = 0;
  for (let i = 0; i < 12; i++) {
    energy += dataArray[i];
  }
  energy /= 12;
  energyHistory.push(energy);
  if (energyHistory.length > HISTORY_SIZE) energyHistory.shift();
  const avg = energyHistory.reduce((a, b) => a + b, 0) / energyHistory.length;
  const now = performance.now();
  if (now - startTime > 2000 && avg < 5 && beatsDetected === 0) {
    console.log('No audio data (CORS?). Switching to BPM fallback.');
    startFallbackTimer();
    return;
  }
  if (
    energy > avg * BEAT_THRESHOLD &&
    energy > 5 &&
    now - lastBeatTime > MIN_BEAT_GAP_MS
  ) {
    lastBeatTime = now;
    beatsDetected++;
    const intensity = Math.min((energy - avg) / 25 + 0.5, 1);
    triggerBeat(intensity);
  }
  beatCheckRAF = requestAnimationFrame(detectBeat);
}
function startFallbackTimer() {
  if (fallbackTimer) return;
  const interval = (60 / FALLBACK_BPM) * 1000; // мс между ударами
  fallbackTimer = setInterval(() => {
    if (isPlaying) triggerBeat(0.7 + Math.random() * 0.3);
  }, interval);
}
function stopFallbackTimer() {
  if (fallbackTimer) {
    clearInterval(fallbackTimer);
    fallbackTimer = null;
  }
}
function triggerBeat(intensity = 0.7) {
  document.body.style.setProperty('--beat-intensity', intensity);
  contentWrapper.classList.add('beat-active');
  document.body.classList.add('beat-pulse');
  spawnBlock();
  if (intensity > 0.7 && Math.random() > 0.5) spawnBlock();
  spawnCrack(intensity);
  if (intensity > 0.8 && Math.random() > 0.6) {
    setTimeout(() => spawnCrack(intensity * 0.7), 60);
  }
  setTimeout(() => {
    contentWrapper.classList.remove('beat-active');
    document.body.classList.remove('beat-pulse');
  }, 220);
}
function spawnBlock() {
  if (!isPlaying) return;
  const wrapper = document.createElement('div');
  wrapper.className = 'falling-block';
  const block = createFuturisticBlock();
  wrapper.appendChild(block);
  wrapper.style.left = Math.random() * 100 + 'vw';
  const duration = 5 + Math.random() * 3;
  wrapper.style.animationDuration = duration + 's';
  const scale = 0.8 + Math.random() * 0.7;
  wrapper.style.setProperty('--scale', scale);
  wrapper.style.setProperty('--rot-end', (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 360) + 'deg');
  fallingBlocks.appendChild(wrapper);
  setTimeout(() => wrapper.remove(), (duration + 1) * 1000);
}
function playMusic() {
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  energyHistory.length = 0;
  beatsDetected = 0;
  startTime = performance.now();
  lastBeatTime = 0;
  if (!audio.src || audio.src === window.location.href) {
    audio.src = TRACKS[currentTrackIndex].url;
  }
  audio.play().then(() => {
    isPlaying = true;
    musicToggle.classList.remove('paused');
    musicToggle.classList.add('playing');
    musicToggle.setAttribute('title', 'Музыка играет');
    musicToggle.setAttribute('aria-label', 'Музыка играет');
    detectBeat();
    renderTracks();
    if (vampireTimer) clearTimeout(vampireTimer);
    if(fightTimer) clearTimeout(fightTimer);
    if(currentTrackIndex === 1){
      stopVampire();
      fightTimer = setTimeout(()=>{ if(isPlaying && currentTrackIndex===1) runFightScene(); }, 5000);
    } else {
      stopFight();
      vampireTimer = setTimeout(() => {
        if (isPlaying && currentTrackIndex !== 1) startVampire();
      }, 15000);
    }
  }).catch(err => {
    console.error('Audio play failed:', err);
  });
}
function pauseMusic() {
  audio.pause();
  isPlaying = false;
  musicToggle.classList.add('paused');
  musicToggle.classList.remove('playing');
  musicToggle.setAttribute('title', 'Музыка');
  musicToggle.setAttribute('aria-label', 'Музыка');
  if (beatCheckRAF) cancelAnimationFrame(beatCheckRAF);
  stopFallbackTimer();
  stopVampire();
  stopFight();
  contentWrapper.classList.remove('beat-active');
  document.body.classList.remove('beat-pulse');
  closeMiniPlayer(); // закрываем плеер при паузе
  setTimeout(() => {
    while (fallingBlocks.firstChild) fallingBlocks.removeChild(fallingBlocks.firstChild);
    while (cracksContainer.firstChild) cracksContainer.removeChild(cracksContainer.firstChild);
  }, 1500);
}
musicToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  if (miniPlayer.classList.contains('open')) {
    closeMiniPlayer();
  } else {
    openMiniPlayer();
  }
});
mpPause.addEventListener('click', (e) => {
  e.stopPropagation();
  pauseMusic();
});
document.addEventListener('click', (e) => {
  if (
    miniPlayer.classList.contains('open') &&
    !miniPlayer.contains(e.target) &&
    !musicToggle.contains(e.target)
  ) {
    closeMiniPlayer();
  }
});
audio.addEventListener('ended', () => {
  if (isPlaying) {
    currentTrackIndex = (currentTrackIndex + 1) % TRACKS.length;
    selectTrack(currentTrackIndex);
  }
});
renderTracks();
const fightScene = document.getElementById('fightScene');
const fighterH = document.getElementById('fighterH');
const fighterB = document.getElementById('fighterB');
const laserEyes = document.getElementById('laserEyes');
const laserL = document.getElementById('laserL');
const laserR = document.getElementById('laserR');
const fightFx = document.getElementById('fightFx');
let fightActive = false;
let fightTimer = null;
function fightSleep(ms){ return new Promise(r => setTimeout(r, ms)); }
function getPos(el){ return parseFloat(el.style.left || 0); }
function spawnHitEffect(x, y, text, color='#FFD700'){
  const el = document.createElement('div');
  el.className = 'hit-effect';
  el.textContent = text;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  el.style.color = color;
  fightFx.appendChild(el);
  setTimeout(()=>el.remove(), 700);
}
function spawnImpact(x, y, color='rgba(255,200,50,.7)', size=80){
  const el = document.createElement('div');
  el.className = 'impact-flash';
  el.style.left = (x - size/2) + 'px';
  el.style.top = (y - size/2) + 'px';
  el.style.width = size + 'px';
  el.style.height = size + 'px';
  el.style.background = `radial-gradient(circle,${color} 0%,transparent 70%)`;
  fightFx.appendChild(el);
  setTimeout(()=>el.remove(), 500);
}
function spawnLaserBurn(x1, y1, width, angle){
  const el = document.createElement('div');
  el.className = 'laser-burn';
  el.style.left = x1 + 'px';
  el.style.top = y1 + 'px';
  el.style.width = width + 'px';
  el.style.transform = `rotate(${angle}deg)`;
  fightFx.appendChild(el);
  setTimeout(()=>el.remove(), 2000);
}
function addClass(el, cls){ el.classList.add(cls); }
function removeClass(el, cls){ el.classList.remove(cls); }
async function shootLasers(duration=1500){
  const hRect = fighterH.getBoundingClientRect();
  const eyeX = hRect.left + hRect.width * 0.5;
  const eyeY = hRect.top + hRect.height * 0.08;
  const targetX = window.innerWidth * 0.7;
  const targetY = window.innerHeight * 0.4;
  const angle = Math.atan2(targetY - eyeY, targetX - eyeX) * 180 / Math.PI;
  const dist = Math.hypot(targetX - eyeX, targetY - eyeY);
  laserL.style.width = dist + 'px';
  laserL.style.transform = `rotate(${angle + 2}deg)`;
  laserR.style.width = dist + 'px';
  laserR.style.transform = `rotate(${angle - 2}deg)`;
  laserEyes.classList.add('active');
  laserL.classList.add('active');
  laserR.classList.add('active');
  spawnLaserBurn(eyeX, eyeY + 2, dist, angle + 2);
  spawnLaserBurn(eyeX, eyeY - 2, dist, angle - 2);
  for(let i=0; i<3; i++){
    await fightSleep(300);
    const bx = targetX + (Math.random()-0.5)*60;
    const by = targetY + (Math.random()-0.5)*40;
    spawnImpact(bx, by, 'rgba(255,80,0,.9)', 60+Math.random()*40);
    spawnHitEffect(bx-20, by-40, '🔥', '#ff4400');
  }
  await fightSleep(duration);
  laserEyes.classList.remove('active');
  laserL.classList.remove('active');
  laserR.classList.remove('active');
}
async function runFightScene(){
  fightActive = true;
  fightScene.classList.add('active');
  fightScene.style.pointerEvents = 'none';
  const vw = window.innerWidth;
  const fw = fighterH.offsetWidth || 140;
  fighterH.style.left = '-200px';
  fighterB.style.right = '-200px';
  fighterH.style.bottom = '0px';
  fighterB.style.bottom = '0px';
  fighterH.classList.add('visible','walking');
  fighterB.classList.add('visible','walking');
  await fightSleep(200);
  fighterH.style.left = Math.round(vw * 0.2) + 'px';
  fighterB.style.right = Math.round(vw * 0.2) + 'px';
  await fightSleep(1200);
  fighterH.style.left = Math.round(vw * 0.32) + 'px';
  fighterB.style.right = Math.round(vw * 0.32) + 'px';
  await fightSleep(1000);
  fighterH.classList.remove('walking');
  fighterB.classList.remove('walking');
  await fightSleep(400);
  const hRect = fighterH.getBoundingClientRect();
  const impX = hRect.right + 20;
  const impY = hRect.top + hRect.height * 0.45;
  fighterH.classList.add('punch');
  await fightSleep(200);
  spawnImpact(impX, impY, 'rgba(255,220,50,.85)', 100);
  spawnHitEffect(impX - 40, impY - 60, 'POW!', '#FFD700');
  fighterB.classList.add('hit','shake');
  await fightSleep(500);
  fighterH.classList.remove('punch');
  fighterB.classList.remove('hit','shake');
  const curR = parseInt(fighterB.style.right) || Math.round(vw*0.32);
  fighterB.style.right = (curR - 60) + 'px';
  await fightSleep(600);
  fighterB.style.right = (curR - 20) + 'px';
  await fightSleep(500);
  const bRect = fighterB.getBoundingClientRect();
  const impX2 = bRect.left - 20;
  const impY2 = bRect.top + bRect.height * 0.45;
  fighterB.classList.add('punch');
  await fightSleep(200);
  spawnImpact(impX2, impY2, 'rgba(100,200,255,.85)', 90);
  spawnHitEffect(impX2 - 60, impY2 - 60, 'CRACK!', '#88ccff');
  fighterH.classList.add('hit','shake');
  await fightSleep(500);
  fighterB.classList.remove('punch');
  fighterH.classList.remove('hit','shake');
  await fightSleep(600);
  spawnHitEffect(Math.round(vw*0.4), Math.round(window.innerHeight*0.3), '👁 LASER!', '#ff4400');
  await fightSleep(300);
  await shootLasers(1800);
  fighterB.style.right = (curR - 80) + 'px';
  await fightSleep(400);
  fighterB.style.right = curR + 'px';
  await fightSleep(400);
  fighterH.classList.add('walking');
  fighterB.classList.add('walking');
  await fightSleep(300);
  fighterH.classList.remove('walking');
  fighterB.classList.remove('walking');
  const title = document.createElement('div');
  title.className = 'fight-title';
  title.textContent = '💀 BODY 💀';
  fightFx.appendChild(title);
  await fightSleep(100);
  title.classList.add('show');
  await fightSleep(2500);
  title.style.transition='opacity .5s';
  title.style.opacity='0';
  await fightSleep(600);
  title.remove();
  fighterH.classList.add('walking');
  fighterB.classList.add('walking');
  fighterH.style.left = '-250px';
  fighterB.style.right = '-250px';
  await fightSleep(1000);
  fighterH.classList.remove('visible','walking');
  fighterB.classList.remove('visible','walking');
  fightScene.classList.remove('active');
  fightActive = false;
}
function stopFight(){
  fightActive = false;
  fightScene.classList.remove('active');
  fighterH.classList.remove('visible','walking','punch','hit','shake');
  fighterB.classList.remove('visible','walking','punch','hit','shake');
  laserEyes.classList.remove('active');
  laserL.classList.remove('active');
  laserR.classList.remove('active');
  fightFx.innerHTML = '';
  fighterH.style.opacity = '0';
  fighterH.style.visibility = 'hidden';
  fighterH.style.left = '-400px';
  fighterB.style.opacity = '0';
  fighterB.style.visibility = 'hidden';
  fighterB.style.right = '-400px';
  if(fightTimer){ clearTimeout(fightTimer); fightTimer=null; }
}
const vampireEl = document.getElementById('vampire');
let vampireActive = false;
let vampireBehaviorRunning = false;
let currentTarget = null;
function vampireSleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function vampireBehavior() {
  vampireBehaviorRunning = true;
  const startFromLeft = Math.random() > 0.5;
  const vh = window.innerHeight;
  const vw = window.innerWidth;
  vampireEl.style.transition = 'none';
  vampireEl.style.left = (startFromLeft ? -200 : vw + 50) + 'px';
  vampireEl.style.bottom = (40 + Math.random() * 60) + 'px';
  vampireEl.classList.toggle('facing-left', !startFromLeft);
  vampireEl.classList.add('active', 'sneaking');
  await vampireSleep(50);
  const selectors = [
    '.app-card', '.case-card', '.price-card', '.client-chip',
    '.hni', '.cta-box', '.hero-tag', '.btn-primary', '.btn-secondary',
    '.craft-window', '.case-icon', '.phone-mock', '.marquee-item'
  ];
  while (vampireActive) {
    const allTargets = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top > -100 && rect.bottom < vh + 100 && rect.width > 30) {
          allTargets.push(el);
        }
      });
    });
    if (allTargets.length === 0) {
      await vampireSleep(500);
      continue;
    }
    const target = allTargets[Math.floor(Math.random() * allTargets.length)];
    const rect = target.getBoundingClientRect();
    const vampireWidth = vampireEl.offsetWidth;
    const vampireHeight = vampireEl.offsetHeight;
    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;
    const approachFromLeft = Math.random() > 0.5;
    const newX = approachFromLeft ?
      Math.max(20, rect.left - vampireWidth + 30) :
      Math.min(vw - vampireWidth - 20, rect.right - 30);
    const newY = Math.max(40, vh - rect.bottom + Math.random() * 30);
    const currentX = parseFloat(vampireEl.style.left) || 0;
    const movingLeft = newX < currentX;
    vampireEl.classList.toggle('facing-left', movingLeft);
    const distance = Math.abs(newX - currentX);
    const duration = Math.max(2, Math.min(5, distance / 200));
    vampireEl.classList.remove('examining');
    vampireEl.classList.add('sneaking');
    vampireEl.style.transition = `left ${duration}s linear, bottom ${duration}s cubic-bezier(.45,.05,.55,.95)`;
    vampireEl.style.left = newX + 'px';
    vampireEl.style.bottom = newY + 'px';
    await vampireSleep(duration * 1000);
    if (!vampireActive) break;
    vampireEl.classList.remove('sneaking');
    vampireEl.classList.add('examining');
    if (currentTarget) currentTarget.classList.remove('vampire-target');
    target.classList.add('vampire-target');
    currentTarget = target;
    const examineDuration = 1500 + Math.random() * 2000;
    await vampireSleep(examineDuration);
    if (!vampireActive) break;
    target.classList.remove('vampire-target');
    currentTarget = null;
  }
  vampireBehaviorRunning = false;
}
function startVampire() {
  if (vampireActive) return;
  vampireActive = true;
  vampireBehavior();
}
function stopVampire() {
  vampireActive = false;
  if (currentTarget) {
    currentTarget.classList.remove('vampire-target');
    currentTarget = null;
  }
  if (vampireTimer) {
    clearTimeout(vampireTimer);
    vampireTimer = null;
  }
  vampireEl.classList.remove('sneaking', 'examining');
  vampireEl.style.transition = 'left 2s ease-in, opacity 1s ease 1s';
  const goRight = parseFloat(vampireEl.style.left) > window.innerWidth / 2;
  vampireEl.style.left = (goRight ? window.innerWidth + 200 : -200) + 'px';
  vampireEl.classList.toggle('facing-left', !goRight);
  setTimeout(() => {
    vampireEl.classList.remove('active');
  }, 2000);
}
const orb1 = document.querySelector('.orb-1');
const orb2 = document.querySelector('.orb-2');
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 50;
  const y = (e.clientY / window.innerHeight - 0.5) * 50;
  if (orb1) orb1.style.transform = `translate(${x}px, ${y}px)`;
  if (orb2) orb2.style.transform = `translate(${-x}px, ${-y}px)`;
});
const recipes = [
  { items: [{item:'bot',slot:4,label:'TG Bot'},{item:'text',slot:5,label:'Тексты'}], result: {class:'mc-result-funnel',label:'TG Воронка'} },
  { items: [{item:'bot',slot:0,label:'TG Bot'},{item:'text',slot:1,label:'Тексты'},{item:'payment',slot:2,label:'Платежи'}], result: {class:'mc-result-club',label:'Клуб'} },
  { items: [{item:'bot',slot:3,label:'TG Bot'},{item:'ai',slot:4,label:'ИИ'},{item:'database',slot:5,label:'База данных'}], result: {class:'mc-result-miniapp',label:'Mini App'} },
  { items: [{item:'crm',slot:4,label:'CRM'},{item:'automation',slot:5,label:'Автоматизация'}], result: {class:'mc-result-integration',label:'Интеграции'} }
];
let currentRecipeIndex = 0;
let isAnimating = false;
const cursor = document.getElementById('craftCursor');
const tooltip = document.getElementById('craftTooltip');
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function moveCursor(x, y, duration = 800) {
  return new Promise(resolve => {
    cursor.style.transition = `all ${duration}ms cubic-bezier(0.25,0.46,0.45,0.94)`;
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
    setTimeout(resolve, duration);
  });
}
function showTooltip(text, x, y) {
  tooltip.textContent = text;
  tooltip.style.left = (x + 20) + 'px';
  tooltip.style.top = (y + 20) + 'px';
  tooltip.classList.add('show');
}
function hideTooltip() { tooltip.classList.remove('show'); }
async function animateRecipe(recipe) {
  if (isAnimating) return;
  isAnimating = true;
  cursor.classList.add('active');
  for (const item of recipe.items) {
    const invSlot = document.querySelector(`[data-item="${item.item}"]`);
    const craftSlot = document.querySelector(`[data-slot="${item.slot}"]`);
    if (!invSlot || !craftSlot) continue;
    const invRect = invSlot.getBoundingClientRect();
    const craftRect = craftSlot.getBoundingClientRect();
    await moveCursor(invRect.left + invRect.width/2, invRect.top + invRect.height/2);
    await sleep(200);
    showTooltip(item.label, invRect.left + invRect.width/2, invRect.top + invRect.height/2);
    await sleep(600);
    const itemIcon = invSlot.querySelector('.mc-item').cloneNode(true);
    cursor.innerHTML = '';
    cursor.appendChild(itemIcon);
    invSlot.querySelector('.craft-inv-item').style.opacity = '0.3';
    hideTooltip();
    await sleep(200);
    await moveCursor(craftRect.left + craftRect.width/2, craftRect.top + craftRect.height/2);
    await sleep(200);
    const slotItem = craftSlot.querySelector('.craft-slot-item');
    const newIcon = invSlot.querySelector('.mc-item').cloneNode(true);
    slotItem.innerHTML = '';
    slotItem.appendChild(newIcon);
    slotItem.classList.add('show');
    cursor.innerHTML = '👆';
    await sleep(300);
    invSlot.querySelector('.craft-inv-item').style.opacity = '1';
  }
  await sleep(500);
  const resultEl = document.getElementById('craftResult');
  const resultIcon = resultEl.querySelector('.craft-result-icon');
  resultIcon.innerHTML = `<div class="mc-item ${recipe.result.class}"></div>`;
  resultIcon.classList.add('show');
  const resultRect = resultEl.getBoundingClientRect();
  await moveCursor(resultRect.left + resultRect.width/2, resultRect.top + resultRect.height/2);
  showTooltip(recipe.result.label, resultRect.left + resultRect.width/2, resultRect.top + resultRect.height/2);
  await sleep(2000);
  cursor.classList.remove('active');
  hideTooltip();
  await sleep(500);
  document.querySelectorAll('.craft-slot-item').forEach(item => { item.innerHTML = ''; item.classList.remove('show'); });
  resultIcon.innerHTML = '';
  resultIcon.classList.remove('show');
  await sleep(1000);
  isAnimating = false;
  currentRecipeIndex = (currentRecipeIndex + 1) % recipes.length;
  setTimeout(() => animateRecipe(recipes[currentRecipeIndex]), 500);
}
const craftObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !isAnimating) {
      setTimeout(() => animateRecipe(recipes[currentRecipeIndex]), 1000);
    }
  });
}, { threshold: 0.3 });
const craftSection = document.querySelector('.craft-sec');
if (craftSection) craftObserver.observe(craftSection);
