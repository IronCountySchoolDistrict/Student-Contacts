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

var contactData = {};

/**
 * Converts a plain object of contact data to an object with keys that match the tlist child naming scheme.
 * @returns {{}}
 */
function contactObjToTlc(contactObject) {

  var contactCoreData = {};
  var keyName = toContactTlcFieldName('contact_id', -1, contactObject.studentsdcid, true);
  contactCoreData[keyName] = contactObject.contact_id;
  keyName = toContactTlcFieldName('first_name', -1, contactObject.studentsdcid);
  contactCoreData[keyName] = contactObject.first_name;
  keyName = toContactTlcFieldName('last_name', -1, contactObject.studentsdcid);
  contactCoreData[keyName] = contactObject.last_name;
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
  keyName = toContactTlcFieldName('corres_lang', -1, contactObject.studentsdcid);
  contactCoreData[keyName] = contactObject.corres_lang;
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
  keyName = toEmailTlcFieldName('opts_emergency', -1, emailObject.studentsdcid);
  contactCoreData[keyName] = emailObject.opts_emergency;
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
  keyName = toPhoneTlcFieldName('opts_voice_emergency', -1, phoneObject.studentsdcid);
  contactCoreData[keyName] = phoneObject.opts_voice_emergency;
  keyName = toPhoneTlcFieldName('opts_voice_high_priority', -1, phoneObject.studentsdcid);
  contactCoreData[keyName] = phoneObject.opts_voice_high_priority;
  keyName = toPhoneTlcFieldName('opts_voice_general', -1, phoneObject.studentsdcid);
  contactCoreData[keyName] = phoneObject.opts_voice_general;
  keyName = toPhoneTlcFieldName('opts_voice_attendance', -1, phoneObject.studentsdcid);
  contactCoreData[keyName] = phoneObject.opts_voice_attendance;
  keyName = toPhoneTlcFieldName('opts_voice_survey', -1, phoneObject.studentsdcid);
  contactCoreData[keyName] = phoneObject.opts_voice_survey;
  keyName = toPhoneTlcFieldName('opts_text_emergency', -1, phoneObject.studentsdcid);
  contactCoreData[keyName] = phoneObject.opts_text_emergency;
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
 * Converts all core/live contact data in the form to an object with keys that match its database columns
 * @return {Object}
 */
function getContactFormData() {
  return {
    first_name: $j('#live-first-name').val(),
    last_name: $j('#live-last-name').val(),
    priority: $j('#live-priority').val(),
    relationship: $j('#live-relationship').val(),
    legal_guardian: $j('#live-legal-guardian').val(),
    residence_street: $j('#live-residence-street').val(),
    residence_city: $j('#live-residence-city').val(),
    residence_state: $j('#live-residence-state').val(),
    residence_zip: $j('#live-residence-zip').val(),
    mailing_street: $j('#live-mailing-street').val(),
    mailing_city: $j('#live-mailing-city').val(),
    mailing_state: $j('#live-mailing-state').val(),
    mailing_zip: $j('#live-mailing-zip').val(),
    employer: $j('#live-employer').val(),
    notes: $j('#live-notes').val(),
    corres_lang: $j('#live-corres-lang').val()
  };
}

/**
 * Converts all email data in the form to an object with keys that match its database columns
 * @return {Object}
 */
function getEmailFormData() {
  return {
    email_address: $j('#live-email').val(),
    opts_emergency: $j('#live-email-opts-emergency').is(':checked') ? "1" : "",
    opts_high_priority: $j('#live-email-opts-high-priority').is(':checked') ? "1" : "",
    opts_general: $j('#live-email-opts-general').is(':checked') ? "1" : "",
    opts_attendance: $j('#live-email-opts-attendance').is(':checked') ? "1" : "",
    opts_survey: $j('#live-email-opts-survey').is(':checked') ? "1" : ""
  };
}

/**
 * Converts all phone data in the form to an object with keys that match its database columns
 * @return {Object[]}
 */
function getPhoneFormData() {
  var phoneArr = [];
  phoneArr.push({
    phone_priority: "1",
    phone_type: $j('#live-phone-1-type').val(),
    phone_number: $j('#live-phone-1-number').val(),
    phone_extension: $j('#live-phone-1-extension').val(),
    opts_voice_emergency: $j('#live-phone1-opts-voice-emergency').is(':checked') ? "1" : "",
    opts_voice_high_priority: $j('#live-phone1-opts-voice-high-priority').is(':checked') ? "1" : "",
    opts_voice_general: $j('#live-phone1-opts-voice-general').is(':checked') ? "1" : "",
    opts_voice_attendance: $j('#live-phone1-opts-voice-attendance').is(':checked') ? "1" : "",
    opts_voice_survey: $j('#live-phone1-opts-voice-survey').is(':checked') ? "1" : "",
    opts_text_emergency: $j('#live-phone1-opts-text-emergency').is(':checked') ? "1" : "",
    opts_text_high_priority: $j('#live-phone1-opts-text-high-priority').is(':checked') ? "1" : "",
    opts_text_general: $j('#live-phone1-opts-text-general').is(':checked') ? "1" : "",
    opts_text_attendance: $j('#live-phone1-opts-text-attendance').is(':checked') ? "1" : "",
    opts_text_survey: $j('#live-phone1-opts-text-survey').is(':checked') ? "1" : ""
  });
  phoneArr.push({
    phone_priority: "2",
    phone_type: $j('#live-phone-2-type').val(),
    phone_number: $j('#live-phone-2-number').val(),
    phone_extension: $j('#live-phone-2-extension').val(),
    opts_voice_emergency: $j('#live-phone2-opts-voice-emergency').is(':checked') ? "1" : "",
    opts_voice_high_priority: $j('#live-phone2-opts-voice-high-priority').is(':checked') ? "1" : "",
    opts_voice_general: $j('#live-phone2-opts-voice-general').is(':checked') ? "1" : "",
    opts_voice_attendance: $j('#live-phone2-opts-voice-attendance').is(':checked') ? "1" : "",
    opts_voice_survey: $j('#live-phone2-opts-voice-survey').is(':checked') ? "1" : "",
    opts_text_emergency: $j('#live-phone2-opts-text-emergency').is(':checked') ? "1" : "",
    opts_text_high_priority: $j('#live-phone2-opts-text-high-priority').is(':checked') ? "1" : "",
    opts_text_general: $j('#live-phone2-opts-text-general').is(':checked') ? "1" : "",
    opts_text_attendance: $j('#live-phone2-opts-text-attendance').is(':checked') ? "1" : "",
    opts_text_survey: $j('#live-phone2-opts-text-survey').is(':checked') ? "1" : ""
  });
  phoneArr.push({
    phone_priority: "3",
    phone_type: $j('#live-phone-3-type').val(),
    phone_number: $j('#live-phone-3-number').val(),
    phone_extension: $j('#live-phone-3-extension').val(),
    opts_voice_emergency: $j('#live-phone3-opts-voice-emergency').is(':checked') ? "1" : "",
    opts_voice_high_priority: $j('#live-phone3-opts-voice-high-priority').is(':checked') ? "1" : "",
    opts_voice_general: $j('#live-phone3-opts-voice-general').is(':checked') ? "1" : "",
    opts_voice_attendance: $j('#live-phone3-opts-voice-attendance').is(':checked') ? "1" : "",
    opts_voice_survey: $j('#live-phone3-opts-voice-survey').is(':checked') ? "1" : "",
    opts_text_emergency: $j('#live-phone3-opts-text-emergency').is(':checked') ? "1" : "",
    opts_text_high_priority: $j('#live-phone3-opts-text-high-priority').is(':checked') ? "1" : "",
    opts_text_general: $j('#live-phone3-opts-text-general').is(':checked') ? "1" : "",
    opts_text_attendance: $j('#live-phone3-opts-text-attendance').is(':checked') ? "1" : "",
    opts_text_survey: $j('#live-phone3-opts-text-survey').is(':checked') ? "1" : ""
  });
  return phoneArr;
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
    tlcFieldName += '$format=numeric';
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
    tlcFieldName += '$format=numeric';
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
    tlcFieldName += '$format=numeric';
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
    contentType: "application/json; charset=utf-8",
    type: 'PUT'
  });

}

