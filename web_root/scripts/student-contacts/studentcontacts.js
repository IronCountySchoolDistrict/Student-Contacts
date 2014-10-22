/*global jQuery,psData,confirm,loadingDialogInstance*/

(function () {
    'use strict';
    String.prototype.trim = function () {
        return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };

    function copyEmail(email) {
        if (email.trim().length === 0) {
            return;
        }
        var data = email.trim();
        var current = $("#auto_emails").val();
        if (current.length > 0) {
            data = current + "," + email.trim();
        }
        $("#auto_emails").val(data);
    }

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

    function cleanEmailList() {
        var autoEmailsSelector = $('#auto_emails');
        var emails = autoEmailsSelector.val().replace(/\s+/g, ''); //clean all white space
        emails = emails.replace(/;+/g, ',').replace(/,+$/, ''); //all semi-colons to commas, remove trailing comma
        autoEmailsSelector.val(emails); //update field with clean value
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
        $('#error_container').ajaxError(function (e, jqxhr, settings, err) {
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
                        if ($.isEmptyObject(info) || info == "") {
                            return "";
                        }
                        result += '<p style="font-weight:bold;">' + info.firstname + ' ' + info.lastname + '</p>';
                        if (info.priority.trim() !== "") {
                            result += '<span style="font-size:8pt;">(Contact Priority #' + info.priority + ')</span><br />';
                        }
                        result += '<span style="font-size:8pt;">(' + info.relation + ')</span>';
                        if (info.legal_guardian.trim() === "1") {
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
                        if ($.isEmptyObject(info) || info == "") {
                            return '';
                        }
                        var address = info.street.trim() == '' ? '' : info.street + '<br />';
                        address += info.city.trim() == '' ? '' : info.city + ',';
                        address += info.state + ' ' + info.zip;
                        if (info.street.trim() != '') {
                            result += '<a href="http://maps.google.com/?z=14&q=' + info.street + ', ' + info.city + ', ' + info.state + ', ' + info.zip + ' (' + oObj.aData[1].firstname + ' ' + oObj.aData[1].lastname + ')&output" target="_blank">' + address + '</a><br />';
                        }
                        else {
                            result += address;
                        }
                        return result;
                    },
                    "aTargets": [2]
                },
                {
                    "fnRender": function (oObj) {
                        var result = '';
                        var info = oObj.aData[3];
                        if ($.isEmptyObject(info) || info == "") {
                            return "";
                        }
                        result += '<p>';
                        if (info.email.trim() != "") {
                            result += '<span class="infoheader">Email: </span><a href="mailto:' + info.email + '">' + info.email + '</a><br />';
                        }
                        if (info.homephone.trim() != "") {
                            result += '<span class="infoheader">Home: </span>' + info.homephone + '<br />';
                        }
                        if (info.cellphone.trim() != "") {
                            result += '<span class="infoheader">Cell: </span>' + info.cellphone + '<br />';
                        }
                        if (info.workphone.trim() != "") {
                            result += '<span class="infoheader">Work: </span>' + info.workphone + '<br />';
                        }
                        if (info.employer.trim() != "") {
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

        $('body').on('click', '.showinactive', function (event){

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

        $('body').on('click', '.addcontact', function () {
            $('.addcontact').hide();
            $.getJSON(m_requestURL, {"frn": psData.frn, "action": "addcontact", "sdcid": psData.studentdcid})
                .success(function (data) {
                    if (data.contactnumber > 0) {
                        var n = data.contactnumber;
                        var ridx = m_table.fnAddData([n, "", "", "", "", "", ""]);
                        var sourcerow = m_table.fnSettings().aoData[ridx].nTr;
                        $.get(m_requestURL, {"frn": psData.frn, "gidx": n, "action": "getcreateform"}
                        )
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

                                $('form', editrow).submit(function (event) {
                                    event.preventDefault();
                                    var postData = {
                                        name: 'u_student_contacts5',
                                        tables: {
                                            'u_student_contacts5': {
                                                studentsdcid: psData.studentdcid,
                                                contact_id: data.contactnumber.toString(),
                                                status: '0',
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

                                    $.ajax({
                                        url: '/ws/schema/table/u_student_contacts5',
                                        data: JSON.stringify(postData),
                                        dataType: 'json',
                                        contentType: 'json',
                                        type: 'POST'
                                    }).done(function () {
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
        //bind click event on all edit icons
        $(document).on('click', '.editcontact', function () {
            $('.addcontact').hide();
            var row = $(this).parents('tr')[0];
            if (row) {
                var sourcerow = row;
                var n = m_table.fnGetData(row)[m_keyindex];
                $.get(m_requestURL, {"frn": psData.frn, "gidx": n, "action": "geteditform"}
                )
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
                        // Set the right option of the priority dropdown
                        var prioritySelect = $editRow.find('#priority');
                        var priority = prioritySelect.data().value;
                        var priorityOptions = prioritySelect.find('option');
                        $.each(priorityOptions, function (index, option) {
                            if (parseInt($(option).val()) === priority) {
                                $(option).attr('selected', 'selected');
                            }
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
                        var legalGuardianOptions = legalGuardianSelect.find('option');
                        $.each(legalGuardianOptions, function (index, option) {
                            if ($(option).val() === legalGuardian) {
                                $(option).attr('selected', 'selected');
                            }
                        });

                        $('form', editrow).submit(function () {
                            // TODO: Use config object here for student contacts table name
                            var postData = {
                                name: 'u_student_contacts5',
                                tables: {
                                    'u_student_contacts5': {
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
                            $.ajax({
                                url: '/ws/schema/table/u_student_contacts5/' + $(row).data().recordId,
                                data: JSON.stringify(postData),
                                dataType: 'json',
                                contentType: 'json',
                                type: 'PUT'
                            })
                                .done(function (data) {
                                    m_table.fnClose(sourcerow);
                                    $('.addcontact').show();
                                    refreshContact(n, sourcerow);
                                });
                            return false;//prevent normal form submission
                        });
                        $('.edit_cancel', editrow).click(function () {
                            $('.addcontact').show();
                            m_table.fnClose(sourcerow);
                        });
                    });
            }
        });
        //bind click event on all delete icons
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
                        url: "/ws/schema/table/u_student_contacts5/" + $(row).data().recordId,
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
        $.get(m_requestURL, {"sdcid": psData.studentdcid, "action": "fetchcontacts"})
            .done(function (data) {
                var removedWhitespace = data.replace(/\s/g, '');
                if (removedWhitespace !== "") {
                    var response = eval(data);
                } else {
                    loadingDialogInstance.closeDialog();
                }
            });

    });//End jquery document ready function

    /**
     *
     * @param num {Number} - contact_id
     * @param [row] {DOMElement|jQuery}
     */
    function refreshContact(num, row) {
        var settings = {"frn": psData.studentfrn, "action": "getcontact", "gidx": num, "sdcid": psData.studentdcid};
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
                if (row == null) {
                    m_table.fnAddData(data);
                    var newRow = $('#maincontent tr').last();
                    newRow.data('record-id', data[1].record_id);

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
                    m_table.fnUpdate(data, row);
                    $(row).data('record-id', data[1].record_id);

                    if (data[5] === "-2") {
                        var contactNameContainer = $(row).find('td').eq(0).find('p').eq(0);
                        var inactiveTag = contactNameContainer.text() + " (INACTIVE)";
                        if (contactNameContainer.text().indexOf(" (INACTIVE)") === -1) {
                            contactNameContainer.html(inactiveTag);
                        }
                        $(row).css({'background-color': '#DEDEDE'});
                        $(row).attr({'class': 'inactive-contact'});
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