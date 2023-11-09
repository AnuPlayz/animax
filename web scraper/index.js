const puppeteer = require('puppeteer');
const axios = require('axios');
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
  }

async function scrapeAniList() {
  try {
    const browser = await puppeteer.launch({ headless: false });    
    const page = await browser.newPage();
    
    await page.goto('https://anilist.co/search/anime/top-100');
    sleep(2000);

    await autoScroll(page, 25);

    const animeElements = await page.$$('.media-card');
    const animeData = [];

    for (const animeElement of animeElements) {
      const name = (await animeElement.$eval('.title', (element) => element.textContent)).trim();
      const coverImage  = await animeElement.$eval('img', (element) => element.getAttribute('src'));

      animeData.push({
        name,
        coverImage,
      });
    }

    sendDataToDatabase(animeData);
    /*const jsonData = JSON.stringify(animeData, null, 2);
    console.log(jsonData);*/

    await browser.close();
  } catch (error) {
    console.error('Error scraping data:', error.message);
  }
}

async function autoScroll(page, maxScrolls){
    await page.evaluate(async (maxScrolls) => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var scrolls = 0;  // scrolls counter
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                scrolls++;  // increment counter

                // stop scrolling if reached the end or the maximum number of scrolls
                if(totalHeight >= scrollHeight - window.innerHeight || scrolls >= maxScrolls){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    }, maxScrolls);
}

scrapeAniList();

async function sendDataToDatabase(animeData) {
    try {
        const endpointUrl = 'http://localhost:5555/create'; 
        const token = 'uxv23f'; // Replace with your actual token
  
      for (const anime of animeData) {
        const { name, coverImage } = anime;
  
        const response = await axios.post(endpointUrl, {
          name: name,
          coverImage: coverImage,
        }, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json', // Specify content type if needed
          },
        });
  
        // Print the response from the database for each anime
        console.log(`Anime ${name} Response:`, response.data);
      }
  
    } catch (error) {
      console.error('Error sending data to database:', error.message);
    }
  }  