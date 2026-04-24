#!/bin/bash

# One-time setup for Ritual Ticket Server on VPS
# Run this ONCE on your VPS: curl -s https://raw.githubusercontent.com/Decka-tan/Ritual-Ticket/main/vps-setup.sh | bash

echo "🚀 Setting up Ritual Ticket Server..."

# Install Node.js
if ! command -v node &> /dev/null; then
  echo "📦 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
fi

# Install Git
if ! command -v git &> /dev/null; then
  echo "📦 Installing Git..."
  apt-get install -y git
fi

# Clone repository
if [ ! -d ~/ritual-ticket-server ]; then
  echo "📥 Cloning repository..."
  git clone https://github.com/Decka-tan/Ritual-Ticket.git ~/ritual-ticket-server
fi

cd ~/ritual-ticket-server

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production express puppeteer cors

# Install Chromium for Puppeteer
echo "📦 Installing Chromium..."
apt-get update -qq
apt-get install -y -qq \
  ca-certificates \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libatspi2.0-0 \
  libcups2 \
  libdbus-1-3 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libwayland-client0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxkbcommon0 \
  libxrandr2 \
  xdg-utils

# Configure firewall
echo "🔥 Configuring firewall..."
if command -v ufw &> /dev/null; then
  ufw allow 22/tcp    # SSH
  ufw allow 3001/tcp  # API server
  ufw allow 80/tcp    # HTTP
  ufw allow 443/tcp   # HTTPS
fi

# Create systemd service
echo "⚙️ Creating systemd service..."
cat > /etc/systemd/system/ritual-ticket.service << 'EOF'
[Unit]
Description=Ritual Ticket Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/ritual-ticket-server
ExecStart=/usr/bin/node /root/ritual-ticket-server/server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3001

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
echo "🚀 Starting service..."
systemctl daemon-reload
systemctl enable ritual-ticket
systemctl start ritual-ticket

# Wait for service to start
sleep 3

# Check status
if systemctl is-active --quiet ritual-ticket; then
  echo "✅ Setup complete!"
  echo ""
  echo "🌐 Server running on: http://$(hostname -I | awk '{print $1}'):3001"
  echo ""
  echo "🔄 To update later:"
  echo "   cd ~/ritual-ticket-server && git pull && systemctl restart ritual-ticket"
  echo ""
  echo "📊 View logs:"
  echo "   journalctl -u ritual-ticket -f"
else
  echo "❌ Service failed to start. Check logs:"
  echo "   journalctl -u ritual-ticket -n 50"
fi
