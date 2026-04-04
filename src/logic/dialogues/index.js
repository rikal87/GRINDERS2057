// dialogues/index.js
import { VANGUARD_DIALOGUE } from './vanguard.js';
import { MANIAC_DIALOGUE } from './maniac.js';
import { KATE_DIALOGUE } from './kate.js';
import { GAMBLER_DIALOGUE } from './gambler.js';
import { GANGSTER_DIALOGUE } from './gangster.js';
import { FISH_DIALOGUE } from './fish.js';
import { BROKE_DIALOGUE } from './broke.js';
import { RICH_GUY_DIALOGUE } from './rich_guy.js';
import { NIT_DIALOGUE } from './nit.js';
import { SHARK_DIALOGUE } from './shark.js';
import { MR_CALL_DIALOGUE } from './mr_call.js';
import { THE_WHALE_DIALOGUE } from './the_whale.js';
import { OLD_LION_DIALOGUE } from './old_lion.js';
import { QUANT_PRO_DIALOGUE } from './quant_pro.js';
import { THE_DON_DIALOGUE } from './the_don.js';
import { BIG_DADDY_DIALOGUE } from './big_daddy.js';
import { IVY_00_DIALOGUE } from './ivy_00.js';
import { D_NEURAL_DIALOGUE } from './d_neural.js';
import { MAX_MENTOR_DIALOGUE } from './max_mentor.js';
import { MAX_DIALOGUE } from './max.js';
import { FLORENCE_DIALOGUE } from './florence.js';
// Fixing filenames with special characters
import { DWAN_V2_DIALOGUE } from './d.w.a.n_v2.js';
import { JNGL_MAN_DIALOGUE } from './jngl_man.js';
import { YH0_V1RAL_DIALOGUE } from './yh0_v1ral.js';

export const PERSONALITIES = {
  VANGUARD: VANGUARD_DIALOGUE,
  MANIAC: MANIAC_DIALOGUE,
  KATE: KATE_DIALOGUE,
  GAMBLER: GAMBLER_DIALOGUE,
  GANGSTER: GANGSTER_DIALOGUE,
  FISH: FISH_DIALOGUE,
  BROKE: BROKE_DIALOGUE,
  RICH_GUY: RICH_GUY_DIALOGUE,
  NIT: NIT_DIALOGUE,
  SHARK: SHARK_DIALOGUE,
  MR_CALL: MR_CALL_DIALOGUE,
  THE_WHALE: THE_WHALE_DIALOGUE,
  OLD_LION: OLD_LION_DIALOGUE,
  QUANT_PRO: QUANT_PRO_DIALOGUE,
  THE_DON: THE_DON_DIALOGUE,
  BIG_DADDY: BIG_DADDY_DIALOGUE,
  IVY_00: IVY_00_DIALOGUE,
  D_NEURAL: D_NEURAL_DIALOGUE,
  MAX_MENTOR: MAX_MENTOR_DIALOGUE,
  MAX: MAX_DIALOGUE,
  FLORENCE: FLORENCE_DIALOGUE,
  AN_UNKNOWN_WOMAN: FLORENCE_DIALOGUE,
  "D.W.A.N_V2": DWAN_V2_DIALOGUE,
  JNGL_MAN: JNGL_MAN_DIALOGUE,
  YH0_V1RAL: YH0_V1RAL_DIALOGUE,
  // Fallbacks for unusual IDs
  "MAX(MENTOR)": MAX_MENTOR_DIALOGUE,
  "MAX (MENTOR)": MAX_MENTOR_DIALOGUE,
};