from bs4 import BeautifulSoup
import requests
import json

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
            'canon_status': 'canon',
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
        # print(url)
        non_canon_characters.append({
            'canon_status': 'non-canon',
            'url': url
        })
    
    return canon_characters + non_canon_characters


def get_character_details():
    char_id = 1
    characters = []
    char_urls = get_characters_url()
    
    with open('data/devil_fruits.json', 'r') as df:
        df_data = json.load(df)
        # print(f"Reading {devil_fruits}!")
    
    # mapping characters to link their devil fruit's using id's from devil_fruits.json
    fruit_map = {}
    for f in df_data:
        for key in ['current user', 'previous user']:
            if key in f and f[key]:
                # Split on common separators: slash or comma
                users = [u.strip() for u in f[key].replace(';', '/').split('/')]
                for user in users:
                    if user:  # skip empty strings
                        fruit_map[user] = f['id']
        
    for char in char_urls:
        try:
            page = requests.get(char['url'])
            soup = BeautifulSoup(page.text, 'html.parser')
            section = soup.find('aside')
            found_data = {'id': char_id}
            if section:
                title = section.find('h2')
                if title:
                    c_name = title.get_text(strip=True)
                    found_data['name'] = c_name
                    print(found_data['name'])
            else:
                print(f"  No character card found for {char['name']}")
                continue
            
            char_name = found_data['name']
            
            char_data = section.find_all('div', class_='pi-item pi-data pi-item-spacing pi-border-color')
            
            for data in char_data:
                data_source = data.get('data-source')
                value_div = data.find('div', class_='pi-data-value pi-font')
                if not value_div:
                    continue
                # removing all the superscripts because they're not needed
                for sup in value_div.find_all('sup'):
                    sup.decompose()
                # Making sure old bounties are not scraped. Only need the latest number
                for s in value_div.find_all('s'):
                    s.decompose()
                
                if data_source in ['jname']:
                    # using a slash to separate them, too many ,'s and ;'s
                    value = value_div.get_text(separator=' | ', strip=True)
                if data_source in ['alias', 'epithet']:
                    value = value_div.get_text().replace('"', ',') 
                else:
                    value = value_div.get_text()
                    
                if data_source =='jname':
                    found_data['japanese_name'] = value
                found_data['df_id'] = fruit_map.get(char_name, None)
                if data_source =='first':
                    found_data['debut'] = value
                elif data_source =='affiliation':
                    found_data['affiliations'] = value
                elif data_source =='occupation':
                    found_data['occupation'] = value
                elif data_source == 'origin':
                    found_data['origin'] = value
                elif data_source =='residence':
                    found_data['residence'] = value
                elif data_source =='alias':
                    found_data['alias'] = value
                elif data_source =='epithet':
                    found_data['epithet'] = value
                elif data_source =='status':
                    found_data['status'] = value
                elif data_source =='age':
                    found_data['age'] = value
                elif data_source =='birth':
                    found_data['birthday'] = value
                elif data_source =='blood type':
                    found_data['blood_type'] = value
                elif data_source =='bounty':
                    found_data['bounty'] = value
            found_data['canon_status'] = char['canon_status']
            found_data['url'] = char['url']
            
            print(f"df_id is {found_data['df_id']}")
            # for a formatted json output for easier reading while debugging
            # print(json.dumps(found_data, indent=4, ensure_ascii=False))
            
            characters.append(found_data)
            char_id += 1
        
        except Exception as e:
            print(f"Error processing {char['url']}: {e}")
    return characters

def save_to_json(data, filename):
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"Data saved to {filename}")
    return filename

# code to extract html page:
def get_html():
    page = requests.get(CANON_CHAR_URL)
    print(CANON_CHAR_URL)
    soup = BeautifulSoup(page.text, 'html.parser')
    content = soup.prettify()
    with open("page.html", "w", encoding="utf-8") as file:
        file.write(content)
    print ("File saved!")

def main():
    print("Scraping character names...")
    characters = get_character_details()
    print("Adding scraped characters to a json file")
    filename = save_to_json(characters, "characters.json")
    print(f"{filename} created successfully!\n\n")
    
if __name__ == "__main__":
    main()
