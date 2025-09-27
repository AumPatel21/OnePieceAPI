from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime

# URL's to scrape
BASE_URL = 'https://onepiece.fandom.com'
CANON_CHAR_URL = "https://onepiece.fandom.com/wiki/List_of_Canon_Characters"
NON_CANON_CHAR_URL = "https://onepiece.fandom.com/wiki/List_of_Non-Canon_Characters"

def get_characters_url():
    canon_characters = []
    non_canon_characters = []
    
    canon_page = requests.get(CANON_CHAR_URL)
    print(CANON_CHAR_URL)
    canon_soup = BeautifulSoup(canon_page.text, 'html.parser')    
    canon_table = canon_soup.find('table', class_="fandom-table sortable")
    canon_rows = canon_table.find_all('tr')[1:] # skipping the header
    
    for row in canon_rows:
        cells = row.find_all('td')
        if not cells:
            continue
        link = cells[1].find('a')
        # print(link)
        url = BASE_URL + link['href']
        canon_characters.append({
            'status': 'canon',
            'url': url
        })
    
    non_canon_page = requests.get(NON_CANON_CHAR_URL)
    print(NON_CANON_CHAR_URL)
    non_canon_soup = BeautifulSoup(non_canon_page.text, 'html.parser')
    non_canon_table = non_canon_soup.find('table', class_="fandom-table sortable")
    non_canon_rows = non_canon_table.find_all('tr')[1:] # skipping the header
    
    for row in non_canon_rows:
        cells = row.find_all('td')
        if not cells:
            continue
        link = cells[1].find('a')
        url = BASE_URL + link['href']
        print(url)
        non_canon_characters.append({
            'status': 'non-canon',
            'url': url
        })
    
    return canon_characters + non_canon_characters

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"Data saved to {filename}")
    return filename

def main():
    print("Scraping character names...")
    characters = get_characters_url()
    print("Adding scraped characters to a json file")
    filename = save_to_json(characters, "characters.json")
    print(f"{filename} created successfully!\n\n")
    
if __name__ == "__main__":
    main()
    

# code to extract html page:

    # canon_page = requests.get(CANON_CHAR_URL)
    # print(CANON_CHAR_URL)
    # soup = BeautifulSoup(canon_page.text, 'html.parser')
    # content = soup.prettify()
    # with open("canon_page.html", "w", encoding="utf-8") as file:
    #     file.write(content)
    # print ("File saved!")