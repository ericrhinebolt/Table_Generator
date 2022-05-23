"use strict";

// Getting HTML Elements
const jsHeadInfo = document.getElementById("headInfo");
const jsHeadSel = document.getElementById("headSel");
const colSel = document.getElementById("colSel");
const rowSel = document.getElementById("rowSel");
const genCon = document.querySelector(".genCon");
const subSel = document.querySelector(".subSel");
const textarea = document.querySelector(".textarea");
const copyBtn = document.querySelector(".copyBtn");
const downBtn = document.querySelector(".downBtn");

// Creating Elements
const table = document.createElement("table");
table.setAttribute("id", "tableContainer");
const headRow = document.createElement("tr");
headRow.setAttribute("id", "tableHeader");
let tableHead;
let tableRow;
let tableCol;

// Functions

// Functions for sizing output textarea
function autoResize(textBox) {
  textBox.style.height = textBox.scrollHeight + "px";
}
function autoShrink(textbox) {
  textbox.style.height = 0 + "px";
}

// Function for copy to clipboard
function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(
    function () {
      console.log("Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Could not copy text: ", err);
    }
  );
}

// Function for file download
let textFile = null,
  makeTextFile = function (text) {
    let data = new Blob([text], { type: "text/plain" });
    if (textFile !== null) {
      window.URL.revokeObjectURL(textFile);
    }
    textFile = window.URL.createObjectURL(data);
    return textFile;
  };

// Removing/Adding class for showing (Not including header)
if (jsHeadSel != null) {
  jsHeadSel.addEventListener("change", function () {
    if (jsHeadSel.value == "Yes") {
      jsHeadInfo.classList.remove("noHead");
    } else if (jsHeadSel.value == "No") {
      jsHeadInfo.classList.add("noHead");
    }
  });
}

// Generator
if (subSel != null) {
  subSel.addEventListener("click", function () {
    // Making Generated content visible
    genCon.classList.remove("noGen");

    // If user tries to generate a second table, removes the first table and resizes the text box to default
    document.querySelectorAll("tr").forEach((el) => {
      el.replaceChildren();
    });
    document.querySelector("table")?.replaceChildren();
    document.querySelector(".textarea").replaceChildren();
    autoShrink(textarea);

    // Appending <table> tag
    textarea.appendChild(table);

    // Appending header row if necessary
    if (jsHeadSel.value == "Yes") {
      document.getElementById("tableContainer").appendChild(headRow);
    }

    // Checking number of rows entered and generating elements with unique id's for each.
    for (let i = 1; i <= rowSel.value; i++) {
      tableRow = document.createElement("tr");
      tableRow.setAttribute("id", "tableRow" + i);
      table.appendChild(tableRow);
    }

    // Checking number of rows entered and generating elements in the header with unique id's for each.
    if (jsHeadSel.value == "Yes") {
      for (let l = 1; l <= colSel.value; l++) {
        tableHead = document.createElement("th");
        tableHead.setAttribute("id", "headerColumn" + l);
        document.getElementById("tableHeader").appendChild(tableHead);
      }
    }

    // Checking number of rows entered and generating correct number of
    // column elements for each row with unique id's for each.
    for (let j = 1; j <= rowSel.value; j++) {
      for (let k = 1; k <= colSel.value; k++) {
        tableRow = document.getElementById("tableRow" + j);
        tableCol = document.createElement("td");
        tableCol.setAttribute("id", "tableRow" + j + "Column" + k);
        tableRow.appendChild(tableCol);
      }
    }

    // Parsing generated tables into a string, adding line breaks and inputting it into the textarea
    let preHtml = textarea.firstChild.outerHTML;
    textarea.value = preHtml.replaceAll("><", ">\n<");

    // Running the autoResize function to fit the textbox to the content, no scrolling required!
    autoResize(textarea);
  });

  // Copying text to clipboard
  copyBtn.addEventListener("click", function (event) {
    copyTextToClipboard(textarea.value);
  });

  // Downloading a text file
  downBtn.addEventListener(
    "click",
    function () {
      let link = document.createElement("a");
      link.setAttribute("download", "generated-table.txt");
      link.href = makeTextFile(textarea.value);
      document.body.appendChild(link);

      window.requestAnimationFrame(function () {
        let event = new MouseEvent("click");
        link.dispatchEvent(event);
        document.body.removeChild(link);
      });
    },
    false
  );
}
