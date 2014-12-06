var pictureSource;
var destinationType;

document.addEventListener("deviceready",onDeviceReady, false);

function onDeviceReady() {
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
}

function onPhotoDataSuccess(imageData) {
    var capturedImage = document.getElementById('capturedImage');
    capturedImage.src = imageData;
    console.log("imageData: " + imageData);
    uploadFile(imageData);
}

function onPhotoURISuccess(imageURI) {
    var openedImage = document.getElementById('openedImage');
    openedImage.src = imageURI;
    console.log("imageURI: " + imageURI);
    uploadFile(imageURI);
}

function capturePhoto() {
    navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 50,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: true,
        correctOrientation: true
    });
}

function openPhoto() {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        destinationType: window.Camera.DestinationType.FILE_URI,
        sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
        mediaType: window.Camera.MediaType.PICTURE
    });
}

function onFail(message) {
    alert('Failed because: ' + message);
}

function uploadFile (imageURI) {
    var statusDiv = document.getElementById('status');
    statusDiv.innerHTML = "";
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
    console.log("fileName: " + options.fileName);
    options.mimeType="image/jpeg";
    options.chunkedMode = false;

    var server = encodeURI('https://touristmapserver.herokuapp.com/upload');

    // Transfer picture to server
    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            statusDiv.innerHTML = (progressEvent.loaded / progressEvent.total)*100;
        }
    };
    ft.upload(imageURI, server, function(r) {
        console.log(JSON.stringify(r));
        statusDiv.innerHTML = "Upload successful: "+r.bytesSent+" bytes uploaded.";
    }, function(error) {
        console.log(JSON.stringify(error));
        statusDiv.innerHTML = "Upload failed: Code = "+error.code;
    }, options, true);
}