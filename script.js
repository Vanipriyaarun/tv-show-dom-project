//You can edit ALL of the code here
let allEpisodes;
let allShows;
const navEl=document.getElementById("nav");
function setup() {
   fetch("http://api.tvmaze.com/shows")
  .then ((response)=>response.json())
  .then((data)=>{
    console.log(data);
    allShows=data;
    createShowSelectInput();
    makePageForShows(allShows);
  })
}
 
//Create "live" search input (shows)

const searchShowInput=document.getElementById("searchInput");
let filteredShow;
searchShowInput.addEventListener("keyup",searchShow);
function searchShow(e){
const searchString=e.target.value.toUpperCase();
filteredShow=allShows.filter(show=>{
  return (show.name.toUpperCase().includes(searchString) ||  show.summary.toUpperCase().includes(searchString) ||show.genres.map(element=>{
    return element.toUpperCase();
    }).includes(searchString));
})
makePageForShows(filteredShow);
createFilteredShowSelectInput(filteredShow);
}


// Create  "live" search input (episodes)

const searchEpisodeInput=document.getElementById("searchInput");
function searchEpisode(e){
const searchStringEpi=e.target.value.toUpperCase();
const filteredEpi=allEpisodes.filter(episode=>{
    return (episode.name.toUpperCase().includes(searchStringEpi) ||  episode.summary.toUpperCase().includes(searchStringEpi));
})
makePageForEpisodes(filteredEpi);
deleteChild("select");
navEl.removeChild(filteredShowSelect);
}


//Create Page for Episode 

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.className="rootContainer";
  rootElem.textContent = ""
  const episodeCount= document.getElementById("episodeCount");
  episodeCount.innerHTML= `Displaying ${episodeList.length}/${allEpisodes.length} episodes`;
  //create select input
  const selectEl=document.getElementById("episodeOptions");
  const allEpiOption=document.createElement("option");
  allEpiOption.value="allEpisode";
  allEpiOption.innerHTML="All Episodes";
  selectEl.appendChild(allEpiOption)

  episodeList.forEach(episode=>{
    //create body element
    const divEl=document.createElement("div");
    divEl.className="container";
    const episodeBtn=document.createElement("div");
    episodeBtn.className="episodeButton";
    const episodeImg=document.createElement("img");
    episodeImg.className="episodeImg";
    const episodeDescription=document.createElement("p");
    episodeDescription.className="episodeDescription";
    //create option element
    const optionEl=document.createElement("option");
    
    // assign the text content
    let epiNo= episode.number>=10 ? episode.number : "0"+episode.number;
    episodeBtn.innerHTML=`${episode.name} - S0${episode.season} E${epiNo}`;
    episodeImg.src=episode.image.medium;
    episodeDescription.innerHTML=episode.summary;
    optionEl.innerHTML=`S0${episode.season} E${epiNo} - ${episode.name}`;
    optionEl.value=episode.id;

    //Append the child element
    divEl.append(episodeBtn,episodeImg,episodeDescription);
    rootElem.appendChild(divEl);
    selectEl.appendChild(optionEl)

    //Truncate long summaries and provide a "... read more...button
    if(episodeDescription.textContent.length>200){
      let episodeTruncated = episodeDescription.textContent.substring(0, 200)
      let epiMoreText=episodeDescription.textContent.substring(100,episodeDescription.textContent.length)
      episodeDescription.innerHTML = `<p>${episodeTruncated}<span class='textMore'>${epiMoreText}</span></p>`;
      const epiReadMoreBtn=document.createElement("button");
      epiReadMoreBtn.className="readMoreBtn";
      epiReadMoreBtn.innerHTML="Read More";
      episodeDescription.appendChild(epiReadMoreBtn);
      epiReadMoreBtn.addEventListener('click',(e)=>{
        episodeDescription.classList.toggle('showMore');
        if(epiReadMoreBtn.innerText==="Read More"){
          epiReadMoreBtn.innerText="Read Less";
        }else{
          epiReadMoreBtn.innerText="Read More";
        }
      })
    }
  }) 
  searchEpisodeInput.addEventListener("keyup",searchEpisode);
  searchShowInput.addEventListener("keyup",searchShow);
}

