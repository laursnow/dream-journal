/* global $, api */

'use strict';

const ENTRY_INFO = [];

// $( function() {
//   $('.date-field').datepicker();
// } );

$('body').on('focus', '.date-field', function(){
  $(this).datepicker();
});

function watchLogin() {
  $('.login-container').on('submit', '.js-login-form', event => {
    event.preventDefault();
    const username = $('#username').val();
    const pass = $('#pass').val();
    api.login(username, pass, loginSuccess);
    console.log('fire watch login');
  });
}

function loginSuccess(res) {
  sessionStorage.setItem('sessionToken', res.authToken);
  hideLogin();
  showNewPost();
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
    api.register(user, pass, email);
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
    api.postEntry(title, entryNew, entryDate, entryTags,        newPostResponse);
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
  $('input').val('');
  $('textarea').val('');
  hideViewAll();
  console.log('show new post');
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
    api.getAllEntries(getAllEntriesSuccess);
    console.log('fire watch view all link');
  });
}

function getAllEntriesSuccess(res) {
  $('#view-all-page').html('');
  clearENTRY_INFO();
  displayAllEntries(res); 
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
                <input type="text" id="dreamdateUpdate" name="dreamdate" class="date-field" value="${newDate}" required></label>
              <label for="tags">Tags:
                <input type="text" id="tagsUpdate" name="tags" class="post-field" value="${tags}" required></label>
            </fieldset>
             <p class="button-align"><button type="button" class="btnsave" id=${postId}>Save Entry</button><button class="btndelete" type="button" id=${postId}>Delete Entry</button></p></form></div>`
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
    event.preventDefault();
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
  api.deleteEntry(title, content, date, postDeletedResponse);
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
  api.updateEntry(titleUpdate, entryUpdate, entryDateUpdate, entryTagsUpdate, databaseId, postId, viewUpdatedPost);
}

function newPostResponse() {
  $('h3').text(' Post created successfully');
  $('#entry-page').addClass('hidden');
}

function postDeletedResponse() {
  $('h3').text('Post removed successfully');
  $('#view-all-page').addClass('hidden');
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

function updateENTRY_INFO(entry, postId) {
  let objIndex = ENTRY_INFO.findIndex((entry => entry.postId == postId));
  ENTRY_INFO[objIndex].databaseId = entry.id;
  ENTRY_INFO[objIndex].title = entry.title;
  ENTRY_INFO[objIndex].content = entry.content;
  ENTRY_INFO[objIndex].date = entry.contentDate;
  ENTRY_INFO[objIndex].tags = entry.tags;
}

function viewUpdatedPost(entry, id) {
  updateENTRY_INFO(entry, id);
  let unformattedDate = new Date(entry.contentDate);
  let date = unformattedDate.toDateString();
  $('h3').text('View Entry');
  $('#view-all-page').html(
    `<div class="update-container">
    <h4 class="title">${entry.title}</h4>
    <p class="content">${entry.content}</p>
    <p class="date"><span class="purple">Date: </span>${date}</p>
    <p class="tags"><span class="purple">Tags: </span>${entry.tags}</p>

  <p class="button-align"><button class="btnupdate" type="button" id=${id}>Update Entry</button>
  <button class="btndelete" type="button" id=${id}>Delete Entry</button></p>
  </div>`);
}

function entryTemplate(entries) {
  for (let i = 0; i < entries.length; i++) {
    let unformattedDate = new Date(entries[i].contentDate);
    let date = unformattedDate.toDateString();
    $('#view-all-page').append(
      `<div class="entry-container">
      <h4 class="title">${entries[i].title}</h4>
      <p class="content">${entries[i].content}</p>
      <p class="date"><span class="purple">Date: </span>${date}</p>
      <p class="tags"><span class="purple">Tags: </span>${entries[i].tags}</p>

      <p class="button-align"><button class="btnupdate" type="button" id=${i}>Update Entry</button>
      <button class="btndelete" type="button" id=${i}>Delete Entry</button></p>
    </div>`
    );
  }
}



function watchSignOut() {
  $('.sign-out').on('click', event => {
    api.signOut();
    sessionStorage.removeItem('sessionToken');
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
$(watchSignOut);