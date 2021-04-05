const express = require('express'),
    bodyParser = require('body-parser');

const db = require('./../connect_db/connect.js');
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({extended: false});

router.get('/reviews', (req, res, next) => {
    res.sendFile(__dirname + '/reviews.html');
});

router.post('/reviews', urlencodedParser, (req, res, next) => {
  let review = req.body.user_message;
  if (review) {
    db.query("INSERT INTO reviews SET login='goose', message = '" + review + "'", function(error, results, fields) { // not protection
      res.write('Your review was add');
    });
  } else {
    res.send('Message area is empty');
  }
});
module.exports = router;

/*      
db.query("SELECT * FROM reviews", function(error, results, fields) {
  for(let i = 0; i < results.length; i++) {
    res.write(results[i].message_id + " | " + results[i].login + " | " + results[i].message);
  }
});
*/




  /*const userMessages = [];

  const userMessageForm = document.querySelector('form');
  const userMessagesList = document.querySelector('ul');

  function renderMessages() {
    let messageItems = '';
    for (const message of userMessages) {
      messageItems = `
        ${messageItems}
        <li class="message-item">
          <div class="message-image">
            <img src="${message.image}" alt="${message.text}">
          </div>
          <p>${message.text}</p>
        </li>
      `;
    }

    userMessagesList.innerHTML = messageItems;
  }*/