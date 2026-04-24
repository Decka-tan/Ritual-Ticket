# Ritual Ticket

Golden Ticket generator for Ritual Testnet Day 1. A cinematic web experience that transforms user Twitter profiles into animated collectible tickets.

## ✨ Features

- **Portal Experience**: Immersive animated entry with ritual-themed visuals
- **Twitter Integration**: Fetch user profiles via Twitter proxy API
- **Cinematic Transitions**: Smooth multi-stage reveal animations
- **Customizable Tickets**: 10 color themes with real-time preview
- **HD Download**: Export tickets as high-resolution PNG images
- **Responsive Design**: Mobile-optimized with adaptive scaling
- **3D Interactions**: Interactive ticket with hover effects and parallax

## 🎨 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **Image Generation**: html-to-image
- **Icons**: Lucide React

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
ritual-ticket/
├── public/              # Static assets (videos, images, logos)
├── src/
│   ├── App.tsx         # Main application component
│   ├── index.css       # Global styles and animations
│   └── main.tsx        # Application entry point
├── index.html          # HTML template
└── package.json        # Dependencies and scripts
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
- **Reveal Animation**: Scaled to 72% on mobile devices

## 🌐 API Integration

Uses Twitter proxy API for profile fetching:
```
https://ritual-twitter-proxy.artelamon.workers.dev/api/twitter/{username}
```

**Response format:**
```json
{
  "avatar": "https://pbs.twimg.com/profile_images/...",
  "displayName": "Display Name",
  "username": "username"
}
```

## 🎬 Video Assets

- **ritual-bg.mp4**: Portal background animation (1.8MB)
- **ritual-enter.mp4**: Transition sequence (1.5MB)
- **reveal 2.mp4**: Reveal background with split masking (4.6MB)

## 🎨 Color Scheme

Primary accent color: `#40FFAF` (Ritual Green)
- Portal buttons and highlights
- Username displays
- Success states
- Focus indicators

## 🔧 Configuration

### Ticket Dimensions
```typescript
const TICKET_CONFIG = {
  LEFT_WIDTH: 385,
  RIGHT_WIDTH: 190,
  TOTAL_WIDTH: 575,
  HEIGHT: 320,
  CUT_RADIUS: 16,
};
```

### Animation Timing
```typescript
const TRANSITION_CONFIG = {
  BASE_DURATION_MS: 4000,
  SPEED_INCREMENT_MS: 150,
  MAX_SPEED: 15,
};
```

## 🐛 Known Issues

- Memory leak in transition interval (needs useEffect cleanup)
- Missing input validation for Twitter usernames
- Large video assets impact initial load time
- No error boundaries for runtime errors

## 🔒 Security Considerations

- Twitter proxy API should implement rate limiting
- Username input needs validation (1-15 chars, alphanumeric + underscore)
- API responses should be validated before use
- Consider implementing CSP headers

## 🚀 Deployment

### Environment Variables
None required - runs purely client-side

### Build Output
```bash
npm run build
# Outputs to: dist/
```

### Static Hosting
Compatible with:
- Netlify
- Vercel
- GitHub Pages
- Any static file host

## 📝 License

Proprietary - All rights reserved

## 🤝 Contributing

Private project - no external contributions accepted

## 📧 Support

For issues or questions, contact: @decka_chan

---

**Built with ❤️ for Ritual Testnet Day 1**
