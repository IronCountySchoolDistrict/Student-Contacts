/*global require,loadingDialogInstance*/
require.config({
    paths: {
        // app modules
        'tableModule': '/scripts/student-contacts/js/student-contacts-update/table-module',
        'service': '/scripts/student-contacts/js/student-contacts-update/service',
        'actions': '/scripts/student-contacts/js/student-contacts-update/actions',
        'config': '/scripts/student-contacts/js/student-contacts-update/config',
        'tooltip': '/scripts/student-contacts/js/student-contacts-update/tooltip',
        'jquery.inputmask': '/scripts/student-contacts/lib/jquery.inputmask',
        'inputmask': '/scripts/student-contacts/lib/inputmask',
        'dependencyLib': '/scripts/student-contacts/lib/dependencyLib',
        'inputmask.extensions': '/scripts/student-contacts/lib/inputmask.extensions',

        'parsley': '//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.5/parsley',
        'underscore': 'underscore/underscore'
    }
});

require(['tableModule', 'actions', 'tooltip'],
    function (tableModule, actions, tooltip) {
        'use strict';
        loadingDialogInstance.open();
        tableModule.main();
        actions.main();
        tooltip.main();
        $j('#btn-student-contacts').attr({'class': 'selected'});
    });
