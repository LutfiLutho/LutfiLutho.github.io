      (() => {
        document.documentElement.classList.add("js");
        let savedTheme = null;
        try {
          savedTheme = localStorage.getItem("theme");
        } catch {
          // Persistent storage may be unavailable in strict privacy modes.
        }
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.dataset.theme =
          savedTheme === "light" || savedTheme === "dark"
            ? savedTheme
            : prefersDark
              ? "dark"
              : "light";
      })();
(() => {
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeColor = document.querySelector('meta[name="theme-color"]');
const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");
const siteHeader = document.querySelector(".site-header");

const updateThemeControls = () => {
  const isDark = root.dataset.theme === "dark";
  themeToggle?.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme",
  );
  themeColor?.setAttribute("content", isDark ? "#0a0d13" : "#f3f0e9");
};

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = nextTheme;
  try {
    localStorage.setItem("theme", nextTheme);
  } catch {
    // The control still works even when persistence is blocked.
  }
  updateThemeControls();
});

updateThemeControls();

const closeMenu = () => {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open navigation");
  mobileNav?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  menuToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
  mobileNav?.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

const updateHeader = () => {
  siteHeader?.classList.toggle("is-scrolled", window.scrollY > 16);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -7%" },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

document.querySelectorAll(".case-details").forEach((details) => {
  details.addEventListener("toggle", () => {
    const summary = details.querySelector("summary");
    if (!summary) return;
    summary.setAttribute("aria-expanded", String(details.open));
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const scrollToTopLinks = document.querySelectorAll('a[href="#top"]');

scrollToTopLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const reduceTopMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceTopMotion ? "auto" : "smooth",
    });

    // Remove stale #top / #contact / #work from the address after the
    // scroll begins, without causing a second browser jump.
    if (window.history?.replaceState) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  });
});


})();
let THREE = null;
try {
  THREE = await import(
    /* @vite-ignore */
    "https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js"
  );
} catch {
  // Keep every non-WebGL interaction working if Three.js cannot load.
}
const root = document.documentElement;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

const startWebGLHero = () => {
  if (!THREE) return;
  try {
    setupWebGLHero();
  } catch {
    document.querySelector(".hero-webgl-stage")?.remove();
  }
};

if (!reduceMotion.matches && gsap && ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add("extreme-ready");

  setupCursor();
  startWebGLHero();
  setupHeroMotion();
  setupHeroDepth();
  setupMagneticElements();
  setupProjectStack();
  setupMetricCounters();
  setupTimelineMotion();
  setupEducationMotion();
  setupContactMotion();
  setupSectionKickers();
} else if (!reduceMotion.matches) {
  // Three.js/cursor can still work even if the GSAP CDN is temporarily unavailable.
  setupCursor();
  startWebGLHero();
  setupHeroDepth();
}

function setupCursor() {
  if (!finePointer.matches) return;

  const ring = document.createElement("div");
  const dot = document.createElement("div");
  ring.className = "motion-cursor";
  dot.className = "motion-cursor-dot";
  ring.setAttribute("aria-hidden", "true");
  dot.setAttribute("aria-hidden", "true");
  document.body.append(ring, dot);

  let targetX = innerWidth / 2;
  let targetY = innerHeight / 2;
  let ringX = targetX;
  let ringY = targetY;
  let dotX = targetX;
  let dotY = targetY;

  const render = () => {
    ringX += (targetX - ringX) * 0.17;
    ringY += (targetY - ringY) * 0.17;
    dotX += (targetX - dotX) * 0.42;
    dotY += (targetY - dotY) * 0.42;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
    requestAnimationFrame(render);
  };

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      document.body.classList.add("motion-pointer-visible");
    },
    { passive: true },
  );

  document.documentElement.addEventListener("mouseleave", () => {
    document.body.classList.remove("motion-pointer-visible");
  });

  const interactive = document.querySelectorAll(
    "a, button, summary, .case-card, .education-card",
  );

  interactive.forEach((item) => {
    item.addEventListener("pointerenter", () =>
      document.body.classList.add("motion-pointer-hover"),
    );
    item.addEventListener("pointerleave", () =>
      document.body.classList.remove("motion-pointer-hover"),
    );
  });

  requestAnimationFrame(render);
}

