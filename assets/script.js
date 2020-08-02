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

    // Shuffles the deck of cards
    shuffleBtn.onclick = function () {
        shuffleBtn.style.display = "none";
        pickCardBtn.style.display = "block";
        // Showing 3 ways to achieve same result
        $("#runtimeBlock").show();
        $("#ratingBlock").css("display", "block");
        $("#genreBlock").attr("class", "fieldset center-icons");
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

    // Shuffle the Cards API
    const cardHolder = $(".cardHolder");
    function shuffleCards() {


        $.ajax({
            url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1",
            method: "GET"
        })

            .then(function (getid) {
                var cardid = getid.deck_id;
                // console.log(cardid);


                // Draw a Card API
                $.ajax({
                    url: "https://deckofcardsapi.com/api/deck/" + cardid + "/draw/?count=4",
                    method: "GET"
                })

                    .then(function (drawcard) {
                        // console.log(drawcard)
                        cardHolder.each(function (choice) {
                            const _this = $(this);
                            _this.find("#moviePoster").attr("src", drawcard.cards[choice].image);
                            choice++
                        })
                    })

            })

    }
    // query movie API for genre IDs

    // gather the movie parameters

    // build the movie queryURL

    // query the movie API

    // attach the results to movie cards



    function runMovieSelection() {
        pickCardBtn.style.display = "none";
        drawAgainBtn.style.display = "block";
        movieHeader.style.display = "block";
        movieGrid.style.display = "block";

        let apiKey = "8ae6662de0624eaf409751a739208381";
        const runTime = $("#runtime").val();

        // query movie API according to get genre IDs
        $.ajax({
            url: `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`,
            method: "GET"
        })
            .then(function (genres) {
                // console.log(genres);

                let queryURL = `http://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&certification_country=US`;

                // get information from the inputs - need more here - maybe this is a separate funciton?
                let certifications = "";
                console.log(ratedR.checked);
                $(".certifications").each(function(elem) {
                    if (ratedR.checked) {
                        certifications += ",R"
                        console.log(certifications);
                        elem ++
                    }    
                    //if (elem.attr("value")) queryURL += `${elem.attr("name")}=${elem.attr("value")}`;
                    queryURL += "&certification=" + certifications.slice(1);
                    console.log(queryURL);
                })

                // build the queryURL - maybe this is a separate function?
                // if (runtime) queryURL += `&certification=${runtime}`;
                // if (val) queryURL += `&certification=${val}`;
                // if (val) queryURL += `&certification=${val}`;
                // if (val) queryURL += `&certification=${val}`;
                // if (val) queryURL += `&certification=${val}`;


                $.ajax({
                    url: `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&certification_country=US&certification=R&with_runtime=120&with_genre=18`,
                    method: "GET"
                })
                    .then(function (moviedata) {
                        // console.log(moviedata);
                    });
            });


            // use moviedata.title for a title
            // use moviedptions.overview for a description if we want to
            // use moviedptions.poster_path for movie poster
            // use movieoptions.with_runtime for runtime
            // use movieoptions.certification - not sure this is correct name
        }
    });


// });
