// ... (código existente)

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        if (file.size > MAX_FILE_SIZE) {
            alert('File size exceeds the limit. Please upload an image smaller than 5MB.');
            return;
        }
        currentFile = file;
        originalImage.src = URL.createObjectURL(file);
        originalImage.classList.remove('hidden');
    }
});

// ... (resto del código)