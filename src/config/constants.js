// Имена маунтов
export const MYTHIC_MOUNTS_NAMES = {
  6001: 'Gryphon',
  7001: 'Hellhound',
  8001: 'Raven',
  9001: 'Halia',
  9002: 'Voidrake',
  9003: 'Helhest',
  9004: 'Unicorn',
  9005: 'Artio',
  9006: 'Stellar Dragon',
  9007: 'Nyra',
  9008: 'Thunderfire Lion',
  9009: 'Infernal Bat King',
  9010: 'Ardentis',
  9011: 'Stormfang',
  9012: 'Rockhorn',
};

// Конфигурация характеристик
export const STAT_CONFIG = [
  { key: 'attack', title: 'Attack' },
  { key: 'life', title: 'Life' },
  { key: 'speed', title: 'Speed' },
  { key: 'load', title: 'Load' },
  { key: 'limit', title: 'Limit' },
  { key: 'critical_odds', title: 'Crit Chance' },
  { key: 'critical_damage', title: 'Crit Damage' },
];

// Поиск конфига по ключу
export const getStatConfig = (key) => {
  return STAT_CONFIG.find((stat) => stat.key === key);
};
