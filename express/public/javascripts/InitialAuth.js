// Initialize Firebase
var config = {
  apiKey: "AIzaSyC9BbueyahT-qMtv6HgDwSb8pC9u2DUZBE",
  authDomain: "pine-7ac5b.firebaseapp.com",
  databaseURL: "https://pine-7ac5b.firebaseio.com",
  storageBucket: "pine-7ac5b.appspot.com",
  messagingSenderId: "1079802744867"
};
firebase.initializeApp(config);

function initAuth(callback){
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      var uid = user.uid;
      console.log(uid);
      callback(uid);
    } else {
      // User is not sign in.
      firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var errorAlert = errorCode,' : ',errorMessage,'\nFirebaseとコネクションが確立できませんでした．';
        alert(errorAlert);
        throw errorAlert;
      });
    }
  });
}

/*
initFirebase.initAuth(function(uid){
	console.log(uid);
});
*/