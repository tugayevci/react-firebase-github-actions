const functions = require("firebase-functions");

exports.deleteOldItems = functions.database.ref("/path/to/items/{pushId}").onWrite((change: any, context: any) => {
  var ref = change.after.ref.parent; // reference to the items
  var now = Date.now();
  var cutoff = now - 10;
  var oldItemsQuery = ref.orderByChild("timestamp").endAt(cutoff);
  return oldItemsQuery.once("value", function (snapshot: any) {
    // create a map with all children that need to be removed
    var updates: any = {};
    snapshot.forEach(function (child: any) {
      updates[child.key] = null;
    });
    // execute all updates in one go and return the result to end the function
    return ref.update(updates);
  });
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
