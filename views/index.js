/* global $ */

'use strict';

const ENTRY_INFO = [];

function watchLogin() {
  $('.login-container').on('submit', '.js-login-form', event => {
    event.preventDefault();
    const username = $('#username').val();
    const pass = $('#pass').val();
    login(username, pass);
    console.log('fire watch login');
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
    console.log('fire watch register');
  });
}

function showRegistrationForm() {
  $('#email').removeClass('hidden');
  $('legend').text('Enter information below to register:');
  $('#btnlogin').text('Register');
  $('.js-login-form').removeClass('js-login-form').addClass('js-register-form');
  $('.login-register-text').html('Already signed up? <a href=".">Login.</a>');
}

function watchRegistrationForm() {
  $('.login-container').on('submit', '.js-register-form', event => {
    event.preventDefault();
    const user = $('#username').val();
    const pass = $('#pass').val();
    const email = $('#email-field').val();
    register(user, pass, email);
    console.log('fire watch registration form');
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
    console.log('fire watch post');
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
    console.log('fire watch new post link');
  });
}

function watchViewAllLink() {
  $('.display-all').on('click', event => {
    getAllEntries();
    console.log('fire watch view all link');
  });
}

function clearENTRY_INFO() {
  ENTRY_INFO.length = 0;
}

function watchUpdate() {
  $('#view-all-page').on('click', '.btnupdate', function(btn) {
    let id = btn.target.id;
    findPostForUpdate(id);
    console.log('fire watch update');
  });
}

function findPostForUpdate(id) {
  let obj = ENTRY_INFO.find(function(o) {
    return o.postId == id; 
  });
  sendPostForUpdate(obj, id);
}

function sendPostForUpdate(entry, id) {
  let title = entry.title;
  let content = entry.content;
  let date = entry.date;
  let tags = entry.tags;
  let postId = id;
  updateView(title, content, date, tags, postId);
}

function updateView(title, content, date, tags, postId) {
  let unformattedDate = new Date(date);
  let newDate = unformattedDate.toDateString();
  $('h3').text('Update Entry');
  $('#view-all-page').html(
    `<div class="update-container">
      <form class="js-update-form" role="post">
            <fieldset>
              <label for="username">Title:
                <input type="text" id="titleUpdate" name="title" class="post-field" value="${title}" required></label>
              <label for="dreamentry">Entry:
                <textarea id="dreamentryUpdate" name="dreamentry" class="post-field" required>${content}</textarea></label>
              <label for="dreamdate">Date of Dream:
                <input type="text" id="dreamdateUpdate" name="dreamdate" class="post-field" value="${newDate}" required></label>
              <label for="tags">Tags:
                <input type="text" id="tagsUpdate" name="tags" class="post-field" value="${tags}" required></label>
            </fieldset>
             <button type="button" class="btnsave" id=${postId}>Save Entry</button><button class="btndelete" id=${postId}>Delete Entry</button></form>
    </div>`
  );
}

function watchSaveEntry() {
  $('#view-all-page').on('click', '.btnsave', function(btn) {
    let id = btn.target.id;
    getUpdateValues(id);
    console.log('fire save entry');
  });
}

function watchDelete() {
  $('#view-all-page').on('click', '.btndelete', function(btn) {
    let id = btn.target.id;
    let deleteConfirmation = confirm('Are you sure you want to delete this entry?');
    if (deleteConfirmation === true) {
      console.log(`ID: ${id}`);
      findPostForRemoval(id);
      console.log('fire watch delete');
    }
  });
}

function findPostForRemoval(id) {
  let obj = ENTRY_INFO.find(function(o) {
    return o.postId == id; 
  });
  sendPostForRemoval(obj);
}

function sendPostForRemoval(entry) {
  let title = entry.title;
  let content = entry.content;
  let date = entry.date;
  deleteEntry(title, content, date);
}

function deleteEntry(title, content, date) {
  $.ajax({
    method: 'DELETE',
    url: '/entries',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({'title': title, 'content': content, 'contentDate': date}),
    dataType: 'json',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}` },
    success: function () {
      alert(`Entry "${title}" has been deleted.`);
      getAllEntries();
    },
    error: function postAlert(err) {
      alert(err);
    }
  });
}

function getUpdateValues(id) {
  const obj = ENTRY_INFO.find(function(o) {
    return o.postId == id;
  });
  const postId = id;
  const databaseId = obj.databaseId;
  const titleUpdate = $('#titleUpdate').val();
  const entryUpdate = $('#dreamentryUpdate').val();
  const entryDateUpdate = $('#dreamdateUpdate').val();
  const entryTagsUpdate = $('#tagsUpdate').val();
  console.log(titleUpdate, entryUpdate, entryDateUpdate, entryTagsUpdate, postId, databaseId, 'update');
  updateEntry(titleUpdate, entryUpdate, entryDateUpdate, entryTagsUpdate, postId, databaseId);
}


function updateEntry(title, content, date, tags, postId, databaseId) {
  $.ajax({
    method: 'PUT',
    url: '/entries',
    contentType: 'application/json; charset=utf-8',
    data: JSON.stringify({'id': databaseId, 'title': title, 'content': content, 'contentDate': date, 'tags': tags}),
    dataType: 'json',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}` },
    success: function (res) {
      viewUpdatedPost(res, postId);
    },
    error: function postAlert(err) {
      alert(err);
    }
  });
}

function getAllEntries() {
  $.ajax({
    method: 'GET',
    url: '/entries',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    headers: { 'Authorization': `Bearer ${sessionStorage.getItem('sessionToken')}` },
    success: function (res) {
      $('#view-all-page').html('');
      clearENTRY_INFO();
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
  storeEntryInfo(entries);
}

function storeEntryInfo(entries) {
  ENTRY_INFO.length = 0;
  for (let i = 0; i < entries.length; i++) {
    ENTRY_INFO.push({postId: i, databaseId: entries[i].id, title: entries[i].title, content: entries[i].content, date: entries[i].contentDate, tags: entries[i].tags});
  }
  console.log(ENTRY_INFO);
}

function viewUpdatedPost(entries, id) {
  // let unformattedDate = new Date(entries.contentDate);
  // let date = unformattedDate.toDateString();
  // $('h3').text('View Entry');
  // $('#view-all-page').append(
  //   `<div class="update-container">
  //   <h4 class="title">${entries.title}</h4>
  //   <p class="content">${entries.content}</p>
  //   <p class="date">${date}</p>
  //   <p class="tags">Tags: ${entries.tags}<p>

  // <button class="btnupdate" id=${id}>Update Entry</button><button class="btndelete" id=${id}>Delete Entry</button>
  // </div>`
  getAllEntries();
}

function entryTemplate(entries) {
  for (let i = 0; i < entries.length; i++) {
    let unformattedDate = new Date(entries[i].contentDate);
    let date = unformattedDate.toDateString();
    $('#view-all-page').append(
      `<div class="entry-container">
      <h4 class="title">${entries[i].title}</h4>
      <p class="content">${entries[i].content}</p>
      <p class="date">${date}</p>
      <p class="tags">Tags: ${entries[i].tags}<p>

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
      alert('success [need to code this]');
      getAllEntries();

    },
    error: function postAlert(err) {
      alert(err);
    }
  });
}




$(watchLogin);
$(watchPost);
$(watchRegister);
$(watchRegistrationForm);
$(watchNewPostLink);
$(watchViewAllLink);
$(watchUpdate);
$(watchDelete);
$(watchSaveEntry);