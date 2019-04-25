import React from 'react';
import PropTypes from 'prop-types';
import optionalTooltip from '@/components/cell-components/ComponentsUtils';
import './styles/battery-percents.css';

export default function BatteryPercents({ percents, danger, warning, message }) {
  let severity = '';
  if (percents > 100) {
    percents = 100;
  }
  if (percents <= warning) {
    severity = 'battery-warning';
  }
  if (percents <= danger) {
    severity = 'battery-danger';
  }
  const percentsStyle = { height: percents + '%' };
  const element = percents >= 0 ? (
    <div className="battery">
      <div className={'battery-level ' + severity} style={percentsStyle} />
    </div>
  ) : null;

  return (
    <span>{ optionalTooltip(element, message, percents + '%')}</span>
  );
}

BatteryPercents.propTypes = {
  percents: PropTypes.number,
  danger: PropTypes.number,
  warning: PropTypes.number,
  message: PropTypes.string,
};

BatteryPercents.defaultProps = {
  percents: undefined,
  danger: 10,
  warning: 20,
  message: false,
};