function setContactStatusToMigrated(contactRecordId) {
  var contactDcidData = {
    id: contactRecordId,
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
    contentType: "application/json; charset=utf-8",
    type: 'PUT'
  });
}

function setEmailStatusToMigrated(emailRecordId) {
  var contactDcidData = {
    id: emailRecordId,
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
    contentType: "application/json; charset=utf-8",
    type: 'PUT'
  });
}

function getLiveEmailRecordId(contactdcid) {
  return $j.ajax({
    url: '/ws/schema/table/' + config.contactsEmailTable + '?q=contactdcid==' + contactdcid + '&projection=id',
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    type: 'GET'
  });
}

function setPhoneStatusToMigrated(phoneRecordId) {
  var contactDcidData = {
    id: phoneRecordId,
    name: config.contactPhoneStagingTable,
    tables: {}
  };

  contactDcidData.tables[config.contactPhoneStagingTable] = {
    status: "-99"
  };

  return function() {
    return $j.ajax({
      url: '/ws/schema/table/' + config.contactPhoneStagingTable + '/' + phoneRecordId,
      data: JSON.stringify(contactDcidData),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      type: 'PUT'
    });
  };
}

/**
 * Return array of objects with id and contact_id
 * @param studentsDcid
 * @returns {Object[]}
 */
