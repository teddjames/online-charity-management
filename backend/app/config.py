# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Config:
#     # Database configuration
#     # Replace with your PostgreSQL connection string
#     # Example: postgresql://your_app_user:your_strong_password@localhost:5432/charity_db
#     SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://arnold:arnold123@localhost:5432/charity_db')
#     SQLALCHEMY_TRACK_MODIFICATIONS = False

#     # JWT configuration
#     # Generate a strong secret key: import secrets; secrets.token_hex(32)
#     JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')
#     JWT_ACCESS_TOKEN_EXPIRES = 3600 # Token expires in 1 hour (3600 seconds)
import os

class Config:
        # Database configuration
        # Render will provide DATABASE_URL automatically for its PostgreSQL
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://arnold:arnold123@localhost:5432/charity_db')
        SQLALCHEMY_TRACK_MODIFICATIONS = False

        # JWT configuration
        JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'super-secret-key')
        JWT_ACCESS_TOKEN_EXPIRES = 3600

        # Other configurations (will be added later)
        SENDGRID_API_KEY = os.environ.get('SENDGRID_API_KEY')
        CLOUDINARY_CLOUD_NAME = os.environ.get('CLOUDINARY_CLOUD_NAME')
        CLOUDINARY_API_KEY = os.environ.get('CLOUDINARY_API_KEY')
        CLOUDINARY_API_SECRET = os.environ.get('CLOUDINARY_API_SECRET')

        # Add a flag for production/development
        FLASK_ENV = os.environ.get('FLASK_ENV', 'development')
        DEBUG = FLASK_ENV == 'development' # Debug mode only in development
        