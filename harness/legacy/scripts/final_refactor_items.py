import re
import os

path = r'd:\github-repository\CyberPoker2077\src\logic\items.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Clean up ITEM_ID section
new_item_id_obj = {
  "ADVANCED_EQUITY_CALC": 'advanced_equity_calc',
  "ALGORITHMIC_REBATE_TOOL": 'algorithmic_rebate_tool',
  "ALLIN_INSURANCE_PLUS": 'allin_insurance_plus',
  "ANCIENT_POT": 'ancient_pot',
  "ATOMIC_CLOCK_STABILIZER": 'atomic_clock_stabilizer',
  "AURUM_PROCESSOR_Z": 'aurum_processor_z',
  "BACKUP_BATTERY_SET": 'backup_battery_set',
  "BLACK_CONSUMER": 'black_consumer',
  "BLACK_MARKET_COURIER_BAG": 'black_market_courier_bag',
  "BLACKJACK_SEAL": 'blackjack_seal',
  "BLIND_FOLDED_MONK_STATUE": 'blind_folded_monk_statue',
  "BLIND_MAKER": 'blind_maker',
  "BROKEN_COMPASS": 'broken_compass',
  "CAPITALISTS_TOP_HAT: 'capitalists_top_hat',
  "CARD_OF_THE_CARD_SHARK": 'card_of_the_card_shark',
  "CASINO_INSIDER": 'casino_insider',
  "CASINO_INSIDER_NEMESIS": 'casino_insider_nemesis',
  "CASINO_PROMOTION_INFO_COLLECTOR": 'casino_promotion_info_collector',
  "CD": 'CD',
  "CHIPS": 'chips',
  "CLUB_MEMBERSHIP": 'club_membership',
  "CODE_OF_CREATION": 'code_of_creation',
  "CRYO_MINT_DISPENSER": 'cryo_mint_dispenser',
  "CRYPTO_COIN_REPLICA": 'crypto_coin_replica',
  "CRYSTAL_WINE_GLASS": 'crystal_wine_glass',
  "CYBER_PET_COLLAR": 'cyber_pet_collar',
  "DECRYPTED_TAX_FILE": 'decrypted_tax_file',
  "DESTINY_SLOT_MACHINE": 'destiny_slot_machine',
  "DOUBLE_BUY_IN_TICKET": 'double_buy_in_ticket',
  "EIFFEL_TOWER": 'eiffel_tower',
  "EMERGENCY_EXIT_HAMMER": 'emergency_exit_hammer',
  "EMERGENCY_RESERVES": 'emergency_reserves',
  "EQUITY_EMERGENCY_ALARM": 'equity_emergency_alarm',
  "EV_RECOVERY_CORE": 'ev_recovery_core',
  "FAILURE_PHILOSOPHY": 'failure_philosophy',
  "FLOPPY_DISK": 'floppy_disk',
  "FLUSH_MASTER_RING": 'flush_master_ring',
  "FOLDING_FAN": 'folding_fan',
  "FORGED_COUPON": 'forged_coupon',
  "FULL_HOUSE_BLUEPRINT": 'full_house_blueprint',
  "FUSION_CORE_MINI": 'fusion_core_mini',
  "GLITCHY_DATA_CHIP": 'glitchy_data_chip',
  "GOLDEN_DRAGON_STATUE": 'golden_dragon_statue',
  "GOLDEN_HAND_STATUE": 'golden_hand_statue',
  "GOLDEN_MIRROR": 'golden_mirror',
  "GUARDIAN_ANGEL_PROGRAM": 'guardian_angel_program',
  "HIGH_ROLLER_BADGE": 'high_roller_badge',
  "HOLDEM_HOUSE_MEMBERSHIP": 'holdem_house_membership',
  "HOLO_PROJECTED_FLOWER": 'holo_projected_flower',
  "JACKPOT_SEED_DATA": 'jackpot_seed_data',
  "KHAMSA": 'khamsa',
  "LIFE_SAVER_BUOY": 'life_saver_buoy',
  "LIQUID_NITROGEN_COOLING": 'liquid_nitrogen_cooling',
  "LOADED_DICE": 'loaded_dice',
  "LOAN_SHARK_FUNDING": 'loan_shark_funding',
  "LOW_STACK_BATTERY": 'low_stack_battery',
  "LUCK_OF_THE_DRAW_COIN": 'luck_of_the_draw_coin',
  "LUCKY_CAT_GOLD": 'lucky_cat_gold',
  "LUCKY_CHARM": 'lucky_charm',
  "MASK_OF_JOY_AND_DESPAIR": 'mask_of_joy_and_despair',
  "MERCHANTS_SECRET_HANDSHAKE": 'merchants_secret_handshake',
  "MIRACLE_WORKER_SCRIPT": 'miracle_worker_script',
  "MONOPOLY_PASS": 'monopoly_pass',
  "MOVIE_ROUNDERS_DVD": 'movie_rounders_dvd',
  "NEURAL_LINK_V3": 'neural_link_v3',
  "NEURO_SYNC_HEADBAND": 'neuro_sync_headband',
  "OLD_PHONE": 'old_phone',
  "OLD_STOPWATCH": 'old_stopwatch',
  "OLIVE_BRANCH": 'olive_branch',
  "ORBIT_LOUNGE_NETWORK_HACKING": 'orbit_lounge_network_hacking',
  "PHOENIX_PROTOCOL": 'phoenix_protocol',
  "PRISMATIC_ACHIEVEMENT_CARD": 'prismatic_achievement_card',
  "QUANTUM_CRYPTO_WALLET": 'quantum_crypto_wallet',
  "QUANTUM_POCKET_WATCH": 'quantum_pocket_watch',
  "QUICK_FOLD_MANUAL": 'quick_fold_manual',
  "REINCARNATION_PROTOCOL": 'reincarnation_protocol',
  "ROGUE_AI_FRAGMENT": 'rogue_ai_fragment',
  "ROLLER_SKATES": 'roller_skates',
  "ROSARY": 'rosary',
  "ROYAL_FLUSH_CROWN": 'royal_flush_crown',
  "ROYAL_ROOM_INVITE": 'royal_room_invite',
  "RUSTY_PAIR_PENDANT": 'rusty_pair_pendant',
  "SAD_EYES": 'sad_eyes',
  "SAILING_YACHT": 'sailing_yacht',
  "SCRAP_COLLECTOR_GLOVE": 'scrap_collector_glove',
  "SECOND_CHANCE_SCRIPT_V2": 'second_chance_script_v2',
  "SMOKE_BREAK": 'smoke_break',
  "STAR_OF_AF_RICA": 'star_of_africa',
  "STATUE_OF_LIBERTY": 'statue_of_liberty',
  "STONK": 'stonk',
  "SUCKER": 'sucker',
  "SYNAPSE_READING_PROTOCOL": 'synapse_reading_protocol',
  "SYNTHETIC_COFFEE": 'synthetic_coffee',
  "TAX_EVASION_MANUAL": 'tax_evasion_manual',
  "TAX_HAVEN_VPN": 'tax_haven_vpn',
  "THE_BUNKER_KEY": 'the_bunker_key',
  "TITANIUM_INSURANCE_POLICY": 'titanium_insurance_policy',
  "TO_THE_MARS_ROCKET": 'to_the_mars_rocket',
  "UNDERGROUND_BAR_INVITE": 'underground_bar_invite',
  "UNIVERSAL_MEMBERSHIP_CARD": 'universal_membership_card',
  "VICTORY_STREAK_FLAG": 'victory_streak_flag',
  "VIP_LOUNGE_KEYCARD": 'vip_lounge_keycard',
  "WPT_CHAMPIONSHIP_MEDAL": 'wpt_championship_medal'
}

val_to_key = {v: k for k, v in new_item_id_obj.items()}

item_id_str = "export const ITEM_ID = {\n"
for k in sorted(new_item_id_obj.keys()):
    item_id_str += f"  {k}: '{new_item_id_obj[k]}',\n"
item_id_str += "}"

# Replace the existing ITEM_ID section
content = re.sub(r"export const ITEM_ID = \{[\s\S]+?\}", item_id_str, content)

# 2. Replace any remaining literal id: '...' in ITEM_DATA
def replace_id(match):
    id_val = match.group(1)
    if id_val in val_to_key:
        return f"id: ITEM_ID.{val_to_key[id_val]}"
    # Also handle some known renames or messy cases
    if id_val == 'industrial_showdown_lose_refund':
        return f"id: ITEM_ID.SAD_EYES"
    return match.group(0)

item_data_match = re.search(r"export const ITEM_DATA = \[([\s\S]+?)\];", content)
if item_data_match:
    original_data = item_data_match.group(1)
    updated_data = re.sub(r"id:\s*'([^']+)'", replace_id, original_data)
    content = content.replace(original_data, updated_data)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Final cleanup complete")
