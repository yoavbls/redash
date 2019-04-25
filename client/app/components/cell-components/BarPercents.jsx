import React from 'react';
import PropTypes from 'prop-types';
import optionalTooltip from '@/components/cell-components/ComponentsUtils';
import './styles/bar-percents.css';

export default function BarPercents({ percents, danger, warning, message }) {
  let severity = '';
  if (percents > 100) {
    percents = 100;
  }
  if (percents >= warning) {
    severity = 'bar-warning';
  }
  if (percents >= danger) {
    severity = 'bar-danger';
  }
  const percentsStyle = { width: percents + '%' };
  const element = percents >= 0 ? (
    <div className="bar">
      <div className={'bar-level ' + severity} style={percentsStyle} />
    </div>
  ) : null;

  return (
    <span>{ optionalTooltip(element, message, percents + '%')}</span>
  );
}

BarPercents.propTypes = {
  percents: PropTypes.number,
  danger: PropTypes.number,
  warning: PropTypes.number,
  message: PropTypes.string,
};

BarPercents.defaultProps = {
  percents: undefined,
  danger: 90,
  warning: 80,
  message: false,
};
