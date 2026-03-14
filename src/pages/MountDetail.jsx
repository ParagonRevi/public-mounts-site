import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Row, Col, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase';
import { MYTHIC_MOUNTS_NAMES, STAT_CONFIG } from '../config/constants';
import styles from './MountDetail.module.css';
import StatDisplay from '../components/StatDisplay';
import StarRating from '../components/StarRating';
import Controls from '../components/Controls';
import MountHeader from '../components/MountHeader';
import GearSection from '../components/GearSection';
import RelatedMounts from '../components/RelatedMounts';
import NotFound from '../components/NotFound';

const safeParseInt = (value, defaultValue = 0) => {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

const MountDetail = () => {
  const { id: mountId } = useParams();
  const navigate = useNavigate();

  const [mountData, setMountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const [selectedLevel, setSelectedLevel] = useState(1);
  const [gearLevels, setGearLevels] = useState({});

  const [useMaxLevel, setUseMaxLevel] = useState(false);
  const [useMaxGear, setUseMaxGear] = useState(false);

  const [prevSelectedLevel, setPrevSelectedLevel] = useState(1);
  const [prevGearLevels, setPrevGearLevels] = useState({});

  const maxLevel =
    mountData?.advance?.length > 0
      ? Math.max(...mountData.advance.map((a) => safeParseInt(a.max_level, 1)))
      : 100;

  const fetchMountDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      const { data, error: supabaseError } = await supabase
        .from('gds_mounts')
        .select('mount_id, data, advance_data, gear_data')
        .eq('mount_id', parseInt(mountId))
        .not('advance_data', 'is', null)
        .single();

      if (supabaseError) {
        if (supabaseError.code === 'PGRST116') {
          // Row not found
          setNotFound(true);
          setLoading(false);
          return;
        }
        throw supabaseError;
      }
      
      if (!data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const parsedData =
        typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
      const parsedAdvance = Array.isArray(data.advance_data)
        ? data.advance_data
        : typeof data.advance_data === 'string'
          ? JSON.parse(data.advance_data)
          : [];
      const parsedGear =
        typeof data.gear_data === 'string'
          ? JSON.parse(data.gear_data)
          : data.gear_data;

      const formattedData = {
        mount_id: data.mount_id,
        name: MYTHIC_MOUNTS_NAMES[data.mount_id] || `Mount #${data.mount_id}`,
        levels: parsedData,
        advance: parsedAdvance,
        gear: parsedGear,
      };

      setMountData(formattedData);
    } catch (err) {
      setError(err.message);
      message.error(err.message);
      setMountData(null);
    } finally {
      setLoading(false);
    }
  }, [mountId]);

  useEffect(() => {
    fetchMountDetails();
  }, [fetchMountDetails]);

  useEffect(() => {
    if (mountData?.gear) {
      const initialLevels = {};
      for (const gearId in mountData.gear) {
        initialLevels[gearId] = 0;
      }
      setGearLevels(initialLevels);
      setPrevGearLevels(initialLevels);
    }
  }, [mountData]);

  const handleMaxLevelToggle = (checked) => {
    setUseMaxLevel(checked);
    if (checked) {
      setPrevSelectedLevel(selectedLevel);
      setSelectedLevel(maxLevel);
    } else {
      setSelectedLevel(prevSelectedLevel);
    }
  };

  const handleMaxGearToggle = (checked) => {
    setUseMaxGear(checked);
    if (checked) {
      setPrevGearLevels({ ...gearLevels });
      const maxLevels = Object.keys(mountData.gear || {}).reduce(
        (acc, gearId) => {
          acc[gearId] = Object.keys(mountData.gear[gearId]).length;
          return acc;
        },
        {},
      );
      setGearLevels(maxLevels);
    } else {
      setGearLevels({ ...prevGearLevels });
    }
  };

  const handleLevelSliderChange = (level) => {
    setSelectedLevel(level);
    if (useMaxLevel) {
      setUseMaxLevel(false);
    }
    setPrevSelectedLevel(level);
  };

  const handleGearLevelChange = (newLevels) => {
    setGearLevels(newLevels);
    if (useMaxGear) {
      setUseMaxGear(false);
    }
    setPrevGearLevels(newLevels);
  };

  const { calculatedStats, currentStars } = useMemo(() => {
    if (!mountData || !mountData.levels || !mountData.advance) {
      return { calculatedStats: null, currentStars: '0' };
    }

    const baseStats = mountData.levels[selectedLevel] || {};

    const currentStarTier = mountData.advance.find(
      (adv) => selectedLevel <= safeParseInt(adv.max_level),
    );

    const bonusStats = currentStarTier || {};
    const stars = currentStarTier ? currentStarTier.star : '0';

    const finalStats = {};
    STAT_CONFIG.forEach((config) => {
      const baseValue = safeParseInt(baseStats[config.key]);
      const bonusValue = safeParseInt(bonusStats[config.key]);

      let gearValue = 0;
      if (mountData.gear && Object.keys(gearLevels).length > 0) {
        for (const gearId in mountData.gear) {
          const level = gearLevels[gearId] ?? 0;
          if (level > 0) {
            const gearItemData = mountData.gear[gearId][level];
            if (gearItemData) {
              gearValue += safeParseInt(gearItemData[config.key]);
            }
          }
        }
      }

      finalStats[config.key] = {
        base: baseValue,
        bonus: bonusValue,
        gear: gearValue,
        total: baseValue + bonusValue + gearValue,
      };
    });

    return { calculatedStats: finalStats, currentStars: stars };
  }, [selectedLevel, mountData, gearLevels]);

  const levelMarks = useMemo(() => {
    const marks = { 1: '1' };
    for (let i = 20; i <= maxLevel; i += 10) {
      marks[i] = i.toString();
    }
    marks[maxLevel] = maxLevel.toString();
    return marks;
  }, [maxLevel]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Loading mount details..." />
      </div>
    );
  }

  if (notFound) {
    return (
      <NotFound
        title="404"
        subTitle={`Mount #${mountId} not found`}
        backPath="/"
      />
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <Button
          onClick={() => navigate('/')}
          icon={<ArrowLeftOutlined />}
          className={styles.backButton}
        >
          Back to list
        </Button>
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Button
        onClick={() => navigate('/')}
        icon={<ArrowLeftOutlined />}
        className={styles.backButton}
      >
        Back to list
      </Button>

      <MountHeader mountId={mountId} mountName={mountData.name} />
      <RelatedMounts currentMount={mountData} mountId={mountId} />

      {calculatedStats && (
            <div className={`${styles.glassCard} ${styles.controls}`}>
              <div className={styles.section}>
                <Controls
                  useMaxLevel={useMaxLevel}
                  handleMaxLevelToggle={handleMaxLevelToggle}
                  useMaxGear={useMaxGear}
                  handleMaxGearToggle={handleMaxGearToggle}
                  selectedLevel={selectedLevel}
                  handleLevelSliderChange={handleLevelSliderChange}
                  maxLevel={maxLevel}
                  levelMarks={levelMarks}
                  hasGear={
                    mountData.gear && Object.keys(mountData.gear).length > 0
                  }
                />

                <StarRating stars={currentStars} />
                <StatDisplay calculatedStats={calculatedStats} />
              </div>
            </div>
      )}

      <div className={styles.glassCard}>
        <div className={styles.section}>
          <GearSection
            gearData={mountData.gear}
            gearLevels={gearLevels}
            onLevelChange={handleGearLevelChange}
          />
        </div>
      </div>
    </div>
  );
};

export default MountDetail;
