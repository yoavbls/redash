import React from 'react';
import PropTypes from 'prop-types';
import { react2angular } from 'react2angular';
import moment from 'moment';
import 'moment/locale/he';

export function StatusExpression({ danger, warning, value, children, $element }) {
  console.log($element);
  const elementStyle = { filter: 'grayscale(100%)' };
  let element = value ? <span className="label label-success">{value}</span> : { children };
  if (warning && eval(warning)) {
    element = value ? <span className="label label-warning">{value}</span> : <span style={elementStyle}>{ children }</span>;
  }
  if (danger && eval(danger)) {
    element = value ? <span className="label label-danger">{value}</span> : <span style={elementStyle}>{ children }</span>;
  }

  return (
    <span>{element}</span>
  );
}

StatusExpression.propTypes = {
  danger: PropTypes.string,
  warning: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
};

StatusExpression.defaultProps = {
  danger: '',
  warning: '',
  value: '',
  children: null,
};

export default function init(ngModule) {
  ngModule.component('statusExpression', react2angular(StatusExpression, ['danger', 'warning', 'value'], ['$element']));
}

init.init = true;
