import React, { useState, useRef, forwardRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  X,
  ArrowRight,
  Download,
  User,
  Ticket as TicketIcon,
  Loader2,
  Share2,
} from 'lucide-react';
import { toPng } from 'html-to-image';

interface PassengerProfile {
  username: string;
  displayName: string;
  avatar: string | null;
  ticketId?: number;
}

interface TicketTheme {
  id: string;
  label: string;
  swatch: string;
  main: string;
  dark: string;
  medium: string;
  text: string;
  shadow: string;
  displayFrom: string;
  displayTo: string;
  metaFrom: string;
  metaTo: string;
}

const THEMES: TicketTheme[] = [
  { id: 'gold',     label: 'Gold',     swatch: '#FFD700', main: '#FFD700', dark: '#b17504', medium: '#FFB90A', text: '#4E2F10', shadow: 'rgba(255,245,185,1)', displayFrom: 'rgb(30,30,30)',  displayTo: 'rgb(204,133,0)',  metaFrom: '#E6A701', metaTo: '#4E2F10' },
  { id: 'silver',   label: 'Silver',   swatch: '#C0C0C0', main: '#D4D4D4', dark: '#686868', medium: '#AAAAAA', text: '#1A1A1A', shadow: 'rgba(230,230,230,1)', displayFrom: 'rgb(20,20,20)',  displayTo: 'rgb(100,100,100)', metaFrom: '#555555', metaTo: '#111111' },
  { id: 'emerald',  label: 'Emerald',  swatch: '#00C896', main: '#00C896', dark: '#007A5C', medium: '#00E0A8', text: '#003D2F', shadow: 'rgba(180,255,225,1)', displayFrom: 'rgb(0,40,30)',   displayTo: 'rgb(0,160,110)', metaFrom: '#007A5C', metaTo: '#002010' },
  { id: 'rose',     label: 'Rose',     swatch: '#FF6B9D', main: '#FF6B9D', dark: '#B02060', medium: '#FF90B8', text: '#4A0020', shadow: 'rgba(255,200,220,1)', displayFrom: 'rgb(60,0,20)',   displayTo: 'rgb(190,50,100)', metaFrom: '#CC3070', metaTo: '#4A0020' },
  { id: 'sapphire', label: 'Sapphire', swatch: '#4FC3F7', main: '#4FC3F7', dark: '#0277BD', medium: '#81D4FA', text: '#01579B', shadow: 'rgba(180,230,255,1)', displayFrom: 'rgb(1,40,80)',   displayTo: 'rgb(30,130,200)', metaFrom: '#0277BD', metaTo: '#012A4C' },
  { id: 'amethyst', label: 'Amethyst', swatch: '#CE93D8', main: '#CE93D8', dark: '#7B1FA2', medium: '#E1BEE7', text: '#3A0069', shadow: 'rgba(220,180,255,1)', displayFrom: 'rgb(40,0,70)',   displayTo: 'rgb(140,50,180)', metaFrom: '#7B1FA2', metaTo: '#280045' },
];

const fetchTwitterProfile = async (username: string) => {
  try {
    const cleanUsername = username.replace('@', '');
    const apiUrl = `https://ritual-twitter-proxy.artelamon.workers.dev/api/twitter/${cleanUsername}?t=${Date.now()}`;
    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      return { avatar: data?.avatar || null, displayName: data?.displayName || cleanUsername, username: cleanUsername };
    }
  } catch (error) {
    console.warn('Profile fetch failed:', error);
  }
  const cleanUsername = username.replace('@', '');
  return { avatar: null, displayName: cleanUsername, username: cleanUsername };
};

