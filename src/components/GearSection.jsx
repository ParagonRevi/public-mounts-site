import React from 'react';
import { Typography, Slider, Descriptions, Col, Row } from 'antd';
import { formatStatValue, statIcons } from '../utils/formatters.js';
import { getEventIconUrl } from '../utils/imageUtils.js';
import { STAT_CONFIG } from '../config/constants.js';
import { GEAR_NAMES } from '../config/gearNames.js';
import styles from './GearSection.module.css';

const { Title } = Typography;

const safeParseInt = (value, defaultValue = 0) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

const GearSection = ({ gearData, gearLevels, onLevelChange }) => {
  if (!gearData || Object.keys(gearData).length === 0) return null;

  const handleLevelChange = (gearId, level) => {
    onLevelChange((prev) => ({ ...prev, [gearId]: level }));
  };

  return (
    <div className={styles.wrap}>
      <Title level={3} className={styles.title}>
        Equipment
      </Title>

      <div className={styles.gridShell}>
        <div className={styles.gridInner}>
          <Row gutter={[16, 16]}>
            {Object.entries(gearData).map(([gearId, gearItemLevels]) => {
              const selectedLevel = gearLevels[gearId] ?? 0;
              const gearStats =
                selectedLevel > 0 ? gearItemLevels[selectedLevel] : null;
              const maxLevel = Object.keys(gearItemLevels).length;

              const picId = gearItemLevels['1']?.pic;
              const gearName = GEAR_NAMES[picId] || gearId;

              const marks = {};
              for (let i = 0; i <= maxLevel; i++) marks[i] = String(i);

              return (
                <Col xs={24} sm={12} md={8} key={gearId}>
                  <div className={styles.card}>
                    <Title level={5} className={styles.cardTitle}>
                      {gearName}
                    </Title>

                    <div className={styles.slider}>
                      <Slider
                        min={0}
                        max={maxLevel}
                        value={selectedLevel}
                        onChange={(level) => handleLevelChange(gearId, level)}
                        marks={marks}
                      />
                    </div>

                    <Descriptions
                      column={1}
                      size="small"
                      colon={false}
                      className={styles.desc}
                    >
                      {STAT_CONFIG.map((config) => {
                        const statValue = gearStats
                          ? safeParseInt(gearStats[config.key])
                          : 0;
                        if (statValue === 0) return null;

                        const formattedValue = formatStatValue(
                          config.key,
                          statValue,
                        );

                        let iconSrc = statIcons[config.key];
                        if (statValue < 0) {
                          if (config.key === 'attack')
                            iconSrc = getEventIconUrl('skill_de_attack');
                          else if (config.key === 'life')
                            iconSrc = getEventIconUrl('skill_de_blood');
                        }

                        const label = (
                          <span className={styles.label}>
                            {iconSrc ? (
                              <img
                                src={iconSrc}
                                alt={config.key}
                                className={styles.labelIcon}
                                onError={(e) => (e.target.style.display = 'none')}
                              />
                            ) : (
                              <span className={styles.labelIconPlaceholder} />
                            )}
                            <span>{config.title}</span>
                          </span>
                        );

                        return (
                          <Descriptions.Item label={label} key={config.key}>
                            <span
                              className={
                                statValue > 0 ? styles.pos : styles.neg
                              }
                            >
                              {formattedValue}
                            </span>
                          </Descriptions.Item>
                        );
                      })}
                    </Descriptions>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default GearSection;
