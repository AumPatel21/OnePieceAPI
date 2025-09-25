from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime

# default fandom page
BASE_URL = 'https://onepiece.fandom.com'

# function to fetch the urls and statuses of all the devil fruits 
def get_df_urls():
    DEVIL_FRUITS_URL = "https://onepiece.fandom.com/wiki/Category:Devil_Fruits"
    
    df_page = requests.get(DEVIL_FRUITS_URL) # print(req) # 200 good, 400: bad req, 404: not found
    print(DEVIL_FRUITS_URL)
    # page sends the request and .text retrieves the raw HTML
    df_soup = BeautifulSoup(df_page.text, 'html.parser')
    
    #table that contains all the devil fruit contents
    df_main_table = df_soup.find_all('table', class_='navibox toccolours mw-collapsible mw-collapsed')

    # find all the category tables: Paramecia, Zoan, Logia, Undetermined Class
    # [:4] because the last table is irrelevant
    df_category_table = df_main_table[0].find_all('table', class_='collapsible')[:4]
    
    # store all the devil fruits url here
    df_url = []
    
    # loop through the main table
    for i, category_table in enumerate(df_category_table):
        current_canon_status = 'Canon'
        
        # find the rows for subcategories
        rows = category_table.find_all('tr')
        # print(rows)
        for row in rows:

            th = row.find('th')
            if th:
                subcategory_text = th.get_text(strip=True)
                # if "Related Atricles" in subcategory_text
                if 'Canon:' in subcategory_text:
                    current_canon_status = 'Canon'
                if 'Non-Canon:' in subcategory_text:
                    current_canon_status = 'Non-Canon'
                if any(x in subcategory_text for x in ['Standard', 'Ancient', 'Mythical', 'Artificial']):
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
                            # add the devil fruit name and its url to our dictionary
                            df_url.append({
                                'status': fruit_canon_status,
                                'url': absolute_url
                            })
    print(f"\nGRAND TOTAL: {len(df_url)} devil fruits")
    return df_url

# function to collect all the devil fruit data from individual links
def get_fruit_details():
    df_id = 1
    devil_fruits = []
    url_list = get_df_urls() 
    for fruit in url_list:
        try:
            fruit_page = requests.get(fruit['url'])
            fruit_soup = BeautifulSoup(fruit_page.text, 'html.parser')
            
            # storing data for each individual fruit here
            found_data= {'id': df_id}
            # the <section> tag with all the data
            fruit_section = fruit_soup.find('aside', class_='portable-infobox pi-background pi-border-color pi-theme-DevilFruit pi-layout-default')
            
            if fruit_section:
                # get the name of the devil fruit
                fruit_title = fruit_section.find('h2', attrs={'data-source': 'title'})
            if fruit_title:
                fruit_name = fruit_title.get_text(strip=True)
                found_data['name'] = fruit_name  # add the fruit name
                print(found_data['name'])
                
            # fruit_section = fruit_card.find('div', attrs={'data-source': 'meaning'})
            if not fruit_section:
                print(f"  No fruit card found for {fruit['name']}")
                continue
            # For the <div>'s in <section>
            fruit_data = fruit_section.find_all('div',  class_='pi-item pi-data pi-item-spacing pi-border-color')

            for data in fruit_data:
                data_source = data.get('data-source')
                value_div = data.find('div', class_='pi-data-value pi-font')
                if not value_div:
                    continue
                # to remove the footnotes
                for sup in value_div.find_all('sup'):
                    sup.decompose()
                for small in value_div.find_all('small'):
                    small.decompose()
                
                # a way to separate keys that have multiple values for JSON
                if data_source in ['ename', 'jname', 'meaning', 'type', 'user']:
                    # using a slash to separate them, too many ,'s and ;'s
                    value = value_div.get_text(separator=' / ', strip=True)
                else:
                    value = value_div.get_text()

                if data_source =='jname':
                    found_data['japanese Name'] = value
                elif data_source =='ename':
                    found_data['english Name'] = value
                elif data_source =='meaning':
                    found_data['meaning']= value
                elif data_source =='fruit':
                    found_data['fruit debut'] = value
                elif data_source =='first':
                    found_data['usage debut'] = value
                elif data_source =='type':
                    found_data['type'] = value
                elif data_source == 'previous':
                    found_data['previous user'] = value
                elif data_source =='user':
                    found_data['current user'] = value
            # move the status and url to the end
            found_data['status'] = fruit['status']
            found_data['url'] = fruit['url']

            print(found_data)
            devil_fruits.append(found_data)
            # increment id numbers
            df_id += 1
        
        except Exception as e:
            print(f"Error processing {fruit['url']}: {e}")
    return devil_fruits

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
    df = get_fruit_details()
    # get_fruit_details()
    print("Adding scraped devil fruits to a json file")
    filename = save_to_json(df, "devil_fruits.json")
    print(f"{filename} created successfully!\n\n")

if __name__ == "__main__":
    main()
