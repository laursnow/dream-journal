/* global $ */

// Using history API to have functioning bakc & forward buttons
// Functions in this file assign history states to certain actions

'use strict';

const historyAPI = (function() {
  function historyStateNew() {
    history.pushState({ page: 'new' }, null, null);
  }

  function historyStateModify() {
    history.pushState({ page: 'modify' }, null, null);
  }

  function historyStateViewAll() {
    history.pushState({ page: 'viewall' }, null, null);
  }

  function historyStateExpired() {
    history.replaceState({ page: 'expired' }, null, null);
  }

  function historyStateResponse() {
    history.pushState({ page: 'response' }, null, null);
  }

  function expired() {
    historyStateExpired();
    $('h3').text('Data expired. Please try again.');
    $('#entry-page').addClass('hidden');
    $('#view-all-page').addClass('hidden');
    $('.response-container').removeClass('hidden');
  }

  return {
    historyStateExpired,
    historyStateModify,
    historyStateNew,
    historyStateResponse,
    historyStateViewAll,
    expired
  };
})();
