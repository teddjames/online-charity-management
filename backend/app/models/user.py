import uuid
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db

class User(db.Model):
    """
    User model representing all users (Admin, NGO, Donor) in the system.
    """
    __tablename__ = 'users'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='Donor') # 'Admin', 'NGO', 'Donor'
    is_approved = db.Column(db.Boolean, default=True) # For NGO approval by Admin
    two_fa_secret = db.Column(db.String(32), nullable=True) # For 2-Step Authentication

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships:
    # One-to-one relationship with NGOProfile if the user is an NGO
    ngo_profile = db.relationship('NGOProfile', backref='user', uselist=False, lazy=True, cascade="all, delete-orphan")
    # One-to-one relationship with DonorProfile if the user is a Donor
    donor_profile = db.relationship('DonorProfile', backref='user', uselist=False, lazy=True, cascade="all, delete-orphan")

    def set_password(self, password):
        """Hashes the password and stores it."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Checks if the provided password matches the hashed password."""
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username} ({self.role})>'