function setupWebGLHero() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const stage = document.createElement("div");
  stage.className = "hero-webgl-stage";
  stage.setAttribute("aria-hidden", "true");

  const canvas = document.createElement("canvas");
  canvas.id = "hero-webgl";
  stage.appendChild(canvas);
  hero.prepend(stage);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 8.4);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "high-performance",
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.7));
  renderer.setClearColor(0x000000, 0);

  const dataGroup = new THREE.Group();
  scene.add(dataGroup);

  // Data sphere / point cloud.
  const count = innerWidth < 820 ? 430 : 840;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  const c1 = new THREE.Color("#8c8df9");
  const c2 = new THREE.Color("#d9ff57");
  const c3 = new THREE.Color("#45c8ff");

  for (let i = 0; i < count; i += 1) {
    const radius = 2.3 + Math.random() * 2.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const ix = i * 3;
    positions[ix] = radius * Math.sin(phi) * Math.cos(theta);
    positions[ix + 1] = radius * Math.cos(phi) * 0.72;
    positions[ix + 2] = radius * Math.sin(phi) * Math.sin(theta);

    const mix = Math.random();
    const color =
      mix < 0.55 ? c1.clone().lerp(c3, Math.random() * 0.65)
      : c2.clone().lerp(c1, Math.random() * 0.5);

    colors[ix] = color.r;
    colors[ix + 1] = color.g;
    colors[ix + 2] = color.b;
  }

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  pointsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    size: innerWidth < 820 ? 0.035 : 0.042,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  dataGroup.add(points);

  // Wireframe rings suggest analytics / orbiting systems.
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x8c8df9,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  });

  const ringA = new THREE.Mesh(
    new THREE.TorusGeometry(3.4, 0.012, 8, 180),
    ringMaterial,
  );
  ringA.rotation.set(1.08, 0.22, 0.3);
  dataGroup.add(ringA);

  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(2.7, 0.009, 8, 160),
    ringMaterial.clone(),
  );
  ringB.material.opacity = 0.09;
  ringB.rotation.set(0.42, 1.03, -0.4);
  dataGroup.add(ringB);

  const ringC = new THREE.Mesh(
    new THREE.TorusGeometry(4.2, 0.008, 8, 200),
    ringMaterial.clone(),
  );
  ringC.material.opacity = 0.07;
  ringC.rotation.set(0.3, -0.72, 0.9);
  dataGroup.add(ringC);

  // Small bars around the data sphere.
  const barGeometry = new THREE.BoxGeometry(0.035, 0.22, 0.035);
  const barMaterial = new THREE.MeshBasicMaterial({
    color: 0xd9ff57,
    transparent: true,
    opacity: 0.36,
  });

  for (let i = 0; i < 44; i += 1) {
    const bar = new THREE.Mesh(barGeometry, barMaterial.clone());
    const angle = (i / 44) * Math.PI * 2;
    const radius = 3.8 + Math.sin(i * 1.7) * 0.36;
    bar.position.set(
      Math.cos(angle) * radius,
      Math.sin(angle * 2.2) * 1.45,
      Math.sin(angle) * radius * 0.72,
    );
    bar.scale.y = 0.6 + Math.random() * 2.6;
    bar.lookAt(0, 0, 0);
    dataGroup.add(bar);
  }

  let pointerX = 0;
  let pointerY = 0;
  let targetX = 0;
  let targetY = 0;
  let scrollProgress = 0;
  let active = true;

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = (event.clientX / innerWidth - 0.5) * 2;
      targetY = (event.clientY / innerHeight - 0.5) * 2;

      hero.style.setProperty("--mx", `${event.clientX}px`);
      hero.style.setProperty("--my", `${event.clientY}px`);
    },
    { passive: true },
  );

  if (ScrollTrigger) {
    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
    });
  } else {
    window.addEventListener(
      "scroll",
      () => {
        const rect = hero.getBoundingClientRect();
        scrollProgress = Math.min(
          1,
          Math.max(0, -rect.top / Math.max(1, rect.height)),
        );
      },
      { passive: true },
    );
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      active = entry.isIntersecting;
    },
    { rootMargin: "200px" },
  );
  observer.observe(hero);

  const resize = () => {
    const rect = hero.getBoundingClientRect();
    const w = Math.max(1, rect.width);
    const h = Math.max(1, rect.height);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(hero);
  resize();

  const clock = new THREE.Clock();

  const animate = () => {
    requestAnimationFrame(animate);
    if (!active) return;

    const t = clock.getElapsedTime();
    pointerX += (targetX - pointerX) * 0.035;
    pointerY += (targetY - pointerY) * 0.035;

    dataGroup.rotation.y = t * 0.045 + pointerX * 0.18 + scrollProgress * 0.7;
    dataGroup.rotation.x = pointerY * 0.08 + Math.sin(t * 0.16) * 0.035;
    dataGroup.position.y = scrollProgress * -0.85;
    dataGroup.position.z = scrollProgress * 1.15;

    points.rotation.z = t * 0.018;
    ringA.rotation.z += 0.0008;
    ringB.rotation.y -= 0.0007;
    ringC.rotation.x += 0.00035;

    camera.position.x += (pointerX * 0.45 - camera.position.x) * 0.018;
    camera.position.y += (-pointerY * 0.3 - camera.position.y) * 0.018;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  animate();
}

function setupHeroMotion() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const heroTimeline = gsap.timeline({
    defaults: { ease: "power4.out" },
  });

  heroTimeline
    .from(".eyebrow", { y: 18, autoAlpha: 0, duration: 0.65 })
    .from(".hero h1", { y: 78, autoAlpha: 0, duration: 1.05 }, "-=0.36")
    .from(".hero-intro", { y: 34, autoAlpha: 0, duration: 0.72 }, "-=0.62")
    .from(".hero-actions > *", {
      y: 28,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.09,
    }, "-=0.42")
    .from(".skill-list li", {
      y: 18,
      autoAlpha: 0,
      duration: 0.42,
      stagger: 0.05,
    }, "-=0.38")
    .from(".hero-visual", {
      x: 90,
      rotateY: -12,
      rotateX: 4,
      scale: 0.88,
      autoAlpha: 0,
      duration: 1.15,
    }, "-=1.08")
    .from(".metric-item", {
      y: 30,
      autoAlpha: 0,
      duration: 0.6,
      stagger: 0.08,
    }, "-=0.5");

  gsap.to(".hero-copy", {
    y: 80,
    autoAlpha: 0.32,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom 35%",
      scrub: true,
    },
  });

  gsap.to(".hero-visual", {
    y: -58,
    scale: 0.94,
    rotateZ: 1.4,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom 18%",
      scrub: true,
    },
  });

  gsap.to(".metric-strip", {
    y: -34,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "35% top",
      end: "bottom top",
      scrub: true,
    },
  });
}

