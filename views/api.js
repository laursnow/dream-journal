/* global $ */
'use strict';

const api = (function() {

  function login(user, pass, successCallback) {
    $.ajax({
      method: 'POST',
      url: '/auth/login',
      data: JSON.stringify({ username: user, password: pass }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: successCallback,
      error: function loginAlert() {
        alert('Incorrect username or password.');
      }
    });
  }

  function register(user, pass, email) {
    $.ajax({
      method: 'POST',
      url: '/users',
      data: JSON.stringify({ username: user, password: pass, email: email }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function() {
        alert('Registration successful. Please login.');
        location.reload(true);
      },
      error: function registerAlert(err) {
        alert(err.responseText);
      }
    });
  }

  function deleteEntry(databaseId, successCallback) {
    $.ajax({
      method: 'DELETE',
      url: '/entries',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        id: databaseId
      }),
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('sessionToken')}`
      },
      success: successCallback
    });
  }

  function updateEntry(title, content, date, tags, databaseId, postId, successCallback) {
    $.ajax({
      method: 'PUT',
      url: '/entries',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({
        id: databaseId,
        title: title,
        content: content,
        contentDate: date,
        tags: tags
      }),
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('sessionToken')}`
      },
      success: function(res) {
        successCallback(res, postId);
      }
    });
  }

  function getAllEntries(successCallback) {
    $.ajax({
      method: 'GET',
      url: '/entries',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('sessionToken')}`
      },
      success: successCallback
    });
  }

  function postEntry(title, entryNew, entryDate, entryTags, successCallback) {
    $.ajax({
      method: 'POST',
      url: '/entries',
      data: JSON.stringify({
        title: title,
        content: entryNew,
        contentDate: entryDate,
        tags: entryTags
      }),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('sessionToken')}`
      },
      success: successCallback,
    });
  }

  function signOut() {
    $.ajax({
      method: 'get',
      url: '/auth/logout',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('sessionToken')}`
      },
      success: function() {
        location.reload(true);
      }
    });
  }


  return {
    login,
    register,
    deleteEntry,
    updateEntry,
    getAllEntries,
    postEntry,
    signOut
  };
})();
