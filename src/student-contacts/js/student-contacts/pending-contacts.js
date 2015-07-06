
require(['underscore'], function(_) {
    $j.getJSON('/admin/students/contacts/pending-contacts/getAllStudentStagingContacts.json.html?studentsdcid=' + psData.studentdcid, function(stagingContacts) {
        if (stagingContacts.length > 0) {
            stagingContacts.pop();
            $j.each(stagingContacts, function(index, stagingContact) {
                if (!$j.isEmptyObject(stagingContact)) {
                    var contactTemplate = $j('#staging-contact-template').html();
                    var renderedTemplate = _.template(contactTemplate, {contact: stagingContact});
                    var insertSelector = $j('#staging-contacts-list');
                    insertSelector.append(renderedTemplate);
                }
            });
        }
    });
});
