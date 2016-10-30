'use strict'
var map;
var usr;
var target;
var frends;
var now;
var arriveTime;
var timeText;
var timeDiff;

usr = {
  lat: 35.652414,
  lng: 139.545242,
  markerPos: null,
  marker: null
};

target = {
  lat: 35.65576882190963,
  lng: 139.54202812824178,
  markerPos: null,
  marker: null,
  time: null
};

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

function renderTime() {
  now = new Date();
  timeText = document.getElementById('time');
  timeDiff = Math.floor(arriveTime - (now.getTime() / 1000));
  timeText.innerHTML = "到着まで<br>" + Math.floor(timeDiff / 3600) + "時間" + Math.floor(timeDiff % 3600 / 60) + "分";
}

function onRenderMap(targetLat, targetLng){

  navigator.geolocation.watchPosition(function (position) {
    usr.lat = position.coords.latitude;
    usr.lng = position.coords.longitude;
    console.log("lat,lng", usr.lat, usr.lng);
    

    map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: usr.lat,
        lng: usr.lng
      },
      zoom: 16
    });

    usr.marker = new google.maps.Marker({
      position: new google.maps.LatLng(usr.lat, usr.lng),
      title: "",
      draggable: true,
      map: map
    });

    target.marker = new google.maps.Marker({
      position: new google.maps.LatLng(target.lat, target.lng),
      title: "",
      draggable: false,
      icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      map: map
    });

    google.maps.event.addListener(usr.marker, 'dragend', function (ev) {
      console.log(ev.latLng.lat(), ev.latLng.lng());
    });
  },function () {
    //alert("Geolocation Error");
    console.warn("Geolocation Error");
  },{
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  });
}

function handleOrientation(event){//デバイスの向きの変化で実行
  var heading = event.alpha + 180;
  var result=compass.VincentyInverse(usr.lat, usr.lng, target.lat, target.lng);
  var relativeAzimuth = heading + result.azimuth1;
  var relativeDis = result.distance;
  //console.log(relativeAzimuth,heading);
  //console.log("distance:",relativeDis);
  //console.log(usr.lat, usr.lng);
  //renderCompass(relativeAzimuth);
  //renderCompass(result,heading);
  $(".conpass").css({"transform":"rotate("+relativeAzimuth+"deg)"});
  renderDistance(relativeDis);
}

function onCompass(){
  window.addEventListener('deviceorientation', handleOrientation);
}

function calcTime(callback){
  callback(1200000000);
}

function renderDistance(dis){
  console.log(dis);
  var dis = Math.floor(dis);
  console.log("dis = ",dis);
  var message = "???m";
  if(dis < 200){
    message = "200m未満";
  }else{
    message = dis+"m";
  }
  document.getElementById("distance").innerHTML = "距離<br>"+ message;
}

var eventId = getUrlQuery["id"] || "-KVApDZ8di97wDiOM2-Z";　//テスト用

connectFB.initAuth(function(uid){
  console.log("My ID is ",uid);
  
  connectFB.getEvent(eventId,function(eventData){
    console.log(eventData.targetLocation);
    target.lat = eventData.targetLocation.lat;
    target.lng = eventData.targetLocation.lng;
    onRenderMap(target.lat, target.lng);
    onCompass();
    calcTime(function(gotTime){
      arriveTime = 1477953360;
      //renderTime();
      //window.setInterval(renderTime, 500);
    });
    console.log(eventData);
  });

  //connectFB.updateTarget(eventId, {lat:0.6556498,lng:0.5420291});

  //connectFB.updateMyStatus({lat:35.6556498,lng:139.5420291},120000000,eventId,uid);

  connectFB.onTarget(eventId, function(geo){
    target.lat = geo.lat;
    target.lng = geo.lng;
  });

  document.getElementById("inform").addEventListener("click", function(){
    if(window.confirm("現在地を他のメンバーに報告しますか？")){
      connectFB.nortificate(eventId);
      connectFB.updateMyStatus({lat:usr.lat, lng:usr.lng}, arriveTime, eventId, uid);
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



