const inputEl = document.getElementById("input-el")
const ulEl = document.getElementById("ul-el")

let links = []
// restore previous links stored in the local storage
restorePreviousLinks()

function restorePreviousLinks() {

    if(localStorage.getItem("links")) {
        links = JSON.parse(localStorage.getItem("links"))
        renderLinks()
    }
    if(localStorage.getItem("last_session")) {
        generateSession()
    }
}

//generate the p session and inserts it in the unordered list
function generateSession() {
    let session = localStorage.getItem("last_session")
    if (session) {

        let anchorA = document.createElement("a")
        anchorA.href = ""

        let currentDate = new Date()
        anchorA.textContent = currentDate.getFullYear() + "/" + currentDate.getMonth()+1
            + "/" + currentDate.getDate() + " | "
            + currentDate.getHours() + ":" + currentDate.getMinutes()

        let anchorLi = document.createElement("li")
        anchorLi.append(anchorA)
        ulEl.append(anchorLi)


        anchorA.addEventListener("click", () => {
            let session = localStorage.getItem("last_session")
            if(session) {
                session = JSON.parse(session)
                console.log(session)

                // window.open("https://google.com", "chromeWindow1", "popup")
                // window.open("https://fast.com", "chromeWindow2", "_blank")
                for (let i = 0; i < 2; i++) {
                    window.open(session[i], "_blank")
                }
            }
        })

    }
}

document.getElementById("input-btn").addEventListener("click", () => {
    let inputValue = inputEl.value
    if (inputValue) {
        let link =  "https://" + inputValue
        links.push(link)

        renderLinks()
    }
})

document.getElementById("clr-local").addEventListener("click", () => {
    localStorage.clear()
    links = []
    ulEl.textContent = ""
})

document.getElementById("tab-btn").addEventListener("click", () => {
    chrome.tabs.query({active:true, currentWindow:true}, (tabs) => {
        links.push(tabs[0].url)
        localStorage.setItem("links", JSON.stringify(links))
        renderLinks()
    })
})

document.getElementById("all-tabs-btn").addEventListener("click", () => {
    chrome.tabs.query({currentWindow:true}, (tabs) => {
        let lastSession = []
        for(let i = 0; i < tabs.length; i++) {
            lastSession.push(tabs[i].url)
        }
        localStorage.setItem("last_session", JSON.stringify(lastSession))

        //add to links json the current date with link to
        generateSession()
    })
})


function renderLinks() {
    ulEl.textContent = ""
    for (let i = 0; i < links.length; i++) {
        const newListEl = document.createElement("li")
        const newAEl = document.createElement("a")
        newAEl.target = "_blank"

        newAEl.href = links[i]
        newAEl.textContent = links[i]

        newListEl.append(newAEl)
        ulEl.append(newListEl)
    }
    localStorage.setItem("links", JSON.stringify(links))
    inputEl.value = ""
}