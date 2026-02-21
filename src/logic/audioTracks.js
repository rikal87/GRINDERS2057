import BGM_Placebo from '../assets/music/FiloStarquez_Placebo.mp3';
import BGM_RemoteLocation from '../assets/music/FiloStarquez_RemoteLocation.mp3';
import BGM_Grainders2057 from '../assets/music/Grainders2057.mp3';
import BGM_NeonDreams from '../assets/music/epshy_NeonDreams.mp3';
import BGM_VelvetShadows from '../assets/music/MellowFields_VelvetShadows.ogg';
import BGM_DreamVector from '../assets/music/MellowFields_DreamVector.ogg';

export const TRACK_ENUM = {
  Placebo: "Placebo",
  RemoteLocation: "RemoteLocation",
  Grainders2057: "Grainders2057",
  NeonDreams: "NeonDreams",
  VelvetShadows: "VelvetShadows",
  DreamVector: "DreamVector"
};

export const TRACK_INFO = {
  [TRACK_ENUM.Placebo]: {
    "title": "Placebo",
    "artist": "FiloStarquez",
    "source": "http://dummy.com",
    "file": BGM_Placebo
  },
  [TRACK_ENUM.RemoteLocation]: {
    "title": "Remote Location",
    "artist": "FiloStarquez",
    "source": "http://dummy.com",
    "file": BGM_RemoteLocation
  },
  [TRACK_ENUM.Grainders2057]: {
    "title": "Grainders 2057 Main Theme",
    "artist": "Rikal87",
    "file": BGM_Grainders2057,
    "source": "Grainders 2057"
  },
  [TRACK_ENUM.NeonDreams]: {
    "title": "Neon Dreams",
    "artist": "epshy",
    "file": BGM_NeonDreams,
    "source": "Neon Dreams"
  },
  [TRACK_ENUM.VelvetShadows]: {
    "title": "Velvet Shadows",
    "artist": "Mellow Fields",
    "file": BGM_VelvetShadows,
    "source": "Velvet Shadows"
  },
  [TRACK_ENUM.DreamVector]: {
    "title": "Dream Vector",
    "artist": "Mellow Fields",
    "file": BGM_DreamVector,
    "source": "Dream Vector"
  },
};
