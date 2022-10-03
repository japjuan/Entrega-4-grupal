
let moviesData = []


let getJSONData = function(url){
    let result = {};
    return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok';
          result.data = response;
          return result;
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error;
        return result;
    });
}

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData("https://japceibal.github.io/japflix_api/movies-data.json").then(function(resultObj){
        if (resultObj.status === "ok")
        {
            moviesData = resultObj.data;
        }
    });
});

function search(){
    document.getElementById("lista").innerHTML = "" ;
    const searchTerm = document.getElementById("inputBuscar").value.toLowerCase()
    
    for(let i = 0; i < moviesData.length; i++){
        let movieGenres = ""
        const movie = moviesData[i]
        
        for(const genre of movie.genres){
            movieGenres += " " + genre.name
        }

        if(movie.title.toLowerCase().includes(searchTerm) || movieGenres.toLowerCase().includes(searchTerm) || movie.tagline.toLowerCase().includes(searchTerm) || movie.overview.toLowerCase().includes(searchTerm) ){
            showMovie(movie, i)
        }
    }
}

 function showMovie(movieObject, movieIndex){
    let htmlContentToAppend = "";
    const estrellas = showStars(Math.round(movieObject.vote_average / 2))

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action bg-dark" type="button"  data-bs-toggle="offcanvas" data-bs-target="#movieInfoCanvas" id="`+ movieIndex +`" onclick="showContainer(this)">
            <div class="row">
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <div class="mb-1">
                        <p class="movie-title">`+ movieObject.title + `</p> 
                        <small class="movie-tagline">` + movieObject.tagline + `</small> 
                        </div>
                        <div>` + estrellas + `</div>
                    </div>

                </div>
            </div>
        </div>
        `
        document.getElementById("lista").innerHTML += htmlContentToAppend;


    }

/**
 * Returns the Bootstrap stars specified by the argument.
 * @param {Number} starsNum
 * @returns {String} Bootstrap stars specified by the argument.
 */
function showStars(starsNum){
    let stars =""

    for(let i=0; i < 5; i++){
        starsNum > i ? stars += '<span class="fa fa-star checked"></span>' : stars += '<span class="fa fa-star fa_custom"></span>'}

    return stars
    }

function showContainer(movieDiv){
    let htmlContentToAppend = ""
    const movieObj = moviesData[movieDiv.id]
    let movieGenres = ""
    
    for(const genre of movieObj.genres){
        movieGenres += " - " + genre.name
    }
    
    htmlContentToAppend += `
    <div class="offcanvas-header">
        <h1 class="offcanvas-title">` + movieObj.title  + `</h1>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
        <p>` + movieObj.overview +`</p>
        <hr class="solid">
        <small class="text-muted">` + movieGenres + `</small>
        <div class="dropdown-center">
        
        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        More
        </button>
        <ul class="dropdown-menu">
            <li><a class="dropdown-item">Year: ` + movieObj.release_date.slice(0, 4) + `</a></li>
            <li><a class="dropdown-item">Runtime: ` + movieObj.runtime+ ` mins</a></li>
            <li><a class="dropdown-item">Budget: $` + movieObj.budget+ `</a></li>
            <li><a class="dropdown-item">Revenue: $` + movieObj.revenue+ `</a></li>
        </ul>

        </div>
    </div> 
    </div>
    `
    document.getElementById("movieInfoCanvas").innerHTML = htmlContentToAppend;
}