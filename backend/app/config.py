import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get the base directory of the project
basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

class Config:
    """
    Base configuration class. Contains default configuration settings.
    """
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a-very-secret-key'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'another-super-secret-key'
    
    # --- THIS IS THE KEY CHANGE ---
    # Force SQLite for local development to avoid conflicts with local .env files.
    # Use the production DATABASE_URL only when FLASK_ENV is 'production'.
    if os.environ.get('FLASK_ENV') == 'production':
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'app.db')
    # -----------------------------
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Cloudinary configuration (if you use it)
    CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
    CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
    CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')

    # SendGrid configuration (if you use it)
    SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
    SENDGRID_DEFAULT_FROM = os.environ.get('SENDGRID_DEFAULT_FROM')

