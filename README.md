# OSINTeusz 2 — English edition

OSINTeusz is a fictional, browser-based OSINT investigation for cybersecurity education. Students explore simulated search results and social profiles, record six facts, and unlock a local SHA-256 candidate-list demonstration.

Everything runs in the browser. There is no database, login, analytics service, API, or server-side state.

## Publish on GitHub Pages

1. Create a public GitHub repository named `milemario.github.io` for the address `https://milemario.github.io/`. You can instead name it `osinteusz`; its address will be `https://milemario.github.io/osinteusz/`.
2. Upload **the contents of this folder** to the repository root, including the hidden `.github` folder.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **GitHub Actions** as the source.
5. Open the **Actions** tab and wait for “Deploy OSINTeusz to GitHub Pages” to finish.

Every later push to the `main` branch rebuilds and republishes the site automatically. The Vite configuration uses relative asset paths, so the same files work at both repository URL styles.

## Run locally

Install Node.js 22 or newer, then run:

```bash
npm install
npm run dev
```

Create and verify the production build with:

```bash
npm test
```

The generated static files are placed in `dist/`.

## Classroom note

All people, accounts, websites, records, and leaked credentials in this exercise are fictional. The hash lab computes SHA-256 values locally and is intended only for the supplied fictional exercise data. Do not use it to test real accounts, passwords, or systems.
