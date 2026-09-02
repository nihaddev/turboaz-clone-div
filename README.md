## Turbo.az Home Page Clone 

**With tailwindcss**

Structure: 

```bash
index.html
scraper.py
script.js
style.css
turbo_az_cars.json
```

**Explanation of Each File:**

**`scraper.py`**: This file is used to scrape data from the Turbo.az website. It uses the `requests` library to fetch the HTML content of the page and `BeautifulSoup` to parse the HTML and extract the data.

**`turbo_az_cars.json`**: This file is used to store the scraped data from the Turbo.az website. It is a JSON file that contains the data of the cars scraped from the website.

**`index.html`**: This file is the main HTML file that contains the structure of the website. It is a responsive website that is optimized for mobile devices.

**`script.js`**: This file contains the JavaScript code that is used to fetch the data from the JSON file and display it on the website. It also contains the code for the custom dropdowns and the search functionality.

**`style.css`**: This file contains the CSS code that is used to style the website. It is a responsive website that is optimized for mobile devices.

**How to Run:**

```bash
1. Run the scraper: python scraper.py
2. Open index.html in your browser
```



**Example log of scraper.py**

```bash
> python3 scraper.py

Scraping başladı...

Səhifə 1 çəkilir (cursor: 1788207606.469858_10034165)...
Səhifə 2 çəkilir (cursor: 1788206663.182958_10619747)...
Səhifə 3 çəkilir (cursor: 1788205776.845852_10587991)...
Ümumilikdə 72 maşın məlumatı uğurla çəkildi!
Məlumatlar 'turbo_az_cars.json' faylına yadda saxlanıldı.

```
