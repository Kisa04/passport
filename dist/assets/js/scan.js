const qr = ((_) => {
  let video;
  let intv;
  let start_scan = function (callback) {
    window_status = "page-scan";
    bottom_bar("", "", "");

    document.getElementById("qr-screen").style.display = "block";

    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          audio: false,
          video: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        },
        function (stream) {
          video = document.querySelector("video");
          video.srcObject = stream;

          video.onloadedmetadata = function (e) {
            video.play();

            var barcodeCanvas = document.createElement("canvas");
            intv = setInterval(() => {
              barcodeCanvas.width = video.videoWidth;
              barcodeCanvas.height = video.videoHeight;
              var barcodeContext = barcodeCanvas.getContext("2d");
              var imageWidth = Math.max(1, Math.floor(video.videoWidth)),
                imageHeight = Math.max(1, Math.floor(video.videoHeight));

              barcodeContext.drawImage(video, 0, 0, imageWidth, imageHeight);

              var imageData = barcodeContext.getImageData(
                0,
                0,
                imageWidth,
                imageHeight
              );
              var idd = imageData.data;

              let code = jsQR(idd, imageWidth, imageHeight);

              if (code) {
                callback(code.data);
                stop_scan();
                clearInterval(intv);
              }
            }, 1000);
          };
        },
        function (err) {
          console.log("The following error occurred: " + err.name);
        }
      );
    } else {
      console.log("getUserMedia not supported");
    }
  };

  let stop_scan = function () {
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
      document.getElementById("qr-screen").style.display = "none";
      window_status = "page-options";
    });

    video.srcObject = null;
  };

  return {
    start_scan,
    stop_scan,
  };
})();
