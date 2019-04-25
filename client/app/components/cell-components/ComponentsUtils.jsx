
import React from 'react';
import Tooltip from 'antd/lib/tooltip';

export default function optionalTooltip(element, message, value) {
  let wrapper = <div>{element}</div>;
  if (message !== false) {
    if (message && message.length) {
      message = <div style={{ textAlign: 'center' }}>{message}<br /></div>;
    }
    wrapper = <Tooltip title={<span>{message} {value} </span>}>{element}</Tooltip>;
  }
  return wrapper;
}
