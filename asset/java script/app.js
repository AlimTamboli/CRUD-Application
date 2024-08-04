
const cl = console.log;

const postform = document.getElementById("postform");
const titleinputcontrol = document.getElementById("titleinputcontrol");
const contentinputcontrol = document.getElementById("contentinputcontrol");
const userid = document.getElementById("userid");
const cardcontainer = document.getElementById("cardcontainer");
const additemsbtn = document.getElementById("additemsbtn");
const updateitemsbtn = document.getElementById("updateitemsbtn");
const loader = document.getElementById("loader");

const baseurl = "https://jsonplaceholder.typicode.com";

const posturl = `${baseurl}/posts`;

const fetchapi = () => {
    loader.classList.remove('d-none');

    let xhr = new XMLHttpRequest();

    xhr.open("GET", posturl, true);

    xhr.send();

    xhr.onload = () => {
         if(xhr.status >= 200 && xhr.status < 300){
            let data = JSON.parse(xhr.response);
            // createcards
            createcards(data);
            loader.classList.add('d-none');
        }
    }
}

fetchapi();

const createcards = (arr) => {
    cardcontainer.innerHTML = arr.map(obj => {
        return `<div class="card mb-2" id="${obj.id}">
        <div class="card-header">
            <h2>${obj.title}</h2>
        </div>
        <div class="card-body">
            <p>${obj.body}</p>
        </div>
        <div class="card-footer d-flex justify-content-between">
            <button class="btn btn-primary" onClick="Oneditpost(this)">Edit</button>
            <button class="btn btn-danger" onClick="Ondeletepost(this)">Delete</button>
        </div>
    </div>`
    }).join("");
}

const insertcard = (obj) => {
    let div = document.createElement("div");
    div.className = "card mb-2";
    div.id = obj.id;
    div.innerHTML =`<div class="card-header">
                        <h2>${obj.title}</h2>
                    </div>
                    <div class="card-body">
                        <p>${obj.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button class="btn btn-primary" onClick="Oneditpost(this)">Edit</button>
                        <button class="btn btn-danger">Delete</button>
                    </div>`
    cardcontainer.append(div);
}

const insertcardapi = (obj) => {
    loader.classList.remove("d-none");

    let xhr = new XMLHttpRequest();

    xhr.open("POST",posturl);

    xhr.send(JSON.stringify(obj));

    xhr.onload = () => { 
        if(xhr.status >= 200 && xhr.status < 300){
            loader.classList.remove("d-none");
            obj.id = JSON.parse(xhr.response).id;
            insertcard(obj);   
        }loader.classList.add("d-none");
    }
}

const Oneditpost = (eve) => {
    let editid = eve.closest(".card").id;

    localStorage.setItem("editid",editid);

    let editurl = `${baseurl}/posts/${editid}`;

    loader.classList.remove("d-none");

    let xhr = new XMLHttpRequest();

    xhr.open("GET",editurl,true);

    xhr.send();

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300){
            let data = JSON.parse(xhr.response);           
            titleinputcontrol.value = data.title;
            contentinputcontrol.value = data.body;
            userid.value = data.userId;
            additemsbtn.classList.add("d-none");
            updateitemsbtn.classList.remove("d-none");
        }loader.classList.add("d-none");
    }
}






const Onsumbitpostform = (eve) => {
    eve.preventDefault();
    let obj = {
        title : titleinputcontrol.value,
        content : contentinputcontrol.value,
        userid : userid.value
    }
    insertcardapi(obj);
}

const Onupdatebtn = () => {
    let updateid = localStorage.getItem("editid");

    let updateurl = `${baseurl}/posts/${updateid}`;

    let updatedobj = {
        updatedtitle : titleinputcontrol.value,
        updatedbody : contentinputcontrol.value,
        updatedusedid : userid.value
    }
    loader.classList.remove("d-none");
    let xhr = new XMLHttpRequest();

    xhr.open("PATCH",updateurl);

    xhr.send(JSON.stringify(updatedobj));

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300){
            let card = [...document.getElementById(updateid).children];
            card[0].innerHTML = `<h2>${updatedobj.updatedtitle}</h2>`;
            card[1].innerHTML = `<p>${updatedobj.updatedbody}</p>`;
            updateitemsbtn.classList.add("d-none");
            additemsbtn.classList.remove("d-none");
            postform.reset();
        }loader.classList.add("d-none");
    }
}

const Ondeletepost = (eve) => {
    let deleteid = eve.closest(".card").id;

    let deleteurl = `${baseurl}/posts/${deleteid}`;

    loader.classList.remove("d-none");

    let xhr = new XMLHttpRequest();

    xhr.open("DELETE", deleteurl);

    xhr.send()

    xhr.onload = () => {
        if(xhr.status >= 200 && xhr.status < 300){
            let card = document.getElementById(deleteid);
            card.remove();
        }loader.classList.add("d-none");
    }
}

postform.addEventListener("submit", Onsumbitpostform);
updateitemsbtn.addEventListener("click", Onupdatebtn);