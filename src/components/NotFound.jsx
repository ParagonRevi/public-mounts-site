import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import { WarningOutlined } from '@ant-design/icons';
import styles from './NotFound.module.css';

const NotFound = ({ title = '404', subTitle, backPath = '/' }) => {
  return (
    <div className={styles.container}>
      <Result
        icon={<WarningOutlined className={styles.icon} />}
        title={title}
        subTitle={subTitle || 'The page you are looking for does not exist.'}
        extra={
          <Link to={backPath}>
            <Button type="primary">Back to Home</Button>
          </Link>
        }
        className={styles.result}
      />
    </div>
  );
};

export default NotFound;
