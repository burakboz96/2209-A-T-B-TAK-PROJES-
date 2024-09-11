document.addEventListener('DOMContentLoaded', function () {
    const taraButton = document.getElementById('tara-button');
    const timeDisplay = document.getElementById('time');
    const emotionStatus = document.getElementById('emotion-status');
    const suggestionButton = document.querySelector('.suggestion-button');
    const icon1 = document.querySelector('.icons img:nth-child(1)');
    const icon2 = document.querySelector('.icons img:nth-child(2)');
    let timerInterval;
    let gsr_average, human_resistance; // Son değerler için değişkenler

    taraButton.addEventListener('click', async function () {
        // Sayaç geri sayımı başlat
        let timeRemaining = 10;
        updateTimerDisplay(timeRemaining);

        clearInterval(timerInterval); // Önceki sayaç varsa durdur
        timerInterval = setInterval(function () {
            timeRemaining--;
            updateTimerDisplay(timeRemaining);

            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                taramaIslemi(); // Tarama işlemini başlat ve son değeri göster
            }
        }, 1000);

        // Seri porttan gelen verileri al
        try {
            const port = await navigator.serial.requestPort();
            await port.open({ baudRate: 9600 });
            const reader = port.readable.getReader();

            while (timeRemaining > 0) {
                const { value, done } = await reader.read();
                if (done) {
                    break; // Kullanıcı bağlantıyı kapattı
                }
                const textDecoder = new TextDecoder();
                const decodedValue = textDecoder.decode(value);

                // GSR ve direnç değerlerini al ve işleme
                const [gsrAverage, humanResistance] = decodedValue.split(',').map(Number);
                gsr_average = gsrAverage; // Son değeri kaydet
                human_resistance = humanResistance; // Son değeri kaydet
            }

            reader.releaseLock();
        } catch (error) {
            console.error('Seri port hatası:', error);
        }
    });

    function taramaIslemi() {
        // Zaman bitince son değeri işleme ve ekrana bas
        if (gsr_average !== undefined && human_resistance !== undefined) {
            updateEmotionStatus(gsr_average, human_resistance);
        } else {
            emotionStatus.textContent = 'Veri alınamadı.';
        }
    }

    function updateEmotionStatus(gsrAverage, humanResistance) {
        let duygu = '';

        if (gsrAverage >= 300 && gsrAverage <= 500 && humanResistance >= 20 && humanResistance <= 50) {
            duygu = 'MUTLU';
        } else if ((gsrAverage >= 700 && gsrAverage <= 900) || (gsrAverage <= -700 && gsrAverage >= -900) &&
                   (humanResistance >= 1 && humanResistance <= 5)) {
            duygu = 'SİNİRLİ';
        } else if ((gsrAverage >= 500 && gsrAverage <= 700) || (gsrAverage <= -500 && gsrAverage >= -700) &&
                   (humanResistance >= 5 && humanResistance <= 20)) {
            duygu = 'ŞAŞIRMIŞ';
        } else if ((gsrAverage >= 600 && gsrAverage <= 1023) || (gsrAverage <= -600 && gsrAverage >= -1023) &&
                   (humanResistance >= 1 && humanResistance <= 10)) {
            duygu = 'STRESLİ';
        } else if ((gsrAverage >= 800 && gsrAverage <= 1023) || (gsrAverage <= -800 && gsrAverage >= -1023) &&
                   (humanResistance >= 1 && humanResistance <= 5)) {
            duygu = 'KORKMUŞ';
        } else if ((gsrAverage >= 600 && gsrAverage <= 800) || (gsrAverage <= -600 && gsrAverage >= -800) &&
                   (humanResistance >= 3 && humanResistance <= 10)) {
            duygu = 'HEYECANLI';
        } else if ((gsrAverage >= 400 && gsrAverage <= 600) || (gsrAverage <= -400 && gsrAverage >= -600) &&
                   (humanResistance >= 10 && humanResistance <= 30)) {
            duygu = 'ÜZGÜN';
        } else if ((gsrAverage >= 200 && gsrAverage <= 400) || (gsrAverage <= -200 && gsrAverage >= -400) &&
                   (humanResistance >= 30 && humanResistance <= 50)) {
            duygu = 'RAHATLAMIŞ';
        } else {
            duygu = 'BULUNAMADI TARANIYOR...';
        }

        emotionStatus.textContent = duygu;
    }

    // Öneri butonu tıklanırsa
    suggestionButton.addEventListener('click', function () {
        const currentEmotion = emotionStatus.textContent;
        let suggestion = '';

        switch (currentEmotion) {
            case 'MUTLU':
                suggestion = 'Tebrikler! Mutlu olmanın tadını çıkarın!';
                break;
            case 'SİNİRLİ':
                suggestion = 'Derin bir nefes alın ve sakinleşmeye çalışın.';
                break;
            case 'ŞAŞIRMIŞ':
                suggestion = 'Sizi şaşırtan şeyi keşfetmeye çalışın!';
                break;
            case 'STRESLİ':
                suggestion = 'Biraz ara verin ve rahatlamaya çalışın.';
                break;
            case 'KORKMUŞ':
                suggestion = 'Endişelenmeyin, her şey yoluna girecek.';
                break;
            case 'HEYECANLI':
                suggestion = 'Heyecanınızı pozitif bir şekilde kullanın!';
                break;
            case 'ÜZGÜN':
                suggestion = 'Kendinizi iyi hissetmek için sevdiğiniz bir şeyi yapın.';
                break;
            case 'RAHATLAMIŞ':
                suggestion = 'Bu rahatlatıcı anın tadını çıkarın.';
                break;
            default:
                suggestion = 'Duygu durumunuzu tanımlayamadım.';
        }

        alert(suggestion);
    });

    // Icon1 (Veri Tabanı) tıklanırsa
    icon1.addEventListener('click', function () {
        window.location.href = 'veri-tabani.html'; // Veri tabanı sayfasına yönlendir
    });

    // Icon2 (Kullanıcı Portföyü) tıklanırsa
    icon2.addEventListener('click', function () {
        window.location.href = 'kullanici-portfoyu.html'; // Kullanıcı portföyü sayfasına yönlendir
    });

    function updateTimerDisplay(seconds) {
        timeDisplay.textContent = `00:${seconds < 10 ? '0' : ''}${seconds}`;
    }
});
