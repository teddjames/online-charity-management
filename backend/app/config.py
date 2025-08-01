import os
from dotenv import load_dotenv

# This line loads the variables from your .env file
load_dotenv()

class Config:
    # Database configuration
    # This will now correctly load the URL from your .env file for local development
    # and from Render's environment variables when deployed.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'a-default-secret-key-for-dev')

    # Other configurations
    SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')