import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Keep browser instance alive for reuse
let browser;

async function getBrowser() {
  if (!browser) {
    // Check if we're on VPS (Ubuntu) with snap Chromium
    const fs = require('fs');
    let launchOptions = {
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    };

    // Use snap Chromium on VPS if available
    if (fs.existsSync('/snap/bin/chromium')) {
      launchOptions.executablePath = '/snap/bin/chromium';
      console.log('Using snap Chromium');
    }

    browser = await puppeteer.launch(launchOptions);
  }
  return browser;
}

app.post('/api/generate-ticket', async (req, res) => {
  console.log('Received request:', JSON.stringify(req.body, null, 2));

  try {
    const { profile, ticketColor } = req.body;

    if (!profile) {
      return res.status(400).json({ error: 'Profile data required' });
    }

    const browser = await getBrowser();
    const page = await browser.newPage();

    // Set viewport for high quality
    await page.setViewport({ width: 575, height: 320, deviceScaleFactor: 2 });

    // Create ticket HTML
    const colors = {
      gold: {
        primary: '#FFD700',
        secondary: '#FFDB25',
        dark: '#6B4F00',
        light: '#FFEA70',
        text: '#3D2B00',
        border: '#b17504',
        gradient: 'linear-gradient(135deg, #F9B502 0%, #B17714 100%)'
      }
    };

    const selectedColor = colors[ticketColor] || colors.gold;

    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Outfit', sans-serif;
            background: white;
            width: 575px;
            height: 320px;
            overflow: hidden;
          }
          .ticket {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            background: linear-gradient(135deg, ${selectedColor.primary} 0%, ${selectedColor.secondary} 50%, ${selectedColor.primary} 100%);
          }
          .ticket-left {
            flex: 1;
            padding: 20px 24px 16px 24px;
            position: relative;
            z-index: 20;
          }
          .ticket-right {
            width: 190px;
            border-left: 2px dashed rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 24px;
            text-align: center;
          }
          .avatar-container {
            width: 128px;
            height: 128px;
            border-radius: 50%;
            background: white;
            border: 3px solid ${selectedColor.light};
            overflow: hidden;
            margin-bottom: 8px;
            position: relative;
          }
          .avatar-container::before {
            content: '';
            position: absolute;
            inset: 0;
            background: white;
            transform: translateY(3px);
            z-index: 1;
          }
          .avatar {
            width: 100%;
            height: 100%;
            object-fit: cover;
            position: relative;
            z-index: 2;
          }
          .username {
            font-family: 'Space Mono', monospace;
            font-size: 14px;
            font-weight: 500;
            color: ${selectedColor.text};
            line-height: 1;
            letter-spacing: -0.025em;
          }
          .username-container {
            border: 3px solid #FFB90A;
            padding: 6px 12px;
            border-radius: 9999px;
            background: transparent;
            backdrop-filter: blur(0.5px);
            display: inline-block;
          }
          .label {
            font-size: 9px;
            font-weight: bold;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #4E2F10;
            opacity: 0.8;
            margin-bottom: 8px;
          }
          .name {
            font-size: 46px;
            font-weight: 900;
            line-height: 1.02;
            color: ${selectedColor.text};
            word-wrap: break-word;
            max-width: 280px;
          }
          .footer {
            position: absolute;
            bottom: 16px;
            left: 24px;
            right: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          .divider {
            flex: 1;
            height: 1px;
            background: linear-gradient(to right, #1E1E1E, ${selectedColor.border});
            opacity: 0.5;
            margin: 0 12px;
          }
          .footer-text {
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: #4E2F10;
          }
          .ritual-text {
            font-weight: 900;
            font-size: 64px;
            line-height: 0.85;
            color: white;
            text-transform: uppercase;
          }
          .ritual-small {
            font-size: 9px;
            font-weight: bold;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: white;
          }
          .bottom-section {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            color: white;
            margin-top: 16px;
          }
          .ritual-logo {
            position: absolute;
            left: -160px;
            top: 50%;
            transform: translateY(-50%);
            width: 120%;
            height: 400%;
            opacity: 0.20;
            pointer-events: none;
            z-index: 10;
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="ticket-left">
            <div style="display: flex; gap: 20px; margin-bottom: auto; align-items: flex-start;">
              <div class="avatar-container">
                ${profile?.avatar ? `<img class="avatar" src="${profile.avatar}" crossOrigin="anonymous">` : ''}
              </div>
              <div style="margin-top: 8px;">
                <div class="username-container">
                  <p class="username">@${profile?.username || 'traveler'}</p>
                </div>
              </div>
            </div>
            <div style="margin-bottom: 24px;">
              <p class="label">AUTHORIZED FORGE ACCESS</p>
              <p class="name">${profile?.displayName || 'Traveler Name'}</p>
            </div>
            <div class="footer">
              <svg class="logo-img" viewBox="0 0 24 14" fill="#4a3600">
                <text x="0" y="12" font-size="12" font-weight="bold">R</text>
              </svg>
              <div class="divider"></div>
              <span class="footer-text">TESTNET</span>
            </div>
          </div>
          <div class="ticket-right">
            <p class="ritual-small" style="margin-top: 20px;">RITUAL.NET</p>
            <div style="margin-top: auto; margin-bottom: auto;">
              <p class="ritual-text">READY</p>
              <p class="ritual-text">FOR</p>
              <p class="ritual-text">TESTNET</p>
            </div>
            <p class="ritual-small" style="margin-top: 8px;">(DO NOT LOSE)</p>
            <div class="bottom-section">
              <span>Day</span>
              <div class="divider"></div>
              <span>01</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Set content and wait for fonts
    await page.setContent(ticketHTML, { waitUntil: 'networkidle0' });

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      omitBackground: true
    });

    // Close page but keep browser alive
    await page.close();

    // Convert to base64
    const base64 = screenshot.toString('base64');
    const imageUrl = `data:image/png;base64,${base64}`;

    console.log('Ticket generated successfully');
    res.json({ imageUrl });

  } catch (error) {
    console.error('Error generating ticket:', error);
    res.status(500).json({
      error: 'Failed to generate ticket',
      details: error.message
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing browser...');
  if (browser) {
    await browser.close();
  }
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
