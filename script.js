const preview = document.getElementById('preview');
const scanButton = document.getElementById('scanButton');
const resultDiv = document.getElementById('result');

scanButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        preview.srcObject = stream;
        preview.play();
        await scanQRCode();
    } catch (error) {
        console.error('카메라 접근 실패:', error);
        resultDiv.textContent = '카메라 접근 실패: ' + error.message;
    }
});

async function scanQRCode() {
    const codeReader = new ZXing.BrowserQRCodeReader();
    try {
        const result = await codeReader.decodeFromVideoElement(preview);
        preview.srcObject.getVideoTracks().forEach(track => track.stop());
        sendDataToServer(result.text);
    } catch (error) {
        if (!(error instanceof ZXing.NotFoundException)) {
            console.error('QR 코드 스캔 오류:', error);
            resultDiv.textContent = 'QR 코드 스캔 오류: ' + error.message;
        }
        await new Promise(resolve => setTimeout(resolve, 500)); // 재시도 간격 추가
        await scanQRCode(); // 재시도
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
