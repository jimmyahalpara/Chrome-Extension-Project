// document.addEventListener('DOMContentLoaded', function() {
//     var checkPageButton = document.getElementById('checkPage');
//     checkPageButton.addEventListener('click', function() {
//         chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//             let url = tabs[0].url;
//             // use `url` here inside the callback because it's asynchronous!
//             document.getElementById("urlHere").innerHTML = url;
//             console.log(url);
//         });

//     }, false);
// }, false);

// document.getElementById("test").addEventListener('click', () => {
//     console.log("Popup DOM fully loaded and parsed");

//     function modifyDOM() {
//         //You can play with your DOM here or check URL against your regex
//         console.log('Tab script:');
//         console.log(document.body);
//         return document.body.innerHTML;
//     }

//     //We have permission to access the activeTab, so we can call chrome.tabs.executeScript:
//     chrome.tabs.executeScript({
//         code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
//     }, (results) => {
//         //Here we have just the innerHTML and not DOM structure
//         console.log('Popup script:')
//         console.log(results[0]);
//     });
// });

// global variables
let tokenArray = [];

// update/delete/copy token list 

function deleteToken(number) {
    delete tokenArray[number];
    tokenArray = tokenArray.filter(function(el) {
        return el != null;
    });
    updatTokenListShowAll(tokenArray)
}

function updatTokenListShowAll(obj) {
    let htmlContent = "";
    let count = 0;
    let tokenContainerElement = document.getElementById("tokenContainer");

    obj.forEach(element => {
        console.log(element);
        let data = element.data;
        let urlKey;
        if (element.type == "url") {
            urlKey = element.pattern;
        } else {
            urlKey = element["keywords"].join();
        }

        htmlContent += `
        <div class="tokenItem">
                Keyword / Pattern : ${urlKey} <br>
                <hr> Data : <br>
                <p>
                    ${data}
                </p>
                <hr>
                <button>Copy</button>
                <button  onclick="deleteToken(${count})">Delete</button>
            </div>
        `
        count++;




    });
    htmlContent = htmlContent == "" ? "<i>No Data</i>" : htmlContent;
    tokenContainerElement.innerHTML = htmlContent;
}



// show and hide add item form
let addDataFormContainer = document.getElementById("addDataFormContainer");

function showForm() {
    addDataFormContainer.style.display = "block";
}

function hideForm() {
    addDataFormContainer.style.display = "none";
}



// Changing form content based on radiobutton
let urlRadio = document.getElementById("urlPatternRadio");
let keywordPatternRadio = document.getElementById("keywordPatternRadio");

function changedURL() {
    document.getElementById("formChangeThis").innerHTML = `<label for="PatternTextBox">Enter Url pattern (Regex):</label>
    <input type="text" name="urlPattern" placeholder="Enter Pattern" id="PatternTextBox">
    `
}

function changedKeyWord() {
    document.getElementById("formChangeThis").innerHTML = `<label for="PatternTextBox">Enter Keywords(comma seperated):</label>
    <input type="text" name="keywords" placeholder="Enter Keywords" id="PatternTextBox">
    `
}

function clickedSubmit(params) {
    addToken();
    hideForm();
}


// addData function


function addToken() {
    let obj;
    if (urlRadio.checked) {
        obj = {
            "type": "url",
            "pattern": document.getElementById("PatternTextBox").value,
            "data": document.getElementById("tokenDataTextbox").value

        }

    } else {
        obj = {
            "type": "keywords",
            "keywords": document.getElementById("PatternTextBox").value.trim().replace(/,+$/, "").trim().split(",").map(function e(el) {
                return el.trim();
            }),
            "data": document.getElementById("tokenDataTextbox").value
        }
    }
    // console.log("HELLO");
    // console.log(inputBOX.value.split(","));
    tokenArray.push(obj);
}


// -------------BUTTON CLICK EVENTS

document.getElementById("ALLButton").addEventListener("click", (e) => {
    console.log("CLICKED ALL");
    updatTokenListShowAll(tokenArray)
});


document.getElementById("AddButton").addEventListener("click", (e) => {
    console.log("Clicked Add");
    showForm()
});

document.getElementById("urlPatternRadio").addEventListener("change", (e) => {
    console.log("Clicked urlPattern");
    changedURL();
});

document.getElementById("keywordPatternRadio").addEventListener("change", (e) => {
    console.log("Clicked keyword");
    changedKeyWord();
});

document.getElementById("SubmitButton").addEventListener("click", (e) => {
    console.log("Clicked Submit");
    clickedSubmit();
});
// -------------