function setupHeroDepth() {
  const visual = document.querySelector(".hero-visual");
  if (!visual || !finePointer.matches) return;

  let targetRX = 0;
  let targetRY = 0;
  let currentRX = 0;
  let currentRY = 0;
  let targetPX = 0;
  let targetPY = 0;
  let currentPX = 0;
  let currentPY = 0;

  const render = () => {
    currentRX += (targetRX - currentRX) * 0.11;
    currentRY += (targetRY - currentRY) * 0.11;
    currentPX += (targetPX - currentPX) * 0.11;
    currentPY += (targetPY - currentPY) * 0.11;

    // Only use direct transforms when GSAP is not driving a scroll transform.
    visual.style.setProperty("--portrait-x", `${currentPX}px`);
    visual.style.setProperty("--portrait-y", `${currentPY}px`);

    if (!gsap) {
      visual.style.transform =
        `perspective(1200px) rotateX(${currentRX}deg) rotateY(${currentRY}deg)`;
    } else {
      gsap.set(visual, {
        rotationX: currentRX,
        rotationY: currentRY,
        transformPerspective: 1200,
      });
    }

    requestAnimationFrame(render);
  };

  visual.addEventListener("pointermove", (event) => {
    const rect = visual.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width;
    const ny = (event.clientY - rect.top) / rect.height;

    targetRY = (nx - 0.5) * 9;
    targetRX = (0.5 - ny) * 7;
    targetPX = (nx - 0.5) * -17;
    targetPY = (ny - 0.5) * -13;

    visual.style.setProperty("--visual-x", `${nx * 100}%`);
    visual.style.setProperty("--visual-y", `${ny * 100}%`);
  });

  visual.addEventListener("pointerleave", () => {
    targetRX = 0;
    targetRY = 0;
    targetPX = 0;
    targetPY = 0;
  });

  requestAnimationFrame(render);
}

function setupMagneticElements() {
  if (!finePointer.matches) return;

  const elements = document.querySelectorAll(
    ".button, .icon-button, .text-link, .contact-links a",
  );

  elements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const strength = element.classList.contains("icon-button") ? 0.16 : 0.11;

      gsap.to(element, {
        x: dx * strength,
        y: dy * strength,
        duration: 0.28,
        ease: "power3.out",
      });
    });

    element.addEventListener("pointerleave", () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.55,
        ease: "elastic.out(1, 0.46)",
      });
    });
  });
}

