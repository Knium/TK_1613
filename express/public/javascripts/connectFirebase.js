var connectFB = (function(){

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC9BbueyahT-qMtv6HgDwSb8pC9u2DUZBE", //ブラウザ用APIキー
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
      console.log("UserId : ",uid);
      callback(uid);
    } else {
      // User is not sign in.
      firebase.auth().signInAnonymously().catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var errorAlert = errorCode+' : '+errorMessage+'\nFirebaseとコネクションが確立できませんでした．';
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

function writeNewPost(targetLocation, eventName, eventTime, callback) {
  var postData = {
    targetLocation:targetLocation,
    eventName:eventName,
    eventTime:eventTime
  }

  var eventId = firebase.database().ref().child('events').push().key;

  var updates = {};
  updates['/events/' + eventId] = postData;
  firebase.database().ref().update(updates).then(function(data){
  	callback(eventId);
  });
}
/*
connectFirebase.writeNewPost(35.655663,139.5414368,"JPHACK打ち上げ会",1477407418010, function(postId){
	console.log(postId);
});
*/

function getEvent(eventId, callback){
  firebase.database().ref('/events/' + eventId).once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
}

function updateTarget(eventId, targetLocation){
  firebase.database().ref('/events/' + eventId +'/targetLocation/').set(targetLocation);
}

function updateMyStatus(geolocation, arriveTime, eventId, uid){
  var nowTime = ~~( new Date() / 1000 ); // UNIX Timestamp
  var postData = {
    geolocation:geolocation,
    time:nowTime,
    arriveTime:arriveTime
  }

  firebase.database().ref('/members/'+eventId+'/'+uid).set(postData);
  console.log("emit dane!!");
}

function watchTarget(eventId, change_callback){
  var targetRef = firebase.database().ref('/events/' + eventId +'/geolocation');
  targetRef.on('child_changed', function(data) {
    change_callback({lat:data.val().lat, lng:data.val().lng});
  });
}

function getMembers(eventId,callback){
  firebase.database().ref('/members/' + eventId).once('value').then(function(snapshot) {
    callback(snapshot.val());
  });
}

function setNortification(uid,eventId,endpoint){
  var updates = {};
  firebase.database().ref().child('nortification/' + eventId + '/' + uid).set(endpoint);

}

function nortificate(eventId){
  $.get("nortificate", { "eventId": eventId },
  function(data){
    console.log(data);
    //alert("Data Loaded: " + data);
  });
}

return {
  initAuth: initAuth,
  writeNewPost : writeNewPost,
  getEvent : getEvent,
  updateTarget : updateTarget,
  updateMyStatus : updateMyStatus,
  onTarget : watchTarget,
  getMembers : getMembers,
  setNortification : setNortification,
  nortificate : nortificate
};

}());





