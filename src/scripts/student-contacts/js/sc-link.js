/*global $j*/
(function($) {
	var linkTemplate = $($('#sc-link-template').html());
	var linkSelect = $('#btn-accountPreferences');
	linkTemplate.insertAfter(linkSelect);
}($j));
