const uuid = require('uuid');

// TODO: Change to Typescript

module.exports = function (context, req) {
    const question = req.body.question;
    console.log(`Question: ${question.QuestionText}`);

    if (context.bindings.showDocuments.length != 1) {
        throw '0 or more than 1 show docs found';
    }
    
    var show = context.bindings.showDocuments[0];
    show.SelectedQuestion = question;

    context.bindings.showDocument = JSON.stringify(show);

    context.bindings.signalRMessages = [{
        "target": "panellistChanged",
        "arguments": [ panellist ]
    }];
    context.done();
}