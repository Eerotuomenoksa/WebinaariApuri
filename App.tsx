
import React, { useState, useEffect, useCallback } from 'react';
import { AppSettings, MusicType } from './types';
import SettingsModal from './components/SettingsModal';
import { audioService } from './services/AudioService';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    eventTitle: 'Verkkolähetyksen Otsikko',
    startTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
    backgroundColor: '#f1f5f9',
    showSeconds: true,
    extraInfo: 'Tervetuloa mukaan! Aloitamme hetken kuluttua. Tässä tilassa voit valmistautua rauhassa webinaarin alkuun.',
    musicType: MusicType.NONE,
    customMusicUrl: null,
    logoUrl: null,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
    showCameraWarning: true,
    showMicWarning: true,
    titlePosition: 'overlay',
    isBreakMode: false,
    breakText: 'Olemme pienellä tauolla. Palaamme pian!',
    countdownStyle: 'digital',
  });

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const calculateTimeLeft = useCallback(() => {
    const target = new Date(settings.startTime).getTime();
    const now = new Date().getTime();
    const difference = target - now;

    if (difference > 0) {
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        total: difference
      });
    } else {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
    }
  }, [settings.startTime]);

  useEffect(() => {
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  useEffect(() => {
    if (settings.musicType !== MusicType.NONE) {
      audioService.play(settings.musicType, settings.customMusicUrl);
    } else {
      audioService.stop();
    }
  }, [settings.musicType, settings.customMusicUrl]);

  useEffect(() => {
    audioService.setMuted(isMuted);
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const showDays = timeLeft.days > 0;
  const showHours = (timeLeft.hours > 0 || timeLeft.days > 0);

  const TitleComponent = ({ isOverlay = false }) => (
    <h1 className={`font-bold tracking-tight leading-none animate-in fade-in duration-1000 ${
      isOverlay 
        ? "text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-lg" 
        : "text-3xl md:text-4xl lg:text-5xl text-slate-900 mb-4"
    }`}>
      {settings.eventTitle}
    </h1>
  );

  const CountdownDisplay = () => {
    if (settings.isBreakMode) {
      return (
        <div className="animate-in slide-in-from-right-4 duration-500">
          <p className="text-xl md:text-2xl font-bold text-slate-800 leading-tight">
            {settings.breakText}
          </p>
        </div>
      );
    }

    const { days, hours, minutes, seconds } = timeLeft;

    switch (settings.countdownStyle) {
      case 'minimal':
        return (
          <div className="flex items-baseline gap-2 text-6xl md:text-8xl font-light text-slate-900 animate-in fade-in duration-700">
            {showDays && <span>{days}<span className="text-xl font-bold text-slate-300 ml-1">D</span></span>}
            {showHours && <span className="text-slate-200">/</span>}
            {showHours && <span>{hours.toString().padStart(2, '0')}<span className="text-xl font-bold text-slate-300 ml-1">H</span></span>}
            <span className="text-slate-200">/</span>
            <span>{minutes.toString().padStart(2, '0')}<span className="text-xl font-bold text-slate-300 ml-1">M</span></span>
            {settings.showSeconds && <span className="text-slate-200">/</span>}
            {settings.showSeconds && <span className="text-slate-400 font-medium">{seconds.toString().padStart(2, '0')}</span>}
          </div>
        );

      case 'circles':
        const CircleUnit = ({ val, max, label }: { val: number, max: number, label: string }) => {
          const radius = 35;
          const circum = 2 * Math.PI * radius;
          const offset = circum - (val / max) * circum;
          return (
            <div className="flex flex-col items-center space-y-2">
              <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                 <svg className="w-full h-full -rotate-90">
                    <circle cx="50%" cy="50%" r={radius} className="fill-none stroke-slate-200" strokeWidth="6" />
                    <circle cx="50%" cy="50%" r={radius} className="fill-none stroke-blue-500 transition-all duration-1000" strokeWidth="6" strokeDasharray={circum} strokeDashoffset={offset} strokeLinecap="round" />
                 </svg>
                 <span className="absolute text-2xl md:text-4xl font-bold text-slate-800">{val}</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            </div>
          );
        };
        return (
          <div className="flex gap-4 animate-in zoom-in duration-500">
             {showDays && <CircleUnit val={days} max={30} label="Päivää" />}
             {showHours && <CircleUnit val={hours} max={24} label="Tuntia" />}
             <CircleUnit val={minutes} max={60} label="Min" />
             {settings.showSeconds && <CircleUnit val={seconds} max={60} label="Sek" />}
          </div>
        );

      case 'digital':
      default:
        return (
          <div className="flex justify-center lg:justify-start gap-4 animate-in zoom-in duration-500">
            {showDays && (
              <div className="flex flex-col items-center bg-white/60 rounded-3xl p-4 min-w-[80px] md:min-w-[100px] border border-white/80">
                <span className="text-3xl md:text-5xl font-bold text-slate-900">{timeLeft.days}</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Pv</span>
              </div>
            )}
            {showHours && (
              <div className="flex flex-col items-center bg-white/60 rounded-3xl p-4 min-w-[80px] md:min-w-[100px] border border-white/80">
                <span className="text-3xl md:text-5xl font-bold text-slate-900">{timeLeft.hours.toString().padStart(2, '0')}</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">H</span>
              </div>
            )}
            <div className="flex flex-col items-center bg-white/60 rounded-3xl p-4 min-w-[80px] md:min-w-[100px] border border-white/80">
              <span className="text-3xl md:text-5xl font-bold text-slate-900">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Min</span>
            </div>
            {settings.showSeconds && (
              <div className="flex flex-col items-center bg-white/60 rounded-3xl p-4 min-w-[80px] md:min-w-[100px] border border-white/80">
                <span className="text-3xl md:text-5xl font-bold text-slate-900">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Sek</span>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div 
      className="h-screen w-screen flex flex-col overflow-hidden relative transition-colors duration-1000 select-none"
      style={{ backgroundColor: settings.backgroundColor }}
    >
      {/* Header with Logo */}
      <div className="absolute top-8 left-8 z-20">
        {settings.logoUrl ? (
          <img src={settings.logoUrl} alt="Logo" className="h-20 md:h-28 w-auto object-contain drop-shadow-md" />
        ) : (
          <div className="h-20 w-20 md:h-28 md:w-28 bg-white/50 backdrop-blur rounded-2xl flex items-center justify-center text-slate-400 text-[10px] font-bold uppercase tracking-widest border border-white/60 shadow-sm">
            Logo
          </div>
        )}
      </div>

      {/* Main Content Area - Split Layout */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 lg:px-20">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image & Title */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
            {settings.titlePosition === 'above' && <TitleComponent />}

            <div className="w-full aspect-video bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-white/50 relative group transition-transform duration-500 hover:scale-[1.005]">
              {settings.imageUrl ? (
                <img src={settings.imageUrl} alt="Tapahtuma" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 italic">
                  Ei kuvaa valittuna
                </div>
              )}
              
              {settings.titlePosition === 'overlay' && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center lg:justify-start pb-10 px-10">
                  <TitleComponent isOverlay />
                </div>
              )}

              {settings.isBreakMode && (
                <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-500">
                  <div className="bg-white/90 px-10 py-5 rounded-full shadow-2xl transform rotate-[-2deg] border-4 border-purple-600">
                     <span className="text-3xl md:text-5xl font-black text-purple-600 uppercase tracking-widest">TAUKO</span>
                  </div>
                </div>
              )}
            </div>

            {settings.titlePosition === 'below' && <TitleComponent />}
          </div>

          {/* Right Column: Countdown, Info, Warnings */}
          <div className="lg:col-span-5 flex flex-col space-y-8 lg:h-full lg:justify-center">
            
            {/* Countdown / Break Status Box */}
            <div className={`bg-white/30 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/40 shadow-xl space-y-6 ${settings.countdownStyle === 'minimal' ? 'bg-transparent border-transparent shadow-none backdrop-blur-none p-0' : ''}`}>
              <p className="text-sm md:text-base text-slate-500 font-bold uppercase tracking-[0.2em]">
                {settings.isBreakMode ? 'Tauko käynnissä' : 'Verkkolähetys alkaa'}
              </p>
              
              <CountdownDisplay />
            </div>

            {/* Extra Info Box */}
            {settings.extraInfo && !settings.isBreakMode && (
              <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-8 border border-white/20 shadow-sm italic text-slate-600 text-lg leading-relaxed">
                "{settings.extraInfo}"
              </div>
            )}

            {/* Warnings Area */}
            {(settings.showCameraWarning || settings.showMicWarning) && (
              <div className="flex flex-col gap-3">
                {settings.showCameraWarning && (
                  <div className="bg-white/40 backdrop-blur-md border border-white/60 text-slate-700 px-6 py-3 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-3 shadow-sm">
                    <div className="bg-slate-100 p-2 rounded-lg relative overflow-hidden">
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 24 24">
                        <line x1="2" y1="2" x2="22" y2="22" stroke="rgb(239, 68, 68)" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                    Webinaarin aikana toivomme että kamerasi ei ole päällä
                  </div>
                )}
                {settings.showMicWarning && (
                  <div className="bg-white/40 backdrop-blur-md border border-white/60 text-slate-700 px-6 py-3 rounded-2xl text-xs md:text-sm font-semibold flex items-center gap-3 shadow-sm">
                    <div className="bg-slate-100 p-2 rounded-lg relative overflow-hidden">
                      <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 24 24">
                        <line x1="2" y1="2" x2="22" y2="22" stroke="rgb(239, 68, 68)" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                    </div>
                    Webinaarin aikana toivomme että mikrofoni on mykistetty
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-20 bg-white/30 backdrop-blur-2xl flex items-center justify-center relative px-8 border-t border-white/40 shrink-0">
        <p className="text-slate-600 text-xs md:text-sm font-semibold tracking-wide text-center max-w-md">
          Palvelun tarjoaa Vanhustyön keskusliiton SeniorSurf-toiminta.
        </p>

        <div className="absolute right-10 flex items-center gap-4">
          {settings.musicType !== MusicType.NONE && (
            <button 
              onClick={toggleMute}
              className={`transition-all p-3 rounded-full shadow-lg border border-white/50 ${isMuted ? 'bg-slate-200 text-slate-400' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
              aria-label={isMuted ? "Laita ääni päälle" : "Laita ääni pois"}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          )}

          <button 
            onClick={() => setIsSettingsOpen(true)}
            className={`text-slate-500 hover:text-slate-900 transition-all hover:rotate-90 duration-700 p-3 rounded-full bg-white/40 hover:bg-white/80 shadow-sm border border-white/50 ${settings.isBreakMode ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
            aria-label="Asetukset"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </footer>

      {isSettingsOpen && (
        <SettingsModal 
          settings={settings} 
          setSettings={setSettings} 
          onClose={() => setIsSettingsOpen(false)} 
        />
      )}
    </div>
  );
};

export default App;
