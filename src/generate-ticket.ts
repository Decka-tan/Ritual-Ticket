// Cloudflare Worker for server-side ticket rendering
export interface Env {
  BROWSER_BINDING: any;
}

interface TicketRequest {
  profile: {
    username: string;
    displayName: string;
    avatar?: string;
  };
  ticketColor?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const { profile }: TicketRequest = await request.json();

      if (!profile) {
        return new Response(JSON.stringify({ error: 'Profile data required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Use Cloudflare Browser Rendering API
      const browser = env.BROWSER_BINDING;

      const page = await browser.newPage();

      // Set viewport for high quality
      await page.setViewport({ width: 575, height: 320, deviceScaleFactor: 2 });

      // Create ticket HTML
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
              background: linear-gradient(135deg, #FFD700 0%, #FFDB25 50%, #FFD700 100%);
            }
            .ticket-left {
              flex: 1;
              padding: 20px 24px 16px 24px;
              position: relative;
            }
            .ticket-right {
              width: 190px;
              border-left: 2px dashed rgba(0, 0, 0, 0.1);
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
              border: 3px solid #FFEA70;
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
              font-weight: bold;
              color: #3D2B00;
              line-height: 1.5;
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
              color: #3D2B00;
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
            .logo-img {
              width: 24px;
              height: 14px;
            }
            .divider {
              flex: 1;
              height: 1px;
              background: linear-gradient(to right, #1E1E1E, #B17714);
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
                  <p class="username">@${profile?.username || 'traveler'}</p>
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

      // Convert to base64
      const base64 = screenshot.toString('base64');
      const imageUrl = `data:image/png;base64,${base64}`;

      return new Response(JSON.stringify({ imageUrl }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to generate ticket' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  },
};
