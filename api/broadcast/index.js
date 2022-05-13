const uuid = require('uuid');
// use this to update scores regularly every 30 seconds

module.exports = function (context) {
  var documents = context.bindings.scoreDocuments;
  if (context.bindings.showDocuments.length != 1) {
    throw '';
  }
  var show = context.bindings.showDocuments[0];

  let scores = {};
  for (var i=0; i < show.Panellists.length; i++) {
    scores[show.Panellists[i].Title] = 0;
  }


  for (var i = 0; i < documents.length; i++) {
    var document = documents[i];
    scores[document.recipient] += document.scoreChange;
  }

  for (var i=0; i < show.Panellists.length; i++) {
    show.Panellists[i].TotalScore = scores[show.Panellists[i].Title];
  }

  context.bindings.scoreDocument = show;
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
