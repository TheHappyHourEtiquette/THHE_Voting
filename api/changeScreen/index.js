const uuid = require('uuid');

// use this to update scores regularly every 30 seconds

module.exports = function (context, req) {
    const screenName = req.body.screenName;
    console.log(`ScreenName: ${screenName}`);

    if (context.bindings.showDocuments.length != 1) {
        throw '0 or more than 1 show docs found';
    }
    
    var show = context.bindings.showDocuments[0];
    show.CurrentScreen = screenName;

    context.bindings.showDocument = JSON.stringify(show);

    context.bindings.signalRMessages = [{
        "target": "screenChanged",
        "arguments": [ screenName ]
    }];
    context.done();
}