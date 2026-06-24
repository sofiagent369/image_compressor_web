const imageInput = document.getElementById('image-input');
const originalImage = document.getElementById('original-image');
const compressedImage = document.getElementById('compressed-image');
const compressButton = document.getElementById('compress-button');
const exportButton = document.getElementById('export-button');
const historyList = document.getElementById('history-list');

let theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);

function toggleTheme() {
    if (theme === 'light') {
        theme = 'dark';
    } else {
        theme = 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        originalImage.src = URL.createObjectURL(file);
        originalImage.classList.remove('hidden');
        compressedImage.classList.add('hidden');
        exportButton.classList.add('hidden');
    }
});

compressButton.addEventListener('click', async () => {
    const image = await loadImage(originalImage.src);
    const compressedDataUrl = compressImage(image, 0.8); // Compress to 80%
    compressedImage.src = compressedDataUrl;
    compressedImage.classList.remove('hidden');
    exportButton.classList.remove('hidden');

    // Save to history
    saveToHistory({
        original: originalImage.src,
        compressed: compressedDataUrl,
        date: new Date().toISOString()
    });
});

exportButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = compressedImage.src;
    link.download = 'compressed-image.jpg';
    link.click();
});

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous'; // Required for CORS images
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
    });
}

function compressImage(image, quality) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);
    return canvas.toDataURL('image/jpeg', quality);
}

function saveToHistory(entry) {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history.push(entry);
    localStorage.setItem('history', JSON.stringify(history));
    updateHistoryUI();
}

function updateHistoryUI() {
    const history = JSON.parse(localStorage.getItem('history')) || [];
    historyList.innerHTML = '';
    history.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `Entry ${index + 1} - ${new Date(entry.date).toLocaleString()}`;
        listItem.addEventListener('click', () => {
            originalImage.src = entry.original;
            compressedImage.src = entry.compressed;
            originalImage.classList.remove('hidden');
            compressedImage.classList.remove('hidden');
            exportButton.classList.remove('hidden');
        });
        historyList.appendChild(listItem);
    });
}

// Initialize history UI
updateHistoryUI();