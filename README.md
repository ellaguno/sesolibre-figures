# sesolibre-figures

A game to eliminate figures inspired on gems style games (match-3).

![Figuras](src/assets/gemas3.png)

The game has options:
- Vertical and horizontal mode (the horizontal mode works from right to left).
- 4 different sets of figures (Animals, Gems, Katakana, Letters, Numbers).
- Sound can be enabled / disabled.
- Play with unlimited moves or only 20.
- The score is displayed at the end, and the best score is kept on the device.

It is built with React (Create React App) + Tailwind CSS, and can be packaged as
native **Android** and **iOS** apps with [Capacitor](https://capacitorjs.com/).

## Gameplay

- **Tap-tap** a figure and then an adjacent one to swap them, or **swipe** a
  figure toward a neighbour (great on touch screens).
- A swap that doesn't create a line of 3+ is reverted automatically.
- The board never starts with free matches, and if no valid move remains it is
  reshuffled automatically.

## Development

```bash
npm install
npm start        # dev server at http://localhost:3000
npm test         # run the unit tests (board logic + UI smoke test)
npm run build    # production build into ./build
```

Source layout:

- `src/game/board.js` — pure match-3 logic (board creation, match detection,
  gravity/refill, valid-move detection, reshuffle). Unit-tested in
  `src/game/board.test.js`.
- `src/game/figures.js` — the figure sets (SVG assets).
- `src/components/` — `Gem` (a board cell, with tap + swipe) and `ConfigScreen`.
- `src/App.js` — game state, animation/cascade orchestration, score & moves.

## Mobile builds (Android / iOS)

The native projects (`android/`, `ios/`) are **not committed** — they are
regenerated from `capacitor.config.json` by Capacitor. To create them locally:

```bash
npm run build
npx cap add android   # or: npx cap add ios   (iOS requires macOS + Xcode)
npx cap sync          # copies the latest web build into the native project
```

Then open the project in Android Studio / Xcode, or build from the CLI.
Convenience scripts: `npm run mobile:android` and `npm run mobile:ios` run the
web build and `cap sync` in one step.

### GitHub Actions

GitHub builds the mobile apps automatically — see `.github/workflows/`:

| Workflow | Runner | Output artifact |
|----------|--------|-----------------|
| `web.yml` | Ubuntu | tests + `build/` web bundle |
| `android.yml` | Ubuntu | `app-debug.apk` (installable on Android devices) |
| `ios.yml` | macOS | `figures-unsigned.ipa` (compile-checked, **unsigned**) |

All three run on push to `main`, on pull requests, and can be triggered manually
(**Actions → … → Run workflow**). Download the build from the run's
**Artifacts** section.

> **Yes, GitHub Actions can build both.** Android APKs build for free on Linux
> runners. iOS builds run on GitHub's macOS runners.

### Signing iOS

The iOS workflow produces an **unsigned** build, which confirms the app
compiles but is **not installable** on a real device or publishable to the App
Store. To produce a signed, installable `.ipa` you need an
[Apple Developer Program](https://developer.apple.com/programs/) membership and
must add these repository secrets, then extend `ios.yml` to import them and
sign during `xcodebuild archive` / `-exportArchive`:

- `BUILD_CERTIFICATE_BASE64` — your distribution certificate (`.p12`), base64.
- `P12_PASSWORD` — password for the `.p12`.
- `PROVISIONING_PROFILE_BASE64` — the provisioning profile, base64.
- `KEYCHAIN_PASSWORD` — any temporary password for the CI keychain.

Android release builds can be signed similarly using a keystore stored as a
secret (the current workflow ships the debug-signed APK, which is enough for
side-loading and testing).

## Credits

- **Development** — [Eduardo Llaguno](https://sesolibre.com)
- **Animals** — [Freepik](https://www.freepik.es/vector-gratis/paquete-dibujos-animales_762718.htm)
- **Numbers** — Image by [Jaquelin Lassen](https://pixabay.com/users/jackielin1-19315469/) from [Pixabay](https://pixabay.com/)
- **Letters** — Image by [Suxu](https://pixabay.com/users/suxu-269261/) from [Pixabay](https://pixabay.com/)
- **Katakana** — [Wikimedia](https://commons.wikimedia.org/wiki/File:Katakana_origine.svg)
- **Sound** — [Pixabay Sound Effects](https://pixabay.com/sound-effects)

Made with help from Claude.
