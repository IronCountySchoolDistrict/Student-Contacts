/*global $j*/
(function() {
	var linkTemplate = $j($j('#sc-link-template').html());
	var linkSelect = $j('#btn-accountPreferences');
	linkTemplate.insertAfter(linkSelect);
}());
