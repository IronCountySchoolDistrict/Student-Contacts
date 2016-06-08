import $ from 'jquery';

export function main() {
  var linkTemplate = $($('#sc-link-template').html());
  var linkSelect = $('#btn-accountPreferences');
  linkTemplate.insertAfter(linkSelect);
}
