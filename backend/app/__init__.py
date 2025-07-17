from flask import Flask
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from app.extensions import db, jwt, migrate
from app.config import Config

def create_app():
    """
    Factory function to create and configure the Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions with the app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app,db)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    app.register_blueprint(auth_bp)

    # Import models so that SQLAlchemy knows about them
    # This is important for db.create_all() to work correctly
    from app.models.user import User
    # from app.models import ngo, donor, cause, donation # Will be imported later

    # Create database tables if they don't exist
    # In a production environment, you would use Flask-Migrate for migrations
    # with app.app_context():
    #     db.create_all()

    return app
