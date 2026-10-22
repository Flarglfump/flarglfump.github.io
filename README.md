# Projects site

A plain static site for GitHub Pages: a home page listing projects, a page for each one,
and web builds played right on the page. No build step, no Jekyll, no dependencies.

```
index.html              home page
projects.js             the site's name and links, and every project (edit this)
assets/                 style.css, site.js (renders the pages), icon.svg
projects/<slug>/        one folder per project
  index.html            a 10-line page; everything on it comes from projects.js
  play/index.html       the web build, if it has one
  cover.png             optional screenshot for the list and the player (16:9)
projects/_template/     copied for new projects
tools/new-project.sh    makes a project's folder
404.html                GitHub Pages shows this for missing addresses
.nojekyll               tells GitHub Pages to serve the files as they are
```

## Putting it online

1. Make a repository named **`<your-username>.github.io`** and push these files to its
   `main` branch. (Any other name works too; the site then lives at
   `<your-username>.github.io/<repo>/`, and every link still works.)
2. In the repository: **Settings › Pages › Build and deployment**, choose
   **Deploy from a branch**, branch `main`, folder `/ (root)`.
3. A minute later it's at `https://<your-username>.github.io/`.

Before pushing, put your name, tagline and links at the top of `projects.js`, and your
GitHub username in the `Source` links.

## Trying it locally

The pages need to be served (opening `index.html` from the disk works, but the check for
a missing build doesn't):

```sh
python3 -m http.server 8000      # then open http://localhost:8000
```

## Adding a project

```sh
tools/new-project.sh my-game path/to/builds/web/index.html
```

Then add an entry to `PROJECTS` in `projects.js`:

```js
{
  slug: "my-game",
  title: "My Game",
  year: 2026,
  summary: "One line for the list.",
  tags: ["game", "bronto"],
  embed: "play/index.html",
  controls: [["Arrows", "Move"], ["Space", "Jump"]],
  links: [{ label: "Source", url: "https://github.com/you/my-game" }],
  body: `<p>The write-up, in plain HTML.</p>`,
}
```

On Windows without a shell, copy `projects/_template` to `projects/my-game`, replace
`SLUG` with `my-game` in its `index.html`, and put the build in `play/`.

## Web builds

**Bronto:** *Build › Build for › Web* in the editor writes one file,
`builds/web/index.html`. Copy it to `projects/<slug>/play/index.html` and that's all.
For the sample games, `make web` writes `build/web/<example>/index.html`.

The page shows the build in a frame with **Fullscreen**, **Restart** and **Open in its
own tab**. The frame is allowed fullscreen, gamepads and sound, so keyboard, mouse and
controllers reach the game once it's clicked. Bronto's page starts with its own Play
button (browsers only allow sound after a click), so one click starts the game.

**Other engines** (Godot, Unity, raylib/Emscripten...) work the same way: put the
exported folder in `play/` with its `index.html`. For a heavy build, add
`clickToLoad: true` to the entry so nothing downloads until the visitor asks. To embed a
build hosted elsewhere, such as itch.io, set `embed` to its full address.

Some exports need things GitHub Pages can't do. Godot 4's threaded web export needs
special headers (export with threads off), and files over 100 MB can't go in a normal
repository.

**Saved data:** every page on `<your-username>.github.io` shares one browser storage.
Bronto keeps each game's saves under its own name, so give your games distinct names in
*Project Settings*.

## Covers

Without a `cover`, each project gets a small pixel sprite generated from its title. For a
real picture, save a 16:9 screenshot as `projects/<slug>/cover.png` and add
`cover: "cover.png"` to its entry. `snake --headless` writes screenshots you can use.
