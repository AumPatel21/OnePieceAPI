from bs4 import BeautifulSoup
import requests

# default fandom page
BASE_URL = 'https://onepiece.fandom.com'

# Devil fruits url: https://onepiece.fandom.com/wiki/Category:Devil_Fruits
DEVIL_FRUITS_URL = 'wiki/Category:Devil_Fruits'
page = requests.get(BASE_URL + DEVIL_FRUITS_URL)
# print(req) # 200 good, 400: bad req, 404: not found

# page sends the request and .text retrieves the raw HTML
soup = BeautifulSoup(page.text, 'html.parser')
with open("page.html", "w", encoding="utf-8") as f:
    f.write(soup.prettify())