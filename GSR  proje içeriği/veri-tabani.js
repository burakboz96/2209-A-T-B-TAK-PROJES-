document.addEventListener('DOMContentLoaded', function () {
    const filterForm = document.getElementById('filter-form');
    const dataTableBody = document.querySelector('#data-table tbody');

    filterForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;

        try {
            // API'ye filtreleme isteği gönderme
            const response = await fetch('/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ startDate, endDate }),
            });

            // Yanıtı JSON formatında al
            const data = await response.json();

            // Tabloyu güncelle
            updateTable(data);
        } catch (error) {
            console.error('Veri çekme hatası:', error);
        }
    });

    function updateTable(data) {
        dataTableBody.innerHTML = ''; // Mevcut verileri temizle

        // Verileri tabloya ekle
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.day}</td>
                <td>${new Date(row.date).toLocaleDateString()}</td>
                <td>${new Date(row.time).toLocaleTimeString()}</td>
                <td>${row.gsr_average}</td>
                <td>${row.human_resistance}</td>
            `;
            dataTableBody.appendChild(tr);
        });
    }
});
