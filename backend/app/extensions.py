# app/extensions.py
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_mail import Mail
from flask_marshmallow import Marshmallow # Assuming you'll use Marshmallow here

db = SQLAlchemy()
jwt = JWTManager()
migrate = Migrate()
mail = Mail()
ma = Marshmallow() # Initialize Marshmallow here