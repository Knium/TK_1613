var express = require('express');
var request = require('request');
var router = express.Router();
var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: "./bin/pine-2809c1f48e58.json",
  databaseURL: "https://pine-7ac5b.firebaseio.com/"
});
var db = firebase.database();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html');
});

router.get('/nortificate', function(req, res, next) {
  // Attach an asynchronous callback to read the data at our posts reference
	if(req.query.eventId){
	  	var eventId = req.query.eventId;
	  	var type = req.query.type || null;
	  	var ref = db.ref("/nortification/"+eventId);
	  	ref.on("value", function(snapshot) {
	  		var val = snapshot.val();
	  		console.log(val);
	  		for(i in val){
	  			var endpoint = val[i];
					var sliceUrlIndex = endpoint.lastIndexOf("/");
					var url = endpoint.slice(0,sliceUrlIndex);
					var nortificationId = endpoint.slice(sliceUrlIndex + 1);
					//ヘッダーを定義
					var headers = {
						"Authorization": "key="+process.env.PINE_NORTIFICATION_KEY,
					  'Content-Type':'application/json'
					}
					//オプションを定義
					var options = {
					  url: url,
					  method: 'POST',
					  headers: headers,
					  form: { "to": nortificationId }
					}

	  			request(options, function(error, response, body){
	  				console.log(response);
	  			});
	  		}
	  		res.send("YO");
			}, function (errorObject) {
			  console.log("The read failed: " + errorObject.code);
			});
	  }
});

module.exports = router;