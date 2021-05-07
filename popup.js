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
let url = null;
let currentArray = []

// get current url
// document.addEventListener("DOMContentLoaded", function() {
//     chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
//         let url = tabs[0].url;
//         // use `url` here inside the callback because it's asynchronous
//         print("URL LOADED")

//     });
// });

chrome.tabs.getSelected(null, function(tab) {
    url = tab.url;
});

// update/delete/copy token list 
function copyALL(number) {
    var el = document.getElementById(`ti${number}`).innerHTML;
    var fullLink = document.createElement('input');
    document.body.appendChild(fullLink);
    fullLink.value = el;
    console.log("HELLOW", el);
    fullLink.select();
    document.execCommand("copy", false);
    fullLink.remove();
}


function deleteToken(number) {
    delete tokenArray[number];
    tokenArray = tokenArray.filter(function(el) {
        return el != null;
    });
    updatTokenListShowAll(tokenArray)
    storeData()
}

function updatTokenListShowAll(obj) {
    let htmlContent = "";
    let count = 0;
    let tokenContainerElement = document.getElementById("tokenContainer");
    let callableList = [];

    obj.forEach(element => {
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
                <p id="ti${count}">${data}</p>
                <hr>
                <button id="cb${count}">Copy</button>
                <button id= "db${count}">Delete</button>
            </div>
        `
        callableList.push(
            function er(n) {
                idst = "db" + n;
                idcp = "cb" + n;


                document.getElementById(idst).addEventListener("click", (e) => {
                    deleteToken(n);
                });

                document.getElementById(idcp).addEventListener("click", (e) => {
                    copyALL(n);
                });
            }
        )
        count++;




    });


    htmlContent = htmlContent == "" ? "<i>No Data</i>" : htmlContent;
    tokenContainerElement.innerHTML = htmlContent;
    count = 0;
    callableList.forEach(element => {
        element(count);
        count++;
    });
}


function updatTokenListCurrent(obj) {
    let htmlContent = "";
    let count = 0;
    let tokenContainerElement = document.getElementById("tokenContainer");

    obj.forEach(element => {
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
    storeData()
}


// -------------BUTTON CLICK EVENTS

document.getElementById("ALLButton").addEventListener("click", (e) => {
    updatTokenListShowAll(tokenArray)
});


document.getElementById("AddButton").addEventListener("click", (e) => {
    showForm()
});

document.getElementById("urlPatternRadio").addEventListener("change", (e) => {
    changedURL();
});

document.getElementById("keywordPatternRadio").addEventListener("change", (e) => {
    changedKeyWord();
});

document.getElementById("SubmitButton").addEventListener("click", (e) => {
    clickedSubmit();
});

document.getElementById("CurrentButton").addEventListener("click", (e) => {
        updateCurrent();
        updatTokenListCurrent(currentArray);
    })
    // -------------

// searching tokenarray and make another currentArray



function updateCurrent() {
    currentArray = []
    tokenArray.forEach(element => {
        if (element.type == "url") {
            let reg = new RegExp(element.pattern);
            if (reg.test(url)) {
                currentArray.push(element);
            }
        } else {

        }
    });
    console.log("AFTER UDATE CURRENT ARRAY", currentArray);

}

// ------- Function to store and retrive objects
function getData() {
    tokenArray = JSON.parse(localStorage.getItem("tokenData"));
    if (tokenArray == null) {
        tokenArray = [];
        localStorage.setItem("tokenData", "[]");
    }
}

function storeData() {
    localStorage.setItem("tokenData", JSON.stringify(tokenArray));
}

// -------



getData()

setTimeout(() => {
    while (url == null);
    updateCurrent();
    updatTokenListCurrent(currentArray);
}, 1);