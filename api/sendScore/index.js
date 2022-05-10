var https = require('https');

var etag = '';
var star = 0;
// use this to update scores regularly every 30 seconds

module.exports = function (context, req) {
    const recipient = req.body.recipient;
    const scoreChange = req.body.scoreChange;
    console.log(`recipient: ${recipient}, scoreChange: ${scoreChange}`)
    context.bindings.signalRMessages = [{
        "target": "updatedScore",
        "arguments": [ recipient, scoreChange ]
    }]
    context.done();
}