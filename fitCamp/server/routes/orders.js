/*FOR order RELATED ROUTES */

const express = require('express');
const router = express.Router();
const sequenceGenerator = require('./sequenceGenerator');

const Order = require('../models/order');

router.get('/', (req, res, next) => {
  Order.find()
    .then(orders => {
      res.status(200).json(orders);
    })
    .catch(error => {
      res.status(500).json({
        message: 'An error occurred',
        error: error
      });
    });
});

router.post('/', (req, res, next) => {
  const maxOrderId = sequenceGenerator.nextId("orders");

  const Order = new Order({
    id: maxOrderId,
    name: req.body.name,
    description: req.body.description,
    url: req.body.url
  });

  Order.save()
    .then(createdOrder => {
      res.status(201).json({
        message: 'Order added successfully',
        order: createdOrder
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
  Order.findOne({ id: req.params.id })
    .then(order => {
      order.name = req.body.name;
      order.description = req.body.description;
      order.url = req.body.url;

      Order.updateOne({ id: req.params.id }, order)
        .then(result => {
          res.status(204).json({
            message: 'Order updated successfully'
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
        message: 'Order not found.',
        error: { order: 'Order not found'}
      });
    });
});

router.delete("/:id", (req, res, next) => {
  Order.findOne({ id: req.params.id })
    .then(order => {
      Order.deleteOne({ id: req.params.id })
        .then(result => {
          res.status(204).json({
            message: "Order deleted successfully"
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
        message: 'order not found.',
        error: { order: 'order not found'}
      });
    });
});

module.exports = router;
