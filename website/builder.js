// builder.js (Node build-time compiler)
// Run with: node builder.js
// Requires: npm install jsdom node-fetch

import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";
import fetch from "node-fetch";


// ======================== Constants ========================

const INPUT_HTML = "./website/main.html";
const OUTPUT_DIR = "./out";
const POPUP_DATA_PATH = "./website/popup_data.json";
const POPUP_PREFIX = "popup";
const PDF_DATA_PATH = "./website/pdf_data.json";
const GENERIC_BUTTON_PREFIX = "generic/";


async function parseJson(json_path) {
    try {
        const response = await fetch(json_path);
        if (!response.ok) throw new Error(`Failed to load ${json_path} JSON: ${response.statusText}`);
        const pdfData = await response.json();
        return pdfData;
    } catch (error) {
        console.error('Error fetching or processing JSON:', error);
        return null;
    }
}

// ======================== Commit Fetcher ========================

async function lastCommitFetch(doc) {
    try {
        const res = await fetch(
            "https://api.github.com/repos/yeahBOYYYYY/math-summaries/commits?per_page=1"
        );
        const json = await res.json();
        const commitMsg = json[0]?.commit?.message || "no commit found";
        const span = doc.getElementById("lastCommitName");
        if (span) span.textContent = commitMsg;
    } catch (error) {
        console.warn("Not found the last commit.");
        const span = doc.getElementById("lastCommitName");
        if (span) span.textContent = "didn't find the last commit";
    }
}

// ======================== Popup Injector ========================

function getPopupButtonCode(popup_name, display_name, button_color) {
    return `
        <div class="pdf-button-container ${button_color}">
        <button class="pdf-button" onclick="openPopup('${popup_name}')">${display_name}</button>
        </div>
    `;
}

function getPopupCode(popup_name, display_name, courses) {
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

    let inner = "";
    for (let course of courses) {
        inner += `<div title="${course}"></div><br>`
    }

    return pre + inner + post;
}

function createPopups(doc, popupData) {
    let popups_code = "";
    for (let popup_name in popupData) {
        const elem = doc.querySelector(`[title="${POPUP_PREFIX}/${popup_name}"]`);
        if (elem) {
            const frag = JSDOM.fragment(getPopupButtonCode(popup_name, popupData[popup_name]["display_name"], popupData[popup_name]["button_color"]));
            elem.replaceWith(frag);

            popups_code += getPopupCode(popup_name, popupData[popup_name]["display_name"], popupData[popup_name]["courses"]);
        } else {
            console.warn('Not found a popup button request for:', popup_name);
        }
    }
    return popups_code;
}

async function mainPopups(doc, popupData) {
    const popupsTmp = doc.getElementById(`[id="popups_tmp"]`);
    let popups_code = createPopups(doc, popupData);
    const frag = JSDOM.fragment(popups_code);
    popupsTmp.replaceWith(frag);
}

// ======================== PDF Buttons Injector ========================

function parseAttribute(dict) {
    let image = dict.image;
    let text = "";
    for (let field in dict) {
        if (field === "image") continue;
        if (field !== "") text += `<b>${field}</b>: `;
        if (Array.isArray(dict[field])) {
            text += `${dict[field].join(", ")}.`;
        } else {
            text += `${dict[field]}.`;
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

function createButtons(doc, pdfData) {
    for (let pdf_name in jsonRes) {
        const elem = doc.querySelector(`[title="${pdf_name}"]`);
        if (elem) {
            const frag = JSDOM.fragment(getButtonCode(pdfData[pdf_name]));
            elem.replaceWith(frag);
        }
        else {
            console.warn('Not found a button request for:', pdf_name);
        }
    }
}

// ======================== Generic Buttons Injector ========================

function createGenericButton(buttonText) {
    return `
        <div class="pdf-button-container gradient-generic">
            <a class="pdf-button" target="_blank">${buttonText}</a>
        </div>
    `;
}

function createGenericButtons(doc) {
    let generic_buttons = doc.querySelectorAll(`[title^=generic\]`);
    generic_buttons.forEach((button) => {
        let button_name = button.getAttribute("title").replace(GENERIC_BUTTON_PREFIX, "");
        const frag = JSDOM.fragment(createGenericButton(button_name));
        button.replaceWith(frag);
    });
}

// ======================== Main ========================

async function main() {
    // Load HTML
    const html = fs.readFileSync(INPUT_HTML, "utf8");
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    // Load JSON
    const pdfData = JSON.parse(fs.readFileSync(PDF_DATA_PATH, "utf8"));
    const popupData = JSON.parse(fs.readFileSync(POPUP_DATA_PATH, "utf8"));

    // Apply injections
    await lastCommitFetch(doc);
    await mainPopups(doc, popupData);
    createButtons(doc, pdfData);
    createGenericButtons(doc);

    // Prepare output dir
    if (fs.existsSync(OUTPUT_DIR)) {
        fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    // Write final HTML
    fs.writeFileSync(path.join(OUTPUT_DIR, "index.html"), dom.serialize(), "utf8");
    console.log("✅ Built site into", OUTPUT_DIR);
}


main();