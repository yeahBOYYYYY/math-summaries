const lbl_summ_path = "../lbl"


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
            <button class="info-button" data-info=".website/coursesInfo/${infoData}">
                <img src=".website/info.png">
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

document.addEventListener('DOMContentLoaded', function () {
    // Fetch the JSON file containing the PDF metadata
    fetch('website/pdf_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load JSON: ${response.statusText}`);
            }
            return response.json();
        })
        .then(pdfData => {
            // Find all divs with a title attribute matching a PDF name
            document.querySelectorAll('div[title]').forEach(div => {
                const pdfName = div.getAttribute('title');
                
                // Check if the PDF exists in the JSON
                if (pdfData[pdfName]) {
                    const { display_name, summary_type, button_color, course_info } = pdfData[pdfName];

                    // Populate the div with the information
                    div.innerHTML = `
                        <div class="${button_color}">
                            <strong>${display_name}</strong><br>
                            Summary Type: ${summary_type}<br>
                            Course Info: ${course_info}
                        </div>
                    `;
                } else {
                    console.warn(`No metadata found for PDF: ${pdfName}`);
                }
            });
        })
        .catch(error => console.error('Error fetching or processing JSON:', error));
});
