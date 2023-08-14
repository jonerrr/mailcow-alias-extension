export {}

chrome.runtime.onMessage.addListener( 
    function(request) {
        if (request.message === "copyText"){
        copyToClipboard(request.textToCopy);
            //TODO (maybe) create popup modal notifying user that text was copied
    }
    }
);

function copyToClipboard(text: string) {
    const el = document.createElement("textarea")
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
  }