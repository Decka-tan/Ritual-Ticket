import React, { useState, useRef, forwardRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  X,
  ArrowRight,
  Download,
  User,
  Ticket as TicketIcon,
  Loader2,
  Star,
} from 'lucide-react';
import { toPng } from 'html-to-image';

// Types
interface PassengerProfile {
  username: string;
  displayName: string;
  avatar: string | null;
  ticketId?: number;
}

// RESTORE: fetchTwitterProfile from Ritual Proxy
const fetchTwitterProfile = async (username: string) => {
  try {
    const cleanUsername = username.replace('@', '');
    const apiUrl = `https://ritual-twitter-proxy.artelamon.workers.dev/api/twitter/${cleanUsername}?t=${Date.now()}`;

    const res = await fetch(apiUrl);
    if (res.ok) {
      const data = await res.json();
      return {
        avatar: data?.avatar || null,
        displayName: data?.displayName || cleanUsername,
        username: cleanUsername
      };
    }
  } catch (error) {
    console.warn('Profile fetch failed:', error);
  }

  const cleanUsername = username.replace('@', '');
  return {
    avatar: null,
    displayName: cleanUsername,
    username: cleanUsername
  };
};

// Components
const Ticket = forwardRef<HTMLDivElement, { profile: PassengerProfile | null }>(({ profile }, ref) => {
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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, clipPath: `path("${ticketPath}")`, width: `${totalWidth}px` }}
      className="perspective-1000 relative h-[320px] flex group select-none shadow-[0_40px_80px_rgba(0,0,0,0.6)] bg-[#FFD700] rounded-3xl overflow-hidden border-b-6 border-[#b17504]"
    >
      <motion.div
        className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-300"
        style={{ background: `radial-gradient(circle at ${x.get() + 335}px ${y.get() + 160}px, rgba(255, 255, 255, 1), transparent 60%)` }}
      />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700] via-[#FFDB25] to-[#FFD700]" />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [20, -20, 20] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-[600px] h-[500px] rounded-full blur-[100px] opacity-70"
          style={{ background: 'radial-gradient(circle, #FFB900 0%, transparent 75%)' }}
        />
        <div className="absolute z-10 pointer-events-none" style={{ width: '800px', height: '1800px', left: '-620px', top: '-150px', background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0) 65%, transparent 100%)', transform: 'rotate(-55.6deg)', transformOrigin: '50% 0%', opacity: 1.0 }} />
        <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[120%] opacity-[0.20] pointer-events-none z-20" style={{ height: '400%', maskImage: 'url(/Logo_RItual_Black.png)', maskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center', background: 'linear-gradient(135deg, #F9B502 0%, #B17714 100%)' }} />
        <div className="absolute inset-0 z-20 overflow-hidden pointer-events-none flex items-center justify-center">
          <motion.div initial={{ opacity: 0.1, scale: 0.8 }} animate={{ opacity: [0.1, 0.3, 0.1], scale: [0.8, 1.2, 0.8] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 70%)' }} />
        </div>
        <div className="absolute top-0 left-[385px] bottom-0 w-[3px] -translate-x-1/2 pointer-events-none opacity-60 z-30" style={{ backgroundImage: 'linear-gradient(to bottom, #1E1E1E 0%, #B17714 50%, transparent 50%)', backgroundSize: '3px 53.3px', backgroundRepeat: 'repeat-y' }} />
      </div>
      <div className="flex-1 h-full relative z-20 flex flex-col pt-5 pb-4 px-6">
        <div className="flex items-start gap-5 mb-auto">
          <div className="relative w-32 h-32 shrink-0">
            <div className="absolute inset-0 rounded-full bg-white translate-y-[3px] z-10" />
            <div className="absolute inset-0 rounded-full overflow-hidden border-[3px] border-[#FFB90A] z-30" style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)', maskImage: 'radial-gradient(circle, white 100%, black 100%)' }}>
              {profile?.avatar ? ( <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" crossOrigin="anonymous" /> ) : ( <div className="w-full h-full bg-monad-text/5 flex items-center justify-center"> <User className="w-8 h-8 text-monad-text/40" /> </div> )}
            </div>
          </div>
          <div className="mt-2 min-w-0">
            <div className="rounded-full border-[3px] border-[#FFB90A] px-3 py-1.5 bg-transparent backdrop-blur-sm inline-flex items-center max-w-[280px]">
              <p className="font-medium text-sm leading-none tracking-tight ticket-username truncate whitespace-nowrap"> @{profile?.username || 'traveler'} </p>
            </div>
          </div>
        </div>
        <div className="mb-6 pr-10">
          <div className="text-[9px] tracking-widest uppercase font-bold text-[#4E2F10] opacity-80 mb-2">Authorized Forge Access</div>
          <h2 className="text-[2.8rem] font-black tracking-tighter leading-[1.02] mb-1 ticket-display-name overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', maxHeight: '5.7rem' }}> {profile?.displayName || 'Traveler Name'} </h2>
        </div>
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between h-5 text-[#4E2F10]">
          <div style={{ maskImage: 'url(/Logo_RItual_Black.png)', maskSize: 'contain', maskRepeat: 'no-repeat', background: 'linear-gradient(135deg, #F9B502 0%, #4E2F10 100%)', width: '24px', height: '14px' }} />
          <div className="flex-grow h-[1px] bg-gradient-to-r from-[#1E1E1E] to-[#B17714] opacity-50 mx-3" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] ticket-text-metadata font-mono">TESTNET</span>
        </div>
      </div>
      <div style={{ width: '190px' }} className="h-full relative z-20 flex flex-col items-center p-6 text-center border-l-2 border-white/5 overflow-hidden rounded-tr-3xl rounded-br-3xl">
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
  const ticketRef = useRef<HTMLDivElement>(null);

  const resetToPortal = () => {
    setTransitionSpeed(1);
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
        if (prev >= 15) {
          clearInterval(interval);
          return 15;
        }
        return prev + 1;
      });
    }, 150);

    setTimeout(() => {
      setStep('revealed');
    }, 4000);
  };

  const handleReveal = () => setStep('ticket');

  const handleDownload = async () => {
    if (ticketRef.current === null) return;
    const dataUrl = await toPng(ticketRef.current, { cacheBust: true, pixelRatio: 3 });
    const link = document.createElement('a');
    link.download = `golden-ticket-${profile?.username || 'monad'}.png`;
    link.href = dataUrl;
    link.click();
  };

  const isPortalActive = ['portal', 'login', 'confirmation', 'transitioning'].includes(step);

  return (
    <div className="min-h-screen bg-[#0A0A0A] selection:bg-[#BAFF00]/30 flex flex-col font-sans overflow-hidden relative">
      {/* PAGE BACKGROUND — static green ambient glow, never changes */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vh] rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #BAFF00 0%, transparent 70%)', filter: 'blur(80px)' }} />
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
                  className="rounded-full border border-[#BAFF00]/70 animate-ritual-ripple will-change-transform"
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
                className="mt-10 px-8 py-3 bg-[#BAFF00] text-black rounded-full font-black text-lg tracking-tight hover:scale-105 transition-transform active:scale-95 shadow-[0_0_40px_rgba(186,255,0,0.3)]"
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
                  <img src="/Logo_RItual_White.png" alt="Ritual" className="h-20 mb-4" />
                  <div className="text-center space-y-2 mt-3  ">
                    <h3 className="text-2xl font-black uppercase tracking-tight">Sign to verify</h3>
                    <p className="text-white/40 text-sm">Input your username X to proceed</p>
                  </div>
                  <div className="w-full relative group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none"><span className="text-[#BAFF00] font-black font-mono">@</span></div>
                    <input
                      type="text" autoFocus value={handle} onChange={(e) => setHandle(e.target.value)}
                      placeholder="username"
                      onKeyDown={(e) => e.key === 'Enter' && handle && fetchProfile(handle)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-12 pr-6 focus:outline-none focus:border-[#BAFF00]/50 transition-all text-white placeholder:text-white/10 font-mono text-lg"
                    />
                  </div>
                  <button
                    onClick={() => handle && fetchProfile(handle)}
                    disabled={isLoading || !handle}
                    className="w-full bg-[#BAFF00] text-black py-5 rounded-2xl font-black text-xl tracking-tight hover:shadow-[0_0_50px_rgba(186,255,0,0.2)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    {isLoading ? <Loader2 className="animate-spin w-6 h-6" /> : (
                      <><span>Connecting</span><ArrowRight className="w-6 h-6" /></>
                    )}
                  </button>
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
                  <div className="absolute inset-0 rounded-full bg-[#BAFF00]/20 blur-2xl group-hover:bg-[#BAFF00]/40 transition-all duration-500" />
                  <div className="relative w-32 h-32 rounded-full border-4 border-[#BAFF00] overflow-hidden shadow-[0_0_50px_rgba(186,255,0,0.3)]">
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

          {step === 'revealed' && (
            <motion.div
              key="revealed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
              className="relative z-10 w-full flex flex-col items-center justify-center text-center gap-6 py-4 px-4 text-white"
            >
              {/* Typography */}
              <h1 className="text-white text-xl sm:text-2xl md:text-3xl font-medium tracking-tight leading-snug">
                You've received your <span className="text-[#FFD700] font-bold">Golden Ticket</span> to{' '}
                <span className="text-[#FFD700] font-bold">Ritual Testnet</span>.
              </h1>

              {/* Ticket zone — rays use fixed so overflow-hidden never clips them */}
              <div className="relative flex justify-center items-center" style={{ width: '320px', height: '160px' }}>

                {/* Ticket — rays are children so they're relative to ticket position */}
                <motion.div
                  className="relative z-10 transform -rotate-6"
                  style={{ width: '160px', aspectRatio: '2/1' }}
                  animate={{ y: ['-3%', '3%', '-3%'] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {/* Rotating rays — absolute inset[-150%] = centered on ticket, overflow-hidden removed from main so no clip */}
                  <div
                    className="absolute pointer-events-none z-[-1]"
                    style={{
                      inset: '-150%',
                      maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 52%)',
                      WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 52%)',
                      opacity: 0.55,
                      mixBlendMode: 'screen',
                    }}
                  >
                    <motion.div
                      className="w-full h-full"
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                      style={{ background: 'repeating-conic-gradient(from 0deg, transparent 0deg 10deg, #FFD700 10deg 20deg)' }}
                    />
                  </div>

                  {/* Center glow pulse — behind ticket, circular fade */}
                  <motion.div
                    className="absolute rounded-full pointer-events-none z-[-1]"
                    style={{ inset: '-60%', background: 'radial-gradient(circle, rgba(255,215,0,0.55) 0%, transparent 65%)', filter: 'blur(16px)' }}
                    animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
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
                    <line x1="280" y1="10" x2="280" y2="170" stroke="#b08d0b" strokeWidth="2" strokeDasharray="6 6" opacity="0.8"/>
                    <path d="M 15,15 L 345,15 L 345,65 A 25,25 0 0,0 345,115 L 345,165 L 15,165 L 15,115 A 25,25 0 0,0 15,65 Z" fill="none" stroke="#a67c00" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col justify-start pt-3 pl-4 pointer-events-none">
                    <div className="font-bold tracking-widest text-[#4a3600] text-sm leading-none">RITUAL</div>
                    <div className="font-mono font-bold tracking-wider text-[#5a4200] text-[10px] leading-none mt-[3px]">DAY 01</div>
                    <div className="font-mono font-bold tracking-wider text-[#5a4200] text-[10px] leading-none mt-[2px]">TESTNET</div>
                    <div className="absolute bottom-3 right-14 w-4 h-4 text-[#4a3600]">
                      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                  </div>
                </motion.div>

                {/* Ritual logo sparkles — absolute within the 320x160 zone */}
                {[
                  { top: '-30%', left: '4%',   size: 18, delay: 0,   dur: 2.0 },
                  { top: '-20%', right: '6%',  size: 22, delay: 1.2, dur: 2.5 },
                  { top: '40%',  left: '-8%',  size: 16, delay: 0.7, dur: 2.0 },
                  { top: '40%',  right: '-8%', size: 16, delay: 1.8, dur: 2.2 },
                  { top: '110%', left: '12%',  size: 18, delay: 0.4, dur: 2.3 },
                  { top: '110%', right: '12%', size: 14, delay: 1.6, dur: 1.8 },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    className="absolute pointer-events-none z-20"
                    style={{ top: s.top, left: s.left, right: (s as any).right, width: s.size, height: s.size, filter: 'drop-shadow(0 0 6px #BAFF00)' }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                    transition={{ duration: s.dur, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
                  >
                    <img src="/Logo_RItual_White.png" alt="" className="w-full h-full object-contain" />
                  </motion.div>
                ))}
              </div>

              {/* Button with 3s delay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3, duration: 0.5 }}
              >
                <button onClick={handleReveal} className="px-10 py-4 bg-[#FFD700] text-[#3D2B00] rounded-2xl font-black text-lg tracking-wide hover:shadow-[0_0_50px_rgba(255,215,0,0.4)] transition-all flex items-center gap-3 active:scale-[0.98]">
                  <span>VIEW TICKET</span><TicketIcon className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          )}

          {step === 'ticket' && (
            <motion.div
              key="ticket"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full flex flex-col items-center gap-16"
            >
              <Ticket ref={ticketRef} profile={profile} />
              <div className="flex flex-wrap justify-center gap-6">
                <button onClick={handleDownload} className="px-10 py-5 bg-white/5 border border-white/20 rounded-2xl flex items-center gap-3 hover:bg-[#FFD700]/10 hover:border-[#FFD700]/40 transition-all font-bold group backdrop-blur-md text-white">
                  <Download className="w-5 h-5 text-white/60 group-hover:text-[#FFD700]" />
                  <span>SAVE ARTIFACT</span>
                </button>
                <button onClick={() => resetToPortal()} className="px-10 py-5 bg-transparent border border-white/10 rounded-2xl flex items-center gap-3 hover:bg-white/5 transition-all text-white/40 hover:text-white font-bold"><span>FORGE ANOTHER</span></button>
              </div>
              <div className="mt-8 p-10 bg-gradient-to-br from-[#FFD700]/10 to-transparent border border-[#FFD700]/20 rounded-3xl max-w-2xl text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Star className="w-12 h-12" /></div>
                <div className="flex items-center justify-center gap-3 text-[#FFD700]">
                  <div className="h-px w-12 bg-[#FFD700]/40" /><span className="text-xs font-black uppercase tracking-[0.3em]">Official Admittance</span><div className="h-px w-12 bg-[#FFD700]/40" />
                </div>
                <p className="text-white/60 text-lg leading-relaxed italic">"You have received your Golden Ticket to Day 1 of Ritual Testnet. Do not lose this artifact. It is your soul-bound pass to the genesis block."</p>
                <div className="pt-4 flex justify-center gap-10 opacity-20"><img src="/Logo_RItual_White.png" alt="logo" className="h-6" /></div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <footer className="py-20 border-t border-white/5 text-center space-y-8">
        <div className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-bold">&copy; 2026 Ritual Cards • Golden Admission • Mainnet Voyage</div>
      </footer>
    </div>
  );
}
