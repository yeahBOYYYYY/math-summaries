const POPUP_DATA_PATH = "./website/popup_data.json";
const POPUP_PRE = "popup";
const PDF_DATA_PATH = "./website/pdf_data.json";


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

async function createButtons() {
    const jsonRes = await parseJson(PDF_DATA_PATH);
    for (let pdf_name in jsonRes){
        try {
            const elem = document.querySelector(`[title="${pdf_name}"]`);
            const newElement = document.createElement('div');
            newElement.innerHTML = getButtonCode(jsonRes[pdf_name]);
            elem.replaceWith(newElement.firstElementChild);
        } catch (error) {
            console.warn('Not found a button request for:', pdf_name);
        }
    }
}

function parseAttribute(dict){
    let image = dict.image;
    let text = "";
    for (let field in dict) {
        if (field === "image") continue;
        if (field !== "") text += `<b>${field}</b>: `;
        let isArray = Array.isArray(dict[field]);
        if (isArray) {
            text += `${dict[field].join(", ")}.`;
        } else {
            text += `${dict[field]}.`
        }
        text += "<br>";
    }
    return [image, text];
}

function getButtonCode(dict) {
    let prefix = `
        <div class="pdf-button-container ${dict.button_color}">
            <a class="pdf-button" href="${dict.URL}" target="_blank">${dict.display_name}</a>`;
    let postfix = `
        </div>
    `

    let additinal = "";
    for (let att in dict.pdf_info) {
        let res = parseAttribute(dict.pdf_info[att]);
        additinal += `
        <div class="tooltip">
            <img src="${res[0]}">
            <span class="tooltiptext">${res[1]}</span>
        </div>
        `;
    }

    return prefix + additinal + postfix;
}