function setupProjectStack() {
  const cards = [...document.querySelectorAll(".case-card")];
  if (!cards.length) return;

  // Keep ScrollTrigger work lightweight.
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });

  cards.forEach((card, index) => {
    card.dataset.motionIndex = String(index + 1).padStart(2, "0");
    card.style.setProperty("--card-z", String(index + 2));
    card.style.setProperty("--stack-y", "0px");
    card.style.setProperty("--stack-scale", "1");
    card.style.setProperty("--stack-opacity", "1");

    const media = card.querySelector(".case-media");
    const image = media?.querySelector("img");
    const body = card.querySelector(".case-body");

    // Entrance is driven through CSS custom properties so no two GSAP
    // timelines fight over the same transform property.
    gsap.fromTo(
      card,
      {
        "--stack-y": "92px",
        "--stack-scale": 0.955,
        "--stack-opacity": 0.46,
      },
      {
        "--stack-y": "0px",
        "--stack-scale": 1,
        "--stack-opacity": 1,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 94%",
          end: "top 58%",
          scrub: 1.15,
          invalidateOnRefresh: true,
        },
      },
    );

    // Very subtle dashboard parallax. It uses variables instead of
    // overwriting the image transform, so mouse tilt stays smooth.
    if (image) {
      gsap.fromTo(
        image,
        {
          "--scroll-scale": 1.035,
          "--scroll-y": "10px",
        },
        {
          "--scroll-scale": 1.01,
          "--scroll-y": "-8px",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.35,
            invalidateOnRefresh: true,
          },
        },
      );
    }

    // Content reveals once; it no longer reverses/replays while the
    // user moves slightly up and down.
    if (body) {
      gsap.from(body.children, {
        y: 24,
        autoAlpha: 0,
        duration: 0.72,
        stagger: 0.065,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 68%",
          once: true,
        },
      });
    }

    // Previous card gently recedes. No CSS filter animation:
    // filter was one of the more expensive / janky effects.
    const next = cards[index + 1];
    if (next && innerWidth > 1020) {
      gsap.to(card, {
        "--stack-y": "-10px",
        "--stack-scale": 0.972,
        ease: "none",
        scrollTrigger: {
          trigger: next,
          start: "top 90%",
          end: "top 42%",
          scrub: 1.25,
          invalidateOnRefresh: true,
        },
      });
    }

    if (finePointer.matches && image) {
      let targetRX = 0;
      let targetRY = 0;
      let currentRX = 0;
      let currentRY = 0;
      let raf = 0;
      let active = false;

      const renderTilt = () => {
        currentRX += (targetRX - currentRX) * 0.095;
        currentRY += (targetRY - currentRY) * 0.095;

        image.style.setProperty("--image-rx", `${currentRX * 0.30}deg`);
        image.style.setProperty("--image-ry", `${currentRY * 0.30}deg`);

        if (
          active ||
          Math.abs(currentRX) > 0.015 ||
          Math.abs(currentRY) > 0.015
        ) {
          raf = requestAnimationFrame(renderTilt);
        }
      };

      card.addEventListener("pointerenter", () => {
        active = true;
        card.style.setProperty("--project-glow", "1");
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(renderTilt);
      });

      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = (event.clientY - rect.top) / rect.height;

        targetRY = (nx - 0.5) * 5;
        targetRX = (0.5 - ny) * 3.6;

        card.style.setProperty("--card-x", `${nx * 100}%`);
        card.style.setProperty("--card-y", `${ny * 100}%`);
        image.style.setProperty("--image-x", `${(nx - 0.5) * -7}px`);
        image.style.setProperty("--image-y", `${(ny - 0.5) * -5}px`);
      });

      card.addEventListener("pointerleave", () => {
        active = false;
        targetRX = 0;
        targetRY = 0;
        card.style.setProperty("--project-glow", "0");
        image.style.setProperty("--image-x", "0px");
        image.style.setProperty("--image-y", "0px");
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(renderTilt);
      });
    }
  });

  requestAnimationFrame(() => ScrollTrigger.refresh());
}

