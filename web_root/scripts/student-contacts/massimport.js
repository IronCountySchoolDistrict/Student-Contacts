$j(function () {

    /**
     *
     * @type {Object}
     */
    var config = {
        contactsTable: 'u_student_contacts',
        contactsStagingTable: 'u_student_contacts_staging',
        contactsEmailTable: 'u_sc_email',
        contactEmailStagingTable: 'u_sc_email_staging',
        contactsPhoneTable: 'u_sc_phone',
        contactPhoneStagingTable: 'u_sc_phone_staging'
    };

    /**
     * Converts a plain object of contact data to an object with keys that match the tlist child naming scheme.
     * @returns {{}}
     */
    function contactObjToTlc(contactObject) {

        var contactCoreData = {};
        var keyName = toContactTlcFieldName('contact_id', -1, contactObject.studentsdcid, true);
        contactCoreData[keyName] = contactObject.contact_id;
        keyName = toContactTlcFieldName('first_name', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.firstname;
        keyName = toContactTlcFieldName('last_name', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.lastname;
        keyName = toContactTlcFieldName('priority', -1, contactObject.studentsdcid, true);
        contactCoreData[keyName] = contactObject.priority;
        keyName = toContactTlcFieldName('legal_guardian', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.legal_guardian;
        keyName = toContactTlcFieldName('relationship', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.relationship;
        keyName = toContactTlcFieldName('residence_street', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.residence_street;
        keyName = toContactTlcFieldName('residence_city', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.residence_city;
        keyName = toContactTlcFieldName('residence_state', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.residence_state;
        keyName = toContactTlcFieldName('residence_zip', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.residence_zip;
        keyName = toContactTlcFieldName('mailing_street', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.mailing_street;
        keyName = toContactTlcFieldName('mailing_city', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.mailing_city;
        keyName = toContactTlcFieldName('mailing_state', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.mailing_state;
        keyName = toContactTlcFieldName('mailing_zip', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.mailing_zip;
        keyName = toContactTlcFieldName('employer', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.employer;
        keyName = toContactTlcFieldName('notes', -1, contactObject.studentsdcid);
        contactCoreData[keyName] = contactObject.notes;
        keyName = toContactTlcFieldName('status', -1, contactObject.studentsdcid, true);
        contactCoreData[keyName] = contactObject.status;
        return contactCoreData;
    }

    /**
     * Converts a plain object of email data to an object with keys that match the tlist child naming scheme.
     * @returns {{}}
     */
    function emailObjToTlc(emailObject) {

        var contactCoreData = {};
        var keyName = toEmailTlcFieldName('contactdcid', -1, emailObject.studentsdcid);
        contactCoreData[keyName] = emailObject.contactdcid;
        keyName = toEmailTlcFieldName('email_address', -1, emailObject.studentsdcid);
        contactCoreData[keyName] = emailObject.email_address;
        keyName = toEmailTlcFieldName('opts_high_priority', -1, emailObject.studentsdcid);
        contactCoreData[keyName] = emailObject.opts_high_priority;
        keyName = toEmailTlcFieldName('opts_general', -1, emailObject.studentsdcid);
        contactCoreData[keyName] = emailObject.opts_general;
        keyName = toEmailTlcFieldName('opts_attendance', -1, emailObject.studentsdcid);
        contactCoreData[keyName] = emailObject.opts_attendance;
        keyName = toEmailTlcFieldName('opts_survey', -1, emailObject.studentsdcid);
        contactCoreData[keyName] = emailObject.opts_survey;

        return contactCoreData;
    }

    /**
     * Converts a plain object of phone data to an object with keys that match the tlist child naming scheme.
     * @returns {{}}
     */
    function phoneObjToTlc(phoneObject) {

        var contactCoreData = {};
        var keyName = toPhoneTlcFieldName('contactdcid', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.contactdcid;
        keyName = toPhoneTlcFieldName('phone_number', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.phone_number;
        keyName = toPhoneTlcFieldName('phone_type', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.phone_type;
        keyName = toPhoneTlcFieldName('phone_extension', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.phone_extension;
        keyName = toPhoneTlcFieldName('phone_priority', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.phone_priority;
        keyName = toPhoneTlcFieldName('opts_voice_high_priority', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.opts_voice_high_priority;
        keyName = toPhoneTlcFieldName('opts_voice_general', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.opts_voice_general;
        keyName = toPhoneTlcFieldName('opts_voice_attendance', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.opts_voice_attendance;
        keyName = toPhoneTlcFieldName('opts_voice_survey', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.opts_voice_survey;
        keyName = toPhoneTlcFieldName('opts_text_high_priority', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.opts_text_high_priority;
        keyName = toPhoneTlcFieldName('opts_text_general', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.opts_text_general;
        keyName = toPhoneTlcFieldName('opts_text_attendance', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.opts_text_attendance;
        keyName = toPhoneTlcFieldName('opts_text_survey', -1, phoneObject.studentsdcid);
        contactCoreData[keyName] = phoneObject.opts_text_survey;

        return contactCoreData;
    }

    /**
     * Takes a field name and converts it to tlist child (tlc) formatting
     * If creating a new record, pass in recordId=-1
     * @param fieldName
     * @param recordId
     * @param foreignKey
     * @param [isInteger] {Boolean} - if field is an INTEGER
     * @returns {string}
     */
    function toContactTlcFieldName(fieldName, recordId, foreignKey, isInteger) {
        var tlcFieldName = 'CF-[STUDENTS:' + foreignKey + '.U_STUDENT_CONTACTS.U_STUDENT_CONTACTS:' + recordId + ']' + fieldName;
        if (isInteger) {
            tlcFieldName += '$format=numeric'
        }
        return tlcFieldName;
    }

    /**
     * Takes a field name and converts it to tlist child (tlc) formatting
     * If creating a new record, pass in recordId=-1
     * @param fieldName
     * @param recordId
     * @param foreignKey
     * @param [isInteger] {Boolean} - if field is an INTEGER
     * @returns {string}
     */
    function toEmailTlcFieldName(fieldName, recordId, foreignKey, isInteger) {
        var tlcFieldName = 'CF-[STUDENTS:' + foreignKey + '.U_STUDENT_CONTACTS.U_SC_EMAIL:' + recordId + ']' + fieldName;
        if (isInteger) {
            tlcFieldName += '$format=numeric'
        }
        return tlcFieldName;
    }

    /**
     * Takes a field name and converts it to tlist child (tlc) formatting
     * If creating a new record, pass in recordId=-1
     * @param fieldName
     * @param recordId
     * @param foreignKey
     * @param [isInteger] {Boolean} - if field is an INTEGER
     * @returns {string}
     */
    function toPhoneTlcFieldName(fieldName, recordId, foreignKey, isInteger) {
        var tlcFieldName = 'CF-[STUDENTS:' + foreignKey + '.U_STUDENT_CONTACTS.U_SC_PHONE:' + recordId + ']' + fieldName;
        if (isInteger) {
            tlcFieldName += '$format=numeric'
        }
        return tlcFieldName;
    }

    /**
     * Assignes the row's record id to the CONTACTDCID field
     * @param contactRecordId a contact's record id (from the record in the db)
     */
    function setContactDcid(contactRecordId) {
        var contactDcidData = {
            name: config.contactsTable,
            tables: {}
        };

        contactDcidData.tables[config.contactsTable] = {
            contactdcid: contactRecordId
        };

        return $j.ajax({
            url: '/ws/schema/table/' + config.contactsTable + '/' + contactRecordId,
            data: JSON.stringify(contactDcidData),
            dataType: 'json',
            contentType: 'json',
            type: 'PUT'
        });

    }

    function setContactStatusToMigrated(contactRecordId) {
        var contactDcidData = {
            name: config.contactsStagingTable,
            tables: {}
        };

        contactDcidData.tables[config.contactsStagingTable] = {
            status: "-99"
        };

        return $j.ajax({
            url: '/ws/schema/table/' + config.contactsStagingTable + '/' + contactRecordId,
            data: JSON.stringify(contactDcidData),
            dataType: 'json',
            contentType: 'json',
            type: 'PUT'
        });
    }

    function setEmailStatusToMigrated(emailRecordId) {
        var contactDcidData = {
            name: config.contactEmailStagingTable,
            tables: {}
        };

        contactDcidData.tables[config.contactEmailStagingTable] = {
            status: "-99"
        };

        return $j.ajax({
            url: '/ws/schema/table/' + config.contactEmailStagingTable + '/' + emailRecordId,
            data: JSON.stringify(contactDcidData),
            dataType: 'json',
            contentType: 'json',
            type: 'PUT'
        });
    }

    function setPhoneStatusToMigrated(phoneRecordId) {
        var contactDcidData = {
            name: config.contactPhoneStagingTable,
            tables: {}
        };

        contactDcidData.tables[config.contactPhoneStagingTable] = {
            status: "-99"
        };

        return $j.ajax({
            url: '/ws/schema/table/' + config.contactPhoneStagingTable + '/' + phoneRecordId,
            data: JSON.stringify(contactDcidData),
            dataType: 'json',
            contentType: 'json',
            type: 'PUT'
        });
    }

    /**
     *
     * @param stagingContactPhones {Array} - array of phone objects
     * @param contactRecordId {Number|String} - contactdcid
     */
    function migratePhones(stagingContactPhones, contactRecordId) {
        $j.each(stagingContactPhones, function (index, stagingPhone) {
            stagingPhone.contactdcid = contactRecordId;
            var tlcPhone = phoneObjToTlc(stagingPhone);
            tlcPhone.ac = 'prim';
            $j.get('/admin/students/contacts/massimport/phoneTlcForm.html?frn=001' + stagingPhone.studentsdcid, function (phoneFormResp) {
                $j.ajax({
                    type: 'POST',
                    url: '/admin/changesrecorded.white.html',
                    data: tlcPhone
                }).done(function () {
                    setPhoneStatusToMigrated(stagingPhone.id).done(function () {
                        $j.noop();
                    })
                })
            })
        });
    }

    $j('#import').on('click', function (event) {
        /*
        $j.ajaxSetup({
            async: false
        });
        */
        // Fetch all staging contacts
        $j.getJSON('/admin/students/contacts/massimport/allStagingContacts.json.html', function (allStagingContacts) {
            allStagingContacts.pop();
            var contactNum = allStagingContacts.length;
            $j.each(allStagingContacts, function (index, contact) {
                $j('#status').append("Processing contact " + index+1 + " out of " + contactNum);
                var extendedTableCalls = [];

                var stagingContactEmail;
                var stagingContactPhone;
                // Prepare email and phone AJAX calls
                extendedTableCalls.push($j.getJSON('/admin/students/contacts/massimport/getStagingContactEmail.json.html?contactdcid=' + contact.record_id));
                extendedTableCalls.push($j.getJSON('/admin/students/contacts/massimport/getStagingContactPhone.json.html?contactdcid=' + contact.record_id));
                $j.when.apply($j, extendedTableCalls).done(function (stagingContactEmailResp, stagingContactPhoneResp) {
                    stagingContactEmail = stagingContactEmailResp[0];
                    stagingContactPhone = stagingContactPhoneResp[0];
                    stagingContactPhone.pop();
                    var tlcContact = contactObjToTlc(contact);
                    tlcContact.ac = 'prim';

                    // Enable creating a new record by requesting page with tlist_child tag present
                    $j.get('/admin/students/contacts/massimport/contactTlcForm.html?frn=001' + contact.studentsdcid, function (contactFormResp) {
                        // Create new contact record
                        $j.ajax({
                            type: 'POST',
                            url: '/admin/changesrecorded.white.html',
                            data: tlcContact
                        }).done(function (newContactResp) {

                            $j.getJSON('/admin/students/contacts/getContactRecordId.json.html?contactid=' + contact.contact_id + '&studentsdcid=' + contact.studentsdcid, function (contactRecordId) {
                                var newContactCalls = [];

                                // Set live contact's contactdcid field
                                newContactCalls.push(setContactDcid(contactRecordId.id));
                                // Set the staging contact's status to the migrated status (so we can delete later)
                                newContactCalls.push(setContactStatusToMigrated(contact.record_id));
                                $j.when.apply($j, newContactCalls).done(function (contactDcidResp, contactMigratedResp) {
                                    // stagingContactEmail is null if this contact has no email,
                                    // so only migrate email if it is present
                                    if (stagingContactEmail) {
                                        //Set the email's contactdcid to the new contact's id
                                        stagingContactEmail.contactdcid = contactRecordId.id;
                                        var tlcEmail = emailObjToTlc(stagingContactEmail);
                                        tlcEmail.ac = 'prim';

                                        // Enable new email operation
                                        $j.get('/admin/students/contacts/massimport/emailTlcForm.html?frn=001' + contact.studentsdcid, function (emailFormResp) {
                                            //Create new email
                                            $j.ajax({
                                                type: 'POST',
                                                url: '/admin/changesrecorded.white.html',
                                                data: tlcEmail
                                            }).done(function () {

                                                // Set staging email to migrated
                                                setEmailStatusToMigrated(stagingContactEmail.id).done(function () {
                                                    // Migrate phones if there are any
                                                    if (stagingContactPhone.length > 0) {
                                                        migratePhones(stagingContactPhone, contactRecordId.id);
                                                    }
                                                });

                                            });
                                        });
                                    } else {
                                        // Migrate phones if there are any
                                        if (stagingContactPhone.length > 0) {
                                            migratePhones(stagingContactPhone, contactRecordId.id);
                                        }
                                    }
                                });
                            });


                        }).fail(function () {
                            console.log('couldnt get id of new record -- studentsdcid =' + contact.studentsdcid + ', first_name=' + contact.firstname + ' last_name=' + contact.lastname);
                        });
                    });
                });
            });
        });
    });
});