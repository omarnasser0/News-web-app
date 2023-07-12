const API_KEY = "fb46fea4c8f64286a7fd99c7593f7c9a";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("Egypt"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    let articles = data.articles;
    console.log(articles);
    bindData(articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById('cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');

    cardsContainer.innerHTML = '';

    articles.forEach(article => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}


function fillDataCard(cardClone, article) {
    const newsImg = cardClone.querySelector('#news-image');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US", { timeZone: "Africa/Cairo" });

    newsSource.innerHTML = `${article.source.name}  -  ${date}`;
    
    cardClone.firstElementChild.addEventListener('click', () => { window.open(article.url, "_blank") })
}

let curSelectedNavItem = null;
    
function onNavItemClicked(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNavItem?.classList.remove('active');
    curSelectedNavItem = navItem;
    curSelectedNavItem.classList.add('active');
}


function onSearchButtonClicked() {
    const searchInput = document.getElementById("news-input");
    const query = searchInput.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNavItem?.classList.remove('active');
    curSelectedNavItem = null;
}

function toggleVisibility() {
    var div = document.getElementById("bookmarks-title");
    div.classList.toggle("hidden-div");
}

function onBookmarked(){
    alert("bookmarked");
}


async function sortDateUP(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    let articles = data.articles.sort(newFirst)
    console.log(articles);
    bindData(articles);
}
function newFirst(a, b) {
    return new Date (b.publishedAt).valueOf() - new Date (a.publishedAt).valueOf();
}

async function sortDateDown(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    let articles = data.articles.sort(newLast)
    console.log(articles);
    bindData(articles);
}
function newLast(a, b) {
    return new Date (a.publishedAt).valueOf() - new Date (b.publishedAt).valueOf();
}

async function sortPopularFirst(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();

    const newsSources = new Map([
        ["Google News", 1],
        ["BBC News", 2],
        ["Business Insider", 3],
        ["CNET", 4],
        ["NPR", 5],
        ["ABC News", 6],
        ["Al Jazeera English", 7],
        ["The Guardian", 8],
        ["AppleInsider", 9],
        ["Yahoo Entertainment", 10],
        ["Pitchfork", 11],
        ["Stereogum", 12],
        ["GameSpot", 13],
        ["Rock Paper Shotgun", 14],
        ["The New Yorker", 15],
        ["ArchDaily", 16],
        ["Phys.Org", 17],
        ["Harvard Business Review", 18],
        ["MacRumors", 19],
        ["9to5Mac", 20],
        ["IndieWire", 21],
        ["The Next Web", 22],
        ["Itsnicethat.com", 23],
        ["Openculture.com", 24],
        ["FRANCE 24 English", 25],
        ["Science Daily", 26],
        ["Deadline", 27],
        ["Torproject.org", 28],
        ["/FILM", 29],
        ["Torrentfreak.com", 30],
        ["Biztoc.com", 31],
        ["Yieldcode.blog", 32],
        ["The Indian Express", 33]
      ]);
    let articles = data.articles.sort(popularFirst);
    console.log(articles);
    bindData(articles);
    function popularFirst(a, b) {
        return newsSources.get(a.source.name) - newsSources.get(b.source.name)
    }
}

async function sortRelevance(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    const searchTextLowercased = document.getElementById("news-input").value.toLowerCase();
    const rankedIndex = data.map(entry => {
    let points = 0;
    if (entry.name.toLowerCase().includes(searchTextLowercased)) {
        points += 2;
    }
    if (entry.text.toLowerCase().includes(searchTextLowercased)) {
        points += 1;
    }
    return {...entry, points};
}).sort((a, b) => b.points - a.points);
    // let articles = data.articles.sort()
    console.log(rankedIndex);
    bindData(rankedIndex);
}
// function newLast(a, b) {
//     return new Date (a.publishedAt).valueOf() - new Date (b.publishedAt).valueOf();
// }

function sort() {
    var selectedValue = document.getElementById('sort').value;
    if(selectedValue == "publish-date-up") {
        sortDateUP("Egypt");
    } else if(selectedValue == "publish-date-down") {
        sortDateDown("Egypt");
    } else if(selectedValue == "popularity") {
        sortPopularFirst("Egypt");
    } else if(selectedValue == "relevance") {
        sortRelevance("Egypt");
    }
}

/*
const activeNavItem = document.querySelector('#navigation .active');
console.log(activeNavItem.textContent);
*/