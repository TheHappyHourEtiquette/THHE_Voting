const uuid = require('uuid');

// use this to update scores regularly every 30 seconds

module.exports = function (context, req) {
    const recipient = req.body.recipient;
    const scoreChange = req.body.scoreChange;
    console.log(`recipient: ${recipient}, scoreChange: ${scoreChange}`);
    context.bindings.signalRMessages = [{
        "target": "updatedScore",
        "arguments": [ recipient, scoreChange ]
    }];

    context.bindings.scoreDocument = JSON.stringify({
        id: uuid,
        recipient: recipient,
        scoreChange: scoreChange,
        scoreTime: new Date().toString()
      });
    context.done();
}