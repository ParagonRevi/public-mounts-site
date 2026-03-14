// MountHeader.jsx
import React from "react";
import { Typography, Image } from "antd";
import styles from "./MountHeader.module.css";
import {MYTHIC_MOUNTS_NAMES} from "../config/constants.js";

const { Title, Text } = Typography;

const MountHeader = ({ mountId }) => {
  const mountName = MYTHIC_MOUNTS_NAMES[mountId] || "Unknown Mount";

  return (
    <div className={styles.wrap}>
      <Image
        width={64}
        height={64}
        src={`/mounts/${mountId}.png`}
        preview={false}
        className={styles.icon}
        alt={mountName}
        fallback="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjNjY3ZWVhIi8+PHRleHQgeD0iNTAlJSIgeT0iNTAlJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="
      />
      <div>
        <Title level={2} className={styles.title}>
          {mountName}
        </Title>
        <Text className={styles.id}>ID: {mountId}</Text>
      </div>
    </div>
  );
};

export default MountHeader;
