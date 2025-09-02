let q = document.querySelector('#q');
let region = document.querySelector('#country');
let btn = document.querySelector("#clear-btn");
let resultCount = document.querySelector("#count");
let apistatus = document.querySelector("#apiStatus");
let rows = document.querySelector("#rows");

let typingTimer ;

q.addEventListener('input', async ()=> {
    clearTimeout(typingTimer)
    reset();
    typingTimer = setTimeout(()=> {
        getinfo(q.value, region.value);
    },300);
})

btn.addEventListener('click', () => {
    reset();
    q.value = "";
    region.value = "";
})

function reset() {
    rows.innerHTML = "";
    resultCount.innerHTML = "0 Results"
    apistatus.classList.remove("warn");
}


let controller;

async function getinfo(query, region) {
    if(!query.trim()) {
        apistatus.innerText = "";
        reset();
        return;
    };

    if(controller) controller.abort();
    controller = new AbortController();

    if(!region) region ="";
    const api = "pages/api/universities";
    const url = api + "?name=" + encodeURIComponent(query) + "&country=" + encodeURIComponent(region);
    
    try {
        apistatus.innerText = "Loading...";
        let result = await fetch(url, { signal: controller.signal });
        let info =  await result.json();
        apistatus.innerText = "";

        addData(info);
    } catch (err) {
        if(err.name == "AbortError") return ;
        apistatus.innerText = "No Data Found";
        apistatus.classList.add("warn");
        console.log(err);
    }
    
}

function addData(data) {
    resultCount.innerText = data.length + " Results";
    for(d of data) {
        let tr = document.createElement('tr');
        let name = document.createElement('td');
        name.innerHTML = `<strong>${d.name}</strong>`;
        let country = document.createElement('td');
        country.innerText = d.country
        country.classList.add("muted");
        let state = document.createElement('td');
        state.innerText = d["state-province"] == null ? "--" : d["state-province"];
        state.classList.add("muted")
        let website = document.createElement('td');
        website.innerHTML = `<a href="${d.web_pages[0]}">${d.web_pages[0].slice(0,d.web_pages[0].length-1)}</a>`
        tr.append(name, country, state, website);
        rows.append(tr);
    }

}

