import { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Typography, Alert } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getMythicMounts } from '../services/mythicMountsCache';
import { MYTHIC_MOUNTS_NAMES, STAT_CONFIG } from '../config/constants';
import { statIcons, formatStatValue } from '../utils/formatters';
import { getEventIconUrl } from '../utils/imageUtils';
import styles from './MountsList.module.css';

const { Text } = Typography;

const MountsList = () => {
  const [mounts, setMounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchMounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getMythicMounts();
      const sortedData = data
        ? data.sort((a, b) => a.mount_id - b.mount_id)
        : [];
      setMounts(sortedData);
    } catch (err) {
      console.error('Failed to fetch mounts:', err);
      setError(err.message || 'Failed to load mounts data');
      setMounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMounts();
  }, [fetchMounts]);

  const handleMountClick = (id) => {
    navigate(`/mount/${id}`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <div className={styles.spinner}>Loading mounts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.pageContainer}>
        <Alert
          title="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <Row gutter={[16, 16]}>
      {mounts.map((item) => {
        const data = typeof item.data === 'string'
          ? JSON.parse(item.data)
          : item.data || {};

        const level1Stats = data['1'] || {};

        return (
          <Col key={item.mount_id} xs={24} sm={24} md={12} lg={12} xl={12}>
            <Card
              hoverable
              className={styles.mountCardWrap}
              styles={{ body: { padding: 1 } }}
              onClick={() => handleMountClick(item.mount_id)}
              onKeyDown={(e) =>
                (e.key === 'Enter' || e.key === ' ') &&
                handleMountClick(item.mount_id)
              }
              tabIndex={0}
              role="button"
            >
              <div className={styles.mountCard}>
                <div className={styles.thumb}>
                  <img
                    src={`/mounts/${item.mount_id}.png`}
                    alt={MYTHIC_MOUNTS_NAMES[item.mount_id] || 'Mount'}
                    className={styles.thumbImg}
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjNjY3ZWVhIi8+PHRleHQgeD0iNTAlJSIgeT0iNTAlJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
                    }}
                  />
                </div>

                <div className={styles.mountInfo}>
                  <Text className={styles.mountName}>
                    {MYTHIC_MOUNTS_NAMES[item.mount_id] || `Mount #${item.mount_id}`}
                  </Text>

                  <div className={styles.mountStats}>
                    {STAT_CONFIG.map((config) => {
                      const value = level1Stats[config.key];
                      if (value === undefined || value === null) return null;

                      const formattedValue = formatStatValue(config.key, value);
                      const numValue = parseFloat(value || 0);

                      let iconSrc = statIcons[config.key];
                      if (numValue < 0) {
                        if (config.key === 'attack') {
                          iconSrc = getEventIconUrl('skill_de_attack');
                        } else if (config.key === 'life') {
                          iconSrc = getEventIconUrl('skill_de_blood');
                        }
                      }

                      return (
                        <div key={config.key} className={styles.mountStat}>
                          {iconSrc ? (
                            <img
                              src={iconSrc}
                              className={styles.mountStatIcon}
                              alt={config.key}
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          ) : (
                            <span className={styles.mountStatIconPlaceholder} />
                          )}
                          <Text>{formattedValue}</Text>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        );
      })}
      </Row>
    </div>
  );
};

export default MountsList;
