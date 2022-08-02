const mainContainer = document.body.querySelector('.mainContainer');
const bodyContainer = document.body.querySelector('.bodyContainer');
const login = document.getElementById('login');
const animeSearchForm = document.getElementById('animeSearchForm');
const reviewFormDiv = document.getElementById('reviewFormDiv');
const reviewForm = document.getElementById('reviewForm');
const userLogDiv = document.getElementById('userLogDiv');
const displayAnime = document.getElementById('displayAnime');
const logo = document.getElementById('logo')

let currentUser = "";


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
    .then((res) => res.json())
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

            let spaceDiv = document.createElement('div')
            spaceDiv.classList.add('spaceDiv');

            bodyContainer.append(newAnime);
            newAnime.append(newImg);
            newAnime.append(newTitle);
            bodyContainer.append(spaceDiv);

            newTitle.addEventListener('click', () => {
                bodyContainer.innerHTML = '';

                fetch(`/anime/${animeTitle}`)
                .then((res) => res.json())
                .then((anime) => {
                    const animeImage = anime.image;
                
                    let newAnime = document.createElement('div');
                    newAnime.classList.add('anime')
                    let newImg = document.createElement('img');
                    newImg.classList.add('image');
                    newImg.src = animeImage;
                
                    let newTitle = document.createElement('div');
                    newTitle.classList.add('animeTitle')
                    newTitle.innerText = anime.name;
                
                    let spaceDiv = document.createElement('div')
                    spaceDiv.classList.add('spaceDiv');
                
                    bodyContainer.append(newAnime);
                    newAnime.append(newImg);
                    newAnime.append(newTitle);
                    bodyContainer.append(spaceDiv);
                
                    fetch(`/reviews/${animeTitle}`)
                    .then((res) => res.json())
                    .then((reviews) => {
                        for (let currentReview of reviews) {
                            let reviewDiv = document.createElement('div');
                            reviewDiv.classList.add('reviewDiv');
                            reviewDiv.innerText = `"${currentReview.review}"`;
                        
                            let reviewerDiv = document.createElement('div');
                            reviewerDiv.classList.add('reviewerDiv');
                            reviewerDiv.innerText = `- ${currentReview.reviewer}`;
                        
                            bodyContainer.append(reviewDiv);
                            bodyContainer.append(reviewerDiv);
                        }
                    })
                })
            })
        }
    })
})

animeSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const animeSearchInput = document.getElementById('animeSearchInput')
    const animeTitle = animeSearchInput.value;
    bodyContainer.innerHTML = '';


    fetch(`/anime/${animeTitle}`)
    .then((res) => res.json())
    .then((anime) => {
        const animeImage = anime.image;

        let newAnime = document.createElement('div');
        newAnime.classList.add('anime')
        let newImg = document.createElement('img');
        newImg.classList.add('image');
        newImg.src = animeImage;

        let newTitle = document.createElement('div');
        newTitle.classList.add('animeTitle')
        newTitle.innerText = anime.name;

        let spaceDiv = document.createElement('div')
        spaceDiv.classList.add('spaceDiv');

        bodyContainer.append(newAnime);
        newAnime.append(newImg);
        newAnime.append(newTitle);
        bodyContainer.append(spaceDiv);

        fetch(`/reviews/${animeTitle}`)
        .then((res) => res.json())
        .then((reviews) => {
            for (let currentReview of reviews) {
                let reviewDiv = document.createElement('div');
                reviewDiv.classList.add('reviewDiv');
                reviewDiv.innerText = `"${currentReview.review}"`;

                let reviewerDiv = document.createElement('div');
                reviewerDiv.classList.add('reviewerDiv');
                reviewerDiv.innerText = `- ${currentReview.reviewer}`;

                bodyContainer.append(reviewDiv);
                bodyContainer.append(reviewerDiv);
            }
        })
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

                let reviewDiv = document.createElement('div');
                reviewDiv.classList.add('reviewDiv');
                reviewDiv.innerText = `"${reviewInput.value}"`;

                let reviewerDiv = document.createElement('div');
                reviewerDiv.classList.add('reviewerDiv');
                reviewerDiv.innerText = `- ${currentUser}`;

                bodyContainer.append(reviewDiv);
                bodyContainer.append(reviewerDiv);
            })
        }
    })
})






