import { Component } from 'react';
import { Button, Result } from 'antd';
import { BugOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <Result
            icon={<BugOutlined className={styles.icon} />}
            title="Something went wrong"
            subTitle={
              this.state.error?.message || 'An unexpected error occurred'
            }
            extra={
              <Button type="primary" onClick={this.handleReset}>
                Go Home
              </Button>
            }
            className={styles.result}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
