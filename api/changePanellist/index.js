const uuid = require('uuid');

// use this to update scores regularly every 30 seconds

module.exports = function (context, req) {
    const panellist = req.body.panellist;
    console.log(`Panellist: ${panellist.Title}`);

    if (context.bindings.showDocuments.length != 1) {
        throw '0 or more than 1 show docs found';
    }
    
    var show = context.bindings.showDocuments[0];
    show.SelectedPanellist = panellist;

    context.bindings.showDocument = JSON.stringify(show);

    context.bindings.signalRMessages = [{
        "target": "panellistChanged",
        "arguments": [ panellist ]
    }];
    context.done();
}