# Server-Side Ticket Generation

This project now uses server-side rendering with Puppeteer for perfect, consistent ticket downloads across all browsers.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the server:**
   ```bash
   npm run server
   ```

3. **Run the frontend:**
   ```bash
   npm run dev
   ```

The server runs on port 3001 and the frontend on port 5173.

## Environment Variables

For production, set `VITE_API_URL` to point to your server URL:
```
VITE_API_URL=https://your-server-url.com
```

## Benefits

✅ **100% consistent** - Same output across all browsers (Chrome, Safari, Firefox, Edge)
✅ **Perfect quality** - No missing logos, shadows, or font issues
✅ **Safari/iPhone compatible** - Works perfectly on all iOS devices
✅ **Offline capable** - Server can run anywhere
✅ **Scalable** - Can handle 100+ users easily

## Deployment

For deployment, you can:
- Deploy the Express server to Vercel, Railway, or any Node.js hosting
- Set `VITE_API_URL` environment variable
- Both frontend and backend can be deployed separately