function getAllContactIdsForStudent(studentsDcid) {
  return $j.getJSON('/admin/students/contacts/scchange/getAllContactIds.json.html?studentsdcid=' + studentsDcid);
}

function getEmailId(contactdcid) {
  return $j.getJSON('/admin/students/contacts/scchange/getEmailId.json.html?contactdcid=' + contactdcid);
}

function getPhoneId(contactdcid, priority) {
  return $j.getJSON('/admin/students/contacts/scchange/getPhoneId.json.html?contactdcid=' + contactdcid + '&priority=' + priority);
}

/**
 *
 * @param stagingContactPhones {Array} - array of phone objects
 * @param contactRecordId {Number|String} - If a new phone record needs to be created, contactdcid of the live contact the new phone records will be linked to
 * @param studentsdcid {Number|String}
 */
function migratePhones(stagingContactPhones, contactRecordId, studentsdcid) {
  var phoneAjaxCalls = [];
  // The elements of stagingContactPhones are the objects that were pulled from the form.
  $j.each(stagingContactPhones, function(index, stagingFormPhone) {
    var stagingPhoneWithPriority = $j.grep(contactData.stagingPhones, function(elem) {
      return elem.phone_priority == index + 1;
    });
    // If phoneId has id, then there is an existing phone record that should be updated
    if (!$j.isEmptyObject(contactData.livePhones)) {
      var livePhoneWithPriority = $j.grep(contactData.livePhones, function(elem) {
        return elem.phone_priority == index + 1;
      });
      if (livePhoneWithPriority.length > 0) {
        livePhoneWithPriority = livePhoneWithPriority[0];
        phoneAjaxCalls.push(updatePhone(stagingFormPhone, livePhoneWithPriority.id));
        if (!$j.isEmptyObject(stagingPhoneWithPriority[0])) {
          phoneAjaxCalls.push(setPhoneStatusToMigrated(stagingPhoneWithPriority[0].id));
        }
      } else {

        // There exists at least one live phone for this contact, but there was no phone that matches this priority,
        // so create a new phone
        stagingFormPhone.contactdcid = contactRecordId;
        stagingFormPhone.studentsdcid = studentsdcid;
        var tlcPhone = phoneObjToTlc(stagingFormPhone);
        tlcPhone.ac = 'prim';
        phoneAjaxCalls.push(newPhone(tlcPhone, stagingFormPhone.studentsdcid));
        if (!$j.isEmptyObject(stagingPhoneWithPriority[0])) {
          phoneAjaxCalls.push(setPhoneStatusToMigrated(stagingPhoneWithPriority[0].id));
        }
      }

      // no contactData.livePhones, so create new phones
    } else {
      stagingFormPhone.contactdcid = contactRecordId;
      stagingFormPhone.studentsdcid = studentsdcid;
      var tlcPhone = phoneObjToTlc(stagingFormPhone);
      tlcPhone.ac = 'prim';
      phoneAjaxCalls.push(newPhone(tlcPhone, stagingFormPhone.studentsdcid));
      if (!$j.isEmptyObject(stagingPhoneWithPriority[0])) {
        phoneAjaxCalls.push(setPhoneStatusToMigrated(stagingPhoneWithPriority[0].id));
      }
    }
  });

  if (phoneAjaxCalls.length > 0) {
    $j.get('/admin/students/contacts/scchange/phoneTlcForm.html?frn=001' + studentsdcid, function(getResp) {
      // By mapping the phoneAjaxCalls and calling each function, the AJAX requests are initiated.
      var phoneAjaxCallsPromises = $j.map(phoneAjaxCalls, function(c) {
        return c();
      });
      console.log('get callback reached');
      $j.when.apply($j, phoneAjaxCallsPromises).done(function(r1, r2, r3, r4, r5, r6) {
        console.log('phoneAjaxCalls promises resolved');
        returnToStudentContacts();
      });
    });
  } else {
    returnToStudentContacts();
  }

}

/**
 *
 * @returns {Object}
 */
function updateContact(contactData, contactRecordId) {
  var contactUpdateData = {
    id: contactRecordId,
    name: config.contactsTable,
    tables: {}
  };

  contactUpdateData.tables[config.contactsTable] = contactData;

  return $j.ajax({
    url: '/ws/schema/table/' + config.contactsTable + '/' + contactRecordId,
    data: JSON.stringify(contactUpdateData),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    type: 'PUT'
  });
}

