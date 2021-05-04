document.addEventListener('DOMContentLoaded', function() {
    var checkPageButton = document.getElementById('checkPage');
    checkPageButton.addEventListener('click', function() {
        chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
            let url = tabs[0].url;
            // use `url` here inside the callback because it's asynchronous!
            document.getElementById("urlHere").innerHTML = url;
            console.log(url);
        });

    }, false);
}, false);