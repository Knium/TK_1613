var userLat, userLng;

var updateButton = document.getElementById("updateTarget");
var memberTable = document.getElementById("memberTable");

function getUrlQuery(){
  var vars = [], max = 0, hash = "", array = "";
  var url = window.location.search;

  hash  = url.slice(1).split('&');    
  max = hash.length;
  for (var i = 0; i < max; i++) {
      array = hash[i].split('=');
      vars.push(array[0]);
      vars[array[0]] = array[1];
  }
  return vars
}

var eventId = getUrlQuery["id"] || "-KVApDZ8di97wDiOM2-Z";　//テスト用

connectFB.initAuth(function(uid){
  console.log("My ID is ",uid);
  
  navigator.geolocation.watchPosition(function (position) {
	  userLat = position.coords.latitude;
	  userLng = position.coords.longitude;
	  console.log("lat,lng", userLat, userLng);
	  

	  document.getElementById("updateTarget").addEventListener("click", function(){
			if(window.confirm("目的地を現在地に更新しますか？")){
				connectFB.updateTarget(eventId, {lat:userLat,lng:userLng});
			}
		});

	},function () {
	  //alert("Geolocation Error");
	  console.warn("Geolocation Error");
	},{
	  enableHighAccuracy: false,
	  timeout: 5000,
	  maximumAge: 0
	});

  connectFB.getMembers(eventId, function(members){
    console.log(members);
    for(i in members){
    	var arriveDate = new Date(members[i].arriveTime * 1000);
    	var time = arriveDate.toLocaleTimeString();
    	var laterDis=compass.VincentyInverse(userLat, userLng, members[i].geolocation.lat, members[i].geolocation.lng);
    	$('#memberTable').append(
    	"<tr>"+
        "<td>"+ time +"</td>"+
        "<td>"+ laterDis +"m </td>"+
      "</tr>"
      );
    }
  });

  /************* Push Nortification **************/
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('javascripts/serviceWorker.js')
    .then(function(registration) {
      return registration.pushManager.getSubscription().then(function(subscription) {
        if (subscription) {
          return subscription
        }
        return registration.pushManager.subscribe({
          userVisibleOnly: true
        })
      })
    }).then(function(subscription) {
      var endpoint = subscription.endpoint;
      var sliceUrlIndex = endpoint.lastIndexOf("/");
      var url = endpoint.slice(0,sliceUrlIndex);
      var nortificationId = endpoint.slice(sliceUrlIndex + 1);
      console.log(url,nortificationId);
      connectFB.setNortification(uid,eventId,subscription.endpoint);
      console.log("pushManager endpoint:", endpoint) // https://android.googleapis.com/gcm/send/******:******......
    }).catch(function(error) {
      console.warn("serviceWorker error:", error)
    });
  }
});