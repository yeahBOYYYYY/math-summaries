import * as buttonHandler from './pdfButtons.js';



let whitemode, mdRenderedAlready;

const GENERIC_BUTTON_PREFIX = "generic/";


document.addEventListener('DOMContentLoaded', initialize);

async function initialize(){
    whiteMode();
    initMD();
    lastCommitFetch();
    await buttonHandler.createButtons();
    createGenericButtons();
}

function reloadMD(){
    const mdRender = document.getElementById('md-render');

    mdRenderedAlready = JSON.parse(sessionStorage.getItem("renderedMD"));
    if (mdRenderedAlready){
        mdRender.render();
    }
}

function initMD(){
    sessionStorage.setItem('renderedMD', false);
    addEventListener('zero-md-ready', (e) => {
        e.target.render();
        sessionStorage.setItem('renderedMD', true);
    });
}

function whiteModeToggle(){
    whitemode = JSON.parse(localStorage.getItem('whitemode'));
    document.body.classList.toggle('whitemode');
    localStorage.setItem('whitemode', !whitemode);
}

function whiteMode(){
    const themeSwitch = document.getElementById('theme-switch');

    whitemode = localStorage.getItem('whitemode');
    if (whitemode == null) localStorage.setItem('whitemode', false);
    whitemode = JSON.parse(localStorage.getItem('whitemode'));

    if (whitemode) document.body.classList.toggle('whitemode');

    themeSwitch.addEventListener("click", () => {
        whiteModeToggle();
        reloadMD();
    });
}

function lastCommitFetch(){
    try {
        fetch('https://api.github.com/repos/yeahBOYYYYY/math-summaries/commits?per_page=1')
        .then(res => res.json())
        .then(res => {
            document.getElementById('lastCommitName').innerHTML = res[0].commit.message;
        })
    } catch (error) {
        console.warn('Not found the last commit.');
        document.getElementById('lastCommitName').innerHTML = "didn't found the last commit";
    }
}


function createGenericButton(buttonText) {
    return `
        <div class="pdf-button-container gradient-generic">
            <a class="pdf-button" target="_blank">${buttonText}</a>
        </div>
    `;
}

function createGenericButtons(){
    let generic_buttons = document.querySelectorAll(`[title^=generic\]`);
    generic_buttons.forEach((button) => {
        let button_name = button.title.replace(GENERIC_BUTTON_PREFIX, "");
        const newElement = document.createElement('div');
        newElement.innerHTML = createGenericButton(button_name);
        button.replaceWith(newElement.firstElementChild);
    });
}
