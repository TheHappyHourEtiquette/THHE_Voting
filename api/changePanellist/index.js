const uuid = require('uuid');

// use this to update scores regularly every 30 seconds

module.exports = function (context, req) {
    const panellistId = req.body.panellistId;
    console.log(`PanellistId: ${panellistId}`);

    if (context.bindings.showDocuments.length != 1) {
        throw '0 or more than 1 show docs found';
    }
    
    var show = context.bindings.showDocuments[0];
    show.SelectedPanellistId = panellistId;

    context.bindings.showDocument = JSON.stringify(show);

    context.bindings.signalRMessages = [{
        "target": "panellistChanged",
        "arguments": [ panellistId ]
    }];
    context.done();
}