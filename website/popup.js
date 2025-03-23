import {createButtons} from "./pdfButtons.js";

const POPUP_DATA_PATH = "./website/popup_data.json";
const POPUP_PRE = "popup";


document.addEventListener('DOMContentLoaded', mainPopups);


async function mainPopups(){
    const popups_tmp = document.querySelector(`[id="popups_tmp"]`);
    let popups_code = await createPopups();
    const new_popups = document.createElement('div');
    new_popups.innerHTML = popups_code;
    popups_tmp.replaceWith(...new_popups.children);

    createButtons();
}

async function createPopups(){
    const jsonRes = await parseJson(POPUP_DATA_PATH);
    let popups_code = "";
    for (let popup_name in jsonRes){
        try {
            const elem = document.querySelector(`[title="${POPUP_PRE}/${popup_name}"]`);
            const newElement = document.createElement('div');
            newElement.innerHTML = getPopupButtonCode(popup_name, jsonRes[popup_name]["display_name"], jsonRes[popup_name]["button_color"]);
            elem.replaceWith(newElement.firstElementChild);

            popups_code += getPopupCode(popup_name, jsonRes[popup_name]["display_name"], jsonRes[popup_name]["courses"]);
        } catch (error) {
            console.warn('Not found a popup button request for:', popup_name);
        }
    }
    return popups_code;
}

function getPopupButtonCode(popup_name, display_name, button_color){
    return `
        <div class="pdf-button-container ${button_color}">
        <button class="pdf-button" onclick="openPopup('${popup_name}')">${display_name}</button>
        </div>
    `;
}

function getPopupCode(popup_name, display_name, courses){
    let pre = `
        <div class="popup-overlay" id="${popup_name}" onclick="closePopup(event, '${popup_name}')">
            <div class="popup-content" onclick="event.stopPropagation()">
                <h2>בחר וריאציה של הקורס ${display_name}!</h2>
                <h4>שימו לב כי ההבדלים נמצאים בדרך כלל בלחצן המידע הנוסף של הקורס!</h4>
    `;
    let post = `
                <button class="popup-close-button" onclick="closePopup(null, '${popup_name}')">Close</button>
            </div>
      </div>
    `;

    let pdf_button_envoke = "";
    for (let course of courses){
        pdf_button_envoke += `
                <div title="${course}"></div>
                <br>
        `
    }

    return pre + pdf_button_envoke + post;
}

function openPopup(popupId) {
    document.getElementById(popupId).style.display = "flex";
}

function closePopup(event, popupId) {
    if (!event || event.target === document.getElementById(popupId)) {
        document.getElementById(popupId).style.display = "none";
    }
}