"use strict";

// Getting HTML Elements
const jsHeadInfo = document.getElementById("headInfo");
const jsHeadSel = document.getElementById("headSel");
const colSel = document.getElementById("colSel");
const rowSel = document.getElementById("rowSel");
const genCon = document.querySelector(".genCon");
const genBtn = document.getElementById("genBtn");
const textarea = document.querySelector(".textarea");
const copyBtn = document.querySelector(".copyBtn");
const downBtn = document.querySelector(".downBtn");
const conForm = document.getElementById("conForm");

// Creating Elements
const table = document.createElement("table");
table.setAttribute("id", "tableContainer");
const headRow = document.createElement("tr");
headRow.setAttribute("id", "tableHeader");
let tableHead;
let tableRow;
let tableCol;

//Email Validation

const mailVal = new RegExp("[a-z0-9]+@[a-z]+\\.[a-z]{2,3}");
const conBtn = document.getElementById("conBtn");
const conEmail = document.getElementById("conEmail");
const conTextBox = document.getElementById("conTextBox");

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
if (genBtn != null) {
  genBtn.addEventListener("click", function () {
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
    preHtml = preHtml.replaceAll("><", ">,\n<");
    let htmlArr = preHtml.split(",");
    textarea.value = htmlArr.join("");
    // textarea.value = preHtml.replaceAll("><", ">\n<");

    // Running the autoResize function to fit the textbox to the content, no scrolling required!
    autoResize(textarea);
  });

  // Copying text to clipboard
  if (copyBtn != null) {
    copyBtn.addEventListener("click", function (event) {
      copyTextToClipboard(textarea.value);
    });
  }

  // Downloading a text file
  if (downBtn != null) {
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
}

// Email Validation
// conForm?.addEventListener("submit", function (e) {
//   if (mailVal.test(conEmail.value)) {
//     if (conTextBox.value == "") {
//       alert("Please enter a message!");
//       e.preventDefault();
//     } else if (conTextBox.value != "") {
//       alert("Your message has been sent");
//     }
//   } else if (!mailVal.test(conEmail.value)) {
//     alert("Please enter a valid email!");
//     e.preventDefault();
//   }
// });

// conForm.addEventListener("submit", handleSubmit);
// const handleSubmit = (e) => {
//   e.preventDefault();
//   let formData = new FormData(conForm);
//   fetch("/", {
//     method: "POST",
//     headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     body: new URLSearchParams(formData).toString(),
//   })
//     .then(() => console.log("Form successfully submitted"))
//     .catch((error) => alert(error));
// };

conForm?.addEventListener("submit", function (e) {
  if (mailVal.test(conEmail.value)) {
    if (conTextBox.value == "") {
      alert("Please enter a message!");
      e.preventDefault();
    } else if (conTextBox.value != "") {
      let formData = new FormData(conForm);
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      })
        .then(
          () => console.log("Form successfully submitted"),
          alert("Your message has been sent")
        )
        .catch((error) => alert(error));
    }
  } else if (!mailVal.test(conEmail.value)) {
    alert("Please enter a valid email!");
    e.preventDefault();
  }
});
