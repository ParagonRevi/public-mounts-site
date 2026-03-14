import { Typography, Slider, Switch, Form, Row, Col } from 'antd';
import styles from './Controls.module.css';

const { Title } = Typography;

const Controls = ({
  useMaxLevel,
  handleMaxLevelToggle,
  useMaxGear,
  handleMaxGearToggle,
  selectedLevel,
  handleLevelSliderChange,
  maxLevel,
  levelMarks,
  hasGear,
}) => {
  return (
    <>
      <Form layout="inline" className={styles.form}>
        <Row gutter={[16, 16]}>
          <Col>
            <Form.Item label="Max Mount Level">
              <Switch checked={useMaxLevel} onChange={handleMaxLevelToggle} />
            </Form.Item>
          </Col>
          {hasGear && (
            <Col>
              <Form.Item label="Max Gear Levels">
                <Switch checked={useMaxGear} onChange={handleMaxGearToggle} />
              </Form.Item>
            </Col>
          )}
        </Row>
      </Form>

      <Title level={4} className={styles.title}>
        Select Level: {selectedLevel}
      </Title>
      <Slider
        min={1}
        max={maxLevel}
        value={selectedLevel}
        onChange={handleLevelSliderChange}
        className={styles.slider}
        marks={levelMarks}
      />
    </>
  );
};

export default Controls;
