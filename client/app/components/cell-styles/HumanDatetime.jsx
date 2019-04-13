import React from 'react';
import PropTypes from 'prop-types';
import { react2angular } from 'react2angular';
import Tooltip from 'antd/lib/tooltip';
import moment from 'moment';
import 'moment/locale/he';

export function HumanDatetime({ time, from, danger, warn, locale }) {
  time = moment(time);
  let useFrom = true;
  if (!from) {
    from = moment();
    useFrom = false;
  } else {
    from = moment(from);
  }

  const relativeTime = time.locale(locale).from(from, useFrom);
  const actualTime = time.format('YYYY-MM-DD h:mm:ss');
  const dangerTime = moment(time).add(Number(danger.split(' ')[0]), danger.split(' ')[1]);
  const warnTime = moment(time).add(Number(warn.split(' ')[0]), warn.split(' ')[1]);
  let severity = 'success';

  if (warnTime < from) {
    severity = 'warning';
  }
  if (dangerTime < from) {
    severity = 'danger';
  }

  return (
    <div>
      <Tooltip title={actualTime} placement="bottom">
        <span className={'label label-' + severity}>{relativeTime}</span>
      </Tooltip>
    </div>
  );
}

HumanDatetime.propTypes = {
  time: PropTypes.string,
  from: PropTypes.string,
  danger: PropTypes.string,
  warn: PropTypes.string,
  locale: PropTypes.string,
};

HumanDatetime.defaultProps = {
  time: moment(),
  from: null,
  danger: '14 days',
  warn: '3 days',
  locale: 'he',
};

export default function init(ngModule) {
  ngModule.component('humanDatetime', react2angular(HumanDatetime));
}

init.init = true;
