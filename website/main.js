let whitemode = localStorage.getItem('whitemode')
const COURSES_INFO_PATH = "website/coursesInfo"
const INFO_IMG_PATH = "website/info.png"
const LBL_SUMM_PATH = "lbl"
const OTHER_SUMM_PATH = "other"
const CHEATSHEET_SUMM_PATH = "cheatsheet"


document.addEventListener('DOMContentLoaded', initialize);

async function initialize(){
    await createButtons();
    infoButton();
    whiteMode();
}


function infoButton(){
    // Select the overlay and content elements for displaying additional information
    const infoBoxOverlay = document.querySelector('.info-box-overlay');
    const infoContent = document.querySelector('.info-content');
    const closeButton = document.querySelector('.close-button');

    // Select all buttons that will trigger the display of additional information
    const infoButtons = document.querySelectorAll('.info-button');

    // Add click event listeners to each info button
    infoButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // Get the path to the info file from the button's data attribute
            const infoFile = button.dataset.info;
            
            // Fetch the content of the info file
            fetch(infoFile)
                .then(response => response.text())
                .then(data => {
                    // Format the fetched data and display it in the info content area
                    const formattedData = data.replace(/\n/g, '<br>');
                    infoContent.innerHTML = formattedData;
                    infoBoxOverlay.style.display = 'flex';
                })
                .catch(error => console.error('Error fetching info:', error));
        });
    });

    // Add a click event listener to the close button to hide the overlay
    closeButton.addEventListener('click', function() {
        infoBoxOverlay.style.display = 'none';
    });
}

async function createButtons(){
    const jsonRes = await parseJsonOFCourses();
    for (var i = 0; i < jsonRes.length; i++){
        const pdf_name = jsonRes[i][0];
        const { display_name, summary_type, button_color, course_info } = jsonRes[i][1];
        setButtonCode(pdf_name, display_name, summary_type, button_color, course_info);
    }
}

async function parseJsonOFCourses() {
    try {
        const response = await fetch('./website/pdf_data.json');
        if (!response.ok) {
            throw new Error(`Failed to load JSON: ${response.statusText}`);
        }
        const pdfData = await response.json();
        return Object.entries(pdfData);
    } catch (error) {
        console.error('Error fetching or processing JSON:', error);
        return null;
    }
}

function setButtonCode(pdfName, buttonText, summaryType, buttonColor, courseInfo) {
    try {
        const elem = document.querySelector(`[title="${pdfName}"]`);
        const divTitle = elem.getAttribute('title');
        const newElement = document.createElement('div');
        if (summaryType === "lbl"){
            newElement.innerHTML = getButtonCode(buttonText, `${LBL_SUMM_PATH}/${pdfName}.pdf`, buttonColor, courseInfo);
        } else if (summaryType === "other"){
            newElement.innerHTML = getButtonCode(buttonText, `${OTHER_SUMM_PATH}/${pdfName}.pdf`, buttonColor, courseInfo);
        } else if (summaryType === "cheatsheet"){
            newElement.innerHTML = getButtonCode(buttonText, `${CHEATSHEET_SUMM_PATH}/${pdfName}.pdf`, buttonColor, courseInfo);
        } else {
            console.warn('Button request is from unkown summery class:', pdfName);
            return;
        }
        elem.replaceWith(newElement.firstElementChild);
        return;
    } catch (error) {
        console.warn('Not found a button request for:', pdfName);
    }
}

function getButtonCode(buttonText, pdfLink, gradient, infoData) {
    return `
        <div class="pdf-button-container ${gradient}">
            <a class="pdf-button" href="${pdfLink}" target="_blank">${buttonText}</a>
            <button class="info-button" data-info="${COURSES_INFO_PATH}/${infoData}">
                <img src="${INFO_IMG_PATH}">
            </button>
        </div>
    `;
}

function createGenericButton(buttonText) {
    return `
        <div class="pdf-button-container gradient-generic">
            <a class="pdf-button" target="_blank">${buttonText}</a>
        </div>
    `;
}


function whiteMode(){
    const themeSwitch = document.getElementById('theme-switch');

    const enableWhitemode = () => {
    document.body.classList.add('whitemode');
    localStorage.setItem('whitemode', 'active');
    }

    const disableWhitemode = () => {
    document.body.classList.remove('whitemode');
    localStorage.setItem('whitemode', null);
    }

    if(whitemode === "active") enableWhitemode();

    themeSwitch.addEventListener("click", () => {
    whitemode = localStorage.getItem('whitemode');
    location.reload();
    whitemode !== "active" ? enableWhitemode() : disableWhitemode();
    });
}