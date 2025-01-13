'use client';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      color: 'white',
      textColor: 'black',
    };
  }

  componentDidMount() {
    const { type, duration } = this.props;
    this.setMessageType(type);

    this.timeoutId = setTimeout(() => {
      this.setState({ show: false });
    }, duration * 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  setMessageType(type) {
    if (type === 'error') {
      this.setState({ color: 'red', textColor: 'white' });
    } else if (type === 'success') {
      this.setState({ color: 'green', textColor: 'white' });
    } else if (type === 'warning') {
      this.setState({ color: 'orange', textColor: 'white' });
    } else {
      this.setState({ color: 'white', textColor: 'black' });
    }
  }

  render() {
    const { text } = this.props;
    const { show, color, textColor } = this.state;

    const animate = {
      initial: {
        y: -100,
        opacity: 1,
      },
      open: {
        y: 0,
        backgroundColor: color,
        color: textColor,
        opacity: 1,
      },
      closed: {
        y: -100,
        opacity: 1,
        backgroundColor: color,
        color: textColor,
      },
    };

    return (
      <div>
        {show && (
          <motion.div
            initial="closed"
            animate={show ? 'open' : 'closed'}
            variants={animate}
            style={{
              padding: '10px 20px',
              position: 'fixed',
              borderRadius: '10px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 9999,
              boxShadow: '3px 3px 6px rgba(0, 0, 0, .3)',
            }}
          >
            {text}
          </motion.div>
        )}
      </div>
    );
  }
}

Message.success = (props) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return ReactDOM.render(<Message {...props} type="success" />, div);
};

Message.error = (props) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return ReactDOM.render(<Message {...props} type="error" />, div);
};

Message.warning = (props) => {
  const div = document.createElement('div');
  document.body.appendChild(div);
  return ReactDOM.render(<Message {...props} type="warning" />, div);
};

export default Message;
