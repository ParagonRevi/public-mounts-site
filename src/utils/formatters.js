import { getEventIconUrl } from './imageUtils.js';

export const statIcons = {
  attack: getEventIconUrl('skill_attack'),
  life: getEventIconUrl('skill_blood'),
  speed: getEventIconUrl('speed_Light'),
  load: getEventIconUrl('load_Light'),
  limit: getEventIconUrl('TroopLimit'),
  critical_odds: getEventIconUrl('crit'),
  critical_damage: getEventIconUrl('crit'),
};

export const formatStatValue = (key, value) => {
  const numValue = parseFloat(value || 0);
  const addSign = (num) => (num >= 0 ? `+${num}` : num.toString());

  switch (key) {
    case 'limit': {
      const formatted = (numValue / 1000).toFixed(1);
      return `${addSign(parseFloat(formatted))}k`;
    }
    case 'attack':
    case 'life':
    case 'speed':
    case 'load':
    case 'critical_odds':
    case 'critical_damage': {
      const formatted = (numValue / 100).toFixed(1);
      return `${addSign(parseFloat(formatted))}%`;
    }
    default:
      return addSign(numValue);
  }
};
