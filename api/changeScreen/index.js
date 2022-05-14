const uuid = require('uuid');

// use this to update scores regularly every 30 seconds

module.exports = function (context, req) {
    const screenName = req.body.screenName;
    console.log(`ScreenName: ${screenName}`);
    context.bindings.signalRMessages = [{
        "target": "screenChanged",
        "arguments": [ screenName ]
    }];
    context.done();
}