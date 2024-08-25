document.addEventListener('DOMContentLoaded', function() {
    const infoButtons = document.querySelectorAll('.info-button');
    const infoBoxOverlay = document.querySelector('.info-box-overlay');
    const infoContent = document.querySelector('.info-content');
    const closeButton = document.querySelector('.close-button');

    infoButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const infoFile = button.dataset.info;
            fetch(infoFile)
                .then(response => response.text())
                .then(data => {
                    const formattedData = data.replace(/\n/g, '<br>');
                    infoContent.innerHTML = formattedData;
                    infoBoxOverlay.style.display = 'flex';
                })
                .catch(error => console.error('Error fetching info:', error));
        });
    });

    closeButton.addEventListener('click', function() {
        infoBoxOverlay.style.display = 'none';
    });
});


function createPdfButtonContainer(buttonText, pdfLink, gradient, infoData) {
    return `
        <div class="pdf-button-container ${gradient}">
            <a class="pdf-button" href="${pdfLink}" target="_blank">${buttonText}</a>
            <button class="info-button" data-info="../coursesInfo/${infoData}">
                <img src="info.png">
            </button>
        </div>
    `;
}

function createGenericContainer(buttonText) {
    return `
        <div class="pdf-button-container gradient-generic">
            <a class="pdf-button" target="_blank">${buttonText}</a>
        </div>
    `;
}