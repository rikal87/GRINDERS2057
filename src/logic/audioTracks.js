import BGM_Placebo from '../assets/music/FiloStarquez_Placebo.mp3';
import BGM_Solitude from '../assets/music/FiloStarquez_Solitude.mp3';
import BGM_RemoteLocation from '../assets/music/FiloStarquez_RemoteLocation.mp3';
import BGM_Grainders2057 from '../assets/music/Grainders2057.mp3';
import BGM_NeonDreams from '../assets/music/epshy_NeonDreams.mp3';
import BGM_VelvetShadows from '../assets/music/MellowFields_VelvetShadows.ogg';
import BGM_DreamVector from '../assets/music/MellowFields_DreamVector.ogg';
import BGM_JourneyToTitan from '../assets/music/WBA_JourneyToTitan.mp3';
import BGM_MalibuMoon from '../assets/music/WBA_MalibuMoon.ogg';

export const TRACK_ENUM = {
  Placebo: "Placebo",
  RemoteLocation: "RemoteLocation",
  Grainders2057: "Grainders2057",
  NeonDreams: "NeonDreams",
  VelvetShadows: "VelvetShadows",
  DreamVector: "DreamVector",
  Solitude: "Solitude",
  JourneyToTitan: "JourneyToTitan",
  MalibuMoon: "MalibuMoon"
};
//  Karl Casey @ White Bat Audio"
export const TRACK_INFO = {
  [TRACK_ENUM.MalibuMoon]: {
    "title": "Malibu Moon",
    "artist": "Karl Casey @ White Bat Audio",
    "license": "",
    "file": BGM_MalibuMoon
  },
  [TRACK_ENUM.JourneyToTitan]: {
    "title": "Journey To Titan",
    "artist": "Karl Casey @ White Bat Audio",
    "license": "",
    "file": BGM_JourneyToTitan
  },
  [TRACK_ENUM.Placebo]: {
    "title": "Placebo",
    "artist": "FiloStarquez",
    "license": "CC BY 4.0 [https://creativecommons.org/licenses/by/4.0]",
    "file": BGM_Placebo
  },
  [TRACK_ENUM.Solitude]: {
    "title": "Solitude",
    "artist": "FiloStarquez",
    "license": "CC BY 4.0 [https://creativecommons.org/licenses/by/4.0]",
    "file": BGM_Solitude
  },
  [TRACK_ENUM.RemoteLocation]: {
    "title": "Remote Location",
    "artist": "FiloStarquez",
    "license": "CC BY 4.0 [https://creativecommons.org/licenses/by/4.0]",
    "file": BGM_RemoteLocation
  },
  [TRACK_ENUM.Grainders2057]: {
    "title": "Grainders 2057 Main Theme",
    "artist": "Rikal87",
    "license": "",
    "file": BGM_Grainders2057,
  },
  [TRACK_ENUM.NeonDreams]: {
    "title": "Neon Dreams",
    "artist": "epshy",
    "license": "-",
    "file": BGM_NeonDreams,
  },
  [TRACK_ENUM.VelvetShadows]: {
    "title": "Velvet Shadows",
    "artist": "Mellow Fields",
    "license": "-",
    "file": BGM_VelvetShadows,
  },
  [TRACK_ENUM.DreamVector]: {
    "title": "Dream Vector",
    "artist": "Mellow Fields",
    "license": "-",
    "file": BGM_DreamVector,
  },
};
