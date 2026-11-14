(() => {
  document.documentElement.classList.add("js");

  /* ── Live IST clock in the hero ── */
  const clock = document.getElementById("ist-clock");
  if (clock) {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }

  /* ── Visual playground marquee ── */
  // [file number, width, height] of the web exports (mobile exports share the aspect ratio)
  const ROWS = {
    1: [
      [1, 2667, "SpendWise finance app onboarding screens"],
      [2, 2667, "LLMs & Agentic AI for Engineers course banners"],
      [3, 2667, "Build your own Claude Code cohort creatives"],
      [4, 1467, "LLMs & Agentic AI for Engineers poster"],
      [5, 1467, "Become an AI Engineer poster"],
      [6, 1867, "Happy Bhai Dooj 50% off campaign creative"],
      [7, 1867, "Dhanteras offer campaign creative"],
    ],
    2: [
      [8, 1867, "Happy Diwali 50% off campaign creative"],
      [9, 2134, "LLMs & Agentic AI for Engineers landing page"],
      [10, 2134, "Learn through real company case studies section"],
      [11, 2134, "ZAPT preparation guide landing page"],
      [12, 2134, "AI is easy to demo, hard to make work — landing section"],
      [13, 1867, "Become an AI Native Software Engineer landing page"],
      [14, 2667, "CodeFusion hackathon finale creative"],
    ],
  };
  const H = 1600;
  const SPEED = 45; // px per second

  const makeItem = ([n, w, alt], hidden) => {
    const li = document.createElement("li");
    if (hidden) li.setAttribute("aria-hidden", "true");
    li.innerHTML = `
      <picture>
        <source media="(max-width: 640px)" srcset="assets/mobile/page-${n}.webp" />
        <img src="assets/web/page-${n}.webp" alt="${hidden ? "" : alt}"
             width="${w}" height="${H}" decoding="async" />
      </picture>`;
    return li;
  };

  const buildRow = (id, items) => {
    const track = document.getElementById(id);
    if (!track) return;
    const frag = document.createDocumentFragment();
    items.forEach((it) => frag.appendChild(makeItem(it, false)));
    items.forEach((it) => frag.appendChild(makeItem(it, true))); // seamless loop copy
    track.appendChild(frag);
  };

  // Desktop shows two rows (pages 1–7, 8–14); the 390 mobile frame shows a single row.
  const mobileMQ = window.matchMedia("(max-width: 640px)");
  const rowItems = () => mobileMQ.matches
    ? { 1: [...ROWS[1], ...ROWS[2]], 2: [] }
    : ROWS;

  let current = null;
  const render = () => {
    current = rowItems();
    ["1", "2"].forEach((r) => {
      const track = document.getElementById(`row-${r}`);
      if (!track) return;
      track.textContent = "";
      buildRow(`row-${r}`, current[r]);
      track.parentElement.hidden = current[r].length === 0;
    });
    setDurations();
  };

  const setDurations = () => {
    if (!current) return;
    document.querySelectorAll(".marquee").forEach((m) => {
      const items = current[m.dataset.row];
      if (!items.length) return;
      const rowH = m.clientHeight;
      const loopWidth = items.reduce((sum, [, w]) => sum + (w / H) * rowH, 0);
      m.querySelector(".marquee-track").style.setProperty("--duration", `${loopWidth / SPEED}s`);
    });
  };

  const playground = document.getElementById("playground");
  let built = false;
  const build = () => {
    if (built) return;
    built = true;
    render();
    mobileMQ.addEventListener("change", render);
  };

  if (playground && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { build(); io.disconnect(); }
    }, { rootMargin: "1200px 0px" });
    io.observe(playground);
  } else {
    build();
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setDurations, 150);
  });

  /* ── Reveal on scroll ── */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }
})();
