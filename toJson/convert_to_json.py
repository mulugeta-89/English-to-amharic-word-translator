import sqlite3
import json

# Connect to the SQLite database
conn = sqlite3.connect('ahun.sqlite')
cursor = conn.cursor()

# Execute a query to fetch all data from the 'dictionary' table
cursor.execute('SELECT _id, EN, AMH FROM dictionary')
rows = cursor.fetchall()

# Create a dictionary to store the data
translation_dict = {english_word.lower(): amharic_word for english_word, _, amharic_word in rows}

# Close the database connection
conn.close()

# Convert the dictionary to JSON and save it to a file
with open('translations.json', 'w', encoding='utf-8') as json_file:
    json.dump(translation_dict, json_file, ensure_ascii=False, indent=2)

print('Conversion completed. JSON file created: translations.json')
