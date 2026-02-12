import requests
import json
import sys

BASE_URL = "http://localhost:5001"

def register():
    url = f"{BASE_URL}/auth/register"
    payload = {
        "email": "test-admin@golfwire.com",
        "password": "password123",
        "name": "Test Admin",
        "role": "ADMIN"  # Trying to set role, though default is USER. Prisma might allow it if not stripped.
    }
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 201:
            return response.json()
        elif response.status_code == 401: # User already exists
            return login()
        else:
            print(f"Registration failed: {response.status_code} {response.text}")
            return None
    except Exception as e:
        print(f"Error connecting to backend: {e}")
        return None

def login():
    url = f"{BASE_URL}/auth/login"
    payload = {
        "email": "test-admin@golfwire.com",
        "password": "password123"
    }
    response = requests.post(url, json=payload)
    if response.status_code == 201: # NestJS typically returns 201 for POST
        return response.json()
    else:
        print(f"Login failed: {response.status_code} {response.text}")
        return None

def create_how_to_news(token, user_id):
    url = f"{BASE_URL}/golf/news"
    headers = {
        "Authorization": f"Bearer {token}"
    }
    
    # Payload simulating what the frontend sends for a "How To" article
    # Based on NewsManagement.tsx, fixedCategory="HOW-TO"
    payload = {
        "title": "Test How To Article",
        "excerpt": "This is a test excerpt for a How To article.",
        "content": "<p>This is the content of the article.</p>",
        "image": "https://via.placeholder.com/150",
        "categoryId": "", # If category doesn't exist in DB, it sends empty string
        "category": "HOW-TO", # The fixed category name
        "subTagId": "",
        "type": "REGULAR",
        "status": "PUBLISHED",
        "publishedAt": "2026-02-12T12:00",
        "authorId": "staff" # Assuming 'staff' author exists from seed
    }
    
    response = requests.post(url, json=payload, headers=headers)
    
    print(f"Create News Response Code: {response.status_code}")
    print(f"Create News Response Body: {response.text}")

    if response.status_code == 201:
        print("SUCCESS: News created successfully!")
    else:
        print("FAILURE: Could not create news.")

if __name__ == "__main__":
    print("Step 1: Authenticating...")
    auth_data = register()
    
    if auth_data and 'access_token' in auth_data:
        token = auth_data['access_token']
        user = auth_data.get('user', {})
        print(f"Authenticated as {user.get('email')}")
        
        print("\nStep 2: Attempting to create 'How To' news...")
        create_how_to_news(token, user.get('id'))
    else:
        print("Authentication failed. Aborting.")
