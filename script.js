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
  episodeCount.innerHTML= `Displaying ${episodeList.length}/73 episodes`
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

    // assign the text content
    let epiNo= episode.number===10 ? episode.number : "0"+episode.number;
    episodeBtn.innerHTML=`${episode.name} - S0${episode.season} E${epiNo}`;
    episodeImg.setAttribute("src",episode.image.medium)
    episodeDescription.innerHTML=episode.summary;

    //Append the child element
    divEl.appendChild(episodeBtn);
    divEl.appendChild(episodeImg);
    divEl.appendChild(episodeDescription);
    rootElem.appendChild(divEl)
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

window.onload = setup();