const Ticket = forwardRef<HTMLDivElement, { profile: PassengerProfile | null; theme: TicketTheme }>(({ profile, theme }, ref) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [8, -8]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-8, 8]), { stiffness: 100, damping: 30 });

  function handleMouse(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }
  function handleMouseLeave() { x.set(0); y.set(0); }

  const leftWidth = 385;
  const rightWidth = 190;
  const totalWidth = leftWidth + rightWidth;
  const cutStart = leftWidth - 16;
  const cutEnd = leftWidth + 16;
  const ticketPath = `M 0 0 L ${cutStart} 0 A 16 16 0 0 0 ${cutEnd} 0 L ${totalWidth} 0 L ${totalWidth} 320 L ${cutEnd} 320 A 16 16 0 1 0 ${cutStart} 320 L 0 320 Z`;

  const gradStyle = (from: string, to: string): React.CSSProperties => ({
    background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  } as React.CSSProperties);

  const metaStyle: React.CSSProperties = {
    ...gradStyle(theme.metaFrom, theme.metaTo),
    paddingRight: '0.15em',
    paddingBottom: '0.15em',
  };

  const displayNameStyle: React.CSSProperties = {
    background: `linear-gradient(${theme.displayFrom} 0%, ${theme.displayTo} 92.55%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    filter: `drop-shadow(${theme.shadow} 0px 3px 0px)`,
    fontWeight: 900,
    paddingRight: '0.1em',
    paddingBottom: '0.1em',
  } as React.CSSProperties;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, clipPath: `path("${ticketPath}")`, width: `${totalWidth}px`, backgroundColor: theme.main, borderBottomColor: theme.dark }}
      className="perspective-1000 relative h-[320px] flex group select-none shadow-[0_40px_80px_rgba(0,0,0,0.6)] rounded-3xl overflow-hidden border-b-6"
    >
      {/* Hover shimmer */}
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at ${x.get() + 335}px ${y.get() + 160}px, rgba(255,255,255,1), transparent 60%)` }}
      />

      {/* Background layers */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${theme.main} 0%, ${theme.medium} 50%, ${theme.main} 100%)` }} />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [20, -20, 20] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[500px] rounded-full blur-[100px] opacity-70"
          style={{ background: `radial-gradient(circle, ${theme.medium} 0%, transparent 75%)` }}
        />
        {/* Shimmer band */}
        <div className="absolute z-10 pointer-events-none" style={{ width: '800px', height: '1800px', left: '-620px', top: '-150px', background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 65%, transparent 100%)', transform: 'rotate(-55.6deg)', transformOrigin: '50% 0%' }} />
        {/* Watermark logo */}
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[120%] opacity-[0.20] pointer-events-none z-20" style={{ height: '400%', maskImage: 'url(/Logo_RItual_Black.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', background: `linear-gradient(135deg, ${theme.main} 0%, ${theme.dark} 100%)` }} />
        {/* Pulse glow */}
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none flex items-center justify-center">
          <motion.div initial={{ opacity: 0.1, scale: 0.8 }} animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} className="w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)' }} />
        </div>
        {/* Dashed divider */}
        <div className="absolute top-0 left-[385px] bottom-0 w-[3px] -translate-x-1/2 pointer-events-none opacity-60 z-30" style={{ backgroundImage: `linear-gradient(to bottom, ${theme.dark} 0%, ${theme.dark} 50%, transparent 50%)`, backgroundSize: '3px 53.3px', backgroundRepeat: 'repeat-y' }} />
      </div>

      {/* LEFT PANEL */}
      <div className="flex-1 h-full relative z-20 flex flex-col pt-5 pb-4 px-6">
        <div className="flex items-start gap-5 mb-auto">
          <div className="relative w-32 h-32 shrink-0">
            <div className="absolute inset-0 rounded-full bg-white translate-y-[3px] z-10" />
            <div className="absolute inset-0 rounded-full overflow-hidden border-[3px] z-30" style={{ borderColor: theme.medium, WebkitMaskImage: '-webkit-radial-gradient(white, black)', maskImage: 'radial-gradient(circle, white 100%, black 100%)' }}>
              {profile?.avatar
                ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" crossOrigin="anonymous" />
                : <div className="w-full h-full bg-black/5 flex items-center justify-center"><User className="w-8 h-8 text-black/40" /></div>
              }
            </div>
          </div>
          <div className="mt-2 min-w-0">
            <div className="rounded-full border-[3px] px-3 py-1.5 bg-transparent backdrop-blur-sm inline-flex items-center max-w-[280px]" style={{ borderColor: theme.medium }}>
              <p className="font-medium text-sm leading-none tracking-tight truncate whitespace-nowrap font-mono" style={{ ...gradStyle(theme.metaTo, theme.dark), paddingRight: '0.1em', paddingBottom: '0.1em' }}>
                @{profile?.username || 'traveler'}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-6 pr-10">
          <div className="text-[9px] tracking-widest uppercase font-bold opacity-80 mb-2" style={{ color: theme.text }}>Authorized Forge Access</div>
          <h2 className="text-[2.8rem] tracking-tighter leading-[1.02] mb-1 line-clamp-2" style={displayNameStyle}>
            {profile?.displayName || 'Traveler Name'}
          </h2>
        </div>
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between h-5">
          <div style={{ maskImage: 'url(/Logo_RItual_Black.png)', maskSize: 'contain', maskRepeat: 'no-repeat', background: `linear-gradient(135deg, ${theme.main} 0%, ${theme.dark} 100%)`, width: '24px', height: '14px' }} />
          <div className="flex-grow h-[1px] opacity-50 mx-3" style={{ background: `linear-gradient(to right, ${theme.dark}, ${theme.medium})` }} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono" style={metaStyle}>TESTNET</span>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={{ width: '190px' }} className="h-full relative z-20 flex flex-col items-center p-6 text-center border-l-2 border-white/5 overflow-hidden rounded-tr-3xl rounded-br-3xl">
        <div className="absolute top-5 text-[9px] font-black tracking-[0.4em] uppercase font-mono" style={metaStyle}>RITUAL.NET</div>
        <div className="absolute top-[52%] -translate-y-1/2 w-full flex flex-col items-center uppercase">
          {['READY', 'FOR', 'TESTNET'].map(word => (
            <div key={word} className="text-4xl font-black tracking-tighter leading-[0.85]" style={{ ...gradStyle(theme.metaFrom, theme.metaTo), filter: `drop-shadow(${theme.shadow} 0px 2px 0px)`, paddingRight: '0.15em', paddingBottom: '0.15em' }}>{word}</div>
          ))}
          <div className="text-[10px] font-black uppercase tracking-[0.4em] pt-1 font-mono" style={metaStyle}>(DO NOT LOSE)</div>
        </div>
        <div className="absolute bottom-4 left-8 right-8 flex items-center justify-between h-5">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono" style={metaStyle}>Day</span>
          <div className="flex-grow h-[1px] opacity-50 mx-3" style={{ background: `linear-gradient(to right, ${theme.dark}, ${theme.medium})` }} />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono" style={metaStyle}>01</span>
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
  const [ticketTheme, setTicketTheme] = useState<TicketTheme>(THEMES[0]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  const resetToPortal = () => {
    setTransitionSpeed(1);
    setIsCustomizing(false);
    setStep('portal');
  };

  const fetchProfile = async (username: string) => {
    setIsLoading(true);
    const fetchedProfile = await fetchTwitterProfile(username);
    setProfile(fetchedProfile);
    setIsLoading(false);
    setStep('confirmation');
  };

  const startTransition = () => {
    setStep('transitioning');
    const interval = setInterval(() => {
      setTransitionSpeed(prev => {
        if (prev >= 15) { clearInterval(interval); return 15; }
        return prev + 1;
      });
    }, 150);
    setTimeout(() => setStep('revealed'), 4000);
  };

  const handleReveal = () => setStep('ticket');

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    const dataUrl = await toPng(ticketRef.current, { cacheBust: true, pixelRatio: 3 });
    const link = document.createElement('a');
    link.download = `ritual-ticket-${profile?.username || 'anon'}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    const text = `I got my Golden Ticket to Ritual Testnet Day 1! @ritual_net`;
    if (navigator.share) {
      await navigator.share({ title: 'Ritual Testnet Ticket', text, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.href}`);
    }
  };

  const isPortalActive = ['portal', 'login', 'confirmation', 'transitioning'].includes(step);

  return (
    <div className="min-h-screen bg-[#0A0A0A] selection:bg-[#BAFF00]/30 flex flex-col font-sans overflow-hidden relative">
      {/* PAGE BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #BAFF00 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      {/* RIPPLE BACKGROUND */}
      <AnimatePresence>
        {isPortalActive && (
          <motion.div key="ripple-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="fixed inset-0 z-0 bg-black overflow-hidden pointer-events-none flex items-center justify-center">
            <motion.div animate={{ opacity: step === 'transitioning' ? [0, 0, 1] : 0 }} transition={{ duration: 3.5 }} className="absolute inset-0 bg-black z-10 pointer-events-none" />
            {step === 'transitioning' && (
              <video className="ritual-enter-video" autoPlay muted playsInline src="/ritual-enter.mp4" />
            )}
            <video className="ritual-video-bg" autoPlay loop muted playsInline src="/ritual-bg.mp4" />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-full border border-[#BAFF00]/70 animate-ritual-ripple will-change-transform" style={{ position: 'fixed', left: '50%', top: '50%', width: '8vw', height: '8vw', minWidth: '100px', minHeight: '100px', opacity: 0, animationDelay: `${i * (3.0 / transitionSpeed)}s`, animationDuration: `${12 / transitionSpeed}s` }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">

          {/* PORTAL */}
          {step === 'portal' && (
            <motion.div key="portal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-20 flex flex-col items-center justify-center text-center space-y-8 px-4 text-white min-h-[60vh]">
              <img src="/Logo_RItual_White.png" alt="Ritual" className="h-25 md:h-25 mb-6" />
              <div className="flex flex-col items-center space-y-1">
                <div className="flex flex-wrap justify-center gap-6">
                  {['Enter', 'the'].map((word, i) => (
                    <motion.span key={word} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.3, duration: 0.8 }} className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.85]">{word}</motion.span>
                  ))}
                  <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.85] ritual-green-text">Ritual</motion.span>
                </div>
                <div className="flex flex-wrap justify-center gap-6 mb-6">
                  {['Testnet', 'Portal'].map((word, i) => (
                    <motion.span key={word} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.3, duration: 0.8 }} className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.85]">{word}</motion.span>
                  ))}
                </div>
                <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }} className="text-white text-lg md:text-xl max-w-md font-medium">Input your X account to discover your ticket</motion.p>
              </div>
              <button onClick={() => setStep('login')} className="mt-10 px-8 py-3 bg-[#BAFF00] text-black rounded-full font-black text-lg tracking-tight hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(186,255,0,0.3)]">Sign in</button>
            </motion.div>
          )}

          {/* LOGIN */}
          {step === 'login' && (
            <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 text-white">
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-[32px] p-10 relative overflow-hidden shadow-2xl">
                <button onClick={() => resetToPortal()} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                <div className="flex flex-col items-center space-y-8">
                  <img src="/Logo_RItual_White.png" alt="Ritual" className="h-20 mb-4" />
                  <div className="text-center space-y-2 mt-3">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Sign to verify</h3>
                    <p className="text-white/40 text-sm">Input your username X to proceed</p>
                  </div>
                  <div className="w-full relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none"><span className="text-[#BAFF00] font-black font-mono">@</span></div>
                    <input type="text" autoFocus value={handle} onChange={(e) => setHandle(e.target.value)} placeholder="username" onKeyDown={(e) => e.key === 'Enter' && handle && fetchProfile(handle)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 focus:outline-none focus:border-[#BAFF00]/50 transition-all text-white placeholder:text-white/10 font-mono text-lg" />
                  </div>
                  <button onClick={() => handle && fetchProfile(handle)} disabled={isLoading || !handle} className="w-full bg-[#BAFF00] text-black py-5 rounded-2xl font-black text-xl tracking-tight hover:shadow-[0_0_50px_rgba(186,255,0,0.2)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]">
                    {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : <><span>Connecting</span><ArrowRight className="w-6 h-6" /></>}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* CONFIRMATION */}
          {step === 'confirmation' && (
            <motion.div key="confirmation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 text-white">
              <div className="w-full max-w-md flex flex-col items-center text-center space-y-10">
                <div className="relative group">
                  <div className="absolute inset-0 rounded-full bg-[#BAFF00]/20 blur-2xl group-hover:bg-[#BAFF00]/40 transition-all duration-500" />
                  <div className="relative w-32 h-32 rounded-full border-4 border-[#BAFF00] overflow-hidden shadow-[0_0_50px_rgba(186,255,0,0.3)]">
                    {profile?.avatar ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" crossOrigin="anonymous" /> : <div className="w-full h-full bg-[#111] flex items-center justify-center"><User className="w-12 h-12 text-white/20" /></div>}
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-white tracking-tight italic">{profile?.displayName}</h3>
                  <p className="text-[#BAFF00] font-black text-lg">@{profile?.username}</p>
                  <p className="text-white/40 font-bold pt-4 text-xl">Is this really your account?</p>
                </div>
                <div className="flex flex-col w-full gap-4 pt-6">
                  <button onClick={startTransition} className="w-full bg-[#BAFF00] text-black py-6 rounded-2xl font-black text-2xl tracking-tighter hover:shadow-[0_0_60px_rgba(186,255,0,0.4)] transition-all active:scale-95">YES, PROCEED</button>
                  <button onClick={() => setStep('login')} className="w-full bg-white/5 text-white/40 py-4 rounded-2xl font-bold hover:text-white transition-all">No, re-input handle</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* REVEALED */}
          {step === 'revealed' && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }} className="relative z-10 w-full flex flex-col items-center justify-center text-center gap-6 py-4 px-4 text-white">
              <h1 className="text-white text-lg sm:text-xl md:text-2xl font-medium tracking-tight leading-snug">
                You've received your <span className="text-[#FFD700] font-bold">Golden Ticket</span> to
                <br /><span className="text-[#FFD700] font-bold">Day 1</span> of Ritual Testnet.
              </h1>
              <div className="relative flex justify-center items-center" style={{ width: '320px', height: '160px' }}>
                <motion.div className="relative z-10 transform -rotate-6" style={{ width: '160px', aspectRatio: '2/1' }} animate={{ y: ['-3%', '3%', '-3%'] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
                  <div className="absolute pointer-events-none z-[-1]" style={{ inset: '-70%', maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0) 60%)', WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0) 60%)', opacity: 0.6, mixBlendMode: 'screen' }}>
                    <motion.div className="w-full h-full" animate={{ rotate: [0, 360] }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }} style={{ background: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, #FFD700 10deg 20deg)' }} />
                  </div>
                  <motion.div className="absolute rounded-full pointer-events-none z-[-1]" style={{ inset: '-60%', background: 'radial-gradient(circle, rgba(255,215,0,0.55) 0%, transparent 65%)', filter: 'blur(16px)' }} animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                  <svg width="100%" height="100%" viewBox="0 0 360 180" preserveAspectRatio="none" className="drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                    <defs>
                      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fff5cc" />
                        <stop offset="25%" stopColor="#f8d648" />
                        <stop offset="50%" stopColor="#f5c518" />
                        <stop offset="100%" stopColor="#c39d10" />
                      </linearGradient>
                    </defs>
                    <path d="M 12,0 L 348,0 A 12,12 0 0,1 360,12 L 360,65 A 25,25 0 0,0 360,115 L 360,168 A 12,12 0 0,1 348,180 L 12,180 A 12,12 0 0,1 0,168 L 0,115 A 25,25 0 0,0 0,65 L 0,12 A 12,12 0 0,1 12,0 Z" fill="url(#goldGradient)" />
                    <line x1="280" y1="10" x2="280" y2="170" stroke="#b08d0b" strokeWidth="2" strokeDasharray="6 6" opacity="0.8" />
                    <path d="M 15,15 L 345,15 L 345,65 A 25,25 0 0,0 345,115 L 345,165 L 15,165 L 15,115 A 25,25 0 0,0 15,65 Z" fill="none" stroke="#a67c00" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col justify-start pt-3 pl-4 pointer-events-none text-left">
                    <div className="font-bold tracking-widest text-[#4a3600] text-sm leading-none">RITUAL</div>
                    <div className="font-mono font-bold tracking-wider text-[#5a4200] text-[10px] leading-none mt-[3px]">DAY 01</div>
                    <div className="font-mono font-bold tracking-wider text-[#5a4200] text-[10px] leading-none mt-[2px]">TESTNET</div>
                    <div className="absolute bottom-3 right-14 w-4 h-4 text-[#4a3600]">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    </div>
                  </div>
                </motion.div>
                {[
                  { top: '-30%', left: '4%',   size: 18, delay: 0,   dur: 2.0 },
                  { top: '-20%', right: '6%',  size: 22, delay: 1.2, dur: 2.5 },
                  { top: '40%',  left: '-8%',  size: 16, delay: 0.7, dur: 2.0 },
                  { top: '40%',  right: '-8%', size: 16, delay: 1.8, dur: 2.2 },
                  { top: '110%', left: '12%',  size: 18, delay: 0.4, dur: 2.3 },
                  { top: '110%', right: '12%', size: 14, delay: 1.6, dur: 1.8 },
                ].map((s, i) => (
                  <motion.div key={i} className="absolute pointer-events-none z-20" style={{ top: s.top, left: (s as any).left, right: (s as any).right, width: s.size, height: s.size, filter: 'drop-shadow(0 0 6px #BAFF00)' }} animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }} transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}>
                    <img src="/Logo_RItual_White.png" alt="" className="w-full h-full object-contain" />
                  </motion.div>
                ))}
              </div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 0.5 }}>
                <button onClick={handleReveal} className="px-7 py-3 bg-[#FFD700] text-[#3D2B00] rounded-xl font-black text-sm tracking-wide hover:shadow-[0_0_50px_rgba(255,215,0,0.4)] transition-all flex items-center gap-2 active:scale-[0.98]">
                  <span>VIEW TICKET</span><TicketIcon className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* TICKET */}
          {step === 'ticket' && (
            <motion.div key="ticket" initial={{ opacity: 0, scale: 0.8, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="flex flex-col items-center gap-8">
              <Ticket ref={ticketRef} profile={profile} theme={ticketTheme} />

              {/* Action buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsCustomizing(v => !v)}
                  className={`px-5 py-2.5 rounded-xl border font-bold text-sm tracking-wide transition-all ${isCustomizing ? 'border-white/30 text-white bg-white/10' : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'}`}
                >
                  Customize
                </button>
                <button onClick={handleDownload} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 font-bold text-sm tracking-wide hover:text-white hover:border-white/30 transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" /><span>Save</span>
                </button>
                <button onClick={handleShare} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 font-bold text-sm tracking-wide hover:text-white hover:border-white/30 transition-all flex items-center gap-2">
                  <Share2 className="w-4 h-4" /><span>Share</span>
                </button>
                <button onClick={() => resetToPortal()} className="px-5 py-2.5 rounded-xl border border-white/10 text-white/50 font-bold text-sm tracking-wide hover:text-white hover:border-white/30 transition-all">
                  Check Another
                </button>
              </div>

              {/* Color picker */}
              <AnimatePresence>
                {isCustomizing && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="flex items-center gap-3">
                    {THEMES.map(t => (
                      <button key={t.id} onClick={() => setTicketTheme(t)} title={t.label} className="relative w-8 h-8 rounded-full transition-transform hover:scale-110 active:scale-95" style={{ background: t.swatch }}>
                        {ticketTheme.id === t.id && <span className="absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-black ring-white pointer-events-none" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="py-4 border-t border-white/5 text-center">
        <div className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold">&copy; 2026 Ritual Cards • Golden Admission • Mainnet Voyage</div>
      </footer>
    </div>
  );
}