/**
 *
 * @returns {Object}
 */
function updateEmail(emailData, emailRecordId) {
  var emailUpdateData = {
    id: emailRecordId,
    name: config.contactsEmailTable,
    tables: {}
  };

  emailUpdateData.tables[config.contactsEmailTable] = emailData;

  return $j.ajax({
    url: '/ws/schema/table/' + config.contactsEmailTable + '/' + emailRecordId,
    data: JSON.stringify(emailUpdateData),
    dataType: 'json',
    contentType: "application/json; charset=utf-8",
    type: 'PUT'
  });
}

/**
 *
 * @returns {Object}
 */
function updatePhone(phoneData, phoneRecordId) {
  var phoneUpdateData = {
    id: phoneRecordId,
    name: config.contactsPhoneTable,
    tables: {}
  };

  phoneUpdateData.tables[config.contactsPhoneTable] = phoneData;

  return function() {
    return $j.ajax({
      url: '/ws/schema/table/' + config.contactsPhoneTable + '/' + phoneRecordId,
      data: JSON.stringify(phoneUpdateData),
      dataType: 'json',
      contentType: "application/json; charset=utf-8",
      type: 'PUT'
    });
  };
}

function newEmail(tlcEmail, studentsdcid) {
  return $j.get('/admin/students/contacts/scchange/emailTlcForm.html?frn=001' + studentsdcid, function() {
    //Create new email
    return $j.ajax({
      type: 'POST',
      url: '/admin/changesrecorded.white.html',
      data: tlcEmail
    });
  });
}

function newPhone(tlcPhone, studentsdcid) {
  //Create new phone
  return function() {
    return $j.ajax({
      type: 'POST',
      url: '/admin/changesrecorded.white.html',
      data: tlcPhone
    });
  };
}

/**
 * Fill in the values of the staging contact record
 * @params stagingContactData {Object} - object that is returned from getStagingContact.json.html
 */
function fillFormStagingContact(stagingContactData) {
  $j('#staging-first-name').val(stagingContactData.first_name);
  $j('#staging-last-name').val(stagingContactData.last_name);
  $j('#staging-priority').val(stagingContactData.priority);
  $j('#staging-legal-guardian').val(stagingContactData.legal_guardian);
  $j('#staging-residence-street').val(stagingContactData.residence_street);
  $j('#staging-residence-city').val(stagingContactData.residence_city);
  $j('#staging-residence-state').val(stagingContactData.residence_state);
  $j('#staging-residence-zip').val(stagingContactData.residence_zip);
  $j('#staging-mailing-street').val(stagingContactData.mailing_street);
  $j('#staging-mailing-city').val(stagingContactData.mailing_city);
  $j('#staging-mailing-state').val(stagingContactData.mailing_state);
  $j('#staging-mailing-zip').val(stagingContactData.mailing_zip);
  $j('#staging-employer').val(stagingContactData.employer);
  $j('#staging-notes').val(stagingContactData.notes);
  $j('#staging-corres-lang').val(stagingContactData.corres_lang);
}

/**
 * Fill in the values of the live contact record
 * @params stagingContactData {Object} - object that is returned from getLiveContactWithId.json.html
 */
function fillFormLiveContact(liveContactData) {
  $j('#live-first-name').val(liveContactData.first_name);
  $j('#live-last-name').val(liveContactData.last_name);
  $j('#live-priority').val(liveContactData.priority);
  $j('#live-legal-guardian').val(liveContactData.legal_guardian);
  $j('#live-residence-street').val(liveContactData.residence_street);
  $j('#live-residence-city').val(liveContactData.residence_city);
  $j('#live-residence-state').val(liveContactData.residence_state);
  $j('#live-residence-zip').val(liveContactData.residence_zip);
  $j('#live-mailing-street').val(liveContactData.mailing_street);
  $j('#live-mailing-city').val(liveContactData.mailing_city);
  $j('#live-mailing-state').val(liveContactData.mailing_state);
  $j('#live-mailing-zip').val(liveContactData.mailing_zip);
  $j('#live-employer').val(liveContactData.employer);
  $j('#live-notes').val(liveContactData.notes);
  $j('#live-corres-lang').val(liveContactData.corres_lang);
}

/**
 * Fill in the values of the staging contact email record
 * @params stagingEmailData {Object} - object that is returned from getStagingContactEmail.json.html
 */
