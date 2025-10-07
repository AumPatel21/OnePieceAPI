import psycopg2
import json

def load_character_data():
    try:
        conn = psycopg2.connect(
            dbname="onepiece",
            user="aum",
            password="password",
            host="localhost",
            port="5432"
        )
        cursor = conn.cursor()
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        exit()
    
    with open("data/characters.json") as f:
        characters = json.load(f)
    
    for char in characters:
        insert_query = "INSERT INTO characters (name, japanese_name, debut, affiliations, occupation, origin, residence, alias, epithet, status, age, birthday, blood_type, bounty, url, devil_fruit_id) VALUES (%(name)s, %(japanese name)s, %(debut)s, %(affiliations)s, %(occupation)s, %(origin)s, %(residence)s, %(alias)s, %(epithet)s, %(status)s, %(age)s, %(birthday)s, %(blood_type)s, %(bounty)s, %(url)s, %(devilFruitId)s) ON CONFLICT DO NOTHING"
        
        try:
            cursor.execute(insert_query, char)
            conn.commit()
        except psycopg2.Error as e:
            print(f"Error inserting JSON data: {e}")
            conn.rollback()
    cursor.close()
    conn.close()

def main():
    print("Loading data to SQL database")
    load_character_data()
    
if __name__ == "__main__":
    main()