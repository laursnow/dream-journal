/* global $ */

'use strict';

function watchLogin() {
  $('.login-container').on('submit', '.js-login-form', event => {
    event.preventDefault();
    const username = $('#username').val();
    const pass = $('#pass').val();
    login(username, pass);
    console.log('login go');
  });
}

function login(user, pass) {
  $.ajax({
    method: 'POST',
    url: '/auth/login',
    data: JSON.stringify({ 'username': user, 'password': pass }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function (res) {
      sessionStorage.setItem('sessionToken', res.authToken);
      hideLogin();
      showNewPost();
    },
    error: function loginAlert() {
      alert('Incorrect username or password.');
    }
  });
}

function register(user, pass, email) {
  $.ajax({
    method: 'POST',
    url: '/users',
    data: JSON.stringify({ 'username': user, 'password': pass, 'email': email }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    success: function () {
      console.log('ajax register function fired');
      alert('Registration successful. Please login.');
      location.reload(true);
    },
    error: function registerAlert(err) {
      alert(err.responseText);
      console.log(err);
    }
  });
}

function watchRegister() {
  $('.register').on('click', event => {
    event.preventDefault();
    showRegistrationForm();
  });
}

function showRegistrationForm() {
  $('#email').removeClass('hidden');
  $('legend').text('Enter information below to register:');
  $('#btnlogin').text('Register');
  $('.js-login-form').removeClass('js-login-form').addClass('js-register-form');
  $('.login-register-text').html(`Already signed up? <a href=".">Login.</a>`);
}

function watchRegistrationForm() {
  $('.login-container').on('submit', '.js-register-form', event => {
    event.preventDefault();
    const user = $('#username').val();
    const pass = $('#pass').val();
    const email = $('#email-field').val();
    register(user, pass, email);
    console.log('register go');
  });
}

function watchPost() {
  $('.js-post-form').on('submit', event => {
    event.preventDefault();
    const title = $('#title').val();
    const entryNew = $('#dreamentry').val();
    const entryDate = $('#dreamdate').val();
    const entryTags = $('#tags').val();
    postEntry(title, entryNew, entryDate, entryTags);
  });
}

function hideLogin() {
  $('#login-page').addClass('hidden');
  $('#h1-login').addClass('hidden');
}

function showNewPost() {
  $('#navbar').removeClass('hidden');
  $('#entry-page').removeClass('hidden');
  $('h3').text('New Post');
  hideViewAll();
}

function hideNewPost() {
  $('#entry-page').addClass('hidden');
}

function hideViewAll() {
  $('#view-all-page').removeClass('hidden');
  $('#view-all-page').addClass('hidden');
}

function showViewAll() {
  $('#view-all-page').removeClass('hidden');
  $('h3').text('Journal Entries');
}

function watchNewPostLink() {
  $('.new-post').on('click', event => {
    showNewPost();
  });
}

function watchViewAllLink() {
  $('.view-all').on('click', event => {
    getAllEntries();
  });
}

function watchDelete() {
  $('#view-all-page').on('click', '.btndelete', function(btn) {
    let id = btn.target.id;
    let title = $('h4').find(id).val();
    console.log(title);
    event.preventDefault();
  //   let deleteConfirmation = confirm('Are you sure you want to delete this entry?');
  //   if (deleteConfirmation === true) {
  //     getPostInfo(id);   
  // }
  });
}

// function getPostInfo() {
//   deleteEntry(title, content, date);
// }
// function deleteEntry(title, content, date) {
//   $.ajax({
//     method: 'DELETE',
//     url: '/entries/:id',
//     contentType: 'application/json; charset=utf-8',
//     data: JSON.stringify({'title': title, 'content': content, 'contentDate': date}),
//     dataType: 'json',
//     headers: { 'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}` },
//     success: function () {
//       alert(`Entry "${title}" has been deleted.`);
//     },
//     error: function postAlert(err) {
//       alert(err);
//     }
//   });
// }


function getAllEntries() {
  $.ajax({
    method: 'GET',
    url: '/entries',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}` },
    success: function (res) {
      displayAllEntries(res);
    },
    error: function postAlert(err) {
      alert(err);
    }
  });
}

function displayAllEntries(entries) {
  hideNewPost();
  showViewAll();
  entryTemplate(entries);
}

function entryTemplate(entries) {
  for (let i = 0; i < entries.length; i++) {
    let unformattedDate = new Date(entries[i].contentDate);
    let date = unformattedDate.toDateString();
    $('#view-all-page').append(
      `<div class="entry-container" id=${i}>
      <h4 id=${i} class="title">${entries[i].title}</h4>
      <p id=${i} class="content">${entries[i].content}</p>
      <p id=${i} class="date">${date}</p>
      <p id=${i} class="tags">Tags: ${entries[i].tags}<p>

    <button class="btnupdate" id=${i}>Update Entry</button><button class="btndelete" id=${i}>Delete Entry</button>
    </div>`
    );
  }
}

function postEntry(title, entryNew, entryDate, entryTags) {
  $.ajax({
    method: 'POST',
    url: '/entries',
    data: JSON.stringify({ 'title': title, 'content': entryNew, 'contentDate': entryDate, 'tags': entryTags }),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}` },
    success: function (res) {
      console.log(res);
    },
    error: function postAlert(err) {
      alert(err);
    }
  });
}



// function displayOnePost(post) {

// }


$(watchLogin);
$(watchPost);
$(watchRegister);
$(watchRegistrationForm);
$(watchNewPostLink);
$(watchViewAllLink);
// $(watchUpdate);
$(watchDelete);

