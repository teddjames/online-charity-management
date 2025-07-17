import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Database configuration
    # Replace with your PostgreSQL connection string
    # Example: postgresql://your_app_user:your_strong_password@localhost:5432/charity_db
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://arnold:arnold123@localhost:5432/charity_db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration
    # Generate a strong secret key: import secrets; secrets.token_hex(32)
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')
    JWT_ACCESS_TOKEN_EXPIRES = 3600 # Token expires in 1 hour (3600 seconds)
