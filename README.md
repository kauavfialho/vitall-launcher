# Vitall Launcher

**🌐 Language:** **English** | [Português](https://github.com/kauavfialho/vitall-launcher/blob/main/README.pt-BR.md)

A free launcher that brings the Vitall Studios apps together in one place. Use it to install, open and update each app, without hunting for files. Each project has its own repository.

> The launcher and its apps are currently available in Portuguese only.

## Apps

| App | What it does | Status | Project |
|---|---|---|---|
| 💰 Syvo | Organizes your money, sets goals, teaches you to invest and helps you prepare your Brazilian income tax. | Available | [syvo](https://github.com/kauavfialho/syvo) |
| 💻 Computer management | Takes care of your computer and helps you back up your files. | In progress | Coming soon |
| 🗓️ Life management | Organizes your routine, tasks and goals. | In progress | Coming soon |
| 💪 Diet and workouts | Tracks your food, gym sessions and workouts. | In progress | Coming soon |

## Download

Click the file for your computer and the download starts right away. The link always gets the latest version, and the sizes are approximate.

### Installer (recommended)

| Computer | Download | Size |
|---|---|---|
| 64-bit Windows | [⬇️ Download for Windows (.exe)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-win-x64.exe) | 116 MB |
| Mac with Apple chip (M1, M2, M3 or newer) | [⬇️ Download for Apple Mac (.dmg)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-mac-arm64.dmg) | 115 MB |
| Mac with Intel processor | [⬇️ Download for Intel Mac (.dmg)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-mac-x64.dmg) | 121 MB |

### Portable (no installation needed)

| Computer | Download | Size |
|---|---|---|
| 64-bit Windows | [⬇️ Download portable for Windows (.exe)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-win-x64-portable.exe) | 105 MB |
| Mac with Apple chip (M1, M2, M3 or newer) | [⬇️ Download portable for Apple Mac (.zip)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-mac-arm64.zip) | 112 MB |
| Mac with Intel processor | [⬇️ Download portable for Intel Mac (.zip)](https://github.com/kauavfialho/vitall-launcher/releases/latest/download/Vitall-Launcher-mac-x64.zip) | 117 MB |

Not sure which Mac you have? Click the Apple menu in the corner of the screen, then **About This Mac**. The Windows files are for 64-bit systems, the standard on current computers. There is no version for 32-bit Windows.

See [all versions](https://github.com/kauavfialho/vitall-launcher/releases).

The app has no paid certificate, so your system shows a warning the first time.

**Mac:** if a warning says the app can't be opened, go to System Settings, Privacy & Security, and click "Open Anyway". If the warning says the app is damaged, run this in Terminal:

```bash
xattr -cr "/Applications/Vitall Launcher.app"
```

**Windows:** on the blue SmartScreen window, click "More info" and then "Run anyway".

## For developers

To add an app, follow the guide [Como colocar um aplicativo no Vitall Launcher](docs/ADICIONAR-APP.md) (in Portuguese).

```bash
npm install
```

```bash
npm start
```

```bash
npm test
```

To publish a version, update `version` in `package.json` and push a `v*` tag.

## License

MIT.
