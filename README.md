# Dream Journal

## Application Demo
[Live Application](https://dreamjournal-capstone.herokuapp.com// "Dream Journal")

## Description

The Dream Journal application allows users to register and log a description of their dreams. Users can choose to record dates and tag specific entries. Entries can be viewed, modified and deleted from the interface.

## API Documentation

/users/ endpoint:

PUT     : create a new user

/entries/ endpoint:

PUT     : Update an entry
POST    : Create a new entry
GET     : Display all entries for the logged in user
DELETE  : Delete an entry


## Screenshots

![Login]()
Landing screen. User enter their username & password to access their entries recorded through the application.

![Register]()
New users register with a username, password and valid e-mail address.

![New Post]()
Interface for recording a new dream entry into the application.

![View All Posts]()
Interface for viewing all recorded entries (sorted in descending order of each dream's recorded date). Links for updating and deleting are included at the bottom of each individual entry.

![Update Post]()
Interface for updating posts. Posts can also be deleted from the update interface.


## Technology

This application utilizes HTML, CSS, Javascript, jQuery, node.js, Express and MongoDB.