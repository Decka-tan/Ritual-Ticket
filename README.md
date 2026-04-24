# Ritual Ticket

Golden Ticket generator for Ritual Testnet Day 1. A cinematic web experience that transforms user Twitter profiles into animated collectible tickets.

## ✨ Features

- **Portal Experience**: Immersive animated entry with ritual-themed visuals
- **Twitter Integration**: Fetch user profiles via Twitter proxy API
- **Cinematic Transitions**: Smooth multi-stage reveal animations
- **Customizable Tickets**: 10 color themes with real-time preview
- **Server-Side Download**: Perfect quality downloads via Cloudflare Workers + Puppeteer
- **Responsive Design**: Mobile-optimized with adaptive scaling
- **3D Interactions**: Interactive ticket with hover effects and parallax

## 🎨 Tech Stack

- **Frontend**: React 18 with TypeScript + Vite
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Backend**: Cloudflare Workers + Browser Rendering API
- **Icons**: Lucide React

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Start Cloudflare Worker (for download functionality)
npm run worker:dev
```

## 📁 Project Structure

```
ritual-ticket/
├── src/
│   ├── App.tsx              # Main application component
│   ├── generate-ticket.ts   # Cloudflare Worker for ticket generation
│   └── index.css            # Global styles and animations
├── public/                   # Static assets (videos, images, logos)
├── wrangler.toml            # Cloudflare Workers configuration
└── package.json             # Dependencies and scripts
```

## 🎯 User Flow

1. **Portal**: Landing page with ritual branding
2. **Login**: Input Twitter username (@handle)
3. **Confirmation**: Verify profile details
4. **Transition**: Animated ritual sequence (4s)
5. **Reveal**: Golden ticket reveal with effects
6. **Ticket**: Full ticket view with customization options

## 🎨 Customization

Users can customize their ticket with 10 color themes:
- Gold (default)
- Silver
- Cream
- Green
- Pink
- Cyan
- Orange
- Purple
- Blue
- Red

## 📱 Responsive Design

- **Desktop**: Full-size ticket (575px × 320px)
- **Mobile**: Scaled down to 65% for optimal viewing
- **Reveal Animation**: Scaled to 1.0 on mobile devices

## 🌐 API Integration

Uses Twitter proxy API for profile fetching:
```
https://ritual-twitter-proxy.artelamon.workers.dev/api/twitter/{username}
```

## 🎬 Video Assets

- **ritual-bg.mp4**: Portal background animation
- **ritual-enter.mp4**: Transition sequence
- **reveal 2.mp4**: Reveal background with split masking

## 🎨 Color Scheme

Primary accent color: `#40FFAF` (Ritual Green)

## 🚀 Deployment

### Frontend (Vercel)

```bash
npm run build
vercel --prod
```

### Cloudflare Worker (Browser Rendering)

```bash
# Deploy worker
npm run worker:deploy
```

**Important:** Make sure to:
1. Set up Browser Rendering API in Cloudflare dashboard
2. Update `wrangler.toml` with your domain
3. Set `VITE_API_URL` environment variable in Vercel to point to your worker URL

### Environment Variables

```bash
# For local development
VITE_API_URL=http://localhost:8787

# For production (Vercel)
VITE_API_URL=https://your-worker.your-subdomain.workers.dev
```

## 🔧 Configuration

### Ticket Dimensions
- Left section: 385px
- Right section: 190px
- Total: 575px × 320px

## 🐛 Known Issues

- Safari/iPhone CSS mask-image limitations (mitigated with server-side rendering)
- Large video assets impact initial load time

## 📝 License

Proprietary - All rights reserved

## 🤝 Contributing

Private project - no external contributions accepted

## 📧 Support

For issues or questions, contact: @decka_chan

---

**Built with ❤️ for Ritual Testnet Day 1**
