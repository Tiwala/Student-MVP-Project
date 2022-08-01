// const container = document.body.querySelector('.container');
// const userForm = document.getElementById('user-form');
// const logo = document.body.querySelector('input');

// login form
const login = document.getElementById('login');
// login username input
const userLogin = document.getElementById('userLogin');

const reviewForm = document.getElementById('reviewForm');
const animeReviewInput = document.getElementById('anime');
const reviewInput = document.getElementById('review');
const reviewError = document.getElementById('reviewError')

// Verifies who the current user is; determines what they can do
let currentUser = "";

// User "login"
login.addEventListener('submit', (event) => {
    event.preventDefault();
    
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

reviewForm.addEventListener('submit', (event) => {
    event.preventDefault();

    fetch('/anime')
    .then((res) => res.json())
    .then((anime) => {
        let animeName = "";
        for (let currentAnime of anime) {
            if (currentAnime.name === animeReviewInput.value) {
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

