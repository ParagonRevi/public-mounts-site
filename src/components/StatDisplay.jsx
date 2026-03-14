import { Descriptions } from 'antd';
import { formatStatValue, statIcons } from '../utils/formatters.js';
import { getEventIconUrl } from '../utils/imageUtils.js';
import { STAT_CONFIG } from '../config/constants.js';
import styles from './StatDisplay.module.css';

const StatDisplay = ({ calculatedStats }) => {
  return (
    <>
      <Descriptions column={1} size="small" colon={false} className={styles.descriptions}>
        {STAT_CONFIG.map((config) => {
          const stat = calculatedStats[config.key];
          if (!stat || stat.total === 0) return null;

          const formattedBase = formatStatValue(config.key, stat.base);
          const formattedBonus = formatStatValue(config.key, stat.bonus);
          const formattedGear = formatStatValue(config.key, stat.gear);
          const formattedTotal = formatStatValue(config.key, stat.total);

          let iconSrc = statIcons[config.key];
          if (stat.total < 0) {
            if (config.key === 'attack') {
              iconSrc = getEventIconUrl('skill_de_attack');
            } else if (config.key === 'life') {
              iconSrc = getEventIconUrl('skill_de_blood');
            }
          }

          const label = (
              <span style={{ display: "flex", alignItems: "center" }}>
              <img
                  src={iconSrc}
                  alt={config.key}
                  style={{ width: 24, height: 24, marginRight: 8 }}
              />
              <span>{config.title}</span>
            </span>
          );

          return (
            <Descriptions.Item label={label} key={config.key}>
              <span className="stat-total">{formattedTotal}</span>{' '}
              <span className={styles.breakdown}>(</span>
              <span className="stat-base">{formattedBase}</span>
              <span className={styles.breakdown}> + </span>
              <span className="stat-bonus">{formattedBonus}</span>
              {stat.gear !== 0 && (
                <>
                  <span className={styles.breakdown}> + </span>
                  <span className="stat-gear">{formattedGear}</span>
                </>
              )}
              <span className={styles.breakdown}>)</span>
            </Descriptions.Item>
          );
        })}
      </Descriptions>

      <div className={styles.legend}>
        <ul>
          <li>
            <strong className="stat-base">Base</strong> — the mount's original
            stat at the selected level.
          </li>
          <li>
            <strong className="stat-bonus">Bonus</strong> — additional stat
            points gained from the mount's star tier (advance) upgrades.
          </li>
          <li>
            <strong className="stat-gear">Gear</strong> — stat points from
            equipped items.
          </li>
          <li>
            <strong className="stat-total">Total</strong> — the sum of all
            stats, representing the mount's effective power.
          </li>
        </ul>
      </div>
    </>
  );
};

export default StatDisplay;
