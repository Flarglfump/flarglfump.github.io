/* Renders the home page and the project pages from projects.js. No build step. */
(function () {
  "use strict";

  var SITE = window.SITE || { name: "Projects", links: [] };
  var PROJECTS = window.PROJECTS || [];

  /* The site's root, worked out from where this script lives, so the site works at
   * username.github.io/ and at username.github.io/some-repo/ alike. */
  var ROOT = new URL("..", document.currentScript.src);
  function rootUrl(path) { return new URL(path, ROOT).href; }
  function projectUrl(p, path) {
    if (/^[a-z]+:|^\/\//i.test(path)) return path;                  /* already a full URL */
    return rootUrl("projects/" + encodeURIComponent(p.slug) + "/" + (path || ""));
  }

  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") n.className = v;
      else if (k === "html") n.innerHTML = v;
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? "" : v);
    }
    [].concat(children || []).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  /* ---------- generated covers: a mirrored pixel sprite seeded by the title ---------- */

  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) {
    return function () {
      seed = (seed + 0x6d2b79f5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var HUES = [212, 42, 162, 330, 268, 12, 190];
  var coverCache = {};
  function generatedCover(title) {
    if (coverCache[title]) return coverCache[title];
    var r = rng(hash(title));
    var w = 64, h = 36, c = document.createElement("canvas");
    c.width = w; c.height = h;
    var g = c.getContext("2d");
    var hue = HUES[Math.floor(r() * HUES.length)];
    g.fillStyle = "hsl(" + hue + " 38% 22%)"; g.fillRect(0, 0, w, h);
    g.fillStyle = "hsl(" + hue + " 38% 27%)";                     /* faint dot grid */
    for (var y = 2; y < h; y += 4) for (var x = 2; x < w; x += 4) g.fillRect(x, y, 1, 1);
    var cells = 7, px = 3, ox = (w - cells * px) >> 1, oy = (h - cells * px) >> 1;
    g.fillStyle = "hsl(" + hue + " 80% 72%)";
    for (var cy = 0; cy < cells; cy++)
      for (var cx = 0; cx < Math.ceil(cells / 2); cx++)
        if (r() < 0.5) {
          g.fillRect(ox + cx * px, oy + cy * px, px, px);
          g.fillRect(ox + (cells - 1 - cx) * px, oy + cy * px, px, px);
        }
    return (coverCache[title] = c.toDataURL());
  }
  function coverFor(p) { return p.cover ? projectUrl(p, p.cover) : generatedCover(p.title); }

  /* ---------- shared header and footer ---------- */

  function chrome() {
    var header = document.querySelector("[data-site-header]");
    if (header) {
      header.appendChild(el("a", { class: "brand", href: rootUrl("") }, SITE.name));
      var nav = el("nav", { "aria-label": "Elsewhere" });
      (SITE.links || []).forEach(function (l) { nav.appendChild(el("a", { href: l.url }, l.label)); });
      header.appendChild(nav);
    }
    var footer = document.querySelector("[data-site-footer]");
    if (footer) {
      footer.appendChild(el("p", null, [
        "© " + new Date().getFullYear() + " " + SITE.name + ". Hosted on GitHub Pages.",
      ]));
    }
  }

  /* ---------- home ---------- */

  function home() {
    document.title = SITE.name;
    var tagline = document.querySelector("[data-tagline]");
    var intro = document.querySelector("[data-intro]");
    if (tagline) tagline.textContent = SITE.tagline || "";
    if (intro) intro.textContent = SITE.intro || "";
    attract(document.querySelector("[data-attract]"));

    var list = document.querySelector("[data-projects]");
    var filters = document.querySelector("[data-filters]");
    var sorted = PROJECTS.slice().sort(function (a, b) {
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

    /* filter chips: Playable, then every tag used more than once */
    var counts = {};
    sorted.forEach(function (p) { (p.tags || []).forEach(function (t) { counts[t] = (counts[t] || 0) + 1; }); });
    var tags = Object.keys(counts).filter(function (t) { return counts[t] > 1; })
      .sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); });
    var chips = [{ id: "", label: "Everything" }];
    if (sorted.some(function (p) { return p.embed; })) chips.push({ id: ":playable", label: "Playable here" });
    tags.forEach(function (t) { chips.push({ id: t, label: t }); });

    var current = decodeURIComponent((location.hash.match(/^#tag=(.+)/) || [])[1] || "");

    function matches(p) {
      if (!current) return true;
      if (current === ":playable") return !!p.embed;
      return (p.tags || []).indexOf(current) >= 0;
    }

    function render() {
      filters.innerHTML = "";
      chips.forEach(function (c) {
        filters.appendChild(el("button", {
          type: "button", class: "chip", "aria-pressed": String(c.id === current),
          onclick: function () {
            current = c.id;
            history.replaceState(null, "", current ? "#tag=" + encodeURIComponent(current) : location.pathname);
            render();
          },
        }, c.label));
      });

      list.innerHTML = "";
      var shown = sorted.filter(matches);
      if (!shown.length) {
        list.appendChild(el("li", { class: "empty" }, PROJECTS.length
          ? "Nothing is tagged that. Pick another filter."
          : "No projects yet. Add one to projects.js."));
      }
      shown.forEach(function (p) {
        list.appendChild(el("li", { class: "row" + (p.featured ? " featured" : "") }, [
          el("a", { class: "row-link", href: projectUrl(p, "") }, [
            el("img", { class: "thumb", src: coverFor(p), alt: "", loading: "lazy", width: 320, height: 180 }),
            el("div", { class: "row-text" }, [
              el("h3", null, [p.title, p.year ? el("span", { class: "year" }, " " + p.year) : null]),
              el("p", null, p.summary || ""),
              el("ul", { class: "tags", "aria-label": "Tags" },
                (p.tags || []).map(function (t) { return el("li", null, t); })),
            ]),
            p.embed ? el("span", { class: "play-badge" }, "Play") : null,
          ]),
        ]));
      });
    }
    render();
  }

  /* ---------- project page ---------- */

  function project() {
    var slug = document.body.getAttribute("data-slug");
    var p = PROJECTS.filter(function (x) { return x.slug === slug; })[0];
    var main = document.querySelector("main");
    if (!p) {
      document.title = "Not found · " + SITE.name;
      main.appendChild(el("section", { class: "missing" }, [
        el("h1", null, "This project isn't listed"),
        el("p", { html: "Add an entry with <code>slug: \"" + (slug || "") + "\"</code> to <code>projects.js</code>." }),
        el("p", null, el("a", { href: rootUrl("") }, "Back to all projects")),
      ]));
      return;
    }
    document.title = p.title + " · " + SITE.name;
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", p.summary || "");

    main.appendChild(el("a", { class: "back", href: rootUrl("") }, "All projects"));
    main.appendChild(el("header", { class: "project-head" }, [
      el("h1", null, p.title),
      el("p", { class: "summary" }, p.summary || ""),
      el("p", { class: "meta" }, [
        p.year ? String(p.year) : null,
        (p.tags || []).length ? el("span", { class: "tags-inline" }, (p.tags || []).join(", ")) : null,
      ]),
    ]));

    if (p.embed) main.appendChild(player(p));
    else if (p.cover) main.appendChild(el("img", { class: "hero-shot", src: coverFor(p), alt: p.title + " screenshot" }));

    var aside = el("aside", { class: "facts" });
    if ((p.links || []).length) {
      aside.appendChild(el("h2", null, "Links"));
      aside.appendChild(el("ul", { class: "link-list" },
        p.links.map(function (l) { return el("li", null, el("a", { href: l.url }, l.label)); })));
    }
    if ((p.controls || []).length) {
      aside.appendChild(el("h2", null, "Controls"));
      aside.appendChild(el("dl", { class: "controls" }, [].concat.apply([], p.controls.map(function (c) {
        return [el("dt", null, c[0]), el("dd", null, c[1])];
      }))));
    }
    main.appendChild(el("div", { class: "project-body" }, [
      el("article", { class: "prose", html: p.body || "" }),
      aside.childNodes.length ? aside : null,
    ]));
  }

  function player(p) {
    var src = projectUrl(p, p.embed);
    var stage = el("div", { class: "stage", style: "aspect-ratio:" + (p.aspect || "16/9") });
    var wrap = el("section", { class: "player", "aria-label": p.title + " game" }, [stage]);
    var frame = null;

    function load() {
      stage.innerHTML = "";
      frame = el("iframe", {
        src: src, title: p.title,
        allow: "fullscreen; gamepad; autoplay; clipboard-write",
        allowfullscreen: true,
      });
      stage.appendChild(frame);
      if (p.clickToLoad) frame.focus();
    }

    function poster() {
      stage.appendChild(el("img", { class: "poster", src: coverFor(p), alt: "" }));
      stage.appendChild(el("button", { type: "button", class: "start", onclick: load }, "Load " + p.title));
    }

    function missing() {
      stage.innerHTML = "";
      stage.appendChild(el("div", { class: "no-build" }, [
        el("p", { class: "strong" }, "No web build here yet"),
        el("p", { html: "Put the build at <code>projects/" + p.slug + "/" + p.embed +
          "</code>. For a Bronto project, that's <code>builds/web/index.html</code> from " +
          "<em>Build › Build for › Web</em>." }),
      ]));
      tools.hidden = true;
    }

    if (p.clickToLoad) poster(); else load();

    var tools = el("div", { class: "player-tools" }, [
      el("button", { type: "button", onclick: function () {
        if (!frame) load();
        var t = stage;
        (t.requestFullscreen || t.webkitRequestFullscreen || function () {}).call(t);
      } }, "Fullscreen"),
      el("button", { type: "button", onclick: function () { load(); } }, "Restart"),
      el("a", { href: src, target: "_blank", rel: "noopener" }, "Open in its own tab"),
    ]);
    wrap.appendChild(tools);

    /* A missing build would show GitHub's 404 page inside the frame; say what to do instead. */
    if (location.protocol.indexOf("http") === 0 && new URL(src).origin === location.origin) {
      fetch(src, { method: "HEAD" }).then(function (r) { if (!r.ok) missing(); }, function () {});
    }
    return wrap;
  }

  /* ---------- the home page's attract mode: Snake, playing itself at 320x180 ---------- */

  function attract(canvas) {
    if (!canvas) return;
    var W = 320, H = 180, S = 10, COLS = W / S, ROWS = H / S;
    var g = canvas.getContext("2d");
    var css = getComputedStyle(document.documentElement);
    function col(name) { return css.getPropertyValue(name).trim(); }
    var rand = rng(7);
    var snake, dir, apple, grow, timer = null;

    function reset() {
      snake = [{ x: 8, y: 9 }, { x: 7, y: 9 }, { x: 6, y: 9 }];
      dir = { x: 1, y: 0 }; grow = 0; place();
    }
    function occupied(x, y) {
      for (var i = 0; i < snake.length; i++) if (snake[i].x === x && snake[i].y === y) return true;
      return false;
    }
    function place() {
      do { apple = { x: Math.floor(rand() * COLS), y: Math.floor(rand() * ROWS) }; }
      while (occupied(apple.x, apple.y));
    }
    function free(x, y) { return x >= 0 && y >= 0 && x < COLS && y < ROWS && !occupied(x, y); }
    function room(x, y) {                                   /* flood fill, capped */
      var seen = {}, stack = [[x, y]], n = 0;
      while (stack.length && n < 120) {
        var c = stack.pop(), k = c[0] + "," + c[1];
        if (seen[k] || !free(c[0], c[1])) continue;
        seen[k] = 1; n++;
        stack.push([c[0] + 1, c[1]], [c[0] - 1, c[1]], [c[0], c[1] + 1], [c[0], c[1] - 1]);
      }
      return n;
    }
    function step() {
      var h = snake[0], best = null, bestScore = -Infinity;
      [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }].forEach(function (d) {
        if (d.x === -dir.x && d.y === -dir.y) return;
        var nx = h.x + d.x, ny = h.y + d.y;
        if (!free(nx, ny)) return;
        var space = room(nx, ny);
        var score = -(Math.abs(apple.x - nx) + Math.abs(apple.y - ny)) + (space < snake.length ? -1000 : 0) + space * 0.01;
        if (score > bestScore) { bestScore = score; best = d; }
      });
      if (!best) { reset(); return; }
      dir = best;
      snake.unshift({ x: h.x + dir.x, y: h.y + dir.y });
      if (snake[0].x === apple.x && snake[0].y === apple.y) { grow += 3; place(); }
      if (grow > 0) grow--; else snake.pop();
      if (snake.length > 70) reset();
    }
    function draw() {
      g.fillStyle = col("--screen"); g.fillRect(0, 0, W, H);
      g.fillStyle = col("--screen-dot");
      for (var y = 0; y < ROWS; y++) for (var x = 0; x < COLS; x++) g.fillRect(x * S + 4, y * S + 4, 2, 2);
      g.fillStyle = col("--accent");
      g.fillRect(apple.x * S + 2, apple.y * S + 2, S - 4, S - 4);
      snake.forEach(function (s, i) {
        g.fillStyle = i === 0 ? col("--screen-ink") : col("--screen-body");
        g.fillRect(s.x * S + 1, s.y * S + 1, S - 2, S - 2);
      });
    }
    function tick() { step(); draw(); }
    reset();
    for (var i = 0; i < 40; i++) step();                    /* start mid-game */
    draw();
    if (reduceMotion) return;
    function run() { if (!timer) timer = setInterval(tick, 90); }
    function stop() { clearInterval(timer); timer = null; }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (e) { e[0].isIntersecting ? run() : stop(); }).observe(canvas);
    } else run();
    document.addEventListener("visibilitychange", function () { document.hidden ? stop() : run(); });
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      css = getComputedStyle(document.documentElement); draw();
    });
  }

  chrome();
  var page = document.body.getAttribute("data-page");
  if (page === "home") home();
  else if (page === "project") project();
})();
