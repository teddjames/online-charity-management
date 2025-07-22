from flask import Flask
from dotenv import load_dotenv
import os
import marshmallow

# Load environment variables from .env file
load_dotenv()

# Import extensions and config
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
    migrate.init_app(app, db)

    print(f"DEBUG: Marshmallow version in app context: {marshmallow.__version__}")

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.ngo_routes import ngo_bp
    from app.routes.donor_routes import donor_bp 

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(ngo_bp)
    app.register_blueprint(donor_bp) 

    # Import models so that SQLAlchemy knows about them
    from app.models import user, ngo, donor, cause, donation

    return app
