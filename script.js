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
    const codeReader = new ZXing.BrowserQRCodeReader();
    codeReader.decodeFromVideoElement(preview, (result, err) => {
        if (result) {
            preview.srcObject.getVideoTracks().forEach(track => track.stop());
            sendDataToServer(result.text);
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error('QR 코드 스캔 오류:', err);
            resultDiv.textContent = 'QR 코드 스캔 오류: ' + err.message;
        }
    });
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
