import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Tag } from 'antd';
import PropTypes from 'prop-types';

import styles from './RelatedMounts.module.css';
import { MYTHIC_MOUNTS_NAMES } from '../config/constants.js';
import { getMythicMounts } from '../services/mythicMountsCache.js';

const safeParseFloat = (value) => {
  if (typeof value !== 'string' || value.trim() === '') return 0;
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getStatProfile = (stats) => {
  if (!stats) return 'unknown';
  const attack = safeParseFloat(stats.attack);
  const life = safeParseFloat(stats.life);

  const attackProfile = attack > 0 ? '+atk' : attack < 0 ? '-atk' : '';
  const lifeProfile = life > 0 ? '+life' : life < 0 ? '-life' : '';

  return `${attackProfile}${lifeProfile}` || 'neutral';
};

const RelatedMounts = ({ currentMount, mountId }) => {
  const [relatedMounts, setRelatedMounts] = useState([]);

  useEffect(() => {
    const run = async () => {
      if (!currentMount?.levels?.['1']) return;

      const currentProfile = getStatProfile(currentMount.levels['1']);
      if (currentProfile === 'unknown' || currentProfile === 'neutral') return;

      try {
        const allMounts = await getMythicMounts();

        const similar = allMounts
          .filter((m) => String(m.mount_id) !== String(mountId))
          .map((m) => {
            const data = typeof m.data === 'string' ? JSON.parse(m.data) : m.data;
            const level1Stats = data?.['1'];
            return { ...m, level1Stats };
          })
          .filter((m) => m.level1Stats && getStatProfile(m.level1Stats) === currentProfile)
          .slice(0, 6);

        setRelatedMounts(similar);
      } catch {
        // тихо игнорируем — блок просто не показываем
      }
    };

    run();
  }, [currentMount, mountId]);

  if (relatedMounts.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Related:</span>
      <div className={styles.list}>
        {relatedMounts.map((mount) => (
          <Link
            key={mount.mount_id}
            to={`/mount/${mount.mount_id}`}
            className={styles.link}
          >
            <Tag className={styles.tag} icon={<img
              src={`/mounts/${mount.mount_id}.png`}
              alt=""
              className={styles.icon}
              onError={(e) => (e.target.style.display = 'none')}
            />}>
              <span>{MYTHIC_MOUNTS_NAMES[mount.mount_id] || `Mount #${mount.mount_id}`}</span>
            </Tag>
          </Link>
        ))}
      </div>
    </div>
  );
};

RelatedMounts.propTypes = {
  currentMount: PropTypes.object,
  mountId: PropTypes.string.isRequired,
};

export default RelatedMounts;
