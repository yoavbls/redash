import React from 'react';
import PropTypes from 'prop-types';
import { react2angular } from 'react2angular';
import JsxParser from 'react-jsx-parser';
import FormatTime from '@/components/cell-components/FormatTime';
import StatusTime from '@/components/cell-components/StatusTime';
import StatusExpression from '@/components/cell-components/StatusExpression';
import ShowExpression from '@/components/cell-components/ShowExpression';
import BarPercents from '@/components/cell-components/BarPercents';
import BatteryPercents from '@/components/cell-components/BatteryPercents';
import moment from 'moment/min/moment-with-locales';
import * as AntdComponents from 'antd';

export function JsxParse({ jsx }) {
  return (
    <JsxParser
      bindings={{}}
      components={{
        BarPercents,
        FormatTime,
        StatusTime,
        BatteryPercents,
        StatusExpression,
        ShowExpression,
        ...AntdComponents,
      }}
      jsx={jsx}
    />
  );
}

JsxParse.propTypes = {
  jsx: PropTypes.string,
};

JsxParse.defaultProps = {
  jsx: '',
};

export default function init(ngModule) {
  ngModule.component('jsxParse', react2angular(JsxParse));
}

init.init = true;
