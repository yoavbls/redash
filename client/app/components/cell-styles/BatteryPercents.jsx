import React from 'react';
import PropTypes from 'prop-types';
import { react2angular } from 'react2angular';
import Tooltip from 'antd/lib/tooltip';
import './battery-percents.css'; // Import regular stylesheet


export function BatteryPercents({ percents }) {
  let severity = '';
  if (percents > 100) {
    percents = 100;
  }
  if (percents <= 20) {
    severity = 'battery-warn';
  }
  if (percents <= 10) {
    severity = 'battery-alert';
  }
  const percentsStyle = {
    height: percents + '%',
  };
  if (percents >= 0) {
    return (
      <div>
        <Tooltip title={percents + '%'}>
          <div className="battery">
            <div className={'battery-level ' + severity} style={percentsStyle} />
          </div>
        </Tooltip>
      </div>
    );
  }
}

BatteryPercents.propTypes = {
  percents: PropTypes.number,
};

BatteryPercents.defaultProps = {
  percents: undefined,
};

export default function init(ngModule) {
  ngModule.component('batteryPercents', react2angular(BatteryPercents, ['percents']));
}

init.init = true;
