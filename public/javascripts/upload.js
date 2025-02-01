
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('file');

dropZone.addEventListener('click', () => {
    fileInput.click();
});

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('border-slate-500');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('border-slate-500'); 
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('border-slate-500');
    
    const files = e.dataTransfer.files;
    fileInput.files = files;
});



function uploadedSuccessfully() {
    alert("File uploaded successfully!");
}
