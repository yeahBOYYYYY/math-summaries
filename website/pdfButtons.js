const PDF_DATA_PATH = "./website/pdf_data.json";


document.addEventListener('DOMContentLoaded', createButtons);


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