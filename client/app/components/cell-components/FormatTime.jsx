/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
import cronstrue from 'cronstrue/i18n';
import moment from 'moment/min/moment-with-locales';

export default function FormatTime({ value, toFormat, fromFormat, locale }) {
  let formatedTime = null;
  const time = fromFormat ? moment(value, fromFormat) : moment(value);

  if (String(value).indexOf('*') !== -1) {
    formatedTime = cronstrue.toString(value, { locale, use24HourTimeFormat: true });
  } else {
    if (toFormat && toFormat !== 'fromNow') {
      formatedTime = time.locale(locale).format(toFormat);
    } else {
      formatedTime = time.locale(locale).fromNow();
    }
  }
  return (
    <span>{formatedTime}</span>
  );
}

FormatTime.defaultProps = {
  value: moment(),
  toFormat: null,
  fromFormat: null,
  locale: 'he',
};

FormatTime.propTypes = {
  value: PropTypes.string,
  toFormat: PropTypes.string,
  fromFormat: PropTypes.string,
  locale: PropTypes.string,
};