//Add EventListeners to Select Input(episodes)

let selectElem=document.getElementById("episodeOptions");
let divElem=document.getElementById("root");
selectElem.addEventListener("input",selectEpisode);
function selectEpisode(e){
  let selectValue=e.target.value;
  if(selectValue==="allEpisode"){
    deleteChild("root")
    makePageForEpisodes(allEpisodes);
    showSelectElem.addEventListener("input",selectShow);
  }
  else if(selectValue!="allEpisode"){
    let selectedEpi = allEpisodes.filter((episode) => {
      return selectValue == episode.id
    });
    deleteChild("root")
    makePageForEpisodes(selectedEpi); 
    showSelectElem.addEventListener("input",selectShow);
  } 
  deleteChild("select");
  navEl.removeChild(filteredShowSelect);
}

//Create Page for TVshows List

function makePageForShows(showList){
  const showRootElem = document.getElementById("root");
  showRootElem.classList.remove('rootContainer')
  showRootElem.textContent = ""
  const showCount= document.getElementById("episodeCount");
  showCount.innerHTML= `Displaying ${showList.length}/${allShows.length} shows`;

  showList.forEach(show=>{
    //create body element
    const showDivEl=document.createElement("div");
    showDivEl.className="showContainer";
    const secondDivEl=document.createElement("div");
    secondDivEl.className="secondContainer";
    const showName=document.createElement("div");
    showName.className="showButton";
   
    const showImg=document.createElement("img");
    showImg.classList.add("showImg")
    const showDescription=document.createElement("p");
    showDescription.className="showDescription";
    const listElem=document.createElement("ul");
    listElem.className="innerContainer";
    
    
    // assign the text content
    showName.innerHTML=show.name;
    showImg.src=show.image.medium;
    showDescription.innerHTML=show.summary;
    listElem.innerHTML=`
      <li><b>Rated:</b> ${show.rating.average}</li>
      <li><b>Genres:</b> ${show.genres.join(" | ")}</li>
      <li><b>Status:</b> ${show.status}</li>
      <li><b>Runtime:</b> ${show.runtime}</li>`;

    // Add Cast List for each show
     const selectCast=document.createElement('select');
    selectCast.className='selectCast';
    const option=document.createElement('option');
    option.textContent="Cast List";
    selectCast.appendChild(option);
    let showUrl=`http://api.tvmaze.com/shows/${show.id}?embed=cast`
    fetch(showUrl)
    .then ((response)=>response.json())
    .then((data)=>{
      let cast=data._embedded.cast;
      cast.forEach(elem => {
        let optionCastName=document.createElement('option')
        optionCastName.textContent=elem.person.name;
        selectCast.appendChild(optionCastName);
      });
    })

    //Append child element
    secondDivEl.append(showName,showImg,showDescription,listElem,selectCast);
    showDivEl.appendChild(secondDivEl);
    showRootElem.appendChild(showDivEl);

    //Truncate long summaries and provide a "... read more... button
    if(showDescription.textContent.length>500){
      let truncated = showDescription.textContent.substring(0, 500)
      let moreText=showDescription.textContent.substring(500,showDescription.textContent.length)
      showDescription.innerHTML = `<p>${truncated}<span class='textMore'>${moreText}</span></p>`;
      const readMoreBtn=document.createElement("button");
      readMoreBtn.className="readMoreBtn";
      readMoreBtn.innerHTML="Read More";
      showDescription.appendChild(readMoreBtn);
      readMoreBtn.addEventListener('click',(e)=>{
        showDescription.classList.toggle('showMore');
        if(readMoreBtn.innerText==="Read More"){
          readMoreBtn.innerText="Read Less";
        }else{
          readMoreBtn.innerText="Read More";
        }
      })
    }
  }) 
}

