const preview = document.getElementById('preview');
const scanButton = document.getElementById('scanButton');
const resultDiv = document.getElementById('result');

scanButton.addEventListener('click', () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
            preview.srcObject = stream;
            preview.play();
            scanQRCode();
        })
        .catch(error => {
            console.error('카메라 접근 실패:', error);
            resultDiv.textContent = '카메라 접근 실패: ' + error.message;
        });
});

function scanQRCode() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = preview.videoWidth;
    canvas.height = preview.videoHeight;
    context.drawImage(preview, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
        preview.srcObject.getVideoTracks().forEach(track => track.stop());
        sendDataToServer(code.data);
    } else {
        requestAnimationFrame(scanQRCode);
    }
}

function sendDataToServer(qrCodeData) {
    fetch('https://api.test.com/abc', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qrCode: qrCodeData })
    })
        .then(response => response.json())
        .then(data => {
            resultDiv.textContent = JSON.stringify(data);
        })
        .catch(error => {
            console.error('API 요청 실패:', error);
            resultDiv.textContent = 'API 요청 실패: ' + error.message;
        });
}
