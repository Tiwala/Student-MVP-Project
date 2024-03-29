const mainContainer = document.body.querySelector('.mainContainer');
const bodyContainer = document.body.querySelector('.bodyContainer');
const login = document.getElementById('login');
const animeSearchForm = document.getElementById('animeSearchForm');
const reviewFormDiv = document.getElementById('reviewFormDiv');
const reviewForm = document.getElementById('reviewForm');
const userLogDiv = document.getElementById('userLogDiv');
const displayAnime = document.getElementById('displayAnime');
const logo = document.getElementById('logo')

// Global accumulator for currentUser
let currentUser = "";

// On clicking the logo, reloads the page
logo.addEventListener('click', () => {
    location.reload();
})

// User "login"
login.addEventListener('submit', (event) => {
    event.preventDefault();

    // login username input
    const userLogin = document.getElementById('userLogin');

    // On click, makes a fetch request for the weebs table
    fetch('/weebs')
    .then((res) => console.log(res.json()))
    .then((weebs) => {
        // Checks if the weebs table has the entered username in weebs
        for (let weeb of weebs) {
            if (weeb.name === userLogin.value) {
                currentUser = weeb.name;
                console.log(weeb);
                break;
            }
        }
        // Removes the user form; replaces it with the current user
        userLogDiv.innerHTML = '';

        // DOM for username creation
        let userLog = document.createElement('div');
        userLog.classList.add('userLog');
        userLog.innerHTML = `User: <strong>${currentUser}</strong>`
        userLogDiv.append(userLog);

        
        // If the entered username is not in the weebs table, makes a post request
        if (currentUser === "") {
            let newUser = { "name": userLogin.value };
            fetch('/weebs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            })
            .then((res) => res.json())
            .then((data) => {
                // Makes the current user into the newly entered username
                currentUser = data.name;
                console.log(data);

                userLogDiv.innerHTML = '';

                let userLog = document.createElement('div');
                userLog.classList.add('userLog');
                userLog.innerHTML = `User: <strong>${currentUser}</strong>`
                userLogDiv.append(userLog);
            })
        }
    })
})

// On clicking the 'Anime List' tab, clears body and displays all anime
displayAnime.addEventListener('click', () => {
    bodyContainer.innerHTML = '';

    // Fetches anime table
    fetch('/anime')
    .then((res) => res.json())
    .then((anime) => {
        // Iterates through anime database and displays image and title
        for (let currentAnime of anime) {
            const animeTitle = currentAnime.name;
            let newTitle = document.createElement('div');

            showAnime(currentAnime, newTitle);

            // On clicking the title of an anime, directs user to clicked anime page
            newTitle.addEventListener('click', () => {
                bodyContainer.innerHTML = '';

                fetch(`/anime/${animeTitle}`)
                .then((res) => res.json())
                .then((anime) => {
                    let newerTitle = document.createElement('div');
                    showAnime(anime, newerTitle);
                    
                    // Goes through reviews table and displays all reviews for selected anime
                    fetch(`/reviews/${animeTitle}`)
                    .then((res) => res.json())
                    .then((reviews) => {
                        for (let currentReview of reviews) {
                            displayReviews(currentReview);
                        }
                    })
                })
            })
        }
    })
})

// Allows searching for specific anime
animeSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const animeSearchInput = document.getElementById('animeSearchInput')
    const animeTitle = animeSearchInput.value;
    bodyContainer.innerHTML = '';

    // Goes through anime table and displays specific anime searched
    fetch(`/anime/${animeTitle}`)
    .then((res) => res.json())
    .then((anime) => {
        let newTitle = document.createElement('div');
        showAnime(anime, newTitle);

        // Displays reviews for selected anime
        fetch(`/reviews/${animeTitle}`)
        .then((res) => res.json())
        .then((reviews) => {
            for (let currentReview of reviews) {
                displayReviews(currentReview);
            }  
        })
    })
})

// Allows use to post new reviews
reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const animeReviewInput = document.getElementById('anime');
    const reviewInput = document.getElementById('review');
    const reviewError = document.getElementById('reviewError')

    // Checks if anime inputted in form is within the database
    fetch('/anime')
    .then((res) => res.json())
    .then((anime) => {
        // Accumulator for inputted anime
        let animeName = "";
        for (let currentAnime of anime) {
            if (currentAnime.name === animeReviewInput.value) {
                animeName = currentAnime.name;
                console.log(animeName);
                break;
            }
        }
        // If user has not logged in, shows an error
        if (currentUser === "") {
            reviewError.innerText = "Login first, weeb!";
        }
        // If inputted anime is not in the database, shows an error
        if (animeName === "") {
            reviewError.innerText = "That anime is not on our database, weeb!";
        } else {
            // POST request
            let newReview = {
                "anime": animeName,
                "review": reviewInput.value,
                "reviewer": currentUser
            };
            fetch('/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newReview),
            })
            .then((res) => res.json())
            .then((data) => {
                // Pushes new review into the body on the spot
                displayReviews(data);
            })
        }
    })
})

// Function for using DOM to display reviews
const displayReviews = (currentReview) => {
    let newReviewDiv = document.createElement('div');
    newReviewDiv.classList.add('newReview');

    let deleteError = document.createElement('div');
    deleteError.classList.add('deleteError');
    newReviewDiv.append(deleteError);

    let reviewDiv = document.createElement('div');
    reviewDiv.classList.add('reviewDiv');
    reviewDiv.innerText = `"${currentReview.review}"`;

    let deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteButton');
    deleteButton.innerText = 'Delete'
    newReviewDiv.append(deleteButton);

    let reviewerDiv = document.createElement('div');
    reviewerDiv.classList.add('reviewerDiv');
    reviewerDiv.innerText = `- ${currentReview.reviewer}`;

    newReviewDiv.append(reviewDiv);
    newReviewDiv.append(reviewerDiv);
    bodyContainer.append(newReviewDiv);

    deleteButton.addEventListener('click', () => {
        if (`- ${currentUser}` === reviewerDiv.innerText) {
            newReviewDiv.innerHTML = '';

            fetch(`/reviews/${currentReview.review_id}`, {
                method: 'DELETE'
            })
            .then((data) => {
                console.log(currentReview);
            })
        } else {
            deleteError.innerText = "You can't delete someone else's review, weeb!";
        }
    })
}

// Function for using DOM to show anime
const showAnime = (anime, newTitle) => {
    const animeImage = anime.image;

    let newAnime = document.createElement('div');
    newAnime.classList.add('anime')

    let newImg = document.createElement('img');
    newImg.classList.add('image');
    newImg.src = animeImage

    newTitle.classList.add('animeTitle')
    newTitle.innerText = anime.name

    let spaceDiv = document.createElement('div')
    spaceDiv.classList.add('spaceDiv')

    bodyContainer.append(newAnime);
    newAnime.append(newImg);
    newAnime.append(newTitle);
    bodyContainer.append(spaceDiv);
}