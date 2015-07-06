/*global require,loadingDialogInstance*/
require.config({
    paths: {
        // app modules
        tableModule: '/* @echo IMAGE_SERVER_URL *//scripts/student-contacts-update/table-module',
        service: '/* @echo IMAGE_SERVER_URL *//scripts/student-contacts-update/service',
        actions: '/* @echo IMAGE_SERVER_URL *//scripts/student-contacts-update/actions',
        config: '/* @echo IMAGE_SERVER_URL *//scripts/student-contacts-update/config',
        tooltip: '/* @echo IMAGE_SERVER_URL *//scripts/student-contacts-update/tooltip',

        parsley: '//cdnjs.cloudflare.com/ajax/libs/parsley.js/2.0.5/parsley',
        underscore: 'underscore/underscore'
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