function fillFormStagingEmail(stagingEmailData) {
  $j('#staging-email').val(stagingEmailData.email_address);
  if (stagingEmailData.opts_emergency === "1") $j('#staging-email-opts-emergency').attr({
    'checked': 'checked'
  });
  if (stagingEmailData.opts_high_priority === "1") $j('#staging-email-opts-high-priority').attr({
    'checked': 'checked'
  });
  if (stagingEmailData.opts_general === "1") $j('#staging-email-opts-general').attr({
    'checked': 'checked'
  });
  if (stagingEmailData.opts_attendance === "1") $j('#staging-email-opts-attendance').attr({
    'checked': 'checked'
  });
  if (stagingEmailData.opts_survey === "1") $j('#staging-email-opts-survey').attr({
    'checked': 'checked'
  });
}

/**
 * Fill in the values of the live contact email record
 * @params stagingEmailData {Object} - object that is returned from getLiveContactEmail.json.html
 */
function fillFormLiveEmail(liveEmailData) {
  $j('#live-email').val(liveEmailData.email_address);
  if (liveEmailData.opts_emergency === "1") $j('#live-email-opts-emergency').attr({
    'checked': 'checked'
  });
  if (liveEmailData.opts_high_priority === "1") $j('#live-email-opts-high-priority').attr({
    'checked': 'checked'
  });
  if (liveEmailData.opts_general === "1") $j('#live-email-opts-general').attr({
    'checked': 'checked'
  });
  if (liveEmailData.opts_attendance === "1") $j('#live-email-opts-attendance').attr({
    'checked': 'checked'
  });
  if (liveEmailData.opts_survey === "1") $j('#live-email-opts-survey').attr({
    'checked': 'checked'
  });
}

/**
 * Fill in the values of the staging contact email record
 * @params stagingPhoneData {Object} - object that is returned from getStagingContactPhone.json.html
 * @params priority {String|Number} - priority of the phone that is being filled
 */
function fillFormStagingPhone(stagingPhoneData, priority) {
  $j('#staging-phone-' + priority + '-type').val(stagingPhoneData.phone_type);
  $j('#staging-phone-' + priority + '-number').val(stagingPhoneData.phone_number);
  $j('#staging-phone-' + priority + '-extension').val(stagingPhoneData.phone_extension);
  if (stagingPhoneData.opts_voice_emergency === "1") $j('#staging-phone' + priority + '-opts-voice-emergency').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_voice_high_priority === "1") $j('#staging-phone' + priority + '-opts-voice-high-priority').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_voice_general === "1") $j('#staging-phone' + priority + '-opts-voice-general').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_voice_attendance === "1") $j('#staging-phone' + priority + '-opts-voice-attendance').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_voice_survey === "1") $j('#staging-phone' + priority + '-opts-voice-survey').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_text_emergency === "1") $j('#staging-phone' + priority + '-opts-text-emergency').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_text_high_priority === "1") $j('#staging-phone' + priority + '-opts-text-high-priority').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_text_general === "1") $j('#staging-phone' + priority + '-opts-text-general').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_text_attendance === "1") $j('#staging-phone' + priority + '-opts-text-attendance').attr({
    'checked': 'checked'
  });
  if (stagingPhoneData.opts_text_survey === "1") $j('#staging-phone' + priority + '-opts-text-survey').attr({
    'checked': 'checked'
  });
}

/**
 * Fill in the values of the live contact email record
 * @params stagingPhoneData {Object} - object that is returned from getLiveContactPhone.json.html
 * @params priority {String|Number} - priority of the phone that is being filled
 */
function fillFormLivePhone(livePhoneData, priority) {
  $j('#live-phone-' + priority + '-type').val(livePhoneData.phone_type);
  $j('#live-phone-' + priority + '-number').val(livePhoneData.phone_number);
  $j('#live-phone-' + priority + '-extension').val(livePhoneData.phone_extension);
  if (livePhoneData.opts_voice_emergency === "1") $j('#live-phone' + priority + '-opts-voice-emergency').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_voice_high_priority === "1") $j('#live-phone' + priority + '-opts-voice-high-priority').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_voice_general === "1") $j('#live-phone' + priority + '-opts-voice-general').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_voice_attendance === "1") $j('#live-phone' + priority + '-opts-voice-attendance').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_voice_survey === "1") $j('#live-phone' + priority + '-opts-voice-survey').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_text_emergency === "1") $j('#live-phone' + priority + '-opts-text-emergency').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_text_high_priority === "1") $j('#live-phone' + priority + '-opts-text-high-priority').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_text_general === "1") $j('#live-phone' + priority + '-opts-text-general').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_text_attendance === "1") $j('#live-phone' + priority + '-opts-text-attendance').attr({
    'checked': 'checked'
  });
  if (livePhoneData.opts_text_survey === "1") $j('#live-phone' + priority + '-opts-text-survey').attr({
    'checked': 'checked'
  });
}

function createOptionsForStagingPriority(highestPriority) {
  for (var i = 0; i < highestPriority; i++) {
    var optionIndex = i + 1;
    var optionTemplate = '<option value="' + optionIndex + '">' + optionIndex + '</option>';
    $j('#staging-priority').append(optionTemplate);
  }
}

function createOptionsForLivePriority(highestPriority) {
  for (var i = 0; i < highestPriority; i++) {
    var optionIndex = i + 1;
    var optionTemplate = '<option value="' + optionIndex + '">' + optionIndex + '</option>';
    $j('#live-priority').append(optionTemplate);
  }
}

function setStagingRelationship(relationshipVal) {
  $j('#staging-relationship').val(relationshipVal);
}

function setLiveRelationship(relationshipVal) {
  $j('#live-relationship').val(relationshipVal);
}

/**
 * @param parentField {jQuery} - pending change field that will be moved
 * @param onFieldField {jQuery} - on file field that will contain the value of parentField
 */
function defaultApprove(parentField, onFileField) {
  onFileField.val(parentField.val());
  parentField.val('');
}

/**
 * @param parentOpts {jQuery[]} - parent email options
 * @param onFileOpts {jQuery[]} - on file email options
 */
function optsApprove(parentOpts, onFileOpts) {
  $j.each(parentOpts, function(index, parentOpt) {
    if ($j(parentOpt).is(':checked')) {
      $j(onFileOpts).eq(index).prop('checked', true);
    } else {
      $j(onFileOpts).eq(index).prop('checked', false);
    }
  });

}

function bindDefaultApprove() {
  $j('.default-approve').on('click', function(event) {
    var $target = $j(event.target);
    var $parentField = $j($target.parents('td').next().children());
    var $onFileField = $j($target.parents('td').prev().children());
    defaultApprove($parentField, $onFileField);
    $target.attr({
      approved: true
    });
  });
}

function bindOptsApprove() {
  $j('.opts-approve').on('click', function(event) {
    var $target = $j(event.target);
    var $parentOpts = $j($target.parents('td').next().find('input'));
    var $onFileOpts = $j($target.parents('td').prev().find('input'));

    // Copy all parent checkboxes to on file checkboxes.
    optsApprove($parentOpts, $onFileOpts);

    // Clear all parent checkboxes.
    $parentOpts.prop('checked', false);
    $target.attr({
      approved: true
    });
  });
}

function bindApproveAll() {
  $j('.approve-all').on('click', function(event) {
    $j('input[type="button"]').not('.approve-all').not('[approved="true"]').trigger('click');
  });
}

function bindDoSubmit() {
  $j('#btnSubmit').on('click', function(e) {
    e.preventDefault();
    loadingDialogInstance.open();
    // If the liveContact property exists, this is an update operation
    doSubmit();
  });
}

function bindShowStagingAlreadyMigrated() {

  // If contactData.stagingContact is empty, that means the staging contact's status was set to -99, which means
  // it has already been migrated, so show contact migrated status message.
  if ($j.isEmptyObject(contactData.stagingContact)) {
    $j('.button-row').eq(1).css({
      'display': 'none'
    });
    $j('#student-info-form').find('.box-round').css({
      'display': 'none'
    });
    $j('#staging-already-migrated').css({
      display: 'block'
    });
    $j('#btnBack').on('click', function(event) {
      event.preventDefault();
      returnToStudentContacts();
    });
  }
}

function returnToStudentContacts() {
  window.location = '/admin/students/contacts/studentcontacts.html?frn=001' + psData.studentDcid;
}

function showLastModified(stagingContact) {
  if (stagingContact.whoModified !== '' && stagingContact.whenModified) {
    $j('#last-submitted-change').text(stagingContact.whoModified + ' on ' + stagingContact.whenModified);
  } else if (stagingContact.whoCreated !== '' && stagingContact.whenCreated !== '') {
    $j('#last-submitted-change').text(stagingContact.whoCreated + ' on ' + stagingContact.whenCreated);
  }
}

