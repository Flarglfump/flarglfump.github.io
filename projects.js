/*
 * Everything the site shows comes from this file.
 *
 * To add a project:
 *   1. Add an entry to PROJECTS below (the slug becomes its address: /projects/<slug>/).
 *   2. Make its folder:  tools/new-project.sh <slug>   (or copy projects/_template/).
 *   3. If it has a web build, put it in projects/<slug>/play/ (a Bronto web build is a
 *      single index.html, so that's the only file you need).
 *   4. Optional: a screenshot at projects/<slug>/cover.png (16:9 looks best).
 */

window.SITE = {
  name: "Flarglfump",                       // shown in the header and the page titles
  tagline: "I make games, engines, and whatever else I think is neat!",
  intro:
    "Most of what's here runs in your browser. Pick something and press Play; " +
    "everything else links to its source.",
  links: [
    { label: "GitHub", url: "https://github.com/flarglfump" },
    // { label: "itch.io", url: "https://flarglfump.itch.io" },
    // { label: "Email", url: "mailto:you@example.com" },
  ],
};

/*
 * Fields (only slug, title and summary are required):
 *   slug        folder name under projects/
 *   title       display name
 *   summary     one line for the list
 *   year        shown beside the title
 *   tags        list of short words; the home page can filter by them
 *   embed       the web build to play on the page: "play/index.html" (in the project's
 *               folder), or a full URL. Leave it out for projects with nothing to play.
 *   aspect      the embed's shape, "16/9" by default (Bronto's 320x180 is 16/9)
 *   cover       a picture for the list and the player: "cover.png" (in the project's
 *               folder) or a full URL. Without one, a pattern is drawn from the title.
 *   links       [{ label, url }]: source code, downloads, devlogs...
 *   controls    [[keys, what they do], ...]: shown under the player
 *   body        the write-up: plain HTML (paragraphs, lists, images, code)
 *   featured    true puts it first on the home page
 */
window.PROJECTS = [
  {
    slug: "bronto",
    title: "Bronto",
    year: 2026,
    summary: "A small 2D game engine in C99 with no dependencies beyond the C library and the OS.",
    tags: ["engine", "c", "tools"],
    featured: true,
    links: [{ label: "Source", url: "https://github.com/flarglfump/bronto" }],
    body: `
      <p>Bronto is a 2D engine written in plain C99. It draws with its own software
      rasterizer, mixes its own sound, and talks to each operating system through a thin
      platform layer, so a game needs nothing installed beyond a C compiler.</p>
      <ul>
        <li>Native windows, sound and gamepads on Windows, macOS and Linux</li>
        <li>Web builds as WebAssembly with plain clang and its own small C library: no Emscripten</li>
        <li>An entity component system, a scene stack and a scene tree</li>
        <li>Physics, and BrontoScript: a small typed scripting language built in</li>
        <li>A visual scene editor that builds a whole game into one file</li>
      </ul>
      <p>Every game on this site that says <em>Built with Bronto</em> is a single
      <code>index.html</code> from the editor's <em>Build for Web</em>.</p>`,
  },
  {
    slug: "snake",
    title: "Snake",
    year: 2026,
    summary: "The classic, with bonus apples, synthesised music and a computer player.",
    tags: ["game", "bronto", "arcade"],
    embed: "play/index.html",
    controls: [
      ["Arrows / WASD / d-pad", "Steer"],
      ["Enter / A", "Start"],
      ["P / Esc / Start", "Pause"],
      ["M", "Mute the music"],
      ["Touch screen", "On-screen d-pad, A, MUSIC, START and MENU appear when you touch it"],
    ],
    links: [{ label: "Source", url: "https://github.com/flarglfump/bronto/tree/main/examples/snake" }],
    body: `
      <p>Snake is Bronto's first sample game and a tour of the engine: the rules are
      deterministic and unit-tested, and the particles, sound and overlays all listen for
      events instead of being wired into the rules.</p>
      <p>Every sound effect and the music loop are synthesised in code, so the game has no
      asset files at all.</p>`,
  },
  {
    slug: "pop-defense",
    title: "Pop Defense",
    year: 2026,
    summary: "Tower defense: 30 rounds, five towers with two upgrade paths, and balloons in layers.",
    tags: ["game", "bronto", "strategy"],
    embed: "play/index.html",
    controls: [
      ["Mouse", "Place and select towers"],
      ["Keyboard / gamepad", "Also supported"],
      ["Touch screen", "Tap to place and select; on-screen CANCEL and PAUSE"],
    ],
    links: [{ label: "Source", url: "https://github.com/flarglfump/bronto/tree/main/examples/towerdefense" }],
    body: `
      <p>One map, 30 rounds and five towers, each with two upgrade paths. Balloons come
      in layers and can be camo, lead, ceramic or a blimp.</p>
      <p>Upgrades are tiny functions that change a tower's stats, so adding one is a
      three-line change.</p>`,
  },
  {
    slug: "pantry-quest",
    title: "Pantry Quest",
    year: 2026,
    summary: "A top-down adventure across 128 screens, made entirely in the editor with scripts.",
    tags: ["game", "bronto", "adventure"],
    embed: "play/index.html",
    controls: [
      ["Arrows / WASD / stick", "Walk"],
      ["X / A", "Poke with the spoon"],
      ["Z / B", "Use the B item"],
      ["Enter / X button", "Pocket Pantry"],
      ["Esc / Start", "Pause"],
      ["Touch screen", "On-screen stick and buttons appear when you touch it"],
    ],
    links: [{ label: "Source", url: "https://github.com/flarglfump/bronto/tree/main/examples/pantryquest" }],
    body: `
      <p>Caves, shops, secrets, cellars with keys, maps, compasses and bosses, built from
      Tilemaps, prefabs and BrontoScript with no C code, and with its own art, sound and
      music.</p>
      <p>Plays on phones and tablets too: touch the game and an on-screen stick and A B X Y
      buttons appear. Held sideways they sit beside the game; held upright, below it. For
      the whole screen, use <em>Open in its own tab</em>.</p>`,
  },
  {
    slug: "platformer",
    title: "Platformer",
    year: 2026,
    summary: "A single physics-driven level, made only in the editor.",
    tags: ["game", "bronto", "platformer"],
    embed: "play/index.html",
    controls: [
      ["Arrows / A, D", "Run"],
      ["Space / Up / W", "Jump"],
      ["Touch screen", "On-screen \u25c0 \u25b6 and JUMP appear when you touch it"],
    ],
    links: [{ label: "Source", url: "https://github.com/flarglfump/bronto/tree/main/examples/platformer" }],
    body: `<p>A level built from colliders, rigid bodies and a handful of scripts.</p>`,
  },
];
