//You can edit ALL of the code here
let allEpisodes;
function setup() {
  allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.textContent = ""
  const episodeCount= document.getElementById("episodeCount");
  episodeCount.innerHTML= `Displaying ${episodeList.length}/73 episodes`;
  //create select input
  const selectEl=document.getElementById("episodeOptions");

  episodeList.forEach(episode=>{
    
    //create body element
    const divEl=document.createElement("div");
    divEl.classList.add("container")
    const episodeBtn=document.createElement("button");
    episodeBtn.classList.add("episodeButton")
    const episodeImg=document.createElement("img");
    episodeImg.classList.add("episodeImg")
    const episodeDescription=document.createElement("p");
    episodeDescription.classList.add("episodeDescription")
    //create option element
    const optionEl=document.createElement("option");
    optionEl.classList.add("optionElement")

    // assign the text content
    let epiNo= episode.number===10 ? episode.number : "0"+episode.number;
    episodeBtn.innerHTML=`${episode.name} - S0${episode.season} E${epiNo}`;
    episodeImg.setAttribute("src",episode.image.medium)
    episodeDescription.innerHTML=episode.summary;
    optionEl.innerHTML=`S0${episode.season} E${epiNo} - ${episode.name}`;
    optionEl.value=episode.id;

    //Append the child element
    divEl.appendChild(episodeBtn);
    divEl.appendChild(episodeImg);
    divEl.appendChild(episodeDescription);
    rootElem.appendChild(divEl);
    selectEl.appendChild(optionEl)
  })
}

// Create Live Search 
const searchInput=document.getElementById("searchInput");
searchInput.addEventListener("keyup",(e)=>{
const searchString=e.target.value.toUpperCase();
const filteredEpi=allEpisodes.filter(episode=>{
    return (episode.name.toUpperCase().includes(searchString) ||  episode.summary.toUpperCase().includes(searchString));
})
makePageForEpisodes(filteredEpi)
})

//Add EventListeners to Select Input
let selectElem=document.getElementById("episodeOptions");
let divElem=document.getElementById("root");
selectElem.addEventListener("input",(e)=>{
  let selectValue=e.target.value;
  if(selectValue==="allEpisode"){
    makePageForEpisodes(allEpisodes);
    divElem.classList.remove('newContainer');
    divElem.classList.add("rootContainer");
   }
   else if(selectValue!="allEpisode"){
       let selectedEpi = allEpisodes.filter((episode) => {
       return selectValue == episode.id
     });
     makePageForEpisodes(selectedEpi);
     divElem.classList.remove("rootContainer");
     divElem.classList.add('newContainer') 
   } 
 })

window.onload = setup();
