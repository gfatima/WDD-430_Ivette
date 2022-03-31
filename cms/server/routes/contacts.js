/*ROUTER FOR CONTACTS */

const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');

const Contact = require('../models/contact');

//function to return error
/*function returnError(res, error) {
  res.status(500).json({
    message: 'An error occurred',
    error: error
  });
}*/


router.get('/', (req, res, next) => {
  Contact.find()
    .populate('group')
    .then(contacts => {
      res.status(200).json(contacts);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

//POST route for adding contact
router.post('/', (req, res, next) => {
  //get unique id for adding new contact
  const maxContactId = sequenceGenerator.nextId("contacts");

  //create new contact with info from request
  const contact = new Contact({
    id: maxContactId,
    name: req.body.name,
    email: req.body.email,
    url: req.body.url,
    imageUrl: req.body.imageUrl
   // group: req.body.group
  });

  //MAP/REPLACE contacts in group contact with only their primary key value
  //if there is something in the group array...
  /*if (contact.group && contact.group.length > 0) {
    //loop through all the group
    for (let groupContact of contact.group) {
      //assign only the id to the group contact
      groupContact = groupContact._id;
    }
  }*/

  contact.save()
    .then(createdContact => {
      res.status(201).json({
        message: 'Contact added successfully',
        contact: createdContact
      });
    })
    .catch(error => {
       res.status(500).json({
          message: 'An error occurred',
          error: error
        });
    });
});

router.put('/:id', (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      contact.name = req.body.name;
      contact.email = req.body.email;
      contact.phone = req.body.phone;
      contact.imageUrl = req.body.imageUrl;

      Contact.updateOne({ id: req.params.id }, contact)
        .then(result => {
          res.status(204).json({
            message: 'Contact updated successfully'
          })
        })
        .catch(error => {
           res.status(500).json({
           message: 'An error occurred',
           error: error
         });
        });
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found'}
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Contact.findOne({ id: req.params.id })
    .then(contact => {
      Contact.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Contact deleted successfully"
          });
        })
        .catch(error => {
           res.status(500).json({
           message: 'An error occurred',
           error: error
         });
        })
    })
    .catch(error => {
      res.status(500).json({
        message: 'Contact not found.',
        error: { contact: 'Contact not found'}
      });
    });
});

module.exports = router;
