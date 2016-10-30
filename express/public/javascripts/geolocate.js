var geolocate = (function(){

var geolocation = {lat:0, lng:0};
var watchId;

/******************* geolocation *******************/
function getPositionSuccess(position){
  // success
  var data = position.coords ;
  var lat = data.latitude;
  var lng = data.longitude;
  geolocation = { lat:lat, lng:lng };
  console.log(geolocation);
  canUpdate = true;
}

function getPositionError(error){
  // error
  var errorInfo = [
    "原因不明のエラーが発生しました…。" ,
    "位置情報の取得が許可されませんでした…。" ,
    "電波状況などで位置情報が取得できませんでした…。" ,
    "位置情報の取得に時間がかかり過ぎてタイムアウトしました…。"
  ];
  var errorMessage = errorInfo[error.code];
  alert(errorMessage);
  throw errorMessage;
}

function onGeolocate(){
	// Geolocation APIに対応していない
	if(!navigator.geolocation){
	  alert( "あなたの端末では現在位置を取得できません。");
	}

	watchId = navigator.geolocation.watchPosition( getPositionSuccess, getPositionError,{
	    "enableHighAccuracy": false,
	    "timeout": 50000,
	    "maximumAge": 2000,
	});
}

function getGeolocation(){
	return geolocation;
}

function getWatchId(){
	return watchId;
}

function stopGeolocate(watchId){
  // 位置情報の追跡を中止する場合
  navigator.geolocation.clearWatch(watchId) ;
}

return {
  onGeolocate: onGeolocate,
  offGeolocate: stopGeolocate,
  getGeolocation : getGeolocation,
  getWatchId : getWatchId
};

}());