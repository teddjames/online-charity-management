from flask import Flask, jsonify
from dotenv import load_dotenv
import os
import marshmallow
from sqlalchemy import inspect
from flask_cors import CORS
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

    # Enable CORS for the app
    CORS(app)

    from app.models import user, ngo, donor, cause, donation
    from app.models.user import User
    from app.models.ngo import NGOProfile
    from app.models.donor import DonorProfile
    from app.models.cause import Category
    from app.models.donation import Donation
    from app.models.donation import DonationRequest  # Assuming this model exists
    # from app import models
   # DEBUG: Use inspect to check registered models

    # DEBUG: Print registered models (for confirmation)
    print("Registered Models:")
    print(User.__name__)
    print(NGOProfile.__name__)
    print(DonorProfile.__name__)
    print(Category.__name__) # Added Category
    print(Donation.__name__) # Added Donation
    print(DonationRequest.__name__) # Added DonationRequest

    # # --- ADD THIS HEALTH CHECK ENDPOINT ---
    # @app.route('/health', methods=['GET'])
    # def health_check():
    #     return jsonify({"status": "ok", "message": "Service is healthy!"}), 200
    # # --- END OF HEALTH CHECK ENDPOINT ---
        # --- ADD THIS HEALTH CHECK ENDPOINT ---
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "ok", "message": "Service is healthy!"}), 200
    # --- END OF HEALTH CHECK ENDPOINT ---


    return app

