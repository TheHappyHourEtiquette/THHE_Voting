const uuid = require('uuid');

// TODO: Change to Typescript

module.exports = function (context, req) {
    const updateType = req.body.updateType;
    const updateTiming = req.body.updateTiming;
    console.log(`Type: ${updateType}, Timing: ${updateTiming}`);

    context.bindings.signalRMessages = [{
        "target": "setTime",
        "arguments": [ updateType, updateTiming ]
    }];
    context.done();
}