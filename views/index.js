/* global $ */

'use strict';

function watchLogin() {
  $('.js-login-form').on('submit', event => {
    event.preventDefault();
    const username = $('#username').val();
    const pass = $('#pass').val();
    login(username, pass); 
    hideLogin();
    showViewEntries();
  });
}

function login(user, pass) {
  $.ajax({
    method: 'POST',
    url: '/auth/login',
    data: JSON.stringify({ 'username': user, 'password' : pass }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function(res) {
      sessionStorage.setItem('sessionToken', res.authToken);
    },
    error: function loginAlert() {
      alert('Incorrect username or password.');
    }
  });
}

function watchPost() {
  $('.js-post-form').on('submit', event => {
    event.preventDefault();
    const title = $('#title').val();
    const entryNew = $('#dreamentry').val();
    const entryDate = $('#dreamdate').val();
    const entryTags = $('#tags').val();
    console.log(title, entryNew, entryDate, entryTags);
    postEntry(title, entryNew, entryDate, entryTags); 
  });
}

function hideLogin() {
  $('#login-page').addClass('hidden');
  $('#h1-login').addClass('hidden');
};

function showViewEntries() {
  $('nav').removeClass('hidden');
  $('#entry-page').removeClass('hidden');
}


function postEntry(title, entryNew, entryDate, entryTags) {
  $.ajax({
    method: 'POST',
    url: '/entries',
    data: JSON.stringify({ 'title': title, 'content': entryNew, 'contentDate': entryDate, 'tags': entryTags }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    headers: { 'Authorization':  `Bearer ${sessionStorage.getItem('sessionToken')}` }
  })
    .done(function(post) {
      console.log(post);
    });
}


// function displayOnePost(post) {

// }


$(watchLogin);
$(watchPost);
// $(watchUpdate);
// $(watchDelete)

