import uuid
from datetime import datetime
from app.extensions import db

class DonorProfile(db.Model):
    """
    DonorProfile model representing  details for Donor users.
    """
    __tablename__ = 'donor_profiles'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    first_name = db.Column(db.String(80), nullable=False)
    last_name = db.Column(db.String(80), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to individual Donation records
    # Use back_populates to explicitly link to the 'donor' relationship in Donation
    donations = db.relationship('Donation', back_populates='donor', lazy=True, cascade="all, delete-orphan")

    def __repr__(self):
        return f'<DonorProfile {self.first_name} {self.last_name}>'
