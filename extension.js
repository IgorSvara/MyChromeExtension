const inputEl = document.getElementById("input-el")
const ulEl = document.getElementById("ul-el")

let links = []
// restore previous links stored in the local storage
restorePreviousLinks()

function restorePreviousLinks() {

    if (localStorage.getItem("links")) {
        links = JSON.parse(localStorage.getItem("links"))
        renderLinks()
    }
    if (localStorage.getItem("last_session")) {
        generateSession()
    }
}

//generate the p session and inserts it in the unordered list
function generateSession() {


    let session = localStorage.getItem("last_session")

    let anchorA = document.createElement("a")
    anchorA.href = ""

    anchorA.textContent = JSON.parse(session)[0]

    let anchorLi = document.createElement("li")
    anchorLi.append(anchorA)
    ulEl.append(anchorLi)


    anchorA.addEventListener("click", () => {
        session = localStorage.getItem("last_session")
        session = JSON.parse(session)

        // skip the first element because it's the time of save
        for (let i = 1; i < session.length; i++) {
            window.open(session[i], "_blank")
        }
    })

}

document.getElementById("input-btn").addEventListener("click", () => {
    let inputValue = inputEl.value
    if (inputValue) {
        let link = "https://" + inputValue
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
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        links.push(tabs[0].url)
        localStorage.setItem("links", JSON.stringify(links))
        renderLinks()
    })
})

document.getElementById("all-tabs-btn").addEventListener("click", () => {

    function normalizeDate(date) {
        return date.toString().length === 1 ? "0" + date : date;
    }

    const currentDate = new Date()
    const formattedDate = normalizeDate(currentDate.getDate()) + "/" + normalizeDate(currentDate.getMonth() + 1)
        + "/" + normalizeDate(currentDate.getFullYear()) + " - "
        + normalizeDate(currentDate.getHours()) + ":" + normalizeDate(currentDate.getMinutes())


    chrome.tabs.query({currentWindow: true}, (tabs) => {
        let lastSession = []
        lastSession.push(formattedDate)
        for (let i = 0; i < tabs.length; i++) {
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