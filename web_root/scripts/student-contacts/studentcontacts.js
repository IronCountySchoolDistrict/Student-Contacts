/*global jQuery,psData,confirm,loadingDialogInstance, console, require*/

(function () {
    'use strict';

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

    var $ = jQuery.noConflict();
    var m_table;
    var m_keyindex = 0;
    var m_requestURL = '/admin/students/contacts/contactdata.html';
    $(document).ready(function () {
        loadingDialogInstance.open();

        $.ajaxSetup({
            url: m_requestURL
        });
        $('#error_container').ajaxError(function (event, request, settings) {
            clearError();
            displayError("AJAX Error.  Page=" + settings.url + " Error=" + jqxhr.statusText);
        });


        m_table = $('#holder').addClass('display').dataTable({
            "bPaginate": false,
            "bFilter": false,
            "bJQueryUI": true,
            "sDom": '<"H"lfr<"addcontact"><"showinactive">>t<"F"ip>',
            "aaSorting": [
                [5, 'desc'],
                [6, 'asc'],
                [7, 'asc']
            ],
            "aoColumnDefs": [
                {"bSortable": false, "aTargets": ['_all']},
                {"bVisible": false, "aTargets": [m_keyindex, 5, 6]},
                {"sWidth": "100px", "aTargets": [4]},
                {
                    "fnRender": function (oObj) {
                        var result = '';
                        var info = oObj.aData[1];
                        if ($.isEmptyObject(info) || info === "") {
                            return "";
                        }
                        result += '<p style="font-weight:bold;">' + info.firstname + ' ' + info.lastname + '</p>';
                        if (info.priority) {
                            result += '<span style="font-size:8pt;">(Contact Priority #' + info.priority + ')</span><br />';
                        }
                        result += '<span style="font-size:8pt;">(' + info.relation + ')</span>';
                        if (info.legal_guardian === "1") {
                            result += '<br /><span style="font-size:8pt;">(Legal Guardian)</span><br />';
                        }
                        return result;
                    },
                    "aTargets": [1]
                },
                {
                    "fnRender": function (oObj) {
                        var result = '';
                        var info = oObj.aData[2];
                        if ($.isEmptyObject(info) || info === "") {
                            return '';
                        }
                        var residenceAddress = info.residence_street === '' ? '' : info.residence_street + '<br />';
                        residenceAddress += info.residence_city === '' ? '' : info.residence_city + ',';
                        residenceAddress += info.residence_state + ' ' + info.residence_zip;
                        var mailingAddress = info.mailing_street === '' ? '' : info.mailing_street + '<br />';
                        mailingAddress += info.mailing_city === '' ? '' : info.mailing_city + ',';
                        mailingAddress += info.mailing_state + ' ' + info.mailing_zip;
                        if (info.residence_street) {
                            result += '<p style="font-weight: bold; margin-bottom: 0; margin-left: 0;">Residence Address:</p>';
                            result += '<a href="http://maps.google.com/?z=14&q=' + info.residence_street + ', ' + info.residence_city + ', ' + info.residence_state + ', ' + info.residence_zip + ' (' + oObj.aData[1].firstname + ' ' + oObj.aData[1].lastname + ')&output" target="_blank">' + residenceAddress + '</a><br />';
                        }
                        if (info.mailing_street) {
                            result += '<p style="font-weight: bold; margin-bottom: 0; margin-left: 0;">Mailing Address:</p>';
                            result += '<a href="http://maps.google.com/?z=14&q=' + info.mailing_street + ', ' + info.mailing_city + ', ' + info.mailing_state + ', ' + info.mailing_zip + ' (' + oObj.aData[1].firstname + ' ' + oObj.aData[1].lastname + ')&output" target="_blank">' + mailingAddress + '</a><br />';
                        }
                        return result;
                    },
                    "aTargets": [2]
                },
                {
                    "fnRender": function (oObj) {
                        var result = '';
                        var info = oObj.aData[3];
                        if ($.isEmptyObject(info) || info === "") {
                            return "";
                        }
                        result += '<p>';
                        if (info.email) {
                            result += '<span class="infoheader">Email: </span><a href="mailto:' + info.email + '">' + info.email + '</a><br />';
                        }
                        if (info.phone1type) {
                            result += '<span class="infoheader">' + info.phone1type + ': </span>';
                        }
                        if (info.phone1) {
                            result += info.phone1 + '<br />';
                        }
                        if (info.phone2type) {
                            result += '<span class="infoheader">' + info.phone2type + ': </span>';
                        }
                        if (info.phone2) {
                            result += info.phone2 + '<br />';
                        }
                        if (info.phone3type) {
                            result += '<span class="infoheader">' + info.phone3type + ': </span>';
                        }
                        if (info.phone3) {
                            result += info.phone3 + '<br />';
                        }
                        if (info.employer) {
                            result += '<span class="infoheader">Employer: </span>' + info.employer + '<br />';
                        }
                        result += '</p>';
                        return result;
                    },
                    "aTargets": [3]
                }
            ],
            "fnDrawCallback": function () {
                $('#holder td').removeClass('sorting_1 sorting_2 sorting_3');
            }
        });

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
        $('.addcontact').css({'display': 'inline'});
        $('.showinactive').css({'display': 'inline'});

        $(document).on('click', '.showinactive', function (event) {

            var inactiveButton = $(event.target).parents('button');
            var inactiveButtonText = inactiveButton.find('.ui-button-text');

            if (inactiveButtonText.text() === 'Show Inactive Contacts') {
                $('.inactive-contact').css({'display': 'table-row'});
                inactiveButtonText.html('Hide Inactive Contacts');
            } else if (inactiveButtonText.text() === 'Hide Inactive Contacts') {
                $('.inactive-contact').css({'display': 'none'});
                inactiveButtonText.html('Show Inactive Contacts');
            }
        });


        /**
         *
         * @param contactData {Object}
         * @param recordId {Number|String} ID of database record
         */
        function saveContact(contactData, recordId) {
            var url;
            var type;
            if (recordId) {
                type = 'PUT';
                url = '/ws/schema/table/u_student_contacts5/' + recordId;
            } else {
                type = 'POST';
                url = '/ws/schema/table/u_student_contacts5';
            }

            return $.ajax({
                url: url,
                data: JSON.stringify(contactData),
                dataType: 'json',
                contentType: 'json',
                type: type
            });
        }

        $(document).on('click', '.addcontact', function () {
            $('.addcontact').hide();
            $.getJSON(m_requestURL, {"frn": psData.frn, "action": "addcontact", "sdcid": psData.studentdcid})
                .success(function (data) {
                    if (data.contactnumber > 0) {
                        var n = data.contactnumber;
                        var ridx = m_table.fnAddData([n, "", "", "", "", "", ""]);
                        var sourcerow = m_table.fnSettings().aoData[ridx].nTr;
                        $.get(m_requestURL, {"frn": psData.frn, "gidx": n, "action": "getcreateform"})
                            .success(function (editform) {
                                var editrow = m_table.fnOpen(sourcerow, editform, "edit_row");
                                var $editRow = $(editrow);

                                // Set up input masks
                                $editRow.find('.phone').inputmask('999-999-9999');
                                $editRow.find('.zip').inputmask('99999');

                                // Only bind input mask to email field if the guardian email doesn't have commas
                                var guardianEmail = $editRow.find('#guardianemail').text();
                                if (guardianEmail.indexOf(',') === -1) {
                                    $editRow.find('#email').inputmask({'alias': 'email'});
                                }

                                $editRow.find('#copy-email').on('click', function (event) {
                                    var $target = $(event.target);
                                    var $emailField = $target.parents('td').find('#email');
                                    copyGuardianEmail($emailField, $target.siblings('.data').text());
                                });

                                $editRow.find('.copy-home-phone').on('click', function (event) {
                                    var $target = $(event.target);
                                    var $phoneField = $('#' + $target.data().fieldId);
                                    copyPhone($phoneField, $target.siblings('.data').text());
                                });

                                // Add options to the priority select dropdown menu
                                var prioritySelect = $editRow.find('#priority');
                                var optionTemplate = $('#option-template').html();
                                var numberOfContacts = Object.keys(contactsCollection).length;

                                require(['underscore'], function (_) {
                                    $.each(_.range(1, numberOfContacts + 2), function (index, priority) {
                                        var renderedOptTemplate = _.template(optionTemplate, {
                                            value: priority,
                                            label: priority
                                        });
                                        prioritySelect.append(renderedOptTemplate);
                                    });
                                });

                                $('form', editrow).submit(function (event) {
                                    event.preventDefault();
                                    var newPriority = $('#priority').val();
                                    if (newPriority !== $('#priority').find('option').last().val()) {
                                        // Get all contacts with greater than or equal to priority
                                        // of the new contact
                                        $.each(contactsCollection, function (index, contact) {
                                            if (parseInt(contact[1].priority) >= parseInt(newPriority)) {
                                                var postData = {
                                                    name: 'u_student_contacts5',
                                                    tables: {
                                                        'u_student_contacts5': {
                                                            priority: (parseInt(contact[1].priority) + 1).toString()
                                                        }
                                                    }
                                                };
                                                saveContact(postData, contact[1].record_id);
                                            }
                                        });
                                    }

                                    var postData = {
                                        name: 'u_student_contacts5',
                                        tables: {
                                            'u_student_contacts5': {
                                                studentsdcid: psData.studentdcid,
                                                contact_id: data.contactnumber.toString(),
                                                status: '0',
                                                legal_guardian: $('#legal_guardian').val(),
                                                last_name: $('#last-name').val(),
                                                first_name: $('#first-name').val(),
                                                priority: $('#priority').val(),
                                                relationship: $('#relationship').val(),
                                                residence_street: $('#residence-street').val(),
                                                residence_city: $('#residence-city').val(),
                                                residence_state: $('#residence-state').val(),
                                                residence_zip: $('#residence-zip').val(),
                                                mailing_street: $('#mailing-street').val(),
                                                mailing_city: $('#mailing-city').val(),
                                                mailing_state: $('#mailing-state').val(),
                                                mailing_zip: $('#mailing-zip').val(),
                                                email: $('#email').val(),
                                                employer: $('#employer').val(),
                                                phone1type: $('#phone1type').val(),
                                                phone1: $('#phone1').val(),
                                                phone2type: $('#phone2type').val(),
                                                phone2: $('#phone2').val(),
                                                phone3type: $('#phone3type').val(),
                                                phone3: $('#phone3').val()
                                            }
                                        }
                                    };

                                    saveContact(postData).done(function () {
                                        m_table.fnClose(sourcerow);
                                        refreshContact(n, sourcerow);
                                        $('.addcontact').show();
                                    });


                                });
                                $('.edit_cancel', editrow).click(function () {
                                    m_table.fnClose(sourcerow);
                                    m_table.fnDeleteRow(sourcerow);
                                    $('.addcontact').show();
                                });
                            });
                    }
                });
        });


        $(document).on('click', '.editcontact', function () {
            $('.addcontact').hide();
            var row = $(this).parents('tr')[0];
            if (row) {
                var sourcerow = row;
                var contactId = m_table.fnGetData(row)[m_keyindex];
                $.get(m_requestURL, {"frn": psData.frn, "gidx": contactId, "action": "geteditform"})
                    .success(function (editform) {
                        var editrow = m_table.fnOpen(row, editform, "edit_row");
                        var $editRow = $(editrow);

                        // Set up input masks
                        $editRow.find('.phone').inputmask('999-999-9999');
                        $editRow.find('.zip').inputmask('99999');

                        // Only bind input mask to email field if the guardian email doesn't have commas
                        var guardianEmail = $editRow.find('#guardianemail').text();
                        if (guardianEmail.indexOf(',') === -1) {
                            $editRow.find('#email').inputmask({'alias': 'email'});
                        }

                        $editRow.find('#copy-email').on('click', function (event) {
                            var $target = $(event.target);
                            var $emailField = $target.parents('td').find('#email');
                            copyGuardianEmail($emailField, $target.siblings('.data').text());
                        });

                        $editRow.find('.copy-home-phone').on('click', function (event) {
                            var $target = $(event.target);
                            var $phoneField = $('#' + $target.data().fieldId);
                            copyPhone($phoneField, $target.siblings('.data').text());
                        });

                        require(['underscore'], function (_) {
                            var prioritySelect = $editRow.find('#priority');

                            $.each(_.range(1, numberOfContacts + 1), function (index, priority) {
                                var renderedOptTemplate = _.template(optionTemplate, {
                                    value: priority,
                                    label: priority
                                });
                                prioritySelect.append(renderedOptTemplate);
                            });

                            // Set the right option of the priority dropdown
                            var priority = prioritySelect.data().value;
                            var priorityOptions = prioritySelect.find('option');
                            $.each(priorityOptions, function (index, option) {
                                if (parseInt($(option).val()) === priority) {
                                    $(option).attr('selected', 'selected');
                                }
                            });
                        });

                        // Set the right option of the relationship dropdown
                        var relationshipSelect = $editRow.find('#relationship');
                        var relationship = relationshipSelect.data().value;
                        var relationshipOptions = relationshipSelect.find('option');
                        $.each(relationshipOptions, function (index, option) {
                            if ($(option).val() === relationship) {
                                $(option).attr('selected', 'selected');
                            }
                        });

                        // Set the right option of the legal guardian dropdown
                        var legalGuardianSelect = $editRow.find('#legal-guardian');
                        var legalGuardian = legalGuardianSelect.data().value;
                        if (legalGuardian === "1") {
                            legalGuardianSelect.find('option[value="1"]').attr('selected', 'selected');
                        } else {
                            legalGuardianSelect.find('option[value=""]').attr('selected', 'selected');
                        }

                        var phone1TypeSelect = $editRow.find('#phone1type');
                        phone1TypeSelect.find('option[value="' + phone1TypeSelect.data().value + '"]').attr({'selected': 'selected'});

                        var phone2TypeSelect = $editRow.find('#phone2type');
                        phone2TypeSelect.find('option[value="' + phone2TypeSelect.data().value + '"]').attr({'selected': 'selected'});

                        var phone3TypeSelect = $editRow.find('#phone3type');
                        phone3TypeSelect.find('option[value="' + phone3TypeSelect.data().value + '"]').attr({'selected': 'selected'});

                        // Add options to the priority select dropdown menu
                        var optionTemplate = $('#option-template').html();
                        var numberOfContacts = Object.keys(contactsCollection).length;

                        $('form', editrow).submit(function (event) {
                            event.preventDefault();
                            var newPriority = parseInt($('#priority').val());
                            var oldPriority = parseInt(contactsCollection[contactId][1].priority);
                            if (newPriority !== oldPriority) {
                                // First priority contact is getting changed.
                                if (newPriority > oldPriority) {
                                    $.each(contactsCollection, function (index, contact) {
                                        if (parseInt(contact[1].priority) > parseInt(oldPriority) && parseInt(contact[1].priority) <= parseInt(newPriority)) {
                                            var postData = {
                                                name: 'u_student_contacts5',
                                                tables: {
                                                    'u_student_contacts5': {
                                                        priority: (parseInt(contact[1].priority) - 1).toString()
                                                    }
                                                }
                                            };
                                            saveContact(postData, contact[1].record_id);

                                            // Find the rows that were updated and refresh them
                                            // Get all rows that contain a td with a p element (only contact rows have this)
                                            var tableRows = $('tr:has("td p")');
                                            var updatedRow;
                                            $.each(tableRows, function(index, tableRow) {
                                                var rowContactId = m_table.fnGetData(tableRow)[m_keyindex];
                                                if (rowContactId === contactId) {
                                                    updatedRow = tableRow;
                                                }
                                                if (updatedRow) {
                                                    refreshContact(contactId, updatedRow);
                                                }
                                            });

                                        }


                                    });
                                } else if (newPriority < oldPriority) {
                                    $.each(contactsCollection, function (index, contact) {
                                        if (parseInt(contact[1].priority) < parseInt(oldPriority) && parseInt(contact[1].priority) >= parseInt(newPriority)) {
                                            var postData = {
                                                name: 'u_student_contacts5',
                                                tables: {
                                                    'u_student_contacts5': {
                                                        priority: (parseInt(contact[1].priority) + 1).toString()
                                                    }
                                                }
                                            };
                                            saveContact(postData, contact[1].record_id);

                                            // Find the rows that were updated and refresh them
                                            // Get all rows that contain a td with a p element (only contact rows have this)
                                            var tableRows = $('tr:has("td p")');
                                            var updatedRow;
                                            $.each(tableRows, function(index, tableRow) {
                                                var rowContactId = m_table.fnGetData(tableRow)[m_keyindex];
                                                if (rowContactId === contact[1].record_id) {
                                                    updatedRow = tableRow;
                                                }
                                                if (updatedRow) {
                                                    refreshContact(contactId, updatedRow);
                                                }
                                            });
                                        }
                                    });
                                }
                            }



                            var postData = {
                                name: 'u_student_contacts5',
                                tables: {
                                    'u_student_contacts5': {
                                        last_name: $('#last-name').val(),
                                        first_name: $('#first-name').val(),
                                        priority: $('#priority').val(),
                                        legal_guardian: $('#legal_guardian').val(),
                                        relationship: $('#relationship').val(),
                                        residence_street: $('#residence-street').val(),
                                        residence_city: $('#residence-city').val(),
                                        residence_state: $('#residence-state').val(),
                                        residence_zip: $('#residence-zip').val(),
                                        mailing_street: $('#mailing-street').val(),
                                        mailing_city: $('#mailing-city').val(),
                                        mailing_state: $('#mailing-state').val(),
                                        mailing_zip: $('#mailing-zip').val(),
                                        email: $('#email').val(),
                                        employer: $('#employer').val(),
                                        phone1type: $('#phone1type').val(),
                                        phone1: $('#phone1').val(),
                                        phone2type: $('#phone2type').val(),
                                        phone2: $('#phone2').val(),
                                        phone3type: $('#phone3type').val(),
                                        phone3: $('#phone3').val()
                                    }
                                }
                            };
                            saveContact(postData, contactsCollection[contactId][1].record_id).done(function (data) {
                                m_table.fnClose(sourcerow);
                                $('.addcontact').show();
                                refreshContact(contactId, sourcerow);
                            });

                        });
                        $('.edit_cancel', editrow).click(function () {
                            $('.addcontact').show();
                            m_table.fnClose(sourcerow);
                        });
                    });
            }
        });

        $(document).on('click', '.deletecontact', function (event) {
            var row = $(this).parents('tr')[0];
            if (row) {
                var rowData = m_table.fnGetData(row);
                var contactId = rowData[m_keyindex];
                var contactName = $(row).find('td').eq(0).find('p').eq(0).text();
                if (window.confirm("Delete contact, \"" + contactName + "\"?")) {
                    var postData = {
                        name: 'u_student_contacts5',
                        tables: {
                            'u_student_contacts5': {
                                status: '-2'
                            }
                        }
                    };
                    $.ajax({
                        url: "/ws/schema/table/u_student_contacts5/" + contactsCollection[contactId][1].record_id,
                        data: JSON.stringify(postData),
                        type: "PUT",
                        dataType: "json",
                        contentType: "json"
                    })
                        .success(function () {
                            refreshContact(contactId, row);
                        })
                        .error(function (jqxhr) {
                            displayError(jqxhr.statusText);
                        });
                }
            }
        });

        $(document).on('click', '.activatecontact', function (event) {
            var row = $(this).parents('tr')[0];
            if (row) {
                var rowData = m_table.fnGetData(row);
                var contactId = rowData[m_keyindex];
                var contactName = $(row).find('td').eq(0).find('p').eq(0).text();
                if (window.confirm("Activate contact, \"" + contactName + "\"?")) {
                    var postData = {
                        name: 'u_student_contacts5',
                        tables: {
                            'u_student_contacts5': {
                                status: '0'
                            }
                        }
                    };
                    $.ajax({
                        url: "/ws/schema/table/u_student_contacts5/" + contactsCollection[contactId][1].record_id,
                        data: JSON.stringify(postData),
                        type: "PUT",
                        dataType: "json",
                        contentType: "json"
                    })
                        .success(function () {
                            refreshContact(contactId, row);
                        })
                        .error(function (jqxhr) {
                            displayError(jqxhr.statusText);
                        });
                }
            }
        });

        //Fetch contact listing
        $.get(m_requestURL, {"sdcid": psData.studentdcid, "action": "newfetchcontacts"}, function () {
        }, "json")
            .done(function (data) {

                // In order to be valid JSON, an empty element has to be added to the array after the tlist_sql.
                // Remove that empty element here.
                data.pop();

                if (data.length > 0) {
                    $.each(data, function (index, contactId) {
                        refreshContact(contactId);
                    });
                } else {
                    loadingDialogInstance.closeDialog();
                }
            });

    });

    /**
     *
     * @param contactId {Number} - contact_id
     * @param [row] {Element|jQuery}
     */
    function refreshContact(contactId, row) {
        var settings = {
            frn: psData.studentfrn,
            action: "getcontact",
            gidx: contactId,
            sdcid: psData.studentdcid
        };
        $.ajax({
            type: "GET",
            async: true,
            dataType: "text json",
            dataFilter: function (data) {
                return data.replace(/[\r\n\t]/g, '');
            },
            data: settings
        })
            .success(function (data, status) {
                loadingDialogInstance.closeDialog();
                if (!row) {

                    // Contact is already inactive and is getting loaded as inactive
                    // Set the buttons element to Activate button.
                    if (data[5] === "-2") {
                        data[4] = "<button class='activatecontact'>Activate</button>";
                    }

                    m_table.fnAddData(data);
                    var newRow = $('#maincontent tr').last();
                    contactsCollection[data[0]] = data;

                    // An inactive contact was loaded as inactive
                    if (data[5] === "-2") {
                        var contactNameContainer = $(newRow).find('td').eq(0).find('p').eq(0);
                        var inactiveTag = contactNameContainer.text() + " (INACTIVE)";
                        contactNameContainer.html(inactiveTag);
                        $(newRow).css({'background-color': '#DEDEDE'});
                        $(newRow).css({'display': 'none'});
                        $(newRow).attr({'class': 'inactive-contact'});
                    }
                }
                else {
                    // Contact was set to inactive and contact is getting refreshed
                    // Set the buttons element to Activate button.
                    if (data[5] === "-2") {
                        data[4] = "<button class='activatecontact'>Activate</button>";
                    }

                    m_table.fnUpdate(data, row);

                    // If the contact does not have an entry in the contactsCollection, add it
                    var contactId = data[0];
                    if (!contactsCollection[contactId]) {
                        contactsCollection[contactId] = data;
                    }

                    if (data[5] === "-2") {
                        // A contact was set to inactive
                        var contactNameContainer = $(row).find('td').eq(0).find('p').eq(0);
                        var inactiveTag = contactNameContainer.text() + " (INACTIVE)";
                        if (contactNameContainer.text().indexOf(" (INACTIVE)") === -1) {
                            contactNameContainer.html(inactiveTag);
                        }
                        $(row).css({'background-color': '#DEDEDE'});
                        $(row).attr({'class': 'inactive-contact'});
                    } else if (data[5] === "0") {
                        // Contact was previously set to inactive and is getting set back to active
                        $(row).removeClass('inactive-contact');
                        $(row).css({'background-color': ''});
                        var contactBody = $(row).parents('tbody');
                        contactBody.find('tr:even').addClass('odd');
                        contactBody.find('tr:odd').addClass('even');
                    }
                }
                $('.editcontact').button({
                    icons: {
                        primary: "ui-icon-pencil"
                    }
                });
                $('.deletecontact').button({
                    icons: {
                        primary: "ui-icon-trash"
                    }
                });
            });
    }

    function displayError(msg) {
        $('#error_container').html('<div id="alertmsg" style="padding: 0 0.7em;" class="ui-state-error ui-corner-all"><p><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-alert"></span><strong>Alert: </strong>' + msg + '</p></div>').show();
    }

    function clearError() {
        $('#error_container').empty().hide();
    }

}());