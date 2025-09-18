let whitemode, mdRenderedAlready;


document.addEventListener('DOMContentLoaded', initialize);

async function initialize(){
    whiteMode();
    initMD();
}

// ======================== MARKDOWN RENDERER ========================

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

// ======================== White Mode ========================

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

// ======================== Popups buttons ========================

function openPopup(popupId) {
    document.getElementById(popupId).style.display = "flex";
}

function closePopup(event, popupId) {
    if (!event || event.target === document.getElementById(popupId)) {
        document.getElementById(popupId).style.display = "none";
    }
}