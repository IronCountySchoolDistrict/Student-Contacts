/*global require,loadingDialogInstance*/

import {tableModule} from './tableModule';
import {actions} from './actions';
import {tooltip} from './tooltip';

export function main() {
  loadingDialogInstance.open();
  tableModule.main();
  actions.main();
  tooltip.main();
  $j('#btn-student-contacts').attr({
    'class': 'selected'
  });
}
