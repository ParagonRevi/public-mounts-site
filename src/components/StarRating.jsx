import { Image } from 'antd';
import { getEventIconUrl } from '../utils/imageUtils.js';
import styles from './StarRating.module.css';

const StarRating = ({ stars }) => {
  const starCount = parseInt(stars, 10) || 0;

  if (starCount === 0) {
    return <div className={styles.empty} />;
  }

  const starIcons = [];
  const totalSlots = 5;

  if (starCount <= 5) {
    for (let i = 0; i < starCount; i++) {
      starIcons.push(
        <Image
          key={`star-yellow-${i}`}
          src={getEventIconUrl('icon_hero_star')}
          preview={false}
          width={24}
          className={styles.star}
        />,
      );
    }
  } else {
    const redStars = Math.min(totalSlots, starCount - 5);
    const yellowStars = totalSlots - redStars;

    for (let i = 0; i < redStars; i++) {
      starIcons.push(
        <Image
          key={`star-red-${i}`}
          src={getEventIconUrl('icon_hero_star_red')}
          preview={false}
          width={24}
          className={styles.star}
        />,
      );
    }
    for (let i = 0; i < yellowStars; i++) {
      starIcons.push(
        <Image
          key={`star-yellow-${i}`}
          src={getEventIconUrl('icon_hero_star')}
          preview={false}
          width={24}
          className={styles.star}
        />,
      );
    }
  }

  return (
    <div className={styles.container}>
      {starIcons}
    </div>
  );
};

export default StarRating;
