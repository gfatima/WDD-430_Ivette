/*ROUTER FOR clientS */

const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');

const Client = require('../models/client');

router.get('/', (req, res, next) => {
  Client.find()
    .populate('group')
    .then(clients => {
      res.status(200).json(clients);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {

  const maxClientId = sequenceGenerator.nextId("clients");

  const Client = new Client({
    id: maxClientId,
    name: req.body.name,
    email: req.body.email,
    url: req.body.url,
    imageUrl: req.body.imageUrl
  });

  Client.save()
    .then(createdClient => {
      res.status(201).json({
        message: 'Client added successfully',
        client: createdClient
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
  Client.findOne({ id: req.params.id })
    .then(client => {
      client.name = req.body.name;
      client.email = req.body.email;
      client.phone = req.body.phone;
      client.imageUrl = req.body.imageUrl;

      Client.updateOne({ id: req.params.id }, client)
        .then(result => {
          res.status(204).json({
            message: 'client updated successfully'
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
        message: 'client not found.',
        error: { client: 'client not found'}
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Client.findOne({ id: req.params.id })
    .then(client => {
      Client.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Client deleted successfully"
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
        message: 'Client not found.',
        error: { client: 'Client not found'}
      });
    });
});

module.exports = router;