function setupMetricCounters() {
  const metrics = document.querySelectorAll(".metric-item strong");

  const parse = (raw) => {
    const match = raw.trim().match(/^([^0-9]*)([\d,.]+)(.*)$/);
    if (!match) return null;

    return {
      prefix: match[1],
      number: Number(match[2].replaceAll(",", "")),
      decimals: (match[2].split(".")[1] || "").length,
      suffix: match[3],
    };
  };

  metrics.forEach((metric) => {
    const original = metric.textContent.trim();
    const value = parse(original);
    if (!value || !Number.isFinite(value.number)) return;

    const state = { value: 0 };

    gsap.to(state, {
      value: value.number,
      duration: 1.45,
      ease: "power4.out",
      scrollTrigger: {
        trigger: metric,
        start: "top 88%",
        once: true,
      },
      onUpdate: () => {
        const formatted =
          value.decimals > 0
            ? state.value.toFixed(value.decimals)
            : Math.round(state.value).toLocaleString("en-US");

        metric.textContent = `${value.prefix}${formatted}${value.suffix}`;
      },
      onComplete: () => {
        metric.textContent = original;
        gsap.fromTo(
          metric,
          { scale: 0.92, y: 7 },
          { scale: 1, y: 0, duration: 0.42, ease: "back.out(1.7)" },
        );
      },
    });
  });
}

function setupTimelineMotion() {
  const items = document.querySelectorAll(".timeline-item");
  if (!items.length) return;

  items.forEach((item) => {
    gsap.from(item, {
      y: 30,
      autoAlpha: 0,
      duration: 0.78,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 84%",
        once: true,
      },
    });
  });
}

function setupEducationMotion() {
  const cards = document.querySelectorAll(".education-card");
  if (!cards.length) return;

  cards.forEach((card, index) => {
    gsap.from(card, {
      y: 76,
      rotationY: index % 2 === 0 ? -8 : 8,
      rotationX: 5,
      scale: 0.92,
      autoAlpha: 0,
      duration: 1,
      ease: "power4.out",
      transformPerspective: 1100,
      scrollTrigger: {
        trigger: card,
        start: "top 86%",
        toggleActions: "play none none reverse",
      },
    });

    if (!finePointer.matches) return;

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;

      card.style.setProperty("--edu-x", `${nx * 100}%`);
      card.style.setProperty("--edu-y", `${ny * 100}%`);
      card.style.setProperty("--edu-glow", "1");

      gsap.to(card, {
        rotationY: (nx - 0.5) * 6,
        rotationX: (0.5 - ny) * 5,
        duration: 0.35,
        ease: "power3.out",
        transformPerspective: 1100,
      });
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--edu-glow", "0");
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        duration: 0.65,
        ease: "elastic.out(1, .55)",
      });
    });
  });
}

function setupContactMotion() {
  const card = document.querySelector(".contact-card");
  const copy = card?.querySelector(".contact-copy");
  const links = card?.querySelectorAll(".contact-links a");

  if (!card) return;

  // IMPORTANT:
  // The contact card itself never receives a GSAP transform.
  // This prevents the jump/throw bug when scroll direction changes.
  gsap.set(card, {
    clearProps: "transform,rotation,rotationX,rotationY,x,y,scale",
  });

  if (copy) {
    gsap.from(copy, {
      y: 42,
      autoAlpha: 0,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 82%",
        once: true,
      },
    });
  }

  if (links?.length) {
    gsap.from(links, {
      x: 28,
      y: 10,
      autoAlpha: 0,
      duration: 0.62,
      stagger: 0.09,
      ease: "power3.out",
      scrollTrigger: {
        trigger: card,
        start: "top 72%",
        once: true,
      },
    });
  }

  // Pointer interaction now changes ONLY the ambient lighting.
  // No rotateX / rotateY is applied to the whole card.
  if (finePointer.matches) {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;

      card.style.setProperty("--contact-x", `${nx * 100}%`);
      card.style.setProperty("--contact-y", `${ny * 100}%`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--contact-x", "75%");
      card.style.setProperty("--contact-y", "40%");
    });
  }
}

function setupSectionKickers() {
  const kickers = document.querySelectorAll(".section-kicker");

  kickers.forEach((kicker) => {
    const original = kicker.textContent;
    const chars = "01/ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    ScrollTrigger.create({
      trigger: kicker,
      start: "top 88%",
      once: true,
      onEnter: () => {
        let frame = 0;
        const total = 18;

        const timer = window.setInterval(() => {
          const progress = frame / total;
          kicker.textContent = [...original]
            .map((char, index) => {
              if (char === " " || char === "/" || char === "·") return char;
              if (index / original.length < progress) return original[index];
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

          frame += 1;

          if (frame > total) {
            window.clearInterval(timer);
            kicker.textContent = original;
          }
        }, 30);
      },
    });
  });
}
