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
    
    # --- THIS IS THE KEY CHANGE FOR DEPLOYMENT ---
    # When deployed, Render provides a DATABASE_URL.
    # We also need to change the protocol from 'postgres' to 'postgresql' for SQLAlchemy.
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', '').replace(
        'postgres://', 'postgresql://') or \
        'sqlite:///' + os.path.join(basedir, 'app.db')
    # ---------------------------------------------
        
    SQLALCHEMY_TRACK_MODIFICATIONS = False
