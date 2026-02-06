
import React from 'react';
import { AppSettings, MusicType } from '../types';

interface SettingsModalProps {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, setSettings, onClose }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'logoUrl' | 'imageUrl' | 'customMusicUrl') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSettings({ ...settings, [key]: url });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800">Laskurin asetukset</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto settings-scroll flex-1 space-y-6">
          {/* Status Selection: Break vs Countdown */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100 space-y-3">
             <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-purple-900 uppercase tracking-wider">Webinaarin tila</label>
                <div className="flex items-center gap-2">
                   <span className={`text-xs font-bold ${!settings.isBreakMode ? 'text-purple-600' : 'text-slate-400'}`}>Laskuri</span>
                   <button 
                      onClick={() => setSettings({...settings, isBreakMode: !settings.isBreakMode})}
                      className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${settings.isBreakMode ? 'bg-purple-600' : 'bg-slate-300'}`}
                   >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${settings.isBreakMode ? 'left-7' : 'left-1'}`} />
                   </button>
                   <span className={`text-xs font-bold ${settings.isBreakMode ? 'text-purple-600' : 'text-slate-400'}`}>Tauko</span>
                </div>
             </div>
             {settings.isBreakMode && (
                <div className="space-y-2 animate-in slide-in-from-top-2">
                   <label className="text-xs font-medium text-purple-700">Taukoteskti</label>
                   <input
                      type="text"
                      className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                      value={settings.breakText}
                      onChange={(e) => setSettings({ ...settings, breakText: e.target.value })}
                      placeholder="Olemme pienellä tauolla..."
                   />
                </div>
             )}
          </div>

          {/* General Info */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Tapahtuman otsikko</label>
              <input
                type="text"
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={settings.eventTitle}
                onChange={(e) => setSettings({ ...settings, eventTitle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Otsikon sijainti</label>
              <div className="grid grid-cols-3 gap-2">
                {(['above', 'overlay', 'below'] as const).map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setSettings({ ...settings, titlePosition: pos })}
                    className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      settings.titlePosition === pos
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {pos === 'above' ? 'Yllä' : pos === 'below' ? 'Alla' : 'Kuvassa'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Kellon tyyli</label>
              <div className="grid grid-cols-3 gap-2">
                {(['digital', 'minimal', 'circles'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setSettings({ ...settings, countdownStyle: style })}
                    className={`px-2 py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${
                      settings.countdownStyle === style
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {style === 'digital' ? 'Digitaalinen' : style === 'minimal' ? 'Pelkistetty' : 'Kehä'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Alkamisaika</label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={settings.startTime}
                  onChange={(e) => setSettings({ ...settings, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Taustaväri</label>
                <input
                  type="color"
                  className="w-full h-10 p-1 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                  value={settings.backgroundColor}
                  onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Music */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Taustamusiikki</label>
            <div className="space-y-2">
              <select
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={settings.musicType}
                onChange={(e) => setSettings({ ...settings, musicType: e.target.value })}
              >
                {Object.values(MusicType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {settings.musicType === MusicType.CUSTOM && (
              <div className="space-y-2 pt-2 animate-in slide-in-from-top-2 duration-200">
                <label className="text-xs font-medium text-slate-500">Valitse musiikkitiedosto (.mp3, .wav...)</label>
                <input
                  type="file"
                  accept="audio/*"
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'customMusicUrl')}
                />
              </div>
            )}
          </div>

          {/* Assets */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Organisaation logo</label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                onChange={(e) => handleFileChange(e, 'logoUrl')}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Tapahtumakuva</label>
              <input
                type="file"
                accept="image/*"
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                onChange={(e) => handleFileChange(e, 'imageUrl')}
              />
            </div>
          </div>

          {/* Instructions and Warnings */}
          <div className="space-y-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
            <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Huomautukset & Info</label>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Lisätiedot (info-kenttä)</label>
              <textarea
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 resize-none"
                value={settings.extraInfo}
                onChange={(e) => setSettings({ ...settings, extraInfo: e.target.value })}
              />
            </div>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showCameraWarning"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={settings.showCameraWarning}
                  onChange={(e) => setSettings({ ...settings, showCameraWarning: e.target.checked })}
                />
                <label htmlFor="showCameraWarning" className="text-sm text-slate-700 cursor-pointer">Kamerahuomautus</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showMicWarning"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={settings.showMicWarning}
                  onChange={(e) => setSettings({ ...settings, showMicWarning: e.target.checked })}
                />
                <label htmlFor="showMicWarning" className="text-sm text-slate-700 cursor-pointer">Mikrofonihuomautus</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showSeconds"
                  className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  checked={settings.showSeconds}
                  onChange={(e) => setSettings({ ...settings, showSeconds: e.target.checked })}
                />
                <label htmlFor="showSeconds" className="text-sm text-slate-700 cursor-pointer">Näytä sekunnit</label>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors shadow-sm"
          >
            Valmis
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
