from bs4 import BeautifulSoup
import requests
import json
from datetime import datetime

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
    print("Empty for now!")
    
if __name__ == "__main__":
    main()