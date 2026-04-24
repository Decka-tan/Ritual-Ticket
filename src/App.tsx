import React, { useState, useRef, forwardRef, useEffect, Component } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  X,
  ArrowRight,
  Download,
  User,
  Ticket as TicketIcon,
  Loader2,
  Palette,
  Share2,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { toPng } from 'html-to-image';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center text-white">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-[#40FFAF]">Something went wrong</h1>
            <p className="text-white/60">Please refresh the page to continue</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#40FFAF] text-black rounded-full font-black hover:scale-105 transition-transform"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Types
interface PassengerProfile {
  username: string;
  displayName: string;
  avatar: string | null;
  ticketId?: number;
}

type TicketColor = 'gold' | 'silver' | 'cream' | 'green' | 'pink' | 'cyan' | 'orange' | 'purple' | 'blue' | 'red';

interface TicketColors {
  primary: string;
  secondary: string;
  dark: string;
  light: string;
  text: string;
  border: string;
  gradient: string;
}

const ticketColorPalettes: Record<TicketColor, TicketColors> = {
  gold: {
    primary: '#FFD700',
    secondary: '#FFDB25',
    dark: '#6B4F00',
    light: '#FFEA70',
    text: '#3D2B00',
    border: '#b17504',
    gradient: 'linear-gradient(135deg, #F9B502 0%, #B17714 100%)'
  },
  silver: {
    primary: '#C0C0C0',
    secondary: '#D3D3D3',
    dark: '#4A4A4A',
    light: '#E8E8E8',
    text: '#2A2A2A',
    border: '#808080',
    gradient: 'linear-gradient(135deg, #A8A8A8 0%, #6B6B6B 100%)'
  },
  cream: {
    primary: '#FFF8DC',
    secondary: '#FFFAE8',
    dark: '#8B7355',
    light: '#FFFCF5',
    text: '#4A3728',
    border: '#D4C4A8',
    gradient: 'linear-gradient(135deg, #E8DCC8 0%, #B8A88A 100%)'
  },
  green: {
    primary: '#90EE90',
    secondary: '#98FB98',
    dark: '#228B22',
    light: '#B4FFB4',
    text: '#1A4A1A',
    border: '#32CD32',
    gradient: 'linear-gradient(135deg, #7CCD7C 0%, #2E8B2E 100%)'
  },
  pink: {
    primary: '#FFB6C1',
    secondary: '#FFC0CB',
    dark: '#C71585',
    light: '#FFD4DC',
    text: '#4A1A2E',
    border: '#FF69B4',
    gradient: 'linear-gradient(135deg, #FF8FA3 0%, #C71585 100%)'
  },
  cyan: {
    primary: '#00CED1',
    secondary: '#40E0D0',
    dark: '#008B8B',
    light: '#60E5E5',
    text: '#003D3D',
    border: '#20B2AA',
    gradient: 'linear-gradient(135deg, #30D5D5 0%, #008B8B 100%)'
  },
  orange: {
    primary: '#FF8C00',
    secondary: '#FFA500',
    dark: '#CC5500',
    light: '#FFAA33',
    text: '#3D1A00',
    border: '#FF6600',
    gradient: 'linear-gradient(135deg, #FF7700 0%, #CC5500 100%)'
  },
  purple: {
    primary: '#9B59B6',
    secondary: '#A569C7',
    dark: '#6C3483',
    light: '#C39BD3',
    text: '#3B1F4D',
    border: '#7D3C98',
    gradient: 'linear-gradient(135deg, #8E44AD 0%, #6C3483 100%)'
  },
  blue: {
    primary: '#3B82F6',
    secondary: '#60A5FA',
    dark: '#1D4ED8',
    light: '#93C5FD',
    text: '#1E3A8A',
    border: '#2563EB',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
  },
  red: {
    primary: '#EF4444',
    secondary: '#F87171',
    dark: '#B91C1C',
    light: '#FCA5A5',
    text: '#7F1D1D',
    border: '#DC2626',
    gradient: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)'
  }
};

// Components
const Ticket = forwardRef<HTMLDivElement, { profile: PassengerProfile | null; ticketColor?: TicketColor }>(({ profile, ticketColor = 'gold' }, ref) => {
  const colors = ticketColorPalettes[ticketColor];
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 100, damping: 30 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX - rect.width / 2);
    y.set(mouseY - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const leftWidth = 385;
  const rightWidth = 190;
  const totalWidth = leftWidth + rightWidth;
  const dividerPos = leftWidth;
  const cutStart = dividerPos - 16;
  const cutEnd = dividerPos + 16;
  const ticketPath = `M 0 0 L ${cutStart} 0 A 16 16 0 0 0 ${cutEnd} 0 L ${totalWidth} 0 L ${totalWidth} 320 L ${cutEnd} 320 A 16 16 0 1 0 ${cutStart} 320 L 0 320 Z`;

  const ticketStyle = {
    '--ticket-primary': colors.primary,
    '--ticket-secondary': colors.secondary,
    '--ticket-dark': colors.dark,
    '--ticket-light': colors.light,
    '--ticket-text': colors.text,
    '--ticket-border': colors.border,
    '--ticket-gradient': colors.gradient
  } as React.CSSProperties;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, clipPath: `path("${ticketPath}")`, width: `${totalWidth}px`, ...ticketStyle, backgroundColor: colors.primary, borderBottomColor: colors.border }}
      className="perspective-1000 relative h-[320px] flex group select-none rounded-3xl overflow-hidden border-b-6"
      >
      <div className="absolute -inset-4 rounded-3xl opacity-40 pointer-events-none" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(0,0,0,0.3), transparent 70%)', filter: 'blur(20px)', zIndex: -1 }} />
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at ${x.get() + 335}px ${y.get() + 160}px, rgba(255, 255, 255, 1), transparent 60%)` }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] via-[#FFDB25] to-[#FFD700]" style={{ background: `linear-gradient(to bottom right, var(--ticket-primary), var(--ticket-secondary), var(--ticket-primary))` }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [20, -20, 20] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[500px] rounded-full blur-[100px] opacity-70"
          style={{ background: `radial-gradient(circle, var(--ticket-dark)40 0%, transparent 75%)` }}
        />
        <div className="absolute z-10 pointer-events-none" style={{ width: '800px', height: '1800px', left: '-620px', top: '-150px', background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 65%, transparent 100%)', transform: 'rotate(-55.6deg)', transformOrigin: '50% 0%', opacity: 1.0 }} />
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[120%] opacity-[0.20] pointer-events-none z-20 safari-logo-hidden" style={{ height: '400%', maskImage: 'url(/Logo_RItual_Black.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', background: 'var(--ticket-gradient)' }} />
        <img src="/Logo_RItual_Black.png" alt="" className="absolute -left-40 top-1/2 -translate-y-1/2 w-[120%] opacity-[0.20] pointer-events-none z-20 safari-logo-only" style={{ height: '400%', objectFit: 'contain', mixBlendMode: 'multiply' }} crossOrigin="anonymous" />
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none flex items-center justify-center">
          <motion.div initial={{ opacity: 0.1, scale: 0.8 }} animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)' }} />
        </div>
        <div className="absolute top-0 left-[385px] bottom-0 w-[3px] -translate-x-1/2 pointer-events-none opacity-60 z-30" style={{ backgroundImage: `linear-gradient(to bottom, #1E1E1E 0%, ${colors.border} 50%, transparent 50%)`, backgroundSize: '3px 53.3px', backgroundRepeat: 'repeat-y' }} />
      </div>
      <div className="flex-1 h-full relative z-20 flex flex-col pt-5 pb-4 px-6">
        <div className="flex items-start gap-5 mb-auto">
          <div className="relative w-32 h-32 shrink-0">
            <div className="absolute inset-0 rounded-full bg-white translate-y-[3px] z-10" />
            <div className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-[#FFB90A] z-30" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)', maskImage: 'radial-gradient(circle, white 100%, black 100%)', borderColor: 'var(--ticket-light)' }}>
              {profile?.avatar ? ( <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" crossOrigin="anonymous" /> ) : ( <div className="w-full h-full bg-monad-text/5 flex items-center justify-center"> <User className="w-8 h-8 text-monad-text/40" /> </div> )}
            </div>
          </div>
          <div className="mt-2 min-w-0">
            <div className="rounded-full border-[3px] border-[#FFB90A] px-3 py-1.5 bg-transparent backdrop-blur-sm inline-flex items-center max-w-[280px]" style={{ borderColor: 'var(--ticket-light)' }}>
              <p className="font-medium text-sm leading-none tracking-tight ticket-username truncate whitespace-nowrap"> @{profile?.username || 'traveler'} </p>
            </div>
          </div>
        </div>
        <div className="mb-6 pr-10">
          <div className="text-[9px] tracking-widest uppercase font-bold text-[#4E2F10] opacity-80 mb-2">Authorized Forge Access</div>
          <h2 className="text-[2.8rem] font-black tracking-tighter leading-[1.02] mb-1 ticket-display-name overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', maxHeight: '5.7rem' }}> {profile?.displayName || 'Traveler Name'} </h2>
        </div>
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between h-5 text-[#4E2F10]">
          <div className="safari-logo-hidden" style={{ maskImage: 'url(/Logo_RItual_Black.png)', maskSize: 'contain', maskRepeat: 'no-repeat', background: 'var(--ticket-gradient)', width: '24px', height: '14px' }} />
          <img src="/Logo_RItual_Black.png" alt="" className="safari-logo-only" style={{ width: '24px', height: '14px', objectFit: 'contain', filter: 'brightness(0.3) sepia(1) saturate(3) hue-rotate(-10deg)' }} crossOrigin="anonymous" />
          <div className="flex-grow h-[1px] bg-gradient-to-r from-[#1E1E1E] to-[#B17714] opacity-50 mx-3" style={{ background: 'linear-gradient(to right, #1E1E1E, var(--ticket-border))' }} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] ticket-text-metadata font-mono">TESTNET</span>
        </div>
      </div>
      <div className="h-full relative z-20 flex flex-col items-center p-6 text-center border-l-2 border-dashed overflow-hidden rounded-tr-3xl rounded-br-3xl" style={{ width: '190px', borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <div className="absolute top-5 text-[9px] font-black tracking-[0.4em] uppercase ticket-text-metadata font-mono">RITUAL.NET</div>
        <div className="absolute top-[52%] -translate-y-1/2 w-full flex flex-col items-center uppercase text-white">
          <div className="text-4xl font-black tracking-tighter leading-[0.85] ticket-text-gold">READY</div>
          <div className="text-4xl font-black tracking-tighter leading-[0.85] ticket-text-gold">FOR</div>
          <div className="text-4xl font-black tracking-tighter leading-[0.85] ticket-text-gold">TESTNET</div>
          <div className="text-[10px] font-black uppercase tracking-[0.4em] pt-1 ticket-text-metadata font-mono">(DO NOT LOSE)</div>
        </div>
        <div className="absolute bottom-4 left-8 right-8 flex items-center justify-between h-5 h-5 text-white">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] ticket-text-metadata font-mono">Day</span>
          <div className="flex-grow h-[1px] bg-gradient-to-r from-[#1E1E1E] to-[#B17714] opacity-50 mx-3" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] ticket-text-metadata font-mono">01</span>
        </div>
      </div>
    </motion.div>
  );
});

export default function App() {
  const [step, setStep] = useState<'portal' | 'login' | 'confirmation' | 'transitioning' | 'revealed' | 'ticket'>('portal');
  const [handle, setHandle] = useState('');
  const [profile, setProfile] = useState<PassengerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transitionSpeed, setTransitionSpeed] = useState(1);
  const [ticketColor, setTicketColor] = useState<TicketColor>('gold');
  const [savedColor, setSavedColor] = useState<TicketColor>('gold');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showCustomizeWarning, setShowCustomizeWarning] = useState(false);
  const [hasSeenWarning, setHasSeenWarning] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  const resetToPortal = () => {
    setTransitionSpeed(1);
    setIsCustomizing(false);
    setHasSeenWarning(false);
    setStep('portal');
  };

  const handleCustomizeClick = () => {
    if (!hasSeenWarning) {
      setShowCustomizeWarning(true);
    } else {
      setIsCustomizing(true);
    }
  };

  const confirmCustomize = () => {
    setSavedColor(ticketColor);
    setHasSeenWarning(true);
    setShowCustomizeWarning(false);
    setIsCustomizing(true);
  };

  const handleShare = async () => {
    // Auto-download image first
    if (ticketRef.current !== null) {
      const dataUrl = await toPng(ticketRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `golden-ticket-${profile?.username || 'ritual'}.png`;
      link.href = dataUrl;
      link.click();
    }

    // Then open Twitter
    const text = `I am ready for Ritual Testnet, what about yours?\n\nGot my ticket from @decka_chan: http://ticket.decka.my.id/`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    // Notify user to attach image
    setTimeout(() => {
      alert('🎫 Ticket image downloaded! Don\'t forget to attach it to your tweet for maximum impact! ✨');
    }, 1000);
  };

  const fetchProfile = async (username: string) => {
    setIsLoading(true);
    setProfileError(null);

    try {
      const cleanUsername = username.replace('@', '');
      const apiUrl = `https://ritual-twitter-proxy.artelamon.workers.dev/api/twitter/${cleanUsername}?t=${Date.now()}`;

      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error('Profile not found');
      }

      const data = await res.json();

      if (!data || (!data.avatar && !data.displayName)) {
        throw new Error('Profile not found');
      }

      const fetchedProfile = {
        avatar: data?.avatar || null,
        displayName: data?.displayName || cleanUsername,
        username: cleanUsername
      };

      setProfile(fetchedProfile);
      setIsLoading(false);
      setStep('confirmation');
    } catch (error) {
      setIsLoading(false);
      setProfileError('Username not found. Please check and try again.');
    }
  };

  const startTransition = () => {
    setStep('transitioning');
  };

  // Handle transition timing with cleanup
  useEffect(() => {
    if (step !== 'transitioning') return;

    const interval = setInterval(() => {
      setTransitionSpeed(prev => {
        if (prev >= 15) {
          return 15;
        }
        return prev + 1;
      });
    }, 150);

    const timeout = setTimeout(() => {
      setStep('revealed');
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [step]);

  const handleReveal = () => setStep('ticket');

  const handleDownload = async () => {
    if (!profile) return;

    setIsLoading(true);

    try {
      // Create high-resolution canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Ticket dimensions (3x for retina quality)
      const scale = 3;
      const width = 575 * scale;
      const height = 320 * scale;
      canvas.width = width;
      canvas.height = height;

      const colors = ticketColorPalettes[ticketColor];

      // Draw ticket background with gradient
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, colors.primary);
      gradient.addColorStop(0.5, colors.secondary);
      gradient.addColorStop(1, colors.primary);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw ticket shape with cutouts
      ctx.save();
      ctx.beginPath();
      const leftWidth = 385 * scale;
      const cutRadius = 16 * scale;

      // Main ticket shape
      ctx.moveTo(0, 0);
      ctx.lineTo(leftWidth - cutRadius, 0);
      ctx.arc(leftWidth, cutRadius, cutRadius, -Math.PI/2, Math.PI/2);
      ctx.lineTo(leftWidth + cutRadius, 0);
      ctx.lineTo(width, 0);
      ctx.lineTo(width, height);
      ctx.lineTo(leftWidth + cutRadius, height);
      ctx.arc(leftWidth, height - cutRadius, cutRadius, Math.PI/2, -Math.PI/2);
      ctx.lineTo(leftWidth - cutRadius, height);
      ctx.lineTo(0, height);
      ctx.closePath();

      // Clip to ticket shape
      ctx.clip();

      // Draw decorative shimmer
      ctx.save();
      ctx.translate(-620 * scale, -150 * scale);
      ctx.rotate(-55.6 * Math.PI / 180);
      const shimmerGradient = ctx.createLinearGradient(0, 0, 800 * scale, 0);
      shimmerGradient.addColorStop(0, 'transparent');
      shimmerGradient.addColorStop(0.35, 'rgba(255,255,255,0)');
      shimmerGradient.addColorStop(0.5, 'rgba(255,255,255,0.9)');
      shimmerGradient.addColorStop(0.65, 'rgba(255,255,255,0)');
      shimmerGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = shimmerGradient;
      ctx.fillRect(0, 0, 800 * scale, 1800 * scale);
      ctx.restore();

      // Draw ritual logo pattern (subtle)
      ctx.save();
      ctx.globalAlpha = 0.2;
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';

      await new Promise<void>((resolve) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => resolve(); // Continue even if logo fails
        logoImg.src = '/Logo_RItual_Black.png';
      });

      // Draw large background logo
      ctx.save();
      ctx.translate(-40 * scale, height / 2);
      ctx.scale(4, 4);
      ctx.drawImage(logoImg, 0, -logoImg.height / 2, logoImg.width, logoImg.height);
      ctx.restore();

      ctx.restore();

      // Draw user avatar
      const avatarSize = 32 * scale;
      const avatarX = 24 * scale;
      const avatarY = 20 * scale;

      // Avatar background
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2 + 3*scale, avatarSize/2, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      // Avatar circle
      ctx.beginPath();
      ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.save();
      ctx.clip();

      if (profile.avatar) {
        const avatarImg = new Image();
        avatarImg.crossOrigin = 'anonymous';
        await new Promise<void>((resolve) => {
          avatarImg.onload = () => resolve();
          avatarImg.onerror = () => resolve(); // Continue even if avatar fails
          avatarImg.src = profile.avatar;
        });
        ctx.drawImage(avatarImg, avatarX, avatarY, avatarSize, avatarSize);
      } else {
        ctx.fillStyle = '#111';
        ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
      }
      ctx.restore();

      // Draw username badge
      const username = `@${profile.username}`;
      ctx.font = `bold ${12 * scale}px 'Space Mono', monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      // Username background
      const textWidth = ctx.measureText(username).width;
      const badgePadding = 12 * scale;
      const badgeHeight = 24 * scale;
      const badgeX = avatarX + avatarSize + 20 * scale;
      const badgeY = avatarY + 20 * scale;

      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, textWidth + badgePadding * 2, badgeHeight, 12 * scale);
      ctx.strokeStyle = colors.light;
      ctx.lineWidth = 3 * scale;
      ctx.stroke();

      // Username text
      ctx.fillStyle = colors.text;
      ctx.fillText(username, badgeX + badgePadding, badgeY + badgeHeight/2);

      // Draw "Authorized Forge Access" label
      ctx.font = `bold ${9 * scale}px sans-serif`;
      ctx.fillStyle = colors.text;
      ctx.globalAlpha = 0.8;
      ctx.fillText('AUTHORIZED FORGE ACCESS', 24 * scale, 200 * scale);
      ctx.globalAlpha = 1;

      // Draw display name
      const displayName = profile.displayName || 'Traveler Name';
      ctx.font = `900 ${46 * scale}px 'Outfit', sans-serif`;
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'left';

      // Draw text with gradient effect
      const nameGradient = ctx.createLinearGradient(24 * scale, 0, 24 * scale, 250 * scale);
      nameGradient.addColorStop(0, colors.text);
      nameGradient.addColorStop(1, colors.border);
      ctx.fillStyle = nameGradient;

      // Word wrap for long names
      const maxWidth = 280 * scale;
      const words = displayName.split(' ');
      let lineY = 240 * scale;
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine) {
          ctx.fillText(currentLine, 24 * scale, lineY);
          currentLine = word;
          lineY += 50 * scale;
        } else {
          currentLine = testLine;
        }
      }
      ctx.fillText(currentLine, 24 * scale, lineY);

      // Draw footer elements
      const footerY = height - 24 * scale;

      // Small logo
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.drawImage(logoImg, 24 * scale, footerY - 14 * scale, 24 * scale, 14 * scale);
      ctx.restore();

      // Divider line
      ctx.beginPath();
      ctx.moveTo(60 * scale, footerY - 7 * scale);
      ctx.lineTo(515 * scale, footerY - 7 * scale);
      ctx.strokeStyle = '#1E1E1E';
      ctx.lineWidth = 1 * scale;
      ctx.stroke();

      // TESTNET text
      ctx.font = `900 ${10 * scale}px 'Space Mono', monospace`;
      ctx.fillStyle = colors.text;
      ctx.textAlign = 'right';
      ctx.fillText('TESTNET', width - 24 * scale, footerY);

      // Right section divider
      ctx.beginPath();
      ctx.moveTo(385 * scale, 15 * scale);
      ctx.lineTo(385 * scale, height - 15 * scale);
      ctx.setLineDash([6 * scale, 6 * scale]);
      ctx.strokeStyle = `${colors.border}`;
      ctx.lineWidth = 3 * scale;
      ctx.stroke();
      ctx.setLineDash([]);

      // Right section content
      ctx.textAlign = 'center';

      // RITUAL.NET
      ctx.font = `bold ${9 * scale}px sans-serif`;
      ctx.fillStyle = 'white';
      ctx.fillText('RITUAL.NET', 480 * scale, 40 * scale);

      // READY FOR TESTNET
      const readyText = ['READY', 'FOR', 'TESTNET'];
      const readyY = height / 2;
      readyText.forEach((text, i) => {
        ctx.font = `900 ${64 * scale}px 'Outfit', sans-serif`;
        ctx.fillStyle = 'white';
        ctx.fillText(text, 480 * scale, readyY - 40 * scale + (i * 70 * scale));
      });

      // (DO NOT LOSE)
      ctx.font = `bold ${10 * scale}px 'Space Mono', monospace`;
      ctx.fillText('(DO NOT LOSE)', 480 * scale, readyY + 180 * scale);

      // Bottom section
      const bottomY = height - 24 * scale;

      // Day text
      ctx.textAlign = 'left';
      ctx.fillText('Day', 400 * scale, bottomY);

      // Divider
      ctx.beginPath();
      ctx.moveTo(445 * scale, bottomY - 7 * scale);
      ctx.lineTo(545 * scale, bottomY - 7 * scale);
      ctx.strokeStyle = '#1E1E1E';
      ctx.lineWidth = 1 * scale;
      ctx.stroke();

      // 01 text
      ctx.textAlign = 'right';
      ctx.fillText('01', 565 * scale, bottomY);

      ctx.restore();

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          throw new Error('Canvas to blob failed');
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `golden-ticket-${profile.username}.png`;
        link.href = url;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);
        setIsLoading(false);
      }, 'image/png');

    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
      setIsLoading(false);
    }
  };

  const isPortalActive = ['portal', 'login', 'confirmation', 'transitioning'].includes(step);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0A0A0A] selection:bg-[#40FFAF]/30 flex flex-col font-sans overflow-hidden relative">
      {/* PAGE BACKGROUND — static green ambient glow, never changes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #40FFAF 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* PERSISTENT RIPPLE BACKGROUND - FIXED */}
      <AnimatePresence>
        {isPortalActive && (
          <motion.div
            key="ripple-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none flex items-center justify-center"
          >
            {/* Fade to Black Overlay (only during transition) */}
            <motion.div
              animate={{ opacity: step === 'transitioning' ? [0, 0, 1] : 0 }}
              transition={{ duration: 3.5 }}
              className="absolute inset-0 bg-black z-10 pointer-events-none"
            />

            {/* Ritual Enter Video (only during transition) */}
            {step === 'transitioning' && (
              <video
                className="ritual-enter-video"
                autoPlay
                muted
                playsInline
                src="/ritual-enter.mp4"
              />
            )}

            {/* Video Background with Green Color Mask */}
            <video
              className="ritual-video-bg"
              autoPlay
              loop
              muted
              playsInline
              src="/ritual-bg.mp4"
            />

            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-full border border-[#40FFAF]/70 animate-ritual-ripple will-change-transform"
                  style={{
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    width: '8vw',
                    height: '8vw',
                    minWidth: '100px',
                    minHeight: '100px',
                    opacity: 0,
                    animationDelay: `${i * (3.0 / transitionSpeed)}s`,
                    animationDuration: `${12 / transitionSpeed}s`
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SHARED REVEAL VIDEO BACKGROUND - persists across revealed and ticket states */}
      <AnimatePresence>
        {(step === 'revealed' || step === 'ticket') && (
          <motion.div
            key="reveal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'fixed', inset: 0, zIndex: 5, pointerEvents: 'none' }}
          >
            <video
              autoPlay loop muted playsInline
              src="/reveal 2.mp4"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            {/* Left side mask - red to gold */}
            <div className="reveal-mask-left" />
            {/* Right side mask - current green */}
            <div className="reveal-mask-right" />
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col items-center justify-center relative z-10">

        <AnimatePresence mode="wait">
          {step === 'portal' && (
            <motion.div
              key="portal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-20 flex flex-col items-center justify-center text-center space-y-8 px-4 text-white min-h-[60vh]"
            >
              <img src="/Logo_RItual_White.png" alt="Ritual" className="h-25 md:h-25 mb-6" />
              <div className="flex flex-col items-center space-y-1">
                <div className="flex flex-wrap justify-center gap-6">
                  {['Enter', 'the'].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.3, duration: 0.8 }}
                      className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.85]"
                    >
                      {word}
                    </motion.span>
                  ))}
                  <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.85] ritual-green-text"
                  >
                    Ritual
                  </motion.span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mb-6">
                  {['Testnet', 'Portal'].map((word, i) => (
                    <motion.span
                      key={word}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + i * 0.3, duration: 0.8 }}
                      className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.85]"
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.8 }}
                  className="text-white text-lg md:text-xl max-w-md font-medium"
                >
                  Input your X account to discover your ticket
                </motion.p>
              </div>
              <button
                onClick={() => setStep('login')}
                className="mt-10 px-8 py-3 bg-[#40FFAF] text-black rounded-full font-black text-lg tracking-tight hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(64,255,175,0.3)]"
              >
                Sign in
              </button>
            </motion.div>
          )}

          {step === 'login' && (
            <motion.div
              key="login"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[32px] p-10 relative overflow-hidden shadow-2xl"
              >
                <button onClick={() => resetToPortal()} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                <div className="flex flex-col items-center space-y-8">
                  <img src="/ritual-wordmark.png" alt="Ritual" className="h-20 mb-4" />
                  <div className="text-center space-y-2 mt-3  ">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Sign to verify</h3>
                    <p className="text-white/40 text-sm">Input your username X to proceed</p>
                  </div>
                  <div className="w-full relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none"><span className="text-[#40FFAF] font-black font-mono">@</span></div>
                    <input
                      type="text" autoFocus value={handle} onChange={(e) => setHandle(e.target.value)}
                      placeholder="username"
                      onKeyDown={(e) => e.key === 'Enter' && handle && fetchProfile(handle)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 focus:outline-none focus:border-[#40FFAF]/50 transition-all text-white placeholder:text-white/10 font-mono text-lg"
                    />
                  </div>
                  <button
                    onClick={() => handle && fetchProfile(handle)}
                    disabled={isLoading || !handle}
                    className="w-full bg-[#40FFAF] text-black py-5 rounded-2xl font-black text-xl tracking-tight hover:shadow-[0_0_50px_rgba(64,255,175,0.2)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                      <><span>Connecting</span><ArrowRight className="w-6 h-6" /></>
                    )}
                  </button>

                  {/* Error message */}
                  <AnimatePresence>
                    {profileError && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-center"
                      >
                        <p className="text-red-400 font-medium text-sm">{profileError}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === 'confirmation' && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 text-white"
            >
              <div className="w-full max-w-md flex flex-col items-center text-center space-y-10">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-[#40FFAF]/20 blur-2xl group-hover:bg-[#40FFAF]/40 transition-all duration-500" />
                  <div className="relative w-32 h-32 rounded-full border-4 border-[#40FFAF] overflow-hidden shadow-[0_0_50px_rgba(64,255,175,0.3)]">
                    {profile?.avatar ? (
                      <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" crossOrigin="anonymous" />
                    ) : (
                      <div className="w-full h-full bg-[#111] flex items-center justify-center">
                        <User className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-white tracking-tight italic">{profile?.displayName}</h3>
                  <p className="text-[#40FFAF] font-black text-lg">@{profile?.username}</p>
                  <p className="text-white/40 font-bold pt-4 text-xl">Is this really your account?</p>
                </div>
                <div className="flex flex-col w-full gap-4 pt-6">
                  <button onClick={startTransition} className="w-full bg-[#40FFAF] text-black py-6 rounded-2xl font-black text-2xl tracking-tighter hover:shadow-[0_0_60px_rgba(64,255,175,0.4)] transition-all active:scale-95">YES, PROCEED</button>
                  <button onClick={() => setStep('login')} className="w-full bg-white/5 text-white/40 py-4 rounded-2xl font-bold hover:text-white transition-all">No, re-input handle</button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
              className="fixed inset-0 z-10"
            >
              {/* Content Overlay */}
              <div className="relative z-20 w-full h-screen flex flex-col items-center justify-center">
                {/* Typography - positioned at top */}
                <motion.div
                  className="absolute top-30 left-0 right-0 text-center px-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <h1 className="text-white text-lg sm:text-[48px] md:text-[48px] font-medium tracking-tight leading-snug">
                    You've received your <span className="text-[#FFD700] font-bold">Golden Ticket</span> to
                    <br /><span className="text-[#FFD700] font-bold">Day 1</span> of Ritual Testnet.
                  </h1>
                </motion.div>

                {/* Ticket zone - perfectly centered with zoom animation */}
                <motion.div
                  className="relative flex justify-center items-center"
                  style={{ width: '320px', height: '160px' }}
                  initial={{ scale: 8 }}
                  animate={{ scale: window.innerWidth < 768 ? 1 : 2.5 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >

                  {/* Rotating rays */}
                  <div
                    className="absolute pointer-events-none z-0"
                    style={{
                      width: '250px',
                      height: '250px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0) 50%)',
                      WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0) 50%)',
                      opacity: 0.8,
                    }}
                  >
                    <motion.div
                      className="w-full h-full"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                      style={{ background: 'repeating-conic-gradient(from 0deg, transparent 0deg 18deg, #FFD700 1deg 36deg)' }}
                    />
                  </div>

                  {/* Sparkles */}
                  {[
                    { top: '15%', left: '20%', size: 14, delay: 0,   dur: 1.8 },
                    { top: '10%', left: '65%', size: 10, delay: 0.6, dur: 2.1 },
                    { top: '75%', left: '15%', size: 12, delay: 1.2, dur: 1.6 },
                    { top: '70%', left: '70%', size: 16, delay: 0.3, dur: 2.3 },
                    { top: '45%', left: '88%', size: 10, delay: 1.5, dur: 1.9 },
                    { top: '45%', left: '5%',  size: 12, delay: 0.9, dur: 2.0 },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      className="absolute pointer-events-none z-20"
                      style={{ top: s.top, left: s.left, width: s.size, height: s.size, filter: 'drop-shadow(0 0 4px #40FFAF)' }}
                      animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                      transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
                    >
                      <img src="/Logo_RItual_White.png" alt="" className="w-full h-full object-contain" />
                    </motion.div>
                  ))}

                  {/* Ticket */}
                  <motion.div
                    className="relative z-10 transform -rotate-6"
                    style={{ width: '160px', aspectRatio: '2/1' }}
                    animate={{ y: ['-3%', '3%', '-3%'] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <svg width="80%" height="100%" viewBox="0 0 360 180" preserveAspectRatio="none" className="drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] block mx-auto">
                      <defs>
                        <linearGradient id="goldGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#fff5cc" />
                          <stop offset="25%" stopColor="#f8d648" />
                          <stop offset="50%" stopColor="#f5c518" />
                          <stop offset="100%" stopColor="#c39d10" />
                        </linearGradient>
                      </defs>
                      <path d="M 12,0 L 348,0 A 12,12 0 0,1 360,12 L 360,16 A 7,8 0 0,0 360,32 A 7,8 0 0,1 360,48 A 7,8 0 0,0 360,64 A 7,8 0 0,1 360,80 A 7,8 0 0,0 360,96 A 7,8 0 0,1 360,112 A 7,8 0 0,0 360,128 A 7,8 0 0,1 360,144 A 7,8 0 0,0 360,160 L 360,168 A 12,12 0 0,1 348,180 L 12,180 A 12,12 0 0,1 0,168 L 0,160 A 7,8 0 0,0 0,144 A 7,8 0 0,1 0,128 A 7,8 0 0,0 0,112 A 7,8 0 0,1 0,96 A 7,8 0 0,0 0,80 A 7,8 0 0,1 0,64 A 7,8 0 0,0 0,48 A 7,8 0 0,1 0,32 A 7,8 0 0,0 0,16 L 0,12 A 12,12 0 0,1 12,0 Z" fill="url(#goldGradient3)" />
                      <line x1="280" y1="15" x2="280" y2="165" stroke="#b08d0b" strokeWidth="2" strokeDasharray="6 6" opacity="0.8"/>
                      <path d="M 15,15 L 345,15 L 345,16 A 7,8 0 0,0 345,32 A 7,8 0 0,1 345,48 A 7,8 0 0,0 345,64 A 7,8 0 0,1 345,80 A 7,8 0 0,0 345,96 A 7,8 0 0,1 345,112 A 7,8 0 0,0 345,128 A 7,8 0 0,1 345,144 A 7,8 0 0,0 345,160 L 345,165 L 15,165 L 15,160 A 7,8 0 0,0 15,144 A 7,8 0 0,1 15,128 A 7,8 0 0,0 15,112 A 7,8 0 0,1 15,96 A 7,8 0 0,0 15,80 A 7,8 0 0,1 15,64 A 7,8 0 0,0 15,48 A 7,8 0 0,1 15,32 A 7,8 0 0,0 15,16 L 15,15 Z" fill="none" stroke="#a67c00" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col justify-start pt-3 pl-2 pointer-events-none text-left">
                      <div className="font-bold tracking-widest text-[#4a3600] text-sm leading-none ml-5">RITUAL</div>
                      <div className="font-mono font-bold tracking-wider text-[#5a4200] text-[10px] leading-none mt-5 ml-5">DAY 01</div>
                      <div className="font-mono font-bold tracking-wider text-[#5a4200] text-[10px] leading-none mt-[2px] ml-5">TESTNET</div>
                      <div className="absolute bottom-3 right-13 w-4 h-4 text-[#4a3600]">
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Button - positioned at bottom */}
                <div className="absolute bottom-40 left-0 right-0 flex justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3, duration: 0.5 }}
                  >
                    <button onClick={handleReveal} className="px-7 py-3 bg-[#FFD700] text-[#3D2B00] rounded-xl font-black text-sm tracking-wide hover:shadow-[0_0_50px_rgba(255,215,0,0.4)] transition-all flex items-center gap-2 active:scale-[0.98]">
                      <span>VIEW TICKET</span><TicketIcon className="w-4 h-4" />
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'ticket' && (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="fixed inset-0 z-10"
            >
              <div className="relative z-20 h-screen flex flex-col items-center justify-center gap-8 px-4">
                <div className="absolute top-8 left-0 right-0 flex justify-center">
                  <img src="/ritual-wordmark.png" alt="Ritual" className="h-15 object-contain" />
                </div>

                <div className="mobile-ticket-scale">
                  <Ticket ref={ticketRef} profile={profile} ticketColor={ticketColor} />
                </div>

                {/* Bottom section */}
                <AnimatePresence mode="wait">
                  {!isCustomizing ? (
                    <motion.div
                      key="main-buttons"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-3 flex-wrap justify-center"
                    >
                      {[
                        { label: 'Customize', icon: <Palette className="w-4 h-4" />,  onClick: handleCustomizeClick },
                        { label: 'Share',     icon: <Share2 className="w-4 h-4" />,   onClick: handleShare },
                        { label: 'Download',  icon: <Download className="w-4 h-4" />, onClick: handleDownload },
                        { label: 'Back',      icon: <ArrowLeft className="w-4 h-4" />, onClick: () => setStep('revealed') },
                      ].map(({ label, icon, onClick }) => (
                        <button
                          key={label}
                          onClick={onClick}
                          className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 font-bold text-sm tracking-wide hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
                        >
                          {icon}<span>{label}</span>
                        </button>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="customize-mode"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -30, scale: 0.9 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-col items-center gap-5"
                    >
                      {/* Color swatches */}
                      <div className="flex items-center gap-3 flex-wrap max-w-[200px] sm:max-w-none justify-center">
                        {(Object.keys(ticketColorPalettes) as TicketColor[]).map((color) => (
                          <button
                            key={color}
                            onClick={() => setTicketColor(color)}
                            className="relative w-9 h-9 rounded-full transition-transform hover:scale-110 active:scale-95"
                            style={{ backgroundColor: ticketColorPalettes[color].primary }}
                            title={color.charAt(0).toUpperCase() + color.slice(1)}
                          >
                            {ticketColor === color && (
                              <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-black ring-white pointer-events-none" />
                            )}
                          </button>
                        ))}
                      </div>
                      {/* Customize sub-buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setSavedColor(ticketColor); setIsCustomizing(false); }}
                          className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 font-bold text-sm tracking-wide hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" /><span>Save</span>
                        </button>
                        <button
                          onClick={() => { setTicketColor(savedColor); setIsCustomizing(false); }}
                          className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 font-bold text-sm tracking-wide hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
                        >
                          <ArrowLeft className="w-4 h-4" /><span>Back</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Customize Warning Modal */}
              <AnimatePresence>
                {showCustomizeWarning && (
                  <motion.div
                    key="warning"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 16 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 16 }}
                      className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center space-y-5"
                    >
                      <div className="text-5xl">🎫</div>
                      <div className="space-y-2">
                        <h3 className="text-white font-black text-xl tracking-tight">Heads up</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                          Once you customize your ticket, your Golden Ticket won't be gold anymore. It's gone. Forever. Well, unless you pick gold again lol
                        </p>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button
                          onClick={() => setShowCustomizeWarning(false)}
                          className="flex-1 py-3 rounded-xl border border-white/10 text-white/40 font-bold text-sm hover:text-white hover:border-white/30 transition-all"
                        >
                          Keep gold
                        </button>
                        <button
                          onClick={confirmCustomize}
                          className="flex-1 py-3 rounded-xl bg-white text-black font-black text-sm hover:bg-white/90 transition-all"
                        >
                          Let's go →
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
    </ErrorBoundary>
  );
}
