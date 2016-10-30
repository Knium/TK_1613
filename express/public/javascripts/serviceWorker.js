self.addEventListener("push", function(event) {
	console.log("aaaa");
  event.waitUntil(
    self.registration.showNotification("PINE", {
    	icon: "img/logo.png",
      body: "メンバーの到着予想時刻が届きました"
    })
  )
})