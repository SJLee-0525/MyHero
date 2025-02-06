# test_creds.py
import json
from datetime import datetime
from google.oauth2 import service_account
import google.auth.transport.requests

def inspect_credentials():
    try:
        creds_path = "/home/ssafy/hero/stt/credentials/google_cloud_key.json"
        with open(creds_path, 'r') as f:
            creds_data = json.load(f)
            print("1. Credentials file contents:")
            print(f"   - type: {creds_data.get('type')}")
            print(f"   - project_id: {creds_data.get('project_id')}")
            print(f"   - private_key_id: {creds_data.get('private_key_id')[:8]}...")
            print(f"   - client_email: {creds_data.get('client_email')}")
            print(f"   - token_uri: {creds_data.get('token_uri')}")
        
        print(f"\n2. Current system time: {datetime.now()}")
        
        credentials = service_account.Credentials.from_service_account_file(
            creds_path,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        
        print("\n3. Credentials object info:")
        print(f"   - Service account: {credentials.service_account_email}")
        print(f"   - Valid: {credentials.valid}")
        print(f"   - Expired: {credentials.expired}")
        
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    inspect_credentials()