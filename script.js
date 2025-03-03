const preview = document.getElementById('preview');
const scanButton = document.getElementById('scanButton');
const resultDiv = document.getElementById('result');

scanButton.addEventListener('click', () => {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: preview,
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment"
            }
        },
        decoder: {
            readers: ["qr_code_reader"]
        }
    }, function(err) {
        if (err) {
            console.error('Quagga 초기화 실패:', err);
            resultDiv.textContent = 'Quagga 초기화 실패: ' + err.message;
            return;
        }
        Quagga.start();
        Quagga.onDetected(onDetected);
    });
});

function onDetected(result) {
    Quagga.stop();
    sendDataToServer(result.codeResult.code);
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