//Add EventListeners to Select Input(TVshows)

let showSelectElem=document.getElementById("showOptions");
showSelectElem.addEventListener("input",selectShow);
function selectShow(e){
  let showSelectValue=e.target.value;
  if(showSelectValue==="allShow"){
    deleteChild("episodeOptions");
    window.location.reload();
  }
  else if(showSelectValue!="allShow"){
    let selectedShow = allShows.filter((show) => {
      return showSelectValue == show.id  
    });

    // Add Cast List to Episode Listing
    deleteChild("filterOpt-Container");
    const filterOptDiv=document.getElementById('filterOpt-Container');
    const selectEpiCast=document.createElement('select');
    selectEpiCast.className='selectCast';
    selectEpiCast.id='selectEpiCast';
    const castOption=document.createElement('option');
    castOption.textContent="Cast List";
    selectEpiCast.appendChild(castOption);
    let castUrl=`http://api.tvmaze.com/shows/${showSelectValue}?embed=cast`;
    console.log(selectedShow[0].id)
    fetch(castUrl)
    .then ((response)=>response.json())
    .then((data)=>{
      let cast=data._embedded.cast;
      cast.forEach(elem => {
        let optionCastName=document.createElement('option')
        optionCastName.textContent=elem.person.name;
        selectEpiCast.appendChild(optionCastName);
        filterOptDiv.appendChild(selectEpiCast)
      });
    })
    
    const showUrl=`${selectedShow[0]._links.self.href}/episodes`;
    fetch(showUrl)
    .then ((response)=>response.json())
    .then((data)=>{
      allEpisodes=data;
      deleteChild("episodeOptions");
      makePageForEpisodes(allEpisodes);
    })
  } 
  navEl.removeChild(filteredShowSelect);
}

//Home button

let homeBtn=document.getElementById("home-Btn");
homeBtn.addEventListener('click',()=>{
  window.location.reload();
})

// Delete Child Element

function deleteChild(id) {
  let child = document.getElementById(id).lastElementChild; 
  while (child) {
    document.getElementById(id).removeChild(child);
    child = document.getElementById(id).lastElementChild;
   }
}

// Sort the Select Input (TVShows) in  alphabetical order

function createShowSelectInput(){
  const showSelectElem=document.getElementById("showOptions");
  allShows.sort(function (a, b) {
    return a.name.toUpperCase() < b.name.toUpperCase() ? -1 : a.name.toUpperCase() > b.name.toUpperCase() ? 1 : 0;
  });
  allShows.forEach(show=>{
    const showOptionEl=document.createElement("option");
    showOptionEl.innerHTML=show.name;
    showOptionEl.value=show.id;
    showSelectElem.appendChild(showOptionEl);
  })
}

// Filtered Show list(select input)

const filteredShowSelect=document.createElement("select");
filteredShowSelect.setAttribute("id","select");
function createFilteredShowSelectInput(){
  filteredShowSelect.innerHTML=`<option>Filtered Show List</option>`
  filteredShow.forEach(show=>{
    const showOptionElem=document.createElement("option");
    showOptionElem.innerHTML=show.name;
    showOptionElem.value=show.id;
    filteredShowSelect.appendChild(showOptionElem);
  })
  navEl.appendChild(filteredShowSelect);
  let filteredShowSelectElem=document.getElementById("select");
  filteredShowSelectElem.addEventListener("input",selectShow);
}

// show list sorted by rating (highest rated shows first)
const sortBtn=document.getElementById("sortBtn")
sortBtn.addEventListener('click',(e)=>{
  allShows.sort(function (a, b) {
    return a.rating.average > b.rating.average ? -1 : a.rating.average < b.rating.average ? 1 : 0;
  });
  makePageForShows(allShows);
})

window.onload = setup();
