fetch('/anime')
    .then((res) => res.json())
    .then((anime) => {
        console.log(anime);
        document.write(JSON.stringify(anime));
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