const url = "https://randomuser.me/api/?results=12&nat=US";

//overview selectors
const grid = document.getElementById("grid");
const gridCards = document.getElementsByClassName("card");
const modalBackground = document.getElementById("modal-background");
const heading = document.querySelector("h1");

//popup selectors
const modal = document.getElementById("modal");
const next = document.getElementById("nextPerson");
const previous = document.getElementById("previousPerson");
const close = document.getElementById("close");

//Filter
const filter = document.getElementById("filter");
const names = document.getElementsByClassName("name");

//counters
let peopleList;
let index;
let tempIndex = 0;
let first = true;
let allCards = [];
let currentCards = [];allCards.filter(card => card.style.display !== "none");


document.addEventListener("DOMContentLoaded", ()=>{
  fetch(url)
    .then(data => data.json())
    .then(data => displayData(data))
    .then(data => addModal(data));

  closePopupListener();
  documentListener();
  addFilterListener();
});

//===========================================
      //Helper Methods
//===========================================
function displayData(data){
  peopleList = data.results;
  peopleList.forEach(person => {
    //create display card
    let card = document.createElement("div");
    card.className = "card";
    let html = `
      <img src=${person.picture.large}></img>
      <div>
        <h2 class="name">${person.name.first} ${person.name.last}</h2>
        <a href="mailto:${person.email}">${person.email}</a>
        <p>${person.location.city}</p>
      </div>
    `;
    card.innerHTML = html;
    //add card to dom
    grid.appendChild(card);
  }); //end forEach
  return peopleList;
} //end displayData

////////////////////////////////////////////////////////
//Modal
function addModal(personArray){
  nextProfileListener();
  previousProfileListener();
  for(let i = 0; i < gridCards.length; i++){
    gridCards[i].addEventListener("click", (e) => {
      tempIndex = 0;
      first = true;
      allCards = [];
      currentCards = [];
      index = i;
      modalBackground.style.display = "block";
      grid.style.filter = "blur(2px)";
      heading.style.filter = "blur(2px)";
      makeCardArray();
      currentCards = allCards.filter(card => card.style.display !== "none");
      createProfileDisplay(peopleList[i]);

    });
  }

}

function createProfileDisplay(person, index){
  let modalDetails = document.createElement("div");
  let longBirthday = new Date(person.dob.date);
  let birthMonth = longBirthday.getMonth();
  let birthDay = longBirthday.getDate();
  let birthYear = longBirthday.getFullYear();
  let shortBirthday = (birthMonth + 1) + " / "
                      + birthDay + " / "
                      + birthYear;
  let string = `
  <img src="${person.picture.large}">
  <h2>${person.name.first} ${person.name.last}</h2>
  <p><a href="mailto:${person.email}">${person.email}</a></p>
  <p>${person.location.city}</p>
  <hr>
  <p>${person.phone}</p>
  <p>${person.location.street},  ${person.location.state} ${person.location.postcode}</p>
  <p>Birthday:  ${shortBirthday}</p>
  `;

  modalDetails.innerHTML = string;
  modal.appendChild(modalDetails);
}

function nextProfileListener(){
  next.addEventListener("click", (e) => {

    if(first){
      tempIndex = currentCards.indexOf(allCards[index]);
      first = false;
    }
    modal.removeChild(modal.lastChild);
    if(tempIndex >= currentCards.length - 1){
      tempIndex = 0;
    }
    else if (tempIndex < currentCards.length -1){
      tempIndex++;
    }
    let x = allCards.indexOf(currentCards[tempIndex]);
    createProfileDisplay(peopleList[x]);
  }); // end event listener
}

function previousProfileListener(){
  previous.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    if(first){
      tempIndex = currentCards.indexOf(allCards[index]);
      first = false;
    }
    modal.removeChild(modal.lastChild);
    if(tempIndex === 0){
      tempIndex = currentCards.length - 1;
    }
    else {
      tempIndex--;
    }

    let x = allCards.indexOf(currentCards[tempIndex]);
    createProfileDisplay(peopleList[x]);
  });
}

function closePopupListener(){
  close.addEventListener("click", () => {
    closePopup();
  });
}

function documentListener(){
  document.addEventListener("click", (e) => {
    if(e.target.id === "modal-background"){
      closePopup();
    }
  });
}

function closePopup(){
  modal.removeChild(modal.lastChild);
  modalBackground.style.display = "none";
  grid.style.filter = "none";
  heading.style.filter = "none";
}

function makeCardArray(){
  for(let i = 0; i < gridCards.length; i++){
    allCards.push(gridCards[i]);
  }
}

////////////////////////////////////////////////////////////
//Filter
function addFilterListener(){
  let timingId = [];
  filter.addEventListener("keyup", () => {
    timingId.forEach(id => window.clearTimeout(id));
    let filterString = filter.value;
    for(let i = 0; i < names.length; i++){
      if(!names[i].textContent.includes(filterString)){
        let id;
        gridCards[i].style.transition = ".25s";
        gridCards[i].style.opacity = "0";
        id = setTimeout((card) => {
          card.style.display = "none";
        }, 250, gridCards[i]);
        timingId.push(id);
      }
      else if(names[i].textContent.includes(filterString)){
        gridCards[i].style.display = "flex";
        gridCards[i].style.transition = ".25s";
        gridCards[i].style.opacity = "1";
      }
    }
  }); //end event listener
}
