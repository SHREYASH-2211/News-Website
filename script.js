const API_KEY = "pub_7529190211cdc08dd5571ed71c10796dd9bb9";
const url = "https://newsdata.io/api/1/news?apikey=";

// Load default news on page load
window.addEventListener("load", () => fetchNews("Technology"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  try {
    const res = await fetch(
      `${url}${API_KEY}&q=${encodeURIComponent(query)}&language=en`
    );
    const data = await res.json();

    console.log("API Response:", data); // Debugging: Check API response format

    if (data.status === "success" && data.results) {
      bindData(data.results);
    } else {
      console.error("No articles found or API error:", data.message);
      bindData([]); // Call bindData with an empty array to prevent errors
    }
  } catch (error) {
    console.error("API Fetch Error:", error);
    bindData([]); // Prevent breaking if API fails
  }
}

function bindData(articles) {
  const cardContainer = document.getElementById("card_container");
  const newsCardTemplate = document.getElementById("template_news_card");

  cardContainer.innerHTML = "";

  if (!articles || articles.length === 0) {
    cardContainer.innerHTML = "<p>No news found.</p>";
    return;
  }

  articles.forEach((article) => {
    if (!article.image_url) return; // Skip articles without images

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newImg = cardClone.querySelector("#news_img");
  const newTitle = cardClone.querySelector("#news_title");
  const newSource = cardClone.querySelector("#news_source");
  const newDesc = cardClone.querySelector("#news_desc");

  newImg.src = article.image_url; // 'image_url' instead of 'urlToImage'
  newTitle.innerHTML = article.title;
  newDesc.innerHTML = article.description || "No description available.";

  const date = new Date(article.pubDate).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newSource.innerHTML = `${article.source_id} • ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.link, "_blank"); // Use 'link' instead of 'url'
  });
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search_button");
const searchText = document.getElementById("search_text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
