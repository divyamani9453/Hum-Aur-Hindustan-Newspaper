async function loadNews() {

    const response = await fetch("/api/news");
    const data = await response.json();

    const container =
      document.getElementById("news-container");

    data.articles.forEach(article => {

        container.innerHTML += `
            <div class="article">
                <h2>${article.title}</h2>
                <p>${article.description || ''}</p>
                <a href="${article.link}" target="_blank">
                    Read Full Article
                </a>
            </div>
        `;
    });
}

loadNews();