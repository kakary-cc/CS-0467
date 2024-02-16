// sfmovie.mjs

function longestFunFact(data) {
    return data.reduce((acc, cur) => {
        if (cur['Fun Facts'].length > acc['Fun Facts'].length) {
            return cur;
        }
        return acc;
    });
}

function getTitlesByYear(data, year) {
    let titles = data.filter((movie) => parseInt(movie['Release Year']) === year);
    titles = titles.map((movie) => (movie['Title'] + ` (${year}).`).toUpperCase());
    titles = titles.filter((s, i, arr) => arr.indexOf(s) === i);
    return titles;
}

function actorCounts(data) {
    let actors = data.map((movie) => movie['Actor 1']);
    actors = actors.concat(data.map((movie) => movie['Actor 2']));
    actors = actors.concat(data.map((movie) => movie['Actor 3']));
    actors = actors.filter((actor) => actor !== '');
    return actors.reduce((acc, cur) => {
        if (Object.hasOwn(acc, cur)) {
            acc[cur]++;
        }
        else {
            acc[cur] = 1;
        }
        return acc;
    }, {});
}

export {
    longestFunFact,
    getTitlesByYear,
    actorCounts
};