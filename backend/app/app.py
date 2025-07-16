
from flask import Flask, jsonify
import os
from app.config import Config
from app.extensions import db, jwt, migrate, mail # Import from extensions
from app.models.user import User # Import User model for user_lookup_loader

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    mail.init_app(app)

    # Import and register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.admin_routes import admin_bp
    from app.routes.ngo_routes import ngo_bp
    from app.routes.donor_routes import donor_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(ngo_bp, url_prefix='/api/ngo')
    app.register_blueprint(donor_bp, url_prefix='/api/donor')

    # JWT Callbacks
    @jwt.user_identity_loader
    def user_identity_lookup(user):
        """
        Returns the identity of the user (e.g., user.id) for JWT.
        """
        return user.id

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        """
        Loads the user object from the database based on the identity in the JWT.
        This is crucial for `current_user` in Flask-JWT-Extended.
        """
        identity = jwt_data["sub"]
        return User.query.filter_by(id=identity).first()

    @jwt.additional_claims_loader
    def add_claims_to_access_token(user):
        """
        Adds custom claims (like user roles) to the JWT payload.
        """
        return {"roles": user.role.value}

    # Error Handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"message": "Bad Request", "errors": str(error)}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({"message": "Unauthorized", "errors": str(error)}), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({"message": "Forbidden", "errors": str(error)}), 403

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"message": "Resource Not Found", "errors": str(error)}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        # Log the error for debugging in production
        app.logger.error('Server Error: %s', (error), exc_info=True)
        return jsonify({"message": "Internal Server Error", "errors": "Something went wrong on our side."}), 500

    return app