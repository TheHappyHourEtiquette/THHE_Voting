const uuid = require('uuid');

// TODO: Change to Typescript

module.exports = function (context, req) {
    const questionId = req.body.questionId;
    console.log(`QuestionId: ${questionId}`);

    if (context.bindings.showDocuments.length != 1) {
        throw '0 or more than 1 show docs found';
    }
    
    var show = context.bindings.showDocuments[0];
    show.SelectedQuestionId = questionId;

    context.bindings.showDocument = JSON.stringify(show);

    context.bindings.signalRMessages = [{
        "target": "dfiChanged",
        "arguments": [ questionId ]
    }];
    context.done();
}