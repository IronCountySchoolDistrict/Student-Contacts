define(['underscore', 'jquery'], function(_, $) {
  return function main() {
    $.getJSON('/admin/students/contacts/pending-contacts/getAllStudentStagingContacts.json.html?studentsdcid=' + psData.studentdcid, function(stagingContacts) {
      if (stagingContacts.length > 0) {
        stagingContacts.pop();
        $.each(stagingContacts, function(index, stagingContact) {
          if (!$.isEmptyObject(stagingContact)) {
            var contactTemplate = $('#staging-contact-template').html();
            var renderedTemplate = _.template(contactTemplate, {
              contact: stagingContact
            });
            var insertSelector = $('#staging-contacts-list');
            insertSelector.append(renderedTemplate);
          }
        });
      }
    });
  };
});
