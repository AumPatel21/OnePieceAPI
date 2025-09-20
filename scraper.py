from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime

# default fandom page
BASE_URL = 'https://onepiece.fandom.com'
# Devil fruits url: https://onepiece.fandom.com/wiki/Category:Devil_Fruits
DEVIL_FRUITS_URL = BASE_URL + '/wiki/Category:Devil_Fruits'

df_page = requests.get(DEVIL_FRUITS_URL) # print(req) # 200 good, 400: bad req, 404: not found
print(DEVIL_FRUITS_URL)
# page sends the request and .text retrieves the raw HTML
df_soup = BeautifulSoup(df_page.text, 'html.parser')

def get_devil_fruits():
    #table that contains all the devil fruit contents
    df_main_table = df_soup.find_all('table', class_='navibox')
    # print(f"Found {len(df_main_table)} main table(s)")

    # find all the category tables: Paramecia, Zoan, Logia, Undetermined Class
    df_category_table = df_main_table[0].find_all('table', class_='collapsible')
    # print(f"Found {len(df_category_table)} category table(s)")

    # store all the devil fruits and respective data here
    devil_fruits = []
    
    # Variable to assign ID's to each devil fruits
    df_ID = 1
    
    # loop through the main table
    for i, df_category_table in enumerate(df_category_table):
        # i represents the order of df categories on the webpage
        if i == 0: main_category = 'Paramecia'
        elif i == 1: main_category = 'Zoan'
        elif i == 2: main_category = 'Logia'
        elif i == 3: main_category = 'Undetermined Class'
        else: continue
        
        # mark whether its Canon, Non-Canon
        current_subcategory = None
        current_canon_status = 'Canon'
        
        # find the rows for subcategories
        rows = df_category_table.find_all('tr')
        # print(rows)
        for row in rows:

            th = row.find('th')
            if th:
                # FIXME non-canon status not applied correctly!
                subcategory_text = th.get_text(strip=True)

                if 'Canon:' in subcategory_text:
                    current_canon_status = 'Canon'
                    current_subcategory = None
                if 'Non-Canon:' in subcategory_text:
                    current_canon_status = 'Non-Canon'
                    current_subcategory = None
                if any(x in subcategory_text for x in ['Standard', 'Ancient', 'Mythical', 'Artificial']):
                    current_subcategory = subcategory_text
                    current_canon_status = 'Canon' # Setting the default status for Zoan to canon
                    
                # extract devil fruits from each subcategory
                list_items = row.find_all('li')
                for li in list_items:
                    link = li.find('a', title=True)
                    if link:
                        fruit_name = link.get('title')
                        # if statement avoids links that'd dont have a devil fruit
                        if 'Category:' not in fruit_name and fruit_name not in ['v', 'e', '?']:
                            relative_url = link.get('href')
                            absolute_url = BASE_URL + relative_url if relative_url else None

                            fruit_canon_status = current_canon_status
                            # Check for non-canon symbol (≠) in this specific fruit   
                            sup_tag = li.find('sup', class_='status-symbol')
                            if sup_tag and sup_tag.get('title') == 'Non-Canon':
                                    fruit_canon_status = 'Non-Canon'
                                    
                            if main_category == 'Zoan' and current_subcategory:
                                # For Zoan, concatenate subcategory with main type
                                fruit_type = f"{current_subcategory} Zoan"
                            else:
                                fruit_type = main_category
                            # add the devil fruit name and its url to our dictionary
                            devil_fruits.append({
                                'id': df_ID,
                                'name': fruit_name,
                                'type': fruit_type,
                                'status': fruit_canon_status,
                                'url': absolute_url
                            })
                            df_ID += 1
                            
    print(f"\nGRAND TOTAL: {len(devil_fruits)} devil fruits")
    return devil_fruits

def get_characters():
    return

def save_to_json(data, filename=None):
    if filename is None:
        # Create a filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"devil_fruits_{timestamp}.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    
    print(f"Data saved to {filename}")
    return filename

def main():
    print("Scraping devil fruits...")
    df = get_devil_fruits()
    print("Adding scraped devil fruits to a json file")
    filename = save_to_json(df, "devil_fruits.json")
    print(f"{filename} created successfully!\n\n")

if __name__ == "__main__":
    main()