
export interface AppSettings {
  eventTitle: string;
  startTime: string;
  backgroundColor: string;
  showSeconds: boolean;
  extraInfo: string;
  musicType: string;
  customMusicUrl: string | null;
  logoUrl: string | null;
  imageUrl: string | null;
  showCameraWarning: boolean;
  showMicWarning: boolean;
  titlePosition: 'above' | 'below' | 'overlay';
  isBreakMode: boolean;
  breakText: string;
  countdownStyle: 'digital' | 'minimal' | 'circles';
}

export enum MusicType {
  NONE = 'Ei musiikkia',
  CUSTOM = 'Oma musiikkitiedosto',
  AIRY = 'Ilmava ja kevyt',
  WARM = 'Lämmin ja pehmeä',
  CALM = 'Tyyni ja syvä'
}
