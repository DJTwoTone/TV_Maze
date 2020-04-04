/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let showsArr = [];
  const showsList = await axios.get("http://api.tvmaze.com/search/shows", {
    params: {
      q: query
    }
  });

  //Build an array of shows matching the search
  const showsInfo = Object.values(showsList.data);
  for (let show of showsInfo) {
    const id = show.show.id;
    const name = show.show.name;
    const summary = show.show.summary;
    const image = imageLinkCheck(show.show.image);
    const showObj = { id, name, summary, image };
    showsArr.push(showObj);
  }
  return showsArr;

  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       "<p><b>The Bletchley Circle</b> follows the journey of four ordinary women with extraordinary skills that helped to end World War II.</p><p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their normal lives, modestly setting aside the part they played in producing crucial intelligence, which helped the Allies to victory and shortened the war. When Susan discovers a hidden code behind an unsolved murder she is met by skepticism from the police. She quickly realises she can only begin to crack the murders and bring the culprit to justice with her former friends.</p>",
  //     image:
  //       "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ];
}

//function to check if the show has images

function imageLinkCheck(val) {
  if (val === null) {
    return "https://tinyurl.com/tv-missing";
  } else {
    return val.original;
  }
}
/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src="${show.image}">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary episodes" data-show-id="${show.id}">Episodes</button>
             
           </div>
         </div>
       </div>
      `
    );
    // btnListener();

    $showsList.append($item);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  // $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  const url = `http://api.tvmaze.com/shows/${id}/episodes`;
  const res = await axios.get(url);
  populateEpisodes(res.data);
}
//make a list of episodes
function populateEpisodes(arr) {
  console.log(arr);
  arr.forEach(function(episode) {
    const airdate = episode.airdate;
    const title = episode.name;
    const season = episode.season;
    const number = episode.number;
    const episodeInfo = `On ${airdate}: ${title} aired. S${season}E${number}`;
    console.log(episodeInfo);
    const $epUl = $("#episodes-list");
    const $epLi = $("<li>").text(episodeInfo);
    $epUl.append($epLi);
  });
}

$(document).on("click", ".episodes", function(e) {
  console.log(e.target.dataset.showId);
  getEpisodes(e.target.dataset.showId);
});
