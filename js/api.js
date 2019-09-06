const url = "https://randomuser.me/api/?results=12&nat=US";
const grid = document.getElementById("grid");
const gridCards = document.getElementsByClassName("card");

document.addEventListener("DOMContentLoaded", ()=>{
  fetch(url)
    .then(data => data.json())
    .then(data => displayData(data))
    .then(data => addModal(data));
});

//===========================================
      //Helper Methods
//===========================================
function displayData(data){
  const peopleList = data.results;
  peopleList.forEach(person => {
    //create display card
    let card = document.createElement("div");
    card.className = "card";
    let html = `
      <img src=${person.picture.large}></img>
      <div>
        <h2>${person.name.first} ${person.name.last}</h2>
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

function addModal(personArray){
  const peopleList = personArray;
  //const gridCardsArray = gridArray();
  for(let i = 0; i < gridCards.length; i++){
    gridCards[i].addEventListener("click", () => {
      console.log(peopleList[i]);
      let modal = document.createElement("div");
      let html =
      `<p>${peopleList[i].name.first}</p>`;
      modal.innerHTML = html;
      grid.appendChild(modal);
    });
  }
}