function fillForm() {
  $j.getJSON('/admin/students/contacts/scchange/getStagingContact.json.html?stagingcontactdcid=' + psData.stagingContactDcid, function(stagingContact) {

    if (stagingContact) {
      showLastModified(stagingContact);
      var extendedTableCalls = [];

      var stagingContactEmail;
      var stagingContactPhones;
      var highestPriority;
      // Prepare email and phone AJAX calls
      extendedTableCalls.push($j.getJSON('/admin/students/contacts/scchange/getStagingContactEmail.json.html?stagingcontactdcid=' + psData.stagingContactDcid));
      extendedTableCalls.push($j.getJSON('/admin/students/contacts/scchange/getStagingContactPhone.json.html?stagingcontactdcid=' + psData.stagingContactDcid));
      extendedTableCalls.push($j.getJSON('/admin/students/contacts/scchange/getHighestPriority.json.html?studentsdcid=' + psData.studentDcid));
      $j.when.apply($j, extendedTableCalls).done(function(stagingContactEmailResp, stagingContactPhoneResp, highestPriorityResp) {
        stagingContactEmail = stagingContactEmailResp[0];
        stagingContactPhones = stagingContactPhoneResp[0];
        stagingContactPhones.pop();
        highestPriority = highestPriorityResp[0];

        contactData.stagingContact = stagingContact;
        bindShowStagingAlreadyMigrated();

        var safeHighestPriority;
        if (highestPriority.priority) {
          safeHighestPriority = highestPriority.priority;
        } else {
          safeHighestPriority = 1;
        }
        createOptionsForStagingPriority(safeHighestPriority);

        // Create options for live priority here so if user approve staging priority there is an option to be selected
        createOptionsForLivePriority(safeHighestPriority);

        fillFormStagingContact(stagingContact);
        setStagingRelationship(stagingContact.relationship);

        contactData.stagingEmail = stagingContactEmail;
        fillFormStagingEmail(stagingContactEmail);

        contactData.stagingPhones = stagingContactPhones;
        $j.each(stagingContactPhones, function(index, stagingPhone) {
          fillFormStagingPhone(stagingPhone, stagingPhone.phone_priority);
        });

        $j.getJSON('/admin/students/contacts/scchange/getLiveContactWithId.json.html?studentsdcid=' + psData.studentDcid + '&contactid=' + stagingContact.contact_id, function(liveContact) {


          if (liveContact) {

            var liveExtendedTableCalls = [];
            liveExtendedTableCalls.push($j.getJSON('/admin/students/contacts/scchange/getLiveContactEmail.json.html?livecontactdcid=' + liveContact.record_id));
            liveExtendedTableCalls.push($j.getJSON('/admin/students/contacts/scchange/getLiveContactPhone.json.html?livecontactdcid=' + liveContact.record_id));

            fillFormLiveContact(liveContact);
            setLiveRelationship(liveContact.relationship);

            $j.when.apply($j, liveExtendedTableCalls).done(function(liveContactEmailResp, liveContactPhoneResp) {
              var liveContactEmail = liveContactEmailResp[0];
              var liveContactPhones = liveContactPhoneResp[0];
              liveContactPhones.pop();

              if (liveContact) {
                contactData.liveContact = liveContact;
              }

              if (liveContactEmail) {
                contactData.liveEmail = liveContactEmail;
                fillFormLiveEmail(liveContactEmail);
              }

              if (liveContactPhones) {
                contactData.livePhones = liveContactPhones;
                $j.each(liveContactPhones, function(index, livePhone) {
                  fillFormLivePhone(livePhone, livePhone.phone_priority);
                });
              }

            });
          }
        });
      });
    }
  });
}

