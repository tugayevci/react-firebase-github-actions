const functions = require("firebase-functions");

exports.deleteOldItems = functions.database.ref("/messages/{pushId}").onWrite((change, context) => {
  var ref = change.after.ref.parent; // reference to the items
  var now = Date.now();
  var cutoff = now - 10;
  var oldItemsQuery = ref.orderByChild("timestamp").endAt(cutoff);
  return oldItemsQuery.once("value", function (snapshot) {
    // create a map with all children that need to be removed
    var updates = {};
    snapshot.forEach(function (child) {
      updates[child.key] = null;
    });
    // execute all updates in one go and return the result to end the function
    return ref.update(updates);
  });
});
