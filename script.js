// ===== Dark/Light Mode Toggle =====
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');

    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// ===== Compare Mode =====
const compareBtn = document.getElementById('compareBtn');
let compareMode = false;

compareBtn.addEventListener('click', () => {
    compareMode = !compareMode;

    const table = document.getElementById('specsTable');
    const headerCells = table.querySelectorAll('th');

    if (compareMode) {
        compareBtn.textContent = 'Single Mode';
        headerCells[2].style.display = 'table-cell';
        table.querySelectorAll('tbody tr').forEach(row => {
            if (row.children[2]) row.children[2].style.display = 'table-cell';
        });
    } else {
        compareBtn.textContent = 'Compare Mode';
        headerCells[2].style.display = 'none';
        table.querySelectorAll('tbody tr').forEach(row => {
            if (row.children[2]) row.children[2].style.display = 'none';
            row.children[2].textContent = '-'; // Clear compare column
        });
    }
});

// ===== Search & Populate Table =====
const searchBtn = document.getElementById('searchBtn');
const phoneInput = document.getElementById('phoneInput');

searchBtn.addEventListener('click', async () => {
    const keyword = phoneInput.value.trim();
    if (!keyword) return alert("Enter a phone model.");

    try {
        // 1️⃣ Search phone by keyword
        const searchRes = await fetch('http://localhost:3000/api/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyword })
        });

        const searchData = await searchRes.json();
        if (!searchData || !searchData[0]) return alert("No phone found.");

        const deviceId = searchData[0].id; // device ID from API

        // 2️⃣ Fetch device details
        const detailRes = await fetch('http://localhost:3000/api/device', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ device_id: deviceId })
        });

        const deviceData = await detailRes.json();

        // 3️⃣ Decide which column to fill
        const table = document.getElementById('specsTable').querySelector('tbody');
        let col = 1; // default: Phone 1
        if (compareMode) {
            const firstPhoneCell = table.querySelector('tr td:nth-child(2)');
            col = firstPhoneCell.textContent === '-' ? 1 : 2;
        }

        // 4️⃣ Map API data to table
        table.rows[0].children[col].textContent = deviceData.deviceName || '-';
        table.rows[1].children[col].textContent = deviceData.releaseDate || '-';
        table.rows[2].children[col].textContent = deviceData.chipset || '-';
        table.rows[3].children[col].textContent = deviceData.os || '-';
        table.rows[4].children[col].textContent = deviceData.sensors?.join(', ') || '-';
        table.rows[5].children[col].textContent = deviceData.ports?.join(', ') || '-';
        table.rows[6].children[col].textContent = deviceData.discontinued ? 'Yes' : 'No';

        phoneInput.value = ''; // Clear input
    } catch (err) {
        console.error(err);
        alert("Failed to fetch phone data from server.");
    }
});

