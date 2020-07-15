
const captureVideoButton = document.querySelector('.capture-button');

const screenShotBtn = document.querySelector('#screenshot-button');

const img = document.querySelector('#screenshot img');

const video = document.querySelector('#screenshot video');

const canvas = document.querySelector('#screenshot canvas');

const maWidth = "40";

const maHeight = "40";

const maValeur = 190;

// Bouton capture

/*
{video: {
          frameRate: 0.01666666666
        }}
*/

function demarrer() {
    startCapture().then((display) => {
                video.srcObject = display;

                //setTimeout(stopStreamedVideo, 5000);
            });
}

/*captureVideoButton.onclick = function() {
    navigator.mediaDevices.getUserMedia( {audio:true}).
    then(stream => {
        video.srcObject = stream;
    }).catch(err => {console.log(err)});
};
*/

// Bouton screenshot

function fairescreen() {

    // Dimension
    canvas.width = maWidth;
    canvas.height = maHeight;

    // Dessin
    canvas.getContext('2d').drawImage(video, -1520, -50);
    whiteText(canvas);

    // Quantité
    const { createWorker } = Tesseract;
(async () => {
  const worker = createWorker({
        workerPath: 'https://unpkg.com/tesseract.js@v2.0.0/dist/worker.min.js',
        langPath: 'https://github.com/Shreeshrii/tessdata_shreetest',
        corePath: 'https://unpkg.com/tesseract.js-core@v2.0.0/tesseract-core.wasm.js',
      });
  await worker.load();
  await worker.loadLanguage('digits');
  await worker.initialize('digits');
  const { data: { text } } = await worker.recognize(canvas);
  console.log(text);
})();


}

function startCapture(displayMediaOptions) {
    let captureStream = null;
   
    return navigator.mediaDevices.getDisplayMedia(displayMediaOptions)
       .catch(err => { console.error("Error:" + err); return null; });
   }

function stopStreamedVideo() {
const stream = video.srcObject;
const tracks = stream.getTracks();

tracks.forEach(function(track) {
    track.stop();
});

}


function whiteText(monCanvas) {

    var ctx = monCanvas.getContext('2d');
    var imgd = ctx.getImageData(0, 0, maWidth, maHeight);
    var pix = imgd.data;

    for (var i = 0, n = pix.length; i <n; i += 4) {
        var r = pix[i];
        var g = pix[i+1];
        var b = pix[i+2];
    
        if(g > maValeur  && r>maValeur && b>maValeur) { 
            // If the green component value is higher than 150
            // make the pixel transparent because i+3 is the alpha component
            // values 0-255 work, 255 is solid
            pix[i] = 255;
            pix[i+1] = 255;
            pix[i+2] = 255;
        } else {
            pix[i] = 0;
            pix[i+1] = 0;
            pix[i+2] = 0;
        }
    }

 
    ctx.putImageData(imgd, 0, 0);

}
