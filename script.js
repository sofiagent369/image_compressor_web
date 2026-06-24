// ... (código existente)

exportButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = compressedImage.src;
    link.download = 'compressed-image.jpg';
    link.click();
});

// ... (resto del código)