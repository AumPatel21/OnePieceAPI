# Script used to upload scraped data into PostgreSQL database

import psycopg2
import json
import os

DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_NAME = os.getenv('DB_NAME', 'onepiece')
DB_USER = os.getenv('DB_USER', 'aum') 
DB_PASSWORD = os.getenv('DB_PASSWORD', 'password')

def load_character_data():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port="5432"
        )
        print("Successfully connected to PostgreSQL!")
        cursor = conn.cursor()
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        exit()
        
    with open("data/characters.json") as ch:
        characters = json.load(ch)
    
    insert_character = "INSERT INTO characters (id, name, japanese_name, df_id, debut, affiliations, occupation, origin, residence, alias, epithet, status, age, birthday, blood_type, bounty, url) VALUES (%(id)s, %(name)s, %(japanese_name)s,  %(df_id)s, %(debut)s, %(affiliations)s, %(occupation)s, %(origin)s, %(residence)s, %(alias)s, %(epithet)s, %(status)s, %(age)s, %(birthday)s, %(blood_type)s, %(bounty)s, %(url)s) ON CONFLICT DO NOTHING"
    for char in characters:
        char_data = {
            'id': char.get('id'),
            'name': char.get('name'),
            'japanese_name': char.get('japanese_name'),
            'df_id': char.get('df_id'),
            'debut': char.get('debut'),
            'affiliations': char.get('affiliations'),
            'occupation': char.get('occupation'),
            'origin': char.get('origin'),
            'residence': char.get('residence'),
            'alias': char.get('alias'),
            'epithet': char.get('epithet'),
            'status': char.get('status'),
            'age': char.get('age'),
            'birthday': char.get('birthday'),
            'blood_type': char.get('blood_type'),
            'bounty': char.get('bounty'),
            'url': char.get('url'),
        }
        try:
            cursor.execute(insert_character, char_data)
            conn.commit()
        except psycopg2.Error as e:
            print(f"Error inserting character JSON data: {e}")
            conn.rollback()
    cursor.close()
    conn.close()


def load_df_data():
    try:
        conn = psycopg2.connect(
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASSWORD,
            host=DB_HOST,
            port="5432"
        )
        print("Successfully connected to PostgreSQL!")
        cursor = conn.cursor()
    except psycopg2.Error as e:
        print(f"Error connecting to PostgreSQL: {e}")
        exit()
        
    with open("data/devil_fruits.json") as d:
        devil_fruits = json.load(d)
        
    # comand to insert df data into the table
    insert_df = "INSERT INTO devil_fruits (id, name, japanese_name, english_name, meaning, fruit_debut, usage_debut, type, previous_owner, current_owner, status, url) VALUES (%(id)s, %(name)s, %(japanese_name)s, %(english_name)s, %(meaning)s, %(fruit_debut)s, %(usage_debut)s, %(type)s, %(previous_owner)s, %(current_owner)s, %(status)s, %(url)s) ON CONFLICT DO NOTHING"
    for df in devil_fruits:
        df_data = {
            'id': df.get('id'),
            'name': df.get('name'),
            'japanese_name': df.get('japanese_name'),
            'english_name': df.get('english_name'),
            'meaning': df.get('meaning'),
            'fruit_debut': df.get('fruit_debut'),
            'usage_debut': df.get('usage_debut'),
            'type': df.get('type'),
            'previous_owner': df.get('previous_user'),
            'current_owner': df.get('current_user'),
            'status': df.get('status'),
            'url': df.get('url'),
        }
        try:
            cursor.execute(insert_df, df_data)
            conn.commit()
        except psycopg2.Error as e:
            print(f"Error inserting devil druit JSON data: {e}")
            conn.rollback()
    cursor.close()
    conn.close()

def main():
    print("Loading devil fruit data to SQL database")
    load_df_data()
    print("Loading character data to SQL database")
    load_character_data()
    
if __name__ == "__main__":
    main()