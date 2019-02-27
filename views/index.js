/* global $ */

'use strict';

function watchLogin() {
  $('.js-login-form').on('submit', event => {
    event.preventDefault();
    const username = $('#username').val();
    const pass = $('#pass').val();
    login(username, pass); 
  });
}

function watchPost() {

}

function login(user, pass) {
  $.ajax({
    method: 'POST',
    url: '/auth/login',
    data: JSON.stringify({ 'username': user, 'password' : pass }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
  })
    .done(function(res) {
      sessionStorage.setItem('sessionToken', res.authToken);
    });
}

function postEntry(user, pass) {
  $.ajax({
    method: 'POST',
    url: '/entries',
    data: JSON.stringify({ 'username': user, 'password' : pass }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    headers: { 'Authorization':  `Bearer ${sessionStorage.getItem('sessionToken')}` }
  })
    .done(function(post) {
      displayOnePost(post);
    });
}
function displayOnePost(post) {

}


$(watchLogin);

