/*global require,loadingDialogInstance*/

define(['tableModule', 'actions', 'tooltip'],
  function(tableModule, actions, tooltip) {
    'use strict';
    return function main() {
      loadingDialogInstance.open();
      tableModule.main();
      actions.main();
      tooltip.main();
      $j('#btn-student-contacts').attr({
        'class': 'selected'
      });
    }
  });
