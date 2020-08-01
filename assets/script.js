$(document).ready(function () {

    // Define Variables
    const runtime = document.querySelector("#runtime");

    const ratedR = document.querySelector("#ratedR");
    const ratedPG13 = document.querySelector("#ratedPG13");
    const ratedPG = document.querySelector("#ratedPG");
    const ratedG = document.querySelector("#ratedG");

    const action = document.querySelector("#action");
    const drama = document.querySelector("#drama");
    const comedy = document.querySelector("#comedy");
    const horror = document.querySelector("#horror");
    const kids = document.querySelector("#kids");

    const shuffleBtn = document.querySelector("#shuffleBtn");
    const pickCardBtn = document.querySelector("#pickCardBtn");
    const drawAgainBtn = document.querySelector("#drawAgainBtn");

    const runtimeModal = document.querySelector("#runtimeModal");
    const ratingModal = document.querySelector("#ratingModal");
    const genreModal = document.querySelector("#genreModal");
    const closeBtn1 = document.querySelector("#close1");
    const closeBtn2 = document.querySelector("#close2");
    const closeBtn3 = document.querySelector("#close3");

    const movieHeader = document.querySelector("#movie-header");
    const movieGrid = document.querySelector("#movie-grid");
    const result1 = document.querySelector("#result1");
    const result2 = document.querySelector("#result2");
    const result3 = document.querySelector("#result3");
    const result4 = document.querySelector("#result4");

    // Shuffles the deck of cards
    shuffleBtn.onclick = function () {
        shuffleBtn.style.display = "none";
        pickCardBtn.style.display = "block";
    }

    // Validate Rating & Genre Selection
    pickCardBtn.onclick = function () {
        shuffleCards();
        let runtimeLength = document.querySelector("#runtime").value;
        if (runtimeLength < 60 || runtimeLength > 240 || isNaN(runtimeLength)) {
            runtimeModal.style.display = "block";
        } else if (!ratedR.checked && !ratedPG13.checked && !ratedPG.checked && !ratedG.checked) {
            ratingModal.style.display = "block";
        } else if (!action.checked && !drama.checked && !comedy.checked && !horror.checked && !kids.checked) {
            genreModal.style.display = "block";
        } else runMovieSelection();
    };

    // When the user clicks on either close button (x), close the modal
    closeBtn1.onclick = function () {
        runtimeModal.style.display = "none";
    }
    closeBtn2.onclick = function () {
        ratingModal.style.display = "none";
    }
    closeBtn3.onclick = function () {
        genreModal.style.display = "none";
    }

    // Main function to create movie selection
    // 
    function runMovieSelection() {
        pickCardBtn.style.display = "none";
        drawAgainBtn.style.display = "block";
        movieHeader.style.display = "block";
        movieGrid.style.display = "block";
    }
    // Shuffle the Cards API
    const cardHolder = $(".cardHolder");
    function shuffleCards() {


        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
            method: "GET"
        })

            .then(function (getid) {
                var cardid = getid.deck_id;
                console.log(cardid);


                // Draw a Card API
                $.ajax({
                    url: "https://deckofcardsapi.com/api/deck/" + cardid + "/draw/?count=4",
                    method: "GET"
                })

                    .then(function (drawcard) {
                        console.log(drawcard)
                        cardHolder.each(function(choice){
                            const _this = $(this);
                            _this.find("#moviePoster").attr("src", drawcard.cards[choice].image);
                            choice++
                        })
                    })

            })

    }
    // WHO's READY FOR SOME JAVASCRIPT?!?!

    // query the card API - shuffle

    // query the card API - draw 4 cards

    // query movie API for genre IDs
    // https://api.themoviedb.org/3/genre/movie/list?api_key=8ae6662de0624eaf409751a739208381&language=en-US

    // gather the movie parameters

    // build the movie queryURL

    // query movie API according to the parameters

    // show the 4 cards

    // animate the 4 cards to "flip" and reveal the 4 movies




    // THIS IS WHERE I AM TRYING TO SORT OUT HOW TO QUERY THE 
    // MOVIE API ... YOU CAN MOSTLY IGNORE THIS FOR NOW. :-)

    // this is the URL to query movie API based on criteria
    let queryURL = "http://api.themoviedb.org/3/discover/movie?";

    // begin building an object to contain our API call's query parameters
    // set the API key
    let queryParams = { "api-key": "8ae6662de0624eaf409751a739208381" };

    // grab the runtime
    // note: this might not work - trying to figure out how to query for this
    // when the syntax is runtime=number
    queryParams.with_runtime = $("#runtime")
        .val();

    // grab the genre(s) - best way to collect more than one?
    // this is the URL for calling the genre list
    // https://api.themoviedb.org/3/genre/movie/list?api_key=8ae6662de0624eaf409751a739208381&language=en-US
    // would we then have to match genre name with list, then use the discover/movie url and plug
    // that number in?

    // with_genre = can take more than one value, separated by commas
    // so, maybe we build that string first?
    queryParams.with_genre = ("#")
        .val();

    // grab the rating(s) - best way to grab more than one?
    // &with_runtime.lte will give us all movies with runtime less than a given integer

    // have to include country in order to get certification info
    queryParams.certification_country = "US";

    queryParams.certification = $("#")
        .val();

    // log the URL so we can see it and troubleshoot
    // took this code from the NYT class exersize ... not sure how it works
    console.log("---------------\nURL: " + queryURL + "n---------------");
    console.log(queryURL = $.param(queryParams));
    return queryURL + $.param(queryParams);


    function showMovies(movieResults) {

        // set the number of cards/movies at 4
        const numMovies = 4;


        console.log(movieResults);
        console.log("---------------------------------");

        // loop through the results and build elements for the defined number of movies
        for (i = 0; i < numMovies; i++) {

            let movieOptions = movieResults.results[i];

            // increase the articleCount (track article number starting at 1)
            let movieCount = i + 1;

            // create area where results will be displayed - is this already done?

            // use movieOptions.title for a title
            // use movieOptions.overview for a description if we want to
            // use movieOptions.poster_path for movie poster
        }
    }

    // CLICK EVENT TO GET MOVIES
    $("#pickCardButton").on("click", function (event) {

        event.preventDefault();

        // empty the area where prior movies were displayed, if any
        clear();

        // build the query URL for the ajax request to the movie API
        let queryURL = buildQueryURL();

        // make request to the API 
        // the data then gets passed as an argument to the showMoview function
        $.ajax({
            url: queryURL,
            method: "GET"

        }).then(showMovies);

    });













});