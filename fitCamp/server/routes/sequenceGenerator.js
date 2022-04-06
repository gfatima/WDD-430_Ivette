var Sequence = require('../models/sequence');

var maxOrderId;
var maxClientId;
var sequenceId = null;

function SequenceGenerator() {

  Sequence.findOne()
    .exec(function(err, sequence) {
      if (err) {
        return res.status(500).json({
          title: 'An error occurred',
          error: err
        });
      }

      sequenceId = sequence._id;
      maxOrderId = sequence.maxOrderId;
      maxClientId = sequence.maxClientId;
    });
}

SequenceGenerator.prototype.nextId = function(collectionType) {

  var updateObject = {};
  var nextId;

  switch (collectionType) {
    case 'orders':
      maxOrderId++;
      updateObject = {maxOrderId: maxOrderId};
      nextId = maxOrderId;
      break;

    case 'clients':
      maxClientId++;
      updateObject = {maxClientId: maxClientId};
      nextId = maxClientId;
      break;

    default:
      return -1;
  }

  Sequence.update({_id: sequenceId}, {$set: updateObject},
    function(err) {
      if (err) {
        console.log("nextId error = " + err);
        return null
      }
    });

  return nextId;
}

module.exports = new SequenceGenerator();
