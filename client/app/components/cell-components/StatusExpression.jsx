/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import optionalTooltip from '@/components/cell-components/ComponentsUtils';

export default function StatusExpression({ value, danger, warning, message, children }) {
  let severity = 'success';
  let childStyle = {};

  try {
    if (eval(warning)) {
      severity = 'warning';
      childStyle = { filter: 'grayscale(100%)' };
    }
    if (eval(danger)) {
      severity = 'danger';
      childStyle = { filter: 'grayscale(100%)' };
    }
  } catch (e) {
    console.log('Error in expression evaluate', e);
  }

  const element = children ?
    <span style={childStyle}>{children}</span> :
    <span className={'label label-' + severity}>{value}</span>;

  return (
    <div>{ optionalTooltip(element, message, value)}</div>
  );
}

StatusExpression.propTypes = {
  danger: PropTypes.string,
  warning: PropTypes.string,
  value: PropTypes.string,
  message: PropTypes.string,
};

StatusExpression.defaultProps = {
  danger: false,
  warning: false,
  value: '',
  message: false,
};
