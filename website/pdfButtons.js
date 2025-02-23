const JSON_PATH = "./website/pdf_data.json";

const INFO_IMG_PATH = "website/info.png";
const REAPIR_IMG_PATH = "website/repair.png";
const CONSTRUCTION_IMG_PATH = "website/construction.png";


async function parseJsonOFCourses() {
    try {
        const response = await fetch(JSON_PATH);
        if (!response.ok) throw new Error(`Failed to load JSON: ${response.statusText}`);
        const pdfData = await response.json();
        return pdfData;
    } catch (error) {
        console.error('Error fetching or processing JSON:', error);
        return null;
    }
}

export async function createButtons() {
    const jsonRes = await parseJsonOFCourses();
    for (let pdf_name in jsonRes){
        try {
            const elem = document.querySelector(`[title="${pdf_name}"]`);
            const newElement = document.createElement('div');
            newElement.innerHTML = getButtonCode(jsonRes[pdf_name]);
            elem.replaceWith(newElement.firstElementChild);
        } catch (error) {
            // console.warn('Not found a button request for:', pdf_name);
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