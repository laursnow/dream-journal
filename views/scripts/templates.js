/* global $ */
'use strict';

const templates = (function () {

  function generateEntryTemplate(entries) {
    for (let i = 0; i < entries.length; i++) {
      let unformattedDate = new Date(entries[i].contentDate);
      let date = unformattedDate.toDateString();
      $('#view-all-page').append(
        `<div class="entry-container">
          <h4 class="title">${entries[i].title}</h4>
           <p class="content">${entries[i].content}</p>
           <p class="date"><span class="purple">Date: </span>${date}</p>
           <p class="tags"><span class="purple">Tags: </span>${ entries[i].tags}</p>
           <p class="button-align"><button class="btnupdate" type="button" id=${i}>Update Entry</button>
          <button class="btndelete" type="button" id=${i}>Delete Entry</button></p>
        </div>`
      );
    }
  }

  function generateUpdateEditForm(title, content, date, tags, postId) {
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

  function generateUpdateTemplate(entry, id) {
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

  return {
    generateEntryTemplate,
    generateUpdateEditForm,
    generateUpdateTemplate
  };
})();
