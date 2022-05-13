const uuid = require('uuid');
// use this to update scores regularly every 30 seconds

module.exports = function (context) {
  try {
  console.log('Broadcast triggered');
  var documents = context.bindings.scoreDocuments;
  console.log('Score docs found: ' + context.bindings.scoreDocuments.length);
  console.log('Show docs found: ' + context.bindings.showDocuments.length);
  if (context.bindings.showDocuments.length != 1) {
    throw '0 or more than 1 show docs found';
  }
  
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

  show.Title="UPDATED";
  console.log(show);
  console.log("Saving show");
  
  context.bindings.scoreDocument = show;
  console.log("Sending out the update to client");
  context.bindings.signalRMessages = [
    {
      target: "newMessage",
      arguments: [
        show,
      ],
    },
  ];

  context.res = {
    headers: {
      "Content-Type": "text/html",
    },
    body: show,
  };
  context.done();
  }
  catch(exp) {
    console.log('Error:' + exp);
    context.done();
  }
};
