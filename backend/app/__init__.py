from flask import Flask, jsonify
from dotenv import load_dotenv
import os
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

    # --- CORRECT CORS CONFIGURATION ---
    origins = [
        "https://online-charity-frontend.onrender.com",
    ]
    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)
    # --- END OF CORS CONFIGURATION ---

    # Initialize extensions with the app
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.ngo_routes import ngo_bp
    from app.routes.donor_routes import donor_bp 
    from app.routes.cause_routes import cause_bp # 1. Import the new blueprint
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    # THIS IS THE FIX: Use a consistent, singular prefix
    app.register_blueprint(ngo_bp, url_prefix='/api/ngo')
    app.register_blueprint(donor_bp, url_prefix='/api/donors')
    app.register_blueprint(cause_bp, url_prefix='/api/causes') # 2. Register it
    # --- HEALTH CHECK ENDPOINT ---
    @app.route('/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "ok", "message": "Service is healthy!"}), 200
    # --- END OF HEALTH CHECK ENDPOINT ---

    return app
