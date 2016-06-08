/*global psData,window,loadingDialogInstance, require, document*/

import $ from 'jquery';
import _ from 'underscore';
import {
  Client
} from 'escl';
import * as inputMask from 'jquery.inputmask';
import * as datatables from 'datatables';
import * as parsley from 'parsley';
import * as inputmaskExtensions from 'inputmask.extensions';

export function main() {
  var config = {
    contactsTable: 'u_student_contacts',
    contactsEmailTable: 'u_sc_email',
    contactsPhoneTable: 'U_SC_PHONE'
  };

  var contactClient = new Client({
    coreTable: 'Students',
    extGroup: 'u_student_contacts',
    extTable: 'u_student_contacts',
    coreTableNumber: '001',
    foreignKey: psData.studentdcid
  });

  /**
   *
   * NOTE: Reading the length of this object also represents the number of contacts this student has.
   * Neither the contact ID nor the contact table record ID should ever change, so consider this object
   * a constant.
   * @constant
   * @type {Object} Contact ID (key) => to contact data Object (value) from contactdata.html?action=getcontact
   */
  var contactsCollection = {};

  /**
   *
   * @param target {jQuery}
   * @param email {String}
   */
  function copyGuardianEmail(target, email) {
    target.val(email);
  }

  function copyAddress(type, n) {
    $('#c' + n + '_street').val($('#' + type + 'street' + n).text());
    $('#c' + n + '_city').val($('#' + type + 'city' + n).text());
    $('#c' + n + '_state').val($('#' + type + 'state' + n).text());
    $('#c' + n + '_zip').val($('#' + type + 'zip' + n).text());
  }

  /**
   *
   * @param target {jQuery}
   * @param phone {String}
   */
  function copyPhone(target, phone) {
    target.val(phone);
  }

  var m_table;
  var m_keyindex = 0;
  var m_requestURL = '/admin/students/contacts/contactdata.html';
  $(document).ready(function() {
    loadingDialogInstance.open();

    $.ajaxSetup({
      url: m_requestURL
    });


    m_table = $('#holder').addClass('display').dataTable({
      'bPaginate': false,
      'bFilter': false,
      'bJQueryUI': true,
      "sDom": '<"H"lfr<"addcontact"><"showinactive">>t<"F"ip>',
      "aaSorting": [
        [5, 'desc'],
        [8, 'desc'],
        [6, 'asc'],
        [7, 'asc']
      ],
      "aoColumnDefs": [{
        "bSortable": false,
        "aTargets": ['_all']
      }, {
        "bVisible": false,
        "aTargets": [m_keyindex, 5, 6, 7, 8]
      }, {
        "sWidth": "100px",
        "aTargets": [4]
      }, {
        "mRender": function(data, type, full) {
          var result = '';
          var notes = full[3].notes;
          if ($.isEmptyObject(data) || data === "") {
            return "";
          }
          result += '<p style="font-weight:bold;">' + data.firstname + ' ' + data.lastname + '</p>';
          if (data.priority) {
            result += '<span style="font-size:8pt; display: block;">(Contact Priority #' + data.priority + ')</span>';
          }
          result += '<span style="font-size:8pt; display: block;">(' + data.relation + ')</span>';
          if (data.legal_guardian === "1") {
            result += '<span style="font-size:8pt; display: block;">(Legal Guardian)</span>';
          }
          if (data.corres_lang !== "") {
            result += '<span style="font-size:8pt; display: block;">(' + data.corres_lang + ')</span>';
          }
          if (notes) {
            result += '<p style="margin-bottom: 0; margin-left: 0;"><span class="infoheader">Notes: </span>' + notes + '</p>';
          }
          return result;
        },
        "aTargets": [1]
      }, {
        "mRender": function(data, type, full) {
          var result = '';
          if ($.isEmptyObject(data) || data === "") {
            return '';
          }
          var residenceAddress = data.residence_street === '' ? '' : data.residence_street + '<br />';
          residenceAddress += data.residence_city === '' ? '' : data.residence_city + ',';
          residenceAddress += data.residence_state + ' ' + data.residence_zip;
          var mailingAddress = data.mailing_street === '' ? '' : data.mailing_street + '<br />';
          mailingAddress += data.mailing_city === '' ? '' : data.mailing_city + ',';
          mailingAddress += data.mailing_state + ' ' + data.mailing_zip;
          if (data.residence_street) {
            result += '<p style="font-weight: bold; margin-bottom: 0; margin-left: 0;">Residence Address:</p>';
            result += '<a href="http://maps.google.com/?z=14&q=' + data.residence_street + ', ' + data.residence_city + ', ' + data.residence_state + ', ' + data.residence_zip + ' (' + full[1].firstname + ' ' + full[1].lastname + ')&output" target="_blank">' + residenceAddress + '</a><br />';
          }
          if (data.mailing_street) {
            result += '<p style="font-weight: bold; margin-bottom: 0; margin-left: 0;">Mailing Address:</p>';
            result += '<a href="http://maps.google.com/?z=14&q=' + data.mailing_street + ', ' + data.mailing_city + ', ' + data.mailing_state + ', ' + data.mailing_zip + ' (' + full[1].firstname + ' ' + full[1].lastname + ')&output" target="_blank">' + mailingAddress + '</a><br />';
          }
          return result;
        },
        "aTargets": [2]
      }, {
        "mRender": function(data, type, full) {
          var result = '';
          if ($.isEmptyObject(data) || data === "") {
            return "";
          }
          result += '<p>';
          if (data.email.email_address) {
            result += '<span class="infoheader">Email: </span><a href="mailto:' + data.email.email_address + '">' + data.email.email_address + '</a><br />';
          }
          $.each([1, 2, 3], function(index) {
            if (data.phone[index]) {
              if (data.phone[index].phone_type) {
                result += '<span class="infoheader">' + data.phone[index].phone_type + ': </span>';
              }
              if (data.phone[index].phone_number) {
                result += data.phone[index].phone_number + '<br />';
              }
            }
          });
          if (data.employer) {
            result += '<span class="infoheader">Employer: </span>' + data.employer + '<br />';
          }
          if (data.whenmodified && data.whomodified) {
            result += '<p style="font-size:7pt; display: block;"><span class="infoheader">Modified: </span>' + data.whenmodified + ' by ' + data.whomodified + '</p>';
          }
          result += '</p>';
          return result;
        },
        "aTargets": [3]
      }],
      "fnDrawCallback": function(oSettings) {
        $('#holder').find('td').removeClass('sorting_1 sorting_2 sorting_3');
      },
      "fnRowCallback": function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        var $row = $(nRow);
        var contactIsActive = aData[5] === "0";
        setInactiveDisplay($row, contactIsActive);
      }
    });

    /**
     * @param row {jQuery}
     * @param contactStatus {Boolean} - if contact is active, true, else false
     */
    function setInactiveDisplay(row, contactIsActive) {
      if (!contactIsActive) {
        // A contact was set to inactive
        var contactNameContainer = $(row).find('td').eq(0).find('p').eq(0);
        var inactiveTag = contactNameContainer.text() + " (INACTIVE)";
        if (contactNameContainer.text().indexOf(" (INACTIVE)") === -1) {
          contactNameContainer.html(inactiveTag);
        }
        $(row).attr({
          'class': 'inactive-contact'
        });
      } else {
        // Contact was previously set to inactive and is getting set back to active
        $(row).removeClass('inactive-contact');
        var contactBody = $(row).parents('tbody');
        contactBody.find('tr:even').addClass('odd');
        contactBody.find('tr:odd').addClass('even');
      }
    }

    //create add contact button, and bind click event handler
    $('.addcontact').append('<button>Add Contact</button>');
    $('.showinactive').append('<button>Show Inactive Contacts</button>');
    $('.addcontact button').button({
      icons: {
        primary: 'ui-icon-plus'
      }
    });
    $('.showinactive button').button({
      icons: {
        primary: 'ui-icon-plus'
      }
    });
    $('.addcontact').css({
      'display': 'inline'
    });
    $('.showinactive').css({
      'display': 'inline'
    });

    $(document).on('click', '.showinactive', function(event) {

      var inactiveButton = $(event.target).parents('button');
      var inactiveButtonText = inactiveButton.find('.ui-button-text');

      if (inactiveButtonText.text() === 'Show Inactive Contacts') {
        $('.inactive-contact').css({
          'display': 'table-row'
        });
        inactiveButtonText.html('Hide Inactive Contacts');
      } else if (inactiveButtonText.text() === 'Hide Inactive Contacts') {
        $('.inactive-contact').css({
          'display': 'none'
        });
        inactiveButtonText.html('Show Inactive Contacts');
      }
    });

    /**
     *
     * @param contactData {Object}
     * @param tableName {String}
     * @param [recordId] {Number|String} ID of database record
     */
    function saveContact(contactData, tableName, recordId, async) {
      var url;
      var type;
      if (recordId) {
        type = 'PUT';
        url = '/ws/schema/table/' + tableName + '/' + recordId;
      } else {
        type = 'POST';
        url = '/ws/schema/table/' + tableName;
      }

      // If async isn't passed in, below will be true.
      // If async is passed in, below will be false.
      async = typeof async === 'undefined';

      return $.ajax({
        url: url,
        data: JSON.stringify(contactData),
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: type,
        async: async
      });
    }

    function setupParsley() {
      window.ParsleyValidator
        .addValidator('resaddress', function(value) {
          /**
           *
           * @type {boolean}
           */
          var resFieldsEmpty = $('#residence-street').val() === "" &&
            $('#residence-city').val() === "" &&
            $('#residence-state').val() === "" &&
            $('#residence-zip').val() === "";
          if (resFieldsEmpty) {
            return true;
          } else {
            return !!value;
          }

        }, 100)
        .addMessage('en', 'resaddress', 'All address fields must be filled in');

      window.ParsleyValidator
        .addValidator('mailaddress', function(value) {
          /**
           *
           * @type {boolean}
           */
          var mailFieldsEmpty = $('#mailing-street').val() === "" &&
            $('#mailing-city').val() === "" &&
            $('#mailing-state').val() === "" &&
            $('#mailing-zip').val() === "";
          if (mailFieldsEmpty) {
            return true;
          } else {
            return !!value;
          }

        }, 100)
        .addMessage('en', 'mailaddress', 'All address fields must be filled in');

      window.ParsleyValidator
        .addValidator('onephonereq', function(value) {
          /**
           *
           * @type {boolean}
           */
          var allPhonesEmpty = $('#phone1type').val() === "" &&
            $('#phone1').val() === "" &&
            $('#phone2type').val() === "" &&
            $('#phone2').val() === "" &&
            $('#phone3type').val() === "" &&
            $('#phone3').val() === "";

          return !allPhonesEmpty;

        }, 100)
        .addMessage('en', 'onephonereq', 'At least one phone number is required.');

      window.ParsleyValidator
        .addValidator('phone1num', function(value) {
          if ($('#phone1type').val() === "" && $('#phone1').val() === "") {
            return true;
          } else if ($('#phone1type').val() !== "" && $('#phone1').val() === "") {
            return false;
          } else {
            return true;
          }
        }, 100)
        .addMessage('en', 'phone1num', 'Phone type was given, number is required.');

      window.ParsleyValidator
        .addValidator('phone1type', function(value) {
          if ($('#phone1type').val() === "" && $('#phone1').val() === "") {
            return true;
          } else if ($('#phone1').val() !== "" && $('#phone1type').val() === "") {
            return false;
          } else {
            return true;
          }
        }, 100)
        .addMessage('en', 'phone1type', 'Phone number was given, type is required.');

      window.ParsleyValidator
        .addValidator('phone2num', function(value) {
          if ($('#phone2type').val() === "" && $('#phone2').val() === "") {
            return true;
          } else if ($('#phone2type').val() !== "" && $('#phone2').val() === "") {
            return false;
          } else {
            return true;
          }
        }, 100)
        .addMessage('en', 'phone2num', 'Phone type was given, number is required.');

      window.ParsleyValidator
        .addValidator('phone2type', function(value) {
          if ($('#phone2type').val() === "" && $('#phone2').val() === "") {
            return true;
          } else if ($('#phone2').val() !== "" && $('#phone2type').val() === "") {
            return false;
          } else {
            return true;
          }
        }, 100)
        .addMessage('en', 'phone2type', 'Phone number was given, type is required.');

      window.ParsleyValidator
        .addValidator('phone3num', function(value) {
          if ($('#phone3type').val() === "" && $('#phone3').val() === "") {
            return true;
          } else if ($('#phone3type').val() !== "" && $('#phone3').val() === "") {
            return false;
          } else {
            return true;
          }
        }, 100)
        .addMessage('en', 'phone3num', 'Phone type was given, number is required.');

      window.ParsleyValidator
        .addValidator('phone3type', function(value) {
          if ($('#phone3type').val() === "" && $('#phone3').val() === "") {
            return true;
          } else if ($('#phone3').val() !== "" && $('#phone3type').val() === "") {
            return false;
          } else {
            return true;
          }
        }, 100)
        .addMessage('en', 'phone3type', 'Phone number was given, type is required.');

      window.ParsleyValidator
        .addValidator('phonelength', function(value) {
          var valLength = value.split("_").join("").length;
          return valLength === 12 || valLength === 0;
        }, 100)
        .addMessage('en', 'phonelength', 'Please completely fill in this phone number.');

      $('[id^=ceditform]').parsley({
        // bootstrap form classes
        errorsWrapper: '<span class=\"help-block\" style="display: block;white-space: normal;word-wrap: break-word;"></span>',
        errorTemplate: '<span class="error-message"></span>',
        excluded: ':hidden'
      });
    }

    /**
     * Gathers core contact data from the HTML form, and returns the field names in tlist child format
     * @returns {{}}
     */
    function getDomCoreDataTlc(contactNumber) {

      var contactCoreData = {};
      var keyName = toTlcFieldName('contact_id', -1, psData.studentdcid, null, true);
      contactCoreData[keyName] = contactNumber.toString();
      keyName = toTlcFieldName('first_name', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#first-name').val();
      keyName = toTlcFieldName('last_name', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#last-name').val();
      keyName = toTlcFieldName('priority', -1, psData.studentdcid, null, true);
      contactCoreData[keyName] = $('#priority').val();
      keyName = toTlcFieldName('legal_guardian', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#legal-guardian').val();
      keyName = toTlcFieldName('relationship', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#relationship').val();
      keyName = toTlcFieldName('residence_street', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#residence-street').val();
      keyName = toTlcFieldName('residence_city', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#residence-city').val();
      keyName = toTlcFieldName('residence_state', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#residence-state').val();
      keyName = toTlcFieldName('residence_zip', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#residence-zip').val();
      keyName = toTlcFieldName('mailing_street', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#mailing-street').val();
      keyName = toTlcFieldName('mailing_city', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#mailing-city').val();
      keyName = toTlcFieldName('mailing_state', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#mailing-state').val();
      keyName = toTlcFieldName('mailing_zip', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#mailing-zip').val();
      keyName = toTlcFieldName('employer', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#employer').val();
      keyName = toTlcFieldName('notes', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#notes').val();
      keyName = toTlcFieldName('corres_lang', -1, psData.studentdcid);
      contactCoreData[keyName] = $('#corres-lang').val();
      keyName = toTlcFieldName('status', -1, psData.studentdcid, null, true);
      contactCoreData[keyName] = "0";
      return contactCoreData;
    }

    /**
     * Gathers email data from the HTML form, and returns the field names in tlist child format
     * @returns {{}}
     */
    function getDomEmailDataTlc(contactDcid) {
      var emailData = {};
      var tableName = 'U_SC_EMAIL';
      var keyName = toTlcFieldName('email_address', -1, psData.studentdcid, tableName);
      emailData[keyName] = $('#email').val();
      keyName = toTlcFieldName('contactdcid', -1, psData.studentdcid, tableName);
      emailData[keyName] = contactDcid;
      keyName = toTlcFieldName('opts_emergency', -1, psData.studentdcid, tableName);
      emailData[keyName] = $('#email-opts-emergency').is(':checked') ? "1" : "";
      keyName = toTlcFieldName('opts_high_priority', -1, psData.studentdcid, tableName);
      emailData[keyName] = $('#email-opts-high-priority').is(':checked') ? "1" : "";
      keyName = toTlcFieldName('opts_general', -1, psData.studentdcid, tableName);
      emailData[keyName] = $('#email-opts-general').is(':checked') ? "1" : "";
      keyName = toTlcFieldName('opts_attendance', -1, psData.studentdcid, tableName);
      emailData[keyName] = $('#email-opts-attendance').is(':checked') ? "1" : "";
      keyName = toTlcFieldName('opts_survey', -1, psData.studentdcid, tableName);
      emailData[keyName] = $('#email-opts-survey').is(':checked') ? "1" : "";

      return emailData;
    }

    /**
     * Gathers phone data from the HTML form, and returns the field names in tlist child format
     * @returns {{}}
     */
    function getDomPhoneDataTlc(phoneIndex, contactDcid) {
      var phoneData = {};
      var tableName = 'U_SC_PHONE';
      var newId;
      if (phoneIndex === 3) {
        newId = -2;
      } else {
        newId = -1;
      }
      var keyName = toTlcFieldName('phone_type', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + 'type').val();

      keyName = toTlcFieldName('contactdcid', newId, psData.studentdcid, tableName);
      phoneData[keyName] = contactDcid;

      keyName = toTlcFieldName('phone_number', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex).val();

      keyName = toTlcFieldName('phone_priority', newId, psData.studentdcid, tableName, true);
      phoneData[keyName] = phoneIndex;

      keyName = toTlcFieldName('phone_extension', newId, psData.studentdcid, tableName, true);
      phoneData[keyName] = $('#phone' + phoneIndex + 'ext').val();

      keyName = toTlcFieldName('opts_voice_emergency', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-voice-emergency').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_text_emergency', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-text-emergency').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_voice_high_priority', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-voice-high-priority').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_text_high_priority', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-text-high-priority').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_voice_general', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-voice-general').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_text_general', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-text-general').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_voice_attendance', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-voice-attendance').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_text_attendance', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-text-attendance').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_voice_survey', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-voice-survey').is(':checked') ? "1" : "";

      keyName = toTlcFieldName('opts_text_survey', newId, psData.studentdcid, tableName);
      phoneData[keyName] = $('#phone' + phoneIndex + '-opts-text-survey').is(':checked') ? "1" : "";
      return phoneData;
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
    function toTlcFieldName(fieldName, recordId, foreignKey, tableName, isInteger) {
      // Set tableName to default value if it was not passed in.
      if (!tableName) {
        tableName = 'U_STUDENT_CONTACTS';
      }

      var tlcFieldName = 'CF-[STUDENTS:' + foreignKey + '.U_STUDENT_CONTACTS.' + tableName + ':' + recordId + ']' + fieldName;

      if (isInteger) {
        tlcFieldName += '$formatnumeric=#########.#####';
      }
      return tlcFieldName;
    }

    /**
     * Saves a contact using the same method that a tlist child tag uses:
     * By sending a POST to changesrecorded.white.html with the form fields formatted
     * using the CF-... format.
     * This function will add the ac=prim key value pair
     * @param contactCoreData {Object} all form fields that will saved, in tlist child form.
     */
    function saveDataUsingTlc(contactCoreData) {
      contactCoreData.ac = 'prim';
      return $.ajax({
        type: 'POST',
        url: '/admin/changesrecorded.white.html',
        data: contactCoreData
      });
    }

    $(document).on('click', '.addcontact', function() {
      var _this = this;
      $('.addcontact').hide();
      $.getJSON(m_requestURL, {
          "frn": psData.frn,
          "action": "addcontact",
          "sdcid": psData.studentdcid
        })
        .success(function(addContactResp) {
          if (addContactResp.contactnumber > 0) {
            var n = addContactResp.contactnumber;
            var ridx = m_table.fnAddData([n, "", "", "", "", "", "", "", ""]);
            var sourcerow = m_table.fnSettings().aoData[ridx].nTr;
            $.get(m_requestURL, {
                "frn": psData.frn,
                "gidx": n,
                "action": "getcreateform"
              })
              .success(function(editform) {
                var editrow = m_table.fnOpen(sourcerow, editform, "edit_row");
                var $editRow = $(editrow);

                setupParsley();

                // Set up input masks
                $editRow.find('.phone').inputmask('999-999-9999');
                $editRow.find('.zip').inputmask('99999');
                $editRow.find('#email').inputmask({
                  'alias': 'email'
                });

                $editRow.find('#copy-email').on('click', function(event) {
                  var $target = $(event.target);
                  var $emailField = $target.parents('td').find('#email');
                  copyGuardianEmail($emailField, $target.siblings('.data').text());
                });

                $editRow.find('.copy-home-phone').on('click', function(event) {
                  var $target = $(event.target);
                  var $phoneField = $('#' + $target.data().fieldId);
                  copyPhone($phoneField, $target.siblings('.data').text());
                });

                $editRow.find('.copy-home-phone').on('click', function(event) {
                  var $target = $(event.target);
                  var $phoneField = $('#' + $target.data().fieldId);
                  copyPhone($phoneField, $target.siblings('.data').text());
                });

                // Add options to the priority select dropdown menu
                var prioritySelect = $editRow.find('#priority');
                var optionTemplate = $('#option-template').html();
                var numberOfContacts = Object.keys(contactsCollection).length;

                $.each(_.range(1, numberOfContacts + 2), function(index, priority) {
                  var renderedOptTemplate = _.template(optionTemplate, {
                    value: priority,
                    label: priority
                  });
                  prioritySelect.append(renderedOptTemplate);
                });

                $('form', editrow).one('submit', function(event) {
                  $(this).find('[type=submit]').attr('disabled', 'disabled');
                  event.preventDefault();
                  loadingDialogInstance.open();

                  // Rearrange priorities for existing contacts

                  var newPriority = $('#priority').val();
                  if (newPriority !== $('#priority').find('option').last().val()) {
                    // Get all contacts with greater than or equal to priority
                    // of the new contact
                    $.each(contactsCollection, function(index, contact) {
                      if (parseInt(contact[1].priority) >= parseInt(newPriority)) {

                        var postData = {
                          name: config.contactsTable,
                          tables: {}
                        };

                        postData.tables[config.contactsTable] = {
                          priority: (parseInt(contact[1].priority) + 1).toString()
                        };
                        saveContact(postData, config.contactsTable, contact[1].record_id);
                      }
                    });
                  }

                  function savePhones(contactdcid) {
                    var ajaxCalls = [];
                    $.each([1, 2, 3], function(index, i) {
                      var phoneTypeNameId = 'phone' + i + 'type';
                      var phoneNumberId = 'phone' + i;

                      var phoneTypeElem = $('#' + phoneTypeNameId);
                      var phoneNumberElem = $('#' + phoneNumberId);

                      if (phoneTypeElem.val() && phoneNumberElem.val()) {
                        var phoneDataTlc = getDomPhoneDataTlc(i, contactdcid);

                        // Requests are fired here
                        ajaxCalls.push(saveDataUsingTlc(phoneDataTlc));
                      }
                    });

                    // Callback fires when all responses are recieved
                    $.when.apply($, ajaxCalls).done(function() {
                      m_table.fnClose(sourcerow);
                      loadingDialogInstance.forceClose();
                      $('.addcontact').show();
                      refreshContact(addContactResp.contactnumber, sourcerow);
                    });
                  }

                  var contactCoreDataTlc = getDomCoreDataTlc(addContactResp.contactnumber);
                  saveDataUsingTlc(contactCoreDataTlc).done(function(contactCoreResp) {
                    var contactId = addContactResp.contactnumber.toString();
                    var studentDcid = psData.studentdcid;
                    fetch('/admin/students/contacts/getContactRecordId.json.html?contactid=' + contactId + '&studentsdcid=' + studentDcid, {
                        credentials: 'include'
                      })
                      .then(function(contactRecordId) {
                        return contactRecordId.json();
                      })
                      .then(function(contactRecordResp) {
                        var contact = {
                          id: contactRecordResp.id,
                          contactdcid: contactRecordResp.id
                        };

                        contactClient.save(contact).then(function() {
                          if ($('#email').val()) {
                            var emailDataTlc = getDomEmailDataTlc(contactRecordResp.id);
                            saveDataUsingTlc(emailDataTlc).done(function() {
                              savePhones(contactRecordResp.id);
                            });
                          } else {
                            savePhones(contactRecordResp.id);
                          }
                        });
                      });
                  });
                });
                $('.edit_cancel', editrow).click(function() {
                  m_table.fnClose(sourcerow);
                  m_table.fnDeleteRow(sourcerow);
                  $('.addcontact').show();
                });
              });
          }
        });
    });


    $(document).on('click', '.editcontact', function() {
      var _this = this;
      $('.addcontact').hide();
      var row = $(this).parents('tr')[0];
      if (row) {
        var sourcerow = row;
        var contactId = m_table.fnGetData(row)[m_keyindex];
        var contactDcid = contactsCollection[contactId][1].record_id;
        $.get(m_requestURL, {
            "frn": psData.frn,
            "contactdcid": contactDcid,
            "gidx": contactId,
            "action": "geteditform"
          })
          .success(function(editform) {

            var editrow = m_table.fnOpen(row, editform, 'edit_row');
            var $editRow = $(editrow);

            setupParsley();

            // Set up input masks
            $editRow.find('.phone').inputmask('999-999-9999');
            $editRow.find('.zip').inputmask('99999');

            // Only bind input mask to email field if the guardian email doesn't have commas
            var guardianEmail = $editRow.find('#email').text();
            if (guardianEmail.indexOf(',') === -1) {
              $editRow.find('#email').inputmask({
                'alias': 'email'
              });
            }

            $editRow.find('#copy-email').on('click', function(event) {
              var $target = $(event.target);
              var $emailField = $target.parents('td').find('#email');
              copyGuardianEmail($emailField, $target.siblings('.data').text());
            });

            $editRow.find('.copy-home-phone').on('click', function(event) {
              var $target = $(event.target);
              var $phoneField = $('#' + $target.data().fieldId);
              copyPhone($phoneField, $target.siblings('.data').text());
            });

            var numberOfContacts = Object.keys(contactsCollection).length;

            var prioritySelect = $editRow.find('#priority');

            $.each(_.range(1, numberOfContacts + 1), function(index, priority) {
              var renderedOptTemplate = _.template(optionTemplate, {
                value: priority,
                label: priority
              });
              prioritySelect.append(renderedOptTemplate);
            });

            // Set the right option of the priority dropdown
            var priority = prioritySelect.data().value;
            var priorityOptions = prioritySelect.find('option');
            $.each(priorityOptions, function(index, option) {
              if (parseInt($(option).val()) === priority) {
                $(option).attr('selected', 'selected');
              }
            });

            // Set the right option of the relationship dropdown
            var relationshipSelect = $editRow.find('#relationship');
            var relationship = relationshipSelect.data().value;
            relationshipSelect.val(relationship);

            // Set the right option of the legal guardian dropdown
            var legalGuardianSelect = $editRow.find('#legal-guardian');
            var legalGuardian = legalGuardianSelect.data().value;
            if (legalGuardian.toString() === "1") {
              legalGuardianSelect.find('option[value="1"]').attr('selected', 'selected');
            } else {
              legalGuardianSelect.find('option[value="0"]').attr('selected', 'selected');
            }

            //Set the right option of the language of correspondence dropdown
            var corresLangSelect = $editRow.find('#corres-lang');
            var corresLangVal = corresLangSelect.data().value;
            corresLangSelect.val(corresLangVal);
            // If nothing was selected, select the English default option
            if (corresLangSelect.data().value === '') {
              corresLangSelect.val('ENG');
            }

            // Set the right option for the residence state dropdown
            var residenceStateSelect = $('#residence-state');
            residenceStateSelect.find('option[value="' + residenceStateSelect.data().value + '"]').attr('selected', 'selected');

            // Set the right option for the mailing state dropdown
            var mailingStateSelect = $('#mailing-state');
            mailingStateSelect.find('option[value="' + mailingStateSelect.data().value + '"]').attr('selected', 'selected');

            var phone1TypeSelect = $editRow.find('#phone1type');
            phone1TypeSelect.find('option[value="' + phone1TypeSelect.data().value + '"]').attr({
              'selected': 'selected'
            });

            var phone2TypeSelect = $editRow.find('#phone2type');
            phone2TypeSelect.find('option[value="' + phone2TypeSelect.data().value + '"]').attr({
              'selected': 'selected'
            });

            var phone3TypeSelect = $editRow.find('#phone3type');
            phone3TypeSelect.find('option[value="' + phone3TypeSelect.data().value + '"]').attr({
              'selected': 'selected'
            });

            // Add options to the priority select dropdown menu
            var optionTemplate = $('#option-template').html();


            // Set email contact options checkboxes to checked
            if ($('#email-opts-emergency').attr('value') === '1') {
              $('#email-opts-emergency').attr('checked', 'checked');
            }
            if ($('#email-opts-high-priority').attr('value') === '1') {
              $('#email-opts-high-priority').attr('checked', 'checked');
            }
            if ($('#email-opts-general').attr('value') === '1') {
              $('#email-opts-general').attr('checked', 'checked');
            }
            if ($('#email-opts-attendance').attr('value') === '1') {
              $('#email-opts-attendance').attr('checked', 'checked');
            }
            if ($('#email-opts-survey').attr('value') === '1') {
              $('#email-opts-survey').attr('checked', 'checked');
            }

            $('form', editrow).submit(function(event) {
              $(this).find('[type=submit]').attr('disabled', 'disabled');
              event.preventDefault();
              loadingDialogInstance.open();
              var newPriority = parseInt($('#priority').val());
              var oldPriority = parseInt(contactsCollection[contactId][1].priority);
              if (newPriority !== oldPriority) {
                // First priority contact is getting changed.
                if (newPriority > oldPriority) {
                  $.each(contactsCollection, function(index, contact) {
                    if (parseInt(contact[1].priority) > parseInt(oldPriority) && parseInt(contact[1].priority) <= parseInt(newPriority)) {
                      var postData = {
                        name: config.contactsTable,
                        tables: {}
                      };
                      postData.tables[config.contactsTable] = {
                        priority: (parseInt(contact[1].priority) - 1).toString()
                      };
                      saveContact(postData, config.contactsTable, contact[1].record_id).done(function() {
                        // Find the rows that were updated and refresh them
                        // Get all rows that contain a td with a p element (only contact rows have this)
                        var tableRows = $('tr:has("td p")');
                        var updatedRow;
                        $.each(tableRows, function(index, tableRow) {
                          var rowContactId = m_table.fnGetData(tableRow)[m_keyindex];
                          if (rowContactId === contact[0]) {
                            updatedRow = tableRow;
                          }
                          if (updatedRow) {
                            refreshContact(rowContactId, updatedRow);
                          }
                          updatedRow = null;
                        });
                      });
                    }


                  });
                } else if (newPriority < oldPriority) {
                  $.each(contactsCollection, function(index, contact) {
                    if (parseInt(contact[1].priority) < parseInt(oldPriority) && parseInt(contact[1].priority) >= parseInt(newPriority)) {
                      var postData = {
                        name: config.contactsTable,
                        tables: {}
                      };
                      postData.tables[config.contactsTable] = {
                        priority: (parseInt(contact[1].priority) + 1).toString()
                      };
                      saveContact(postData, config.contactsTable, contact[1].record_id).done(function() {
                        // Find the rows that were updated and refresh them
                        // Get all rows that contain a td with a p element (only contact rows have this)
                        var tableRows = $('tr:has("td p")');
                        var updatedRow;
                        $.each(tableRows, function(index, tableRow) {
                          var rowContactId = m_table.fnGetData(tableRow)[m_keyindex];
                          if (rowContactId === contact[0]) {
                            updatedRow = tableRow;
                          }
                          if (updatedRow) {
                            refreshContact(rowContactId, updatedRow);
                          }
                          updatedRow = null;
                        });
                      });
                    }
                  });
                }
              }

              var contactCoreData = {
                name: config.contactsTable,
                tables: {}
              };

              contactCoreData.tables[config.contactsTable] = {
                first_name: $('#first-name').val(),
                last_name: $('#last-name').val(),
                priority: $('#priority').val(),
                legal_guardian: $('#legal-guardian').val(),
                relationship: $('#relationship').val(),
                residence_street: $('#residence-street').val(),
                residence_city: $('#residence-city').val(),
                residence_state: $('#residence-state').val(),
                residence_zip: $('#residence-zip').val(),
                mailing_street: $('#mailing-street').val(),
                mailing_city: $('#mailing-city').val(),
                mailing_state: $('#mailing-state').val(),
                mailing_zip: $('#mailing-zip').val(),
                employer: $('#employer').val(),
                notes: $('#notes').val(),
                corres_lang: $('#corres-lang').val()
              };

              var contactEmailData = {
                name: config.contactsEmailTable,
                tables: {}
              };

              contactEmailData.tables[config.contactsEmailTable] = {
                email_address: $('#email').val(),
                contactdcid: contactsCollection[contactId][1].record_id.toString(),
                opts_emergency: $('#email-opts-emergency').is(':checked') ? "1" : "",
                opts_high_priority: $('#email-opts-high-priority').is(':checked') ? "1" : "",
                opts_general: $('#email-opts-general').is(':checked') ? "1" : "",
                opts_attendance: $('#email-opts-attendance').is(':checked') ? "1" : "",
                opts_survey: $('#email-opts-survey').is(':checked') ? "1" : ""
              };

              // If this email corresponds to an existing contact, the contactdcid was inserted into the contactsCollection
              // when all contacts were first loaded.
              if (contactsCollection[contactId][1].contactdcid) {
                contactEmailData.tables[config.contactsEmailTable].contactdcid = contactsCollection[contactId][1].contactdcid;
              }

              saveContact(contactCoreData, config.contactsTable, contactsCollection[contactId][1].record_id).done(function(data) {
                /**
                 *
                 */
                function savePhones() {
                  var contCollPhones = contactsCollection[contactId][3].phone;

                  var ajaxCalls = [];

                  $.get('/admin/students/contacts/scchange/phoneTlcForm.html?frn=' + psData.frn, function() {
                    $.each([1, 2, 3], function(index, i) {
                      // Find the contact in the contactsCollection that matches the current priority (@param i)
                      var saveContactPhoneArgs = [];
                      var contCollPhoneWithThisPriority = $.grep(contCollPhones, function(elem) {
                        return elem.phone_priority === i.toString();
                      });

                      var phoneTypeNameId = 'phone' + i + 'type';
                      var phoneNumberId = 'phone' + i;

                      var phoneTypeElem = $('#' + phoneTypeNameId);
                      var phoneNumberElem = $('#' + phoneNumberId);


                      // A contact with a matching priority to "i" exists, so this phone record must already exist
                      if (contCollPhoneWithThisPriority.length !== 0) {

                        var contactPhoneData = {
                          name: config.contactsPhoneTable,
                          tables: {}
                        };

                        contactPhoneData.tables[config.contactsPhoneTable] = {
                          "contactdcid": contactDcid,
                          "phone_number": phoneNumberElem.val(),
                          "phone_type": phoneTypeElem.val(),
                          "phone_priority": i.toString(),
                          "opts_voice_high_priority": $('#phone' + i + '-opts-voice-high-priority').is(':checked') ? "1" : "",
                          "opts_voice_general": $('#phone' + i + '-opts-voice-general').is(':checked') ? "1" : "",
                          "opts_voice_attendance": $('#phone' + i + '-opts-voice-attendance').is(':checked') ? "1" : "",
                          "opts_voice_survey": $('#phone' + i + '-opts-voice-survey').is(':checked') ? "1" : "",
                          "opts_text_high_priority": $('#phone' + i + '-opts-text-high-priority').is(':checked') ? "1" : "",
                          "opts_text_general": $('#phone' + i + '-opts-text-general').is(':checked') ? "1" : "",
                          "opts_text_attendance": $('#phone' + i + '-opts-text-attendance').is(':checked') ? "1" : "",
                          "opts_text_survey": $('#phone' + i + '-opts-text-survey').is(':checked') ? "1" : ""
                        };

                        saveContactPhoneArgs.push(contactPhoneData);
                        saveContactPhoneArgs.push(config.contactsPhoneTable);

                        // The api expects the db record id for this phone record
                        // not to be confused with the contactdcid, which is the foreign key that ties this number
                        // to its corresponding contact
                        saveContactPhoneArgs.push(contCollPhoneWithThisPriority[0].id);

                        // Force the ajax call to be synchronous
                        saveContactPhoneArgs.push(true);

                        if (saveContactPhoneArgs.length !== 0) {
                          ajaxCalls.push(saveContact.apply(this, saveContactPhoneArgs));
                        }
                      } else {
                        // No contact in the contactsCollection array was found to match the phone with the current priority,
                        // so, check if any data was entered for this phone number, and if that is true, create a new phone number+data
                        // for this phone priority.
                        if (phoneTypeElem.val() && phoneNumberElem.val()) {
                          var phoneDataTlc = getDomPhoneDataTlc(i, contactDcid);

                          // POST requests get fired here
                          ajaxCalls.push(saveDataUsingTlc(phoneDataTlc));
                        }
                      }
                    });


                    function doRefresh() {
                      m_table.fnClose(sourcerow);
                      $('.addcontact').show();
                      loadingDialogInstance.forceClose();
                      refreshContact(contactId, sourcerow);
                    }

                    if (ajaxCalls.length > 0) {
                      // Handle POST responses here.
                      $.when.apply($, ajaxCalls).done(function() {
                        doRefresh();
                      });
                    } else {
                      doRefresh();
                    }
                  });
                }

                $.get('/admin/students/contacts/scchange/emailTlcForm.html?frn=' + psData.frn, function() {
                  var contCollEmail = contactsCollection[contactId][3].email;
                  // If contact had email when page was loaded
                  var emailAjaxCall = [];
                  if (contCollEmail.hasOwnProperty('email_address')) {
                    // If this is a new contact, use the dcid of the new contact (given in "data" response obj)
                    var saveContactEmailArgs = [];
                    if (!contactEmailData.tables[config.contactsEmailTable].contactdcid) {
                      contactEmailData.tables[config.contactsEmailTable].contactdcid = data.id;
                    }
                    saveContactEmailArgs.push(contactEmailData);
                    saveContactEmailArgs.push(config.contactsEmailTable);
                    saveContactEmailArgs.push(contCollEmail.id);
                    emailAjaxCall.push(saveContact.apply(this, saveContactEmailArgs));

                    // User didn't have email when page was loaded
                  } else {
                    // If contact is creating new email
                    if ($('#email').val() !== "") {
                      var emailDataTlc = getDomEmailDataTlc(contactsCollection[contactId][1].record_id);
                      emailAjaxCall.push(saveDataUsingTlc(emailDataTlc));
                    }
                  }

                  // If any email options were input to the page
                  if (emailAjaxCall.length !== 0) {
                    $.when.apply($, emailAjaxCall).done(function() {
                      savePhones();
                    });

                  } else {
                    savePhones();
                  }
                });
              });
            });

            $(".form-copy").on("click", function(event) {
              event.preventDefault();
              if ($(event.target).attr("id") === "copy-from-res") {
                $("#mailing-street").val($("#residence-street").val());
                $("#mailing-city").val($("#residence-city").val());
                $("#mailing-state").val($("#residence-state").val());
                $("#mailing-zip").val($("#residence-zip").val());
              }

              if ($(event.target).attr("id") === "copy-from-mail") {
                $("#residence-street").val($("#mailing-street").val());
                $("#residence-city").val($("#mailing-city").val());
                $("#residence-state").val($("#mailing-state").val());
                $("#residence-zip").val($("#mailing-zip").val());
              }
            });

            $('.edit_cancel', editrow).click(function() {
              $('.addcontact').show();
              m_table.fnClose(sourcerow);
            });
          });
      }
    });

    $(document).on('click', '.inactivatecontact', function(event) {
      var row = $(this).parents('tr')[0];
      if (row) {
        var rowData = m_table.fnGetData(row);
        var contactId = rowData[m_keyindex];
        var contactName = $(row).find('td').eq(0).find('p').eq(0).text();
        if (window.confirm("Inactivate contact, \"" + contactName + "\"?")) {
          var postData = {
            name: 'u_student_contacts',
            tables: {
              'u_student_contacts': {
                status: '-2'
              }
            }
          };
          $.ajax({
              url: "/ws/schema/table/u_student_contacts/" + contactsCollection[contactId][1].record_id,
              data: JSON.stringify(postData),
              type: "PUT",
              dataType: "json",
              contentType: 'application/json; charset=utf-8'
            })
            .success(function() {
              refreshContact(contactId, row);
            })
            .error(function(jqxhr) {
              displayError(jqxhr.statusText);
            });
        }
      }
    });

    $(document).on('click', '.deletecontact', function(event) {
      var row = $(this).parents('tr')[0];
      if (row) {
        var rowData = m_table.fnGetData(row);
        var contactId = rowData[m_keyindex];
        var contactName = $(row).find('td').eq(0).find('p').eq(0).text();
        if (window.confirm("Delete contact, \"" + contactName + "\"?")) {
          $.get("/admin/students/contacts/contactdata.html?action=deletecontact&gidx=" + contactId + "&frn=001" + psData.studentdcid, function(resp) {
            $("body").append(resp);
            $.post($("#delete-form").attr("action"), $("#delete-form").serialize(), function(resp) {
              row.remove();
              var index = contactsCollection.indexOf(contactId);
              if (index > -1) {
                contactsCollection.splice(index, 1);
              }
            });
          });
        }
      }
    });

    $(document).on('click', '.activatecontact', function(event) {
      var row = $(this).parents('tr')[0];
      if (row) {
        var rowData = m_table.fnGetData(row);
        var contactId = rowData[m_keyindex];
        var contactName = $(row).find('td').eq(0).find('p').eq(0).text();
        if (window.confirm("Activate contact, \"" + contactName + "\"?")) {
          var postData = {
            name: 'u_student_contacts',
            tables: {
              'u_student_contacts': {
                status: '0'
              }
            }
          };
          $.ajax({
              url: "/ws/schema/table/u_student_contacts/" + contactsCollection[contactId][1].record_id,
              data: JSON.stringify(postData),
              type: "PUT",
              dataType: "json",
              contentType: 'application/json; charset=utf-8'
            })
            .success(function() {
              refreshContact(contactId, row);
            })
            .error(function(jqxhr) {
              displayError(jqxhr.statusText);
            });
        }
      }
    });

    $(document).on("click", ".copy-demo", function(event) {
      /**
       *
       * @return {[object]} [description]
       */
      function createExtDataObj(fieldName, fieldValue) {
        return {
          "_table_extension": {
            "name": "studentcorefields",
            "_field": [{
              "name": fieldName,
              "value": fieldValue
            }]
          }
        };
      }

      function saveDemoData(target) {
        var studentsObj = {
          students: {
            student: {
              client_uid: 1,
              action: "UPDATE",
              id: psData.studentdcid
            }
          }
        };
        if (studentField === "guardianemail") {
          studentsObj.students.student.contact = {
            guardian_email: inputVal
          };
        } else if (studentField === "father") {
          studentsObj.students.student.contact = {
            father: inputVal
          };
        } else if (studentField === "mother") {
          studentsObj.students.student.contact = {
            mother: inputVal
          };
        } else if (studentField === "mother_employer" ||
          studentField === "father_employer" ||
          studentField === "fatherdayphone" ||
          studentField === "father_home_phone" ||
          studentField === "motherdayphone" ||
          studentField === "mother_home_phone") {
          studentsObj.students.student._extension_data = createExtDataObj(studentField, inputVal);
        } else if (studentField === "home_address") {
          studentsObj.students.student.addresses = {
            physical: {
              street: inputVal.street,
              city: inputVal.city,
              state_province: inputVal.state,
              postal_code: inputVal.zip
            }
          };
        } else if (studentField === "mailing_address") {
          studentsObj.students.student.addresses = {
            mailing: {
              street: inputVal.street,
              city: inputVal.city,
              state_province: inputVal.state,
              postal_code: inputVal.zip
            }
          };
        }

        $.ajax({
          "type": "POST",
          "url": "/* @echo API_URL *//api/student",
          "dataType": "json",
          "data": JSON.stringify(studentsObj),
          "contentType": "application/json"
        }).then(function() {
          loadingDialogInstance.forceClose();
          var elem;
          if (op === "append") {
            elem = target.parents('.mini').siblings('.added');
          } else {
            elem = target.parents('.mini').siblings('.copied');
          }
          elem.css({
              display: "block"
            })
            .fadeIn('slow')
            .animate({
              opacity: 1.0
            }, 1500)
            .delay(5000)
            .fadeOut('slow');
        });
      }

      function addToVal(oldVal, addedVal) {
        return oldVal + "," + addedVal;
      }

      var $target = $(event.target);
      var studentField = $target.data("field-name");
      var inputId = $target.data("input-id");
      var op = $target.data("op");
      var inputVal;
      if (studentField === "father" || studentField === "mother") {
        inputVal = $(inputId).eq(1).val() + ", " + $(inputId).eq(0).val();
      } else if (studentField === "home_address" || studentField === "mailing_address") {
        inputVal = {
          street: $(inputId).eq(0).val(),
          city: $(inputId).eq(1).val(),
          state: $(inputId).eq(2).val(),
          zip: $(inputId).eq(3).val()
        };
      } else {
        inputVal = $(inputId).val();
      }

      $.get(`/admin/students/contacts/contactdata.html?action=enable.edit.demo&frn=001${psData.studentdcid}`, function() {
        $.getJSON("/admin/students/contacts/contactdata.html?action=get.demo.data&studentsdcid=" + psData.studentdcid, function(demoData) {
          var msg;
          if (op === "append") {
            msg = "Are you sure you want to add to " + studentField + "? The value entered here \"" + inputVal + "\" will be added to the Demographics value \"" + demoData[studentField] + "\"";
          } else if (demoData[studentField] !== "") {
            // If overwriting an address field, the inputVal needs to be stringified in a specific way.
            if (studentField === "home_address" || studentField === "mailing_address") {
              msg = "Are you sure you want to overwrite the contents of " + studentField + "? The Demographics value \"" + demoData[studentField] + "\" will be replaced by \"" + inputVal.street + " " + inputVal.city + " " + inputVal.state + ", " + inputVal.zip + "\"";
            } else {
              // Fields other than address fields, inputVal can be printed by just concating it to a string.
              msg = "Are you sure you want to overwrite the contents of " + studentField + "? The Demographics value \"" + demoData[studentField] + "\" will be replaced by \"" + inputVal + "\"";
            }
          } else {
            msg = "Are you sure you want to set the contents of " + studentField + " to \"" + inputVal + "\"?";
          }
          var confirmed = window.confirm(msg);
          if (confirmed) {
            loadingDialogInstance.open();
            if ($target.data("op") === "append") {
              inputVal = addToVal(demoData[studentField], inputVal);
            }
            saveDemoData($target);
          }
        });
      });
    });


    //Fetch contact listing
    $.get(m_requestURL, {
        "sdcid": psData.studentdcid,
        "action": "newfetchcontacts"
      }, function() {}, "json")
      .done(function(data) {

        // In order to be valid JSON, an empty element has to be added to the array after the tlist_sql.
        // Remove that empty element here.
        data.pop();

        if (data.length > 0) {
          $.each(data, function(index, contactId) {
            refreshContact(contactId);
          });
        } else {
          loadingDialogInstance.closeDialog();
        }
      });

  });

  function loadContactData(contactId) {
    return $.ajax({
      url: m_requestURL,
      type: 'GET',
      data: {
        action: "getcontact",
        gidx: contactId,
        sdcid: psData.studentdcid
      },
      dataType: "json"
    });
  }

  function loadEmailPhoneData(contactDcid) {
    var emailPhoneAjax = [];
    emailPhoneAjax.push($.ajax({
      url: m_requestURL,
      type: 'GET',
      data: {
        action: "getemail",
        cdcid: contactDcid,
        sdcid: psData.studentdcid
      },
      dataType: "json"
    }));

    emailPhoneAjax.push($.ajax({
      url: m_requestURL,
      type: 'GET',
      data: {
        action: "getphone",
        sdcid: psData.studentdcid,
        cdcid: contactDcid
      },
      dataType: "json"
    }));
    return emailPhoneAjax;

  }


  /**
   *
   * @param contactId {Number} - u_student_contacts.contact_id
   * @param [row] {Element|jQuery}
   */
  function refreshContact(contactId, row) {

    loadContactData(contactId).done(function(contactsData) {
      contactsCollection[contactId] = contactsData;
      var emailPhoneAjax = loadEmailPhoneData(contactsData[1].record_id);
      $.when.apply($, emailPhoneAjax)
        .done(function(contactEmailData, contactPhoneData) {
          $.get('/admin/students/contacts/studentcontacts.html?frn=' + psData.frn, function() {
            contactsCollection[contactId][3].email = contactEmailData[0];
            contactsCollection[contactId][3].phone = contactPhoneData[0];
            contactsCollection[contactId][3].phone.pop();

            var contactData = contactsCollection[contactId];


            loadingDialogInstance.closeDialog();
            if (!row) {

              // Contact is already inactive and is getting loaded as inactive
              // Set the buttons element to Activate button.
              if (contactData[5] === "-2") {
                contactData[4] = "<button class='activatecontact'>Activate</button>";
              }

              m_table.fnAddData(contactData);
            } else {
              // Contact was set to inactive and contact is getting refreshed
              // Set the buttons element to Activate button.
              if (contactData[5] === "-2") {
                contactData[4] = "<button class='activatecontact'>Activate</button>";
              }

              m_table.fnUpdate(contactData, row);
            }
            $('.editcontact').button({
              icons: {
                primary: 'ui-icon-pencil'
              }
            });
            $('.inactivatecontact').button({
              icons: {
                primary: 'ui-icon-cancel'
              }
            });
            $('.deletecontact').button({
              icons: {
                primary: 'ui-icon-trash'
              }
            });
          });
        });
    });
  }

  function displayError(msg) {
    $('#error_container').html('<div id="alertmsg" style="padding: 0 0.7em;" class="ui-state-error ui-corner-all"><p><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-alert"></span><strong>Alert: </strong>' + msg + '</p></div>').show();
  }
}
