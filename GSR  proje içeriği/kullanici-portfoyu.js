document.addEventListener("DOMContentLoaded", function() {
    // Gezinme menüsünde tıklanan öğeye göre sayfaya kaydırma işlemi
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            window.scrollTo({
                top: targetSection.offsetTop - 50, // Üst kısımdan biraz boşluk bırak
                behavior: 'smooth'
            });
        });
    });

    // E-posta adresini kopyalama
    const emailElement = document.getElementById('email');
    emailElement.addEventListener('click', function() {
        const email = emailElement.textContent;
        navigator.clipboard.writeText(email).then(() => {
            alert('E-posta adresi kopyalandı: ' + email);
        }).catch(err => {
            console.error('E-posta kopyalanamadı: ', err);
        });
    });

    // Duygu durumu seçimi formu
    const emotionForm = document.getElementById('emotion-form');
    emotionForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const selectedEmotion = document.querySelector('input[name="emotion"]:checked');

        if (selectedEmotion) {
            const emotionValue = selectedEmotion.value;
            alert('Seçilen Duygu Durumu: ' + emotionValue);

            // Burada, seçilen duyguyu veritabanına kaydetme veya başka bir işlem yapma kodu eklenebilir
        } else {
            alert('Lütfen bir duygu durumu seçin.');
        }
    });

    // Tema değiştirme butonu
    const toggleThemeButton = document.createElement('button');
    toggleThemeButton.textContent = 'Gece Modu';
    toggleThemeButton.classList.add('toggle-theme-button');
    document.body.appendChild(toggleThemeButton);

    toggleThemeButton.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            toggleThemeButton.textContent = 'Gündüz Modu';
        } else {
            toggleThemeButton.textContent = 'Gece Modu';
        }
    });
});
