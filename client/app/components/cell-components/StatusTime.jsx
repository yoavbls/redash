import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import optionalTooltip from '@/components/cell-components/ComponentsUtils';

export default function StatusTime({ value, from, danger, warning, locale, message, children }) {
  const time = moment(value);
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
  const warningTime = moment(time).add(Number(warning.split(' ')[0]), warning.split(' ')[1]);
  let severity = 'success';
  let childStyle = {};

  if (warningTime < from) {
    severity = 'warning';
    childStyle = { filter: 'grayscale(100%)' };
  }
  if (dangerTime < from) {
    severity = 'danger';
    childStyle = { filter: 'grayscale(100%)' };
  }

  const element = children ?
    <span style={childStyle}>{children}</span> :
    <span className={'label label-' + severity}>{relativeTime}</span>;

  return (
    optionalTooltip(element, message, actualTime)
  );
}

StatusTime.defaultProps = {
  value: moment(),
  from: null,
  danger: '14 days',
  warning: '3 days',
  locale: 'he',
  message: false,
};

StatusTime.propTypes = {
  value: PropTypes.string,
  from: PropTypes.string,
  danger: PropTypes.string,
  warning: PropTypes.string,
  locale: PropTypes.string,
  message: PropTypes.string,
};
