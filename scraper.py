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

    # custom dictionary to store all the devil fruits in an organized manner
    devil_fruits = {
        'Paramecia': {'Canon':[], 'Non-Canon':[]},
        'Zoan': {'Standard': [], 'Ancient': [], 'Mythical': [], 'Artificial': []},
        'Logia': {'Canon': [], 'Non-Canon': []},
        'Undetermined Class': {'Canon': [], 'Non-Canon': []}
    }

    # loop through the main table
    for i, df_category_table in enumerate(df_category_table):
        # i represents the order of df categories on the webpage
        if i == 0: main_category = 'Paramecia'
        elif i == 1: main_category = 'Zoan'
        elif i == 2: main_category = 'Logia'
        elif i == 3: main_category = 'Undetermined Class'
        else: continue
        
        # find the rows for subcategories
        rows = df_category_table.find_all('tr')
        current_subcategory = None
        
        for row in rows:
            th = row.find('th')
            if th:
                subcategory_text = th.get_text(strip=True)
                if 'Canon' in subcategory_text:
                    current_subcategory = 'Canon'
                if 'Non-Canon' in subcategory_text:
                    current_subcategory = 'Non-Canon'
                if 'Standard' in subcategory_text:
                    current_subcategory = 'Standard'
                if 'Ancient' in subcategory_text:
                    current_subcategory = 'Ancient'
                if 'Mythical' in subcategory_text:
                    current_subcategory = 'Mythical'
                if 'Artificial' in subcategory_text:
                    current_subcategory = 'Artificial'
                
                # extract devil fruits from each subcategory
                if current_subcategory:
                    links = row.find_all('a', title=True)
                    for link in links:
                        fruit_name = link.get('title')
                        # if statement avoids links that'd dont have a devil fruit
                        if 'Category:' not in fruit_name and fruit_name not in ['v', 'e', '?']:
                            relative_url = link.get('href')
                            absolute_url = BASE_URL + relative_url if relative_url else None
                            
                            # add the devil fruit name and its url to our dictionary
                            devil_fruits[main_category][current_subcategory].append({
                                'name': fruit_name,
                                'url': absolute_url
                            })
    # Print the results
    # for main_category, subcategories in devil_fruits.items():
    #     print(f"\n=== {main_category.upper()} ===")
    #     total_count = 0
    #     for subcategory, fruits in subcategories.items():
    #         print(f"\n  {subcategory}: {len(fruits)} fruits")
    #         for fruit in fruits:
    #             print(f"    - {fruit['name']}")
    #         total_count += len(fruits)
    #     print(f"  Total: {total_count} fruits")

    # print(f"\nGRAND TOTAL: {sum(len(fruits) for category in devil_fruits.values() for fruits in category.values())} devil fruits")
    
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











# if df_main_table:
#     df_category_table = df_main_table[0].find_all('table', class_='collapsible')

#     for i in range(0, 4):
#         category_links = df_category_table[i].find_all('a', title=True)
#         print(f"Found {len(category_links)} devil fruits\n")
#         for link in category_links:
#             category_title = link.get('title')
#             # Get the relative URL and make it absolute
#             relative_url = link.get('href')
#             absolute_url = BASE_URL + relative_url if relative_url else None
            
#             # You can also get the text content as backup
#             text_content = link.get_text(strip=True)
            
#             print(f"Title: {category_title}")
#             print(f"URL: {absolute_url}")
#             # print(f"Link Text: {text_content}")
#             print("---")