# Juztin Yuen — Photography & Motion Portfolio

An editorial portfolio website inspired by minimalist gallery showcases (edz.us / Koken Madison theme), custom-built for photographer and videographer **Juztin Yuen** ([@quietframes.sg](https://www.instagram.com/quietframes.sg/)).

Featuring combat sports (Muay Thai fight nights), motorsport (Formula 1 demo runs), stage performances (Wushu showcases), event publicity, 4K videography, Instagram highlights, and direct client booking workflows.

---

## 🚀 Live Deployment to Vercel (Free & Permanent)

This project is pre-configured with `vercel.json` for single-page application routing and deep linking.

### Option 1: One-Command CLI Deploy (Fastest)
Run the following command in your terminal:
```bash
npx vercel
```
1. Follow the one-time browser login prompt (GitHub, Google, or Email).
2. Press **Enter** to accept the default project settings.
3. Your website will be live worldwide in seconds at `https://<your-project>.vercel.app`!
4. For production updates anytime in the future, run:
   ```bash
   npx vercel --prod
   ```

### Option 2: Connect via GitHub (Automatic Updates)
1. Push this project to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/portfolio.git
   git branch -M main
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **Add New... > Project**.
3. Import your GitHub repository and click **Deploy**.
4. Any future edits or photos you push to GitHub will automatically deploy!
5. In **Settings > Domains**, you can also add your own custom domain (e.g. `quietframes.sg` or `juztinyuen.com`).

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run TypeScript type check
npm run lint

# Build production bundle
npm run build
```

---

## 📁 Key Features
- **Editorial Clean Layout**: Madison-inspired fixed left sidebar navigation with mobile responsive drawer.
- **Deep Hash Routing**: Direct URL linking for all albums, sub-albums (`#subalbum-muay-thai`, `#subalbum-formula-1`), `#about`, `#contact`, and `#instagram`.
- **Minimal Home Slideshow**: Pure, distraction-free photography viewing with smooth transitions and keyboard/touch navigation.
- **Interactive Lightbox**: Fullscreen mode, zoom, and EXIF camera & lens metadata inspection.
- **Client Inquiry Form**: Contact form with draft recovery, live character counters, email copying, and anti-bot protection.
- **Terms & Copyright License**: Built-in modal outlining usage terms, tagging requirements, and copyright ownership.