function doSubmit() {
  var studentsdcid = psData.studentDcid;
  var liveContactFormData = getContactFormData();
  var liveEmailFormData = getEmailFormData();
  var livePhonesFormData = getPhoneFormData();

  if (!$j.isEmptyObject(contactData.liveContact)) {
    updateContact(liveContactFormData, contactData.liveContact.record_id).done(function(updateContactResp) {
      setContactStatusToMigrated(contactData.stagingContact.record_id).done(function() {

        // Is there is a live email record that should be updated
        if (!$j.isEmptyObject(contactData.liveEmail)) {

          updateEmail(liveEmailFormData, contactData.liveEmail.id).done(function(updateEmailResp) {
            if (!$j.isEmptyObject(contactData.stagingEmail)) {
              setEmailStatusToMigrated(contactData.stagingEmail.id).done(function() {

                // If phone exists, save them
                if (!$j.isEmptyObject(contactData.stagingPhones)) {
                  migratePhones(livePhonesFormData, contactData.liveContact.record_id, studentsdcid);
                  // If no phones exist, we're done, so go back to student contacts
                } else {
                  returnToStudentContacts();
                }
              });
            } else {
              // If phone exists, save them
              if (!$j.isEmptyObject(contactData.stagingPhones)) {
                migratePhones(livePhonesFormData, contactData.liveContact.record_id, studentsdcid);
                // If no phones exist, we're done, so go back to student contacts
              } else {
                returnToStudentContacts();
              }
            }
          });
          // Create a new live email record
        } else {
          liveEmailFormData.studentsdcid = studentsdcid;
          liveEmailFormData.contactdcid = contactData.liveContact.record_id;
          var tlcEmail = emailObjToTlc(liveEmailFormData);
          tlcEmail.ac = 'prim';
          newEmail(tlcEmail, studentsdcid).then(function(newEmailResp) {
            getLiveEmailRecordId(contactData.liveContact.record_id).then(function(liveEmailId) {
              //Now that a new email record has been created, we can get its id in order
              //to set its status to migrated.
              setEmailStatusToMigrated(contactData.stagingEmail.id).done(function() {
                migratePhones(livePhonesFormData, contactData.liveContact.record_id, studentsdcid);
              });
            });

          });
          g
        }
      });
    });

  } else {
    // Live contact was not found, so create a new contact.

    // contactObjToTlc expects the liveContactFormData to contain contact_id and studentsdcid fields.
    liveContactFormData.studentsdcid = studentsdcid;
    liveContactFormData.contact_id = contactData.stagingContact.contact_id;
    liveContactFormData.status = '0';
    var tlcContact = contactObjToTlc(liveContactFormData);
    tlcContact.ac = 'prim';

    // Enable creating a new record by requesting page with tlist_child tag present
    $j.get('/admin/students/contacts/scchange/contactTlcForm.html?frn=001' + studentsdcid, function(contactFormResp) {
      // Create new contact record
      $j.ajax({
        type: 'POST',
        url: '/admin/changesrecorded.white.html',
        data: tlcContact
      }).done(function(newContactResp) {

        $j.getJSON('/admin/students/contacts/getContactRecordId.json.html?contactid=' + contactData.stagingContact.contact_id + '&studentsdcid=' + studentsdcid, function(contactRecordId) {
          var newContactCalls = [];

          // Set live contact's contactdcid field
          newContactCalls.push(setContactDcid(contactRecordId.id));
          // Set the staging contact's status to the migrated status (so we can delete later)
          newContactCalls.push(setContactStatusToMigrated(contactData.stagingContact.record_id));
          $j.when.apply($j, newContactCalls).done(function(contactDcidResp, contactMigratedResp) {

            // Is there a live email record to update?
            if (!$j.isEmptyObject(contactData.liveEmail)) {
              updateEmail(liveEmailFormData, contactData.liveEmail.id).done(function(updateEmailResp) {
                if (!$j.isEmptyObject(contactData.stagingEmail)) {
                  setEmailStatusToMigrated(contactData.stagingEmail.id).done(function() {
                    // If there are phones, save them
                    if (contactData.stagingPhones) {
                      migratePhones(livePhonesFormData, contactRecordId.id, studentsdcid);
                    }
                  });
                } else {
                  // If phone exists, save them
                  if (!$j.isEmptyObject(contactData.stagingPhones)) {
                    migratePhones(livePhonesFormData, contactData.liveContact.record_id, studentsdcid);
                    // If no phones exist, we're done, so go back to student contacts
                  } else {
                    returnToStudentContacts();
                  }
                }
              });

              // There isn't a live email to update, so create a new one
            } else {
              //Set the new email's contactdcid to the new contact's id
              liveEmailFormData.contactdcid = contactRecordId.id;

              // emailObjToTlc needs to know what foreign key (studentsdcid) is, so add it liveEmailFormData
              liveEmailFormData.studentsdcid = studentsdcid;
              var tlcEmail = emailObjToTlc(liveEmailFormData);
              tlcEmail.ac = 'prim';

              // Enable new email operation
              $j.get('/admin/students/contacts/scchange/emailTlcForm.html?frn=001' + studentsdcid, function(emailFormResp) {
                //Create new email
                $j.ajax({
                  type: 'POST',
                  url: '/admin/changesrecorded.white.html',
                  data: tlcEmail
                }).done(function() {

                  // Set staging email to migrated
                  if (!$j.isEmptyObject(contactData.stagingEmail)) {
                    setEmailStatusToMigrated(contactData.stagingEmail.id).done(function() {
                      migratePhones(livePhonesFormData, contactRecordId.id, studentsdcid);
                    });
                  } else {
                    migratePhones(livePhonesFormData, contactRecordId.id, studentsdcid);
                  }
                });
              });
            }
          });
        }).fail(function() {
          console.log('couldnt get id of new record -- studentsdcid =' + contact.studentsdcid + ', first_name=' + contact.first_name + ' last_name=' + contact.last_name);
        });
      });
    });
  }

}

export function main() {
  fillForm();
  bindDefaultApprove();
  bindOptsApprove();
  bindApproveAll();
  bindDoSubmit();
}
