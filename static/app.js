const mainContainer = document.body.querySelector('.mainContainer');
const bodyContainer = document.body.querySelector('.bodyContainer');


// Login form
const login = document.getElementById('login');

// Search anime
const animeSearchForm = document.getElementById('animeSearchForm');


// Accesses the review form
const reviewForm = document.getElementById('reviewForm');

// Verifies who the current user is; determines what they can do
let currentUser = "";

const displayAnime = document.getElementById('displayAnime');

// User "login"
login.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // login username input
    const userLogin = document.getElementById('userLogin');

    // On click, makes a fetch request for the weebs table
    fetch('/weebs')
    .then((res) => res.json())
    .then((weebs) => {
        // Checks if the weebs table has the entered username in weebs
        for (let weeb of weebs) {
            if (weeb.name === userLogin.value) {
                currentUser = weeb.name;
                console.log(currentUser);
                break;
            }
        }
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
                console.log(data.name);
            })
        }
    })
})

displayAnime.addEventListener('click', () => {
    bodyContainer.innerHTML = '';

    fetch('/anime')
    .then((res) => res.json())
    .then((anime) => {
        for (let currentAnime of anime) {
            const animeImage = currentAnime.image;
            const animeTitle = currentAnime.name;

            let newAnime = document.createElement('div');
            newAnime.classList.add('anime')
            let newImg = document.createElement('img');
            newImg.classList.add('image');
            newImg.src = animeImage;

            let newTitle = document.createElement('div');
            newTitle.classList.add('animeTitle')
            newTitle.innerText = animeTitle;

            bodyContainer.append(newAnime);
            newAnime.append(newImg);
            newAnime.append(newTitle);
        }
    })
})

animeSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const animeSearchInput = document.getElementById('animeSearchInput')
    const searchedAnime = animeSearchInput.value;
    bodyContainer.innerHTML = '';
    fetch(`/anime/${searchedAnime}`)
    .then((res) => res.json())
    .then((anime) => {
        const animeImage = anime.image;
        const animeTitle = anime.name;

        let newAnime = document.createElement('div');
        newAnime.classList.add('anime')
        let newImg = document.createElement('img');
        newImg.classList.add('image');
        newImg.src = animeImage;

        let newTitle = document.createElement('div');
        newTitle.classList.add('animeTitle')
        newTitle.innerText = animeTitle;

        bodyContainer.append(newAnime);
        newAnime.append(newImg);
        newAnime.append(newTitle);
    })
})

// For reviewing anime; will find position later
reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const animeReviewInput = document.getElementById('anime');
    const reviewInput = document.getElementById('review');
    const reviewError = document.getElementById('reviewError')

    fetch('/anime')
    .then((res) => res.json())
    .then((anime) => {
        let animeName = "";
        for (let currentAnime of anime) {
            if (currentAnime.name.toLowerCase() === animeReviewInput.value.toLowerCase()) {
                animeName = currentAnime.name;
                console.log(animeName);
                break;
            }
        }
        if (currentUser === "") {
            reviewError.innerText = "Login first, weeb!";
        }
        if (animeName === "") {
            reviewError.innerText = "That anime is not on our database, weeb!";
        } else {
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
                reviewError.innerHTML = "";
                console.log(data);
            })
        }
    })
})






fetch('/anime')
    .then((res) => res.json())  
    .then((anime) => {
        console.log(anime);
    })

fetch('/weebs')
    .then((res) => res.json())
    .then((weebs) => {
        console.log(weebs);
    })

fetch('/reviews')
    .then((res) => res.json())
    .then((reviews) => {
        console.log(reviews);
    })

