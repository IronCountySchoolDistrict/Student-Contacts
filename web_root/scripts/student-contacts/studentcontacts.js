/*global $,psData,confirm, loadingDialogInstance*/

String.prototype.trim = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
};

function copyEmail(email) {
    if (email.trim().length == 0) {
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

(function () {
    'use strict';
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
            "sDom": '<"H"lfr<"addcontact">>t<"F"ip>',
            "aaSorting": [
                [5, 'asc'],
                [6, 'asc']
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
                        if (info.legal_guardian.trim() !== "") {
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
        $('.addcontact button').button({
            icons: {
                primary: 'ui-icon-plus'
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

                                // Set up input masks
                                $(editrow).find('.phone').inputmask('999-999-9999');
                                $(editrow).find('.zip').inputmask('99999');
                                $(editrow).find('#email').inputmask({'alias': 'email'});
                                $('form', editrow).submit(function (event) {
                                    event.preventDefault();
                                    var postData = {
                                        name: 'u_student_contacts4',
                                        tables: {
                                            'u_student_contacts4': {
                                                studentsdcid: psData.studentdcid,
                                                contact_id: data.contactnumber.toString(),
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
                                        url: '/ws/schema/table/u_student_contacts4',
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
        $('body').on('click', '.editcontact', function () {
            var row = $(this).parents('tr')[0];
            if (row) {
                var sourcerow = row;
                var n = m_table.fnGetData(row)[m_keyindex];
                $.get(m_requestURL, {"frn": psData.frn, "gidx": n, "action": "geteditform"}
                )
                    .success(function (editform) {
                        var editrow = m_table.fnOpen(row, editform, "edit_row");

                        // Set up input masks
                        $(editrow).find('.phone').inputmask('999-999-9999');
                        $(editrow).find('.zip').inputmask('99999');
                        $(editrow).find('#email').inputmask({'alias': 'email'});

                        $(editrow).find('#copy-email').on('click', function (event) {
                            var $target = $(event.target);
                            var $emailField = $target.parents('td').find('#email');
                            copyGuardianEmail($emailField, $target.siblings('.data').text());
                        });

                        $(editrow).find('.copy-home-phone').on('click', function (event) {
                            var $target = $(event.target);
                            var $phoneField = $('#' + $target.data().fieldId);
                            copyPhone($phoneField, $target.siblings('.data').text());
                        });
                        // Set the right option of the priority dropdown
                        var prioritySelect = $('#priority');
                        var priority = prioritySelect.data().value;
                        var priorityOptions = prioritySelect.find('option');
                        $.each(priorityOptions, function (index, option) {
                            if (parseInt($(option).val()) === priority) {
                                $(option).attr('selected', 'selected');
                            }
                        });

                        // Set the right option of the relationship dropdown
                        var relationshipSelect = $('#relationship');
                        var relationship = relationshipSelect.data().value;
                        var relationshipOptions = relationshipSelect.find('option');
                        $.each(relationshipOptions, function (index, option) {
                            if ($(option).val() === relationship) {
                                $(option).attr('selected', 'selected');
                            }
                        });

                        $('form', editrow).submit(function () {
                            // TODO: Use config object here for student contacts table name
                            var postData = {
                                name: 'u_student_contacts4',
                                tables: {
                                    'u_student_contacts4': {
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
                                url: '/ws/schema/table/u_student_contacts4/' + $(row).data().recordId,
                                data: JSON.stringify(postData),
                                dataType: 'json',
                                contentType: 'json',
                                type: 'PUT'
                            })
                                .done(function (data) {
                                    m_table.fnClose(sourcerow);
                                    refreshContact(n, sourcerow);
                                });
                            return false;//prevent normal form submission
                        });
                        $('.edit_cancel', editrow).click(function () {
                            m_table.fnClose(sourcerow);
                        });
                    });
            }
        });
        //bind click event on all delete icons
        $('body').on('click', '.deletecontact', function () {
            var row = $(this).parents('tr')[0];
            if (row) {
                var sourcerow = row;
                var d = m_table.fnGetData(row);
                var n = d[m_keyindex];
                var contactname = $('td:first p', row).text();
                if (window.confirm("Delete contact, \"" + contactname + "\"?")) {
                    //submitting blank custom fields.txt will cause PS to delete them
                    $.ajax({
                        type: "GET",
                        async: true,
                        dataType: "html",
                        data: {"action": "deletecontact", "gidx": n, "frn": psData.frn}
                    })
                        .success(function (deldata) {
                            var serializedDelData = $(deldata).serialize();
                            $.post('/admin/changesrecorded.white.html', serializedDelData)
                                .success(function (data) {
                                    m_table.fnDeleteRow(sourcerow);
                                });
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

    function syncParent(syncname, n) {
        var f_lastfirst = '#sync_' + syncname + n;
        var f_dayphone = '#sync_' + syncname + 'dayphone' + n;
        var f_homephone = '#sync_' + syncname + '_home_phone' + n;
        var f_employer = '#sync_' + syncname + '_employer' + n;
        //determine what the day phonenber should be.
        var dayphoneval = $('#contact' + n + '_cellphone').val();
        if ($('#contact' + n + '_cellphone').val() != '') {
            dayphoneval = $('#contact' + n + '_cellphone').val();
        }
        else if ($('#contact' + n + '_workphone').val() != '') {
            dayphoneval = $('#contact' + n + '_workphone').val();
        }
        else {
            dayphoneval = $('#contact' + n + '_homephone').val();
        }
        //copy values for sync
        $(f_lastfirst).val($('#contact' + n + '_last').val() + ', ' + $('#contact' + n + '_first').val());
        $(f_homephone).val($('#contact' + n + '_homephone').val());
        $(f_employer).val($('#contact' + n + '_employer').val());
        $(f_dayphone).val(dayphoneval);
    }

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
                }
                else {
                    m_table.fnUpdate(data, row);
                    $(row).data('record-id', data[1].record_id);
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
        $('#error_container').html('<div id="alertmsg" style="padding: 0pt 0.7em;" class="ui-state-error ui-corner-all"><p><span style="float: left; margin-right: 0.3em;" class="ui-icon ui-icon-alert"></span><strong>Alert: </strong>' + msg + '</p></div>').show();
    }

    function clearError() {
        $('#error_container').empty().hide();
    }
}());