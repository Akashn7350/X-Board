
const accordionElement = document.querySelector("#newsAccordion");


function addDateToDOM() {

  const dateElement = document.querySelector(".date");
  const timeElement = document.querySelector(".time");

  dateElement.innerHTML = new Date().toDateString();
  setInterval(() => {
    const date = new Date();
    timeElement.innerHTML = date.toLocaleTimeString();
  }, 1000);
}


async function getNews(URL) {
  const rssToJsonConverterURL = `https://api.rss2json.com/v1/api.json?rss_url=${URL}`;
//   console.log("rsstojson", rssToJsonConverterURL)
  try {
    // Fetch the news using the url
    const newsResponse = await fetch(rssToJsonConverterURL);
    if (newsResponse.ok) {
      // Convert the newsResponse object to json format
      const news = await newsResponse.json();
       return news.items;
    }
    else {
      const message = `⚡⚡An unknown error occurred with a status code of ${newsResponse.status}⚡⚡`;
      throw new Error(message);
    }
  } catch (error) {
    console.log(error.message);
  }
}

function getNewsCard(news) {
  return `
    <a href="${news.link}">
      <div class="card">
        <img src="${news.enclosure.link}" class="card-img-top" alt="News image">
        <div class="card-body">
          <h5 class="card-title">${news.title}</h5>
          <span class="text-muted">${news.author || "unknown"} · ${new Date(news.pubDate).toLocaleDateString()}
          </span>
          <p class="card-text">${news.description}</p>
        </div>
      </div>
    </a>
  `;
}

function getCarouselInnerElement(newsCards) {

  const carouselInnerElement = document.createElement("div");        // Create a div for carousel inner element
  carouselInnerElement.setAttribute("class", "carousel-inner");      // Set the class attribute to the corousel inner element

  newsCards.forEach((newsCard, index) => {        // Loop over the newscards array and append each newscard as carousel item in carousel inner element
    const carouselItem = document.createElement("div");
    const className = index === 0 ? "carousel-item active" : "carousel-item";
    carouselItem.setAttribute("class", className);
    carouselItem.innerHTML = newsCard;
    carouselInnerElement.append(carouselItem);
  });
  return carouselInnerElement;
}

function getAccordionItemElement(carouselInnerElement, index) {
  // Create a div for accordion item element
  const accordionItemElement = document.createElement("div");

  // Set the class attribute to the accordion item element
  accordionItemElement.setAttribute("class", "accordion-item");

  // Set the innerHTML of accordion item
  accordionItemElement.innerHTML = `
    <h2 class="accordion-header" id="heading-${index}">
      <button class="accordion-button ${
        index === 0 ? "" : "collapsed"
      }" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="true" aria-controls="collapse-${index}">
        <ion-icon class="accordion-button-icon" name="chevron-down-outline"></ion-icon>
         ${topics[index]}
      </button>
    </h2>
    <div id="collapse-${index}" class="accordion-collapse collapse ${index === 0 ? "show" : ""}" 
    aria-labelledby="heading-${index}" data-bs-parent="#newsAccordion">
      <div class="accordion-body">
        <div id="newsCarousel-${index}" class="carousel slide carousel-fade" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${carouselInnerElement.innerHTML}
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#newsCarousel-${index}" data-bs-slide="prev">
            <ion-icon name="arrow-back-circle" class="icon-prev"></ion-icon>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#newsCarousel-${index}" data-bs-slide="next">
            <ion-icon name="arrow-forward-circle" class="icon-next"></ion-icon>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  `;

  return accordionItemElement;
}

async function init() {
  addDateToDOM();
  let newsItems;
  // Loop over the dmagazinces array and add an accordion for each magazine link
  for (index = 0; index < dmagazines.length; index++) {
    newsItems = await getNews(dmagazines[index]);
    // console.log("newsItems", newsItems)
    let newsCards = [];
    newsItems.forEach((newsItem) => {
      newsCards.push(getNewsCard(newsItem));
      console.log("newsCards", newsCards);

    });
    const carouselInnerElement = getCarouselInnerElement(newsCards);
    const accordionItemElement = getAccordionItemElement(
      carouselInnerElement,
      index
    );
    // Remove the loader from dom
    if (index === 0) {
      accordionElement.innerHTML = "";
    }
    accordionElement.append(accordionItemElement);
  }
}

init();