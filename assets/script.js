$(document).ready(function () {

    // Define Variables
    const ratedR = $("#ratedR");
    const ratedPG13 = $("#ratedPG13");
    const ratedPG = $("#ratedPG");
    const ratedG = $("#ratedG");

    const action = $("#action");
    const drama = $("#drama");
    const comedy = $("#comedy");
    const horror = $("#horror");
    const family = $("#family");
    const romance = $("#romance");

    let cardid;

    // Shuffles the deck of cards
    $("#shuffleBtn").on("click", function () {
        $("#shuffleBtn").hide();
        $("#pickCardBtn").show();
        // Showing 2 ways to achieve same result
        $("#runtimeBlock").show();
        $("#ratingBlock").show();
        $("#genreBlock").attr("class", "fieldset center-icons");
    });

    // Draws new cards
    $("#drawAgainBtn").on("click", function () {
        drawAgain();
    });

    //Allows user to only choose 1 rating
    // Cited:   https://stackoverflow.com/questions/9709209/html-select-only-one-checkbox-in-a-group
    $(".selectOne").on("change", function () {
        $(".selectOne").not(this).prop("checked", false);
    });
    $(".chooseOne").on("change", function () {
        $(".chooseOne").not(this).prop("checked", false);
    });

    let runtimeLength;
    // Validate Rating & Genre Selection
    $("#pickCardBtn").on("click", function () {
        runtimeLength = $("#runtime").val();
        if (runtimeLength < 90 || runtimeLength > 240 || isNaN(runtimeLength)) {
            $("#runtimeModal").show();
        } else if (!ratedR.prop("checked") && !ratedPG13.prop("checked") && !ratedPG.prop("checked") && !ratedG.prop("checked")) {
            $("#ratingModal").show();
        } else if (!action.prop("checked") && !drama.prop("checked") && !comedy.prop("checked") && !horror.prop("checked") && !family.prop("checked") && !romance.prop("checked")) {
            $("#genreModal").show();
        } else shuffleCards();
    });

    // Run movie selection when cards are clicked
    $(document).on("click", '.moviePoster', function (event) {
        event.preventDefault();
        runMovieSelection();
        $(".showRating").css("display", "block");
        $(".showLength").css("display", "block");
        $(".title").css("display", "block");
        $(".summary").css("display", "block");
    });

    // When the user clicks on either close button (x), close the modal
    $("#close1").on("click", function () {
        $("#runtimeModal").hide();
    });
    $("#close2").on("click", function () {
        $("#ratingModal").hide();
    });
    $("#close3").on("click", function () {
        $("#genreModal").hide();
    });

    // Shuffle the Cards API
    const cardHolder = $(".cardHolder");
    function shuffleCards() {

        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
            method: "GET"
        })
            .then(function (getid) {
                cardid = getid.deck_id;
                // Draw a Card API
                $.ajax({
                    url: `https://deckofcardsapi.com/api/deck/${cardid}/draw/?count=4`,
                    method: "GET"
                })
                    .then(function (drawcard) {
                        cardHolder.each(function (choice) {
                            const _this = $(this);
                            _this.find(".moviePoster").attr("src", drawcard.cards[choice].image);
                            choice++;
                        });
                        $("#pickCardBtn").hide();
                        $("#drawAgainBtn").show();
                        $("#movie-header").show();
                        $("#movie-grid").show();
                    });
            });
    }

    // Draw again function
    function drawAgain() {
        event.preventDefault();
        $(".showRating").css("display", "none");
        $(".showLength").css("display", "none");
        $(".title").css("display", "none");
        $(".summary").css("display", "none");
        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/" + cardid + "/draw/?count=4",
            method: "GET"
        })
            .then(function (drawcard) {
                if (drawcard.remaining > 0) {
                    cardHolder.each(function (choice) {
                        const _this = $(this);
                        _this.find(".dontClick").attr("src", drawcard.cards[choice].image).addClass("animate__animated animate__flip moviePoster").removeClass("dontClick");
                        choice++;
                    });
                } else {
                    $(".dontClick").hide();
                    $("#drawAgainBtn").addClass("alert white").removeClass("warning").text("Go for a walk!");
                    $(".moviePoster").hide();
                }
            });
    }

    // Array to allow for differing selections of movies on re-draw
    let randomArray = ["popularity.desc", "revenue.desc", "release_date.desc", "vote_count.desc", "vote_average.desc", "primary_release_date.desc", "original_title.desc", "release_date.asc", "revenue.asc", "vote_average.asc", "vote_count.asc", "primary_release_date.asc", "original_title.asc"];
    let sortByIndex = 0;

    function runMovieSelection() {
        
        // build queryURL
        let apiKey = "8ae6662de0624eaf409751a739208381";

        let queryURL = `http://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&certification_country=US&sort_by=${randomArray[sortByIndex]}`;
        if (sortByIndex == randomArray.length - 1) {
            sortByIndex = 0;
        } else {
            sortByIndex++;
        }

        let certifications = "";

        // build the ratings section of the queryURL
        $(".certifications").each(function (rating) {
            if (ratedR.prop("checked")) {
                certifications += "|R";
            }
            if (ratedPG13.prop("checked")) {
                certifications += "|PG-13";
            }
            if (ratedPG.prop("checked")) {
                certifications += "|PG";
            }
            if (ratedG.prop("checked")) {
                certifications += "|G";
            }
            rating++;
        });

        let genre = "";
        // build the genre section of the queryURL
        $(".genre-selection").each(function (type) {
            if (action.prop("checked")) {
                genre += "|28";
            }
            if (drama.prop("checked")) {
                genre += "|18";
            }
            if (comedy.prop("checked")) {
                genre += "|35";
            }
            if (horror.prop("checked")) {
                genre += "|27";
            }
            if (family.prop("checked")) {
                genre += "|10751";
            }
            if (romance.prop("checked")) {
                genre += "|10749";
            }
            type++;
        });

        queryURL += "&certification=" + certifications.slice(1) + "&with_genres=" + genre.slice(1) + "&with_runtime.lte=" + runtimeLength;
        // Call the movie API with user input
        $.ajax({
            url: queryURL,
            method: "GET"
        })
            // Get title, movie blurb, poster URL
            .then(function (moviedata) {
                // This loop grabs top 4 movies in the list - they are ranked by popularity
                cardHolder.each(function (i, childElm) {

                    // Set variable for title
                    let movieTitle = moviedata.results[i].title;

                    // Set variable for movie blurb
                    let movieBlurb = moviedata.results[i].overview;

                    // Set variable for title
                    let moviePoster = moviedata.results[i].poster_path;

                    // Set movieId variable to be used in the next API call
                    let movieId = moviedata.results[i].id;

                    // Create the URL for a new call to the API using movieId
                    let ratingURL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=release_dates`;
                    let usaRating;
                    let runTime;
                    if (!moviePoster){
                        $(childElm).find('.moviePoster').attr("src", 'https://www.virginmediastore.com/media/tile-placeholder-poster.2769cb5f.png').addClass("animate__animated animate__flip dontClick").removeClass("moviePoster");
                    } else {
                        $(childElm).find('.moviePoster').attr("src", 'https://image.tmdb.org/t/p/w500' + moviePoster).addClass("animate__animated animate__flip dontClick").removeClass("moviePoster");
                    }
                    $(childElm).find(".summary").text(movieBlurb);
                    $(childElm).find(".title").text(movieTitle);

                    // New call to movie API to get rating and runtime
                    $.ajax({
                        url: ratingURL,
                        method: "GET"
                    })
                        .then(function (ratingdata) {
                            // Set variable for runtime
                            runTime = ratingdata.runtime;
                            let returnData = ratingdata.release_dates.results;

                            // Loop through results and find the US rating information
                            for (i = 0; i < returnData.length; i++) {
                                if (returnData[i].iso_3166_1 == "US") {
                                    // Set variable for rating
                                    usaRating = returnData[i].release_dates[0].certification;
                                }
                                // else {usaRating = "rating not available"}
                            }
                            if (runTime === 0 || !runTime){
                                $(childElm).find(".length").text("Not Provided");
                            } else{
                                $(childElm).find(".length").text(runTime);
                            }

                            if (usaRating === 0 || !usaRating){
                                $(childElm).find(".rating").text("Not Provided");
                            }
                            else {
                                $(childElm).find(".rating").text(usaRating);
                            }
                        });
                });
            });
    }
});

