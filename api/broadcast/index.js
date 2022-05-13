const uuid = require('uuid');
// use this to update scores regularly every 30 seconds

module.exports = function (context) {
  console.log('Broadcast triggered');
  var documents = context.bindings.scoreDocuments;
  console.log('Score docs found: ' + context.bindings.scoreDocuments);
  if (context.bindings.showDocuments.length != 1) {
    throw '';
  }
  console.log('Show docs found: ' + context.bindings.showDocuments);
  var show = context.bindings.showDocuments[0];

  let scores = {};
  for (var i=0; i < show.Panellists.length; i++) {
    scores[show.Panellists[i].Title] = 0;
  }
  console.log(scores);

  console.log("Getting scores by panellist");
  for (var i = 0; i < documents.length; i++) {
    var document = documents[i];
    scores[document.recipient] += document.scoreChange;
  }

  console.log("Updating scores by panellist");
  for (var i=0; i < show.Panellists.length; i++) {
    show.Panellists[i].TotalScore = scores[show.Panellists[i].Title];
  }

  console.log("Saving show");
  context.bindings.scoreDocument = show;
  console.log("Sending out the update to client");
  context.bindings.signalRMessages = [
    {
      target: "newMessage",
      arguments: [
        `Current star count of https://github.com/Azure/azure-signalr is: ${star}`,
      ],
    },
  ];

  context.res = {
    headers: {
      "Content-Type": "text/html",
    },
    body: data,
  };
  context.done();
};
