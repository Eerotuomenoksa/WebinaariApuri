
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
}

export enum MusicType {
  NONE = 'Ei musiikkia',
  ELEVATOR_1 = 'Klassinen hissimusiikki',
  ELEVATOR_2 = 'Kevyt Bossa Nova',
  ELEVATOR_3 = 'Pehmyt Jazz-tunnelma',
  ELEVATOR_4 = 'Lounge-odotusmusiikki',
  ELEVATOR_5 = 'Moderni aulatila',
  CUSTOM = 'Oma musiikkitiedosto'
}
