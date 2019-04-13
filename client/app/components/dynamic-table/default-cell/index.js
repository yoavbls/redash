import { includes, identity } from 'lodash';
import { renderDefault, renderImage, renderLink, renderHTML } from './utils';
import { HumanDatetime } from '@/components/cell-styles/HumanDatetime';
import { BatteryPercents } from '@/components/cell-styles/BatteryPercents';
import { StatusExpression } from '@/components/cell-styles/StatusExpression';
import '@/components/cell-styles/HelloWord.ts';
import template from './template.html';

const renderFunctions = {
  image: renderImage,
  link: renderLink,
  html: renderHTML,
};

export default function init(ngModule) {
  ngModule.directive('dynamicTableDefaultCell', ($sce, $compile) => ({
    template,
    restrict: 'E',
    replace: true,
    scope: {
      column: '=',
      row: '=',
    },
    link: ($scope, $element) => {
      // `dynamicTable` will recreate all table cells if some columns changed.
      // This means two things:
      // 1. `column` object will be always "fresh" - no need to watch it.
      // 2. we will always have a column object already available in `link` function.
      // Note that `row` may change during this directive's lifetime.      
      const renderValue = renderFunctions[$scope.column.displayAs] || renderDefault;
      const temp = `<div>${renderValue($scope.column, $scope.row)}</div>`;

      if (($scope.column.displayAs === 'string' && $scope.column.allowHTML) || includes(['image', 'link', 'html'], $scope.column.displayAs)) {
        $element.append($compile(temp)($scope));
      } else {
        $element.append(`${temp}`);
      }
    },
  }));
}

init.init = true;
