const cutDescr = (overview, ind) => {
    const titles = document.querySelectorAll('.movie__name');

    const lineHeight = 31;
    const currentTitle = titles[ind-1];
    const numberOfTitleLines = currentTitle.clientHeight / lineHeight

    let result = overview;

    const maxLengthOverview = 300;
    const numberHiddenSymbols = 80; // number of hidden overviews characters with one titles line

    const length = maxLengthOverview - numberOfTitleLines * numberHiddenSymbols;

    if (overview.length > length) {
        const newDescr = overview.substr(0, length);
        const index = newDescr.lastIndexOf(' ');

        result = `${newDescr.substr(0, index)}...`;
    };

    return result;
};

const setRatingColor = (voteAverage) => {
    const vote = +voteAverage;

    let borderColor;

    if(vote < 3) {
        borderColor = '#E90000';
    } else if (vote < 5) {
        borderColor = '#E97E00';
    } else if (vote < 7) {
        borderColor = '#E9D100';
    } else {
        borderColor = '#66E900';
    };

    return borderColor;
}

export { cutDescr, setRatingColor };