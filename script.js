const API_KEY="d8a65066d4c240f9b04a6d2f06e6820e";
const url="https://newsapi.org/v2/everything?q=";

window.addEventListener("load",()=>fetchNews("India"));

function reload(){
    window.location.reload();
}

async function fetchNews (query){
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    console.log(data);
    bindData(data.articles);
}

function bindData(articles){
    const cardContainer=document.getElementById('card_container');
    const newsCardTemplate=document.getElementById('template_news_card');

    cardContainer.innerHTML='';

    articles.forEach((article)=>{
        if(!article.urlToImage) return;
        const cardClone=newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article)
        cardContainer.appendChild(cardClone); 
    });

}

function fillDataInCard(cardClone,article){
    const newImg=cardClone.querySelector('#news_img');
    const newTitle=cardClone.querySelector('#news_title');
    const newSource=cardClone.querySelector('#news_source');
    const newDesc=cardClone.querySelector('#news_desc');

    newImg.src=article.urlToImage;
    newTitle.innerHTML=article.title;
    newDesc.innerHTML=article.description;

    const date= new Date(article.publishedAt).toLocaleString("en-US",{
        timeZone:"Asia/Jakarta"
    });

    newSource.innerHTML=`${article.source.name} . ${date}`;

    cardClone.firstElementChild.addEventListener("click",()=>{
        window.open(article.url,"_blank");
    });
}

let curSelectedNav=null;
function onNavItemClick(id){
    fetchNews(id);
    const navItem=document.getElementById(id);
    curSelectedNav?.classList.remove('active');
    curSelectedNav=navItem;
    curSelectedNav.classList.add('active');
}

const searchButton=document.getElementById('search_button');
const searchText=document.getElementById('search_text');

searchButton.addEventListener('click',()=>{
    const query=searchText.value;
    if(!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav=null;
});

