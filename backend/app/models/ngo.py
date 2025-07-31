import uuid
from datetime import datetime
from app.extensions import db

class NGOProfile(db.Model):
    """
    NGOProfile model representing additional details for NGO users.
    """
    __tablename__ = 'ngo_profiles'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), unique=True, nullable=False)
    organization_name = db.Column(db.String(120), unique=True, nullable=False)
    registration_number = db.Column(db.String(80), unique=True, nullable=True) # Optional
    contact_person = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    address = db.Column(db.String(255), nullable=True)
    website_url = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationship to individual DonationRequest records
    # Add overlaps to resolve SAWarning
    # donation_requests = db.relationship('DonationRequest', backref='ngo_obj', lazy=True, cascade="all, delete-orphan", overlaps="ngo_obj,ngo")
    donation_requests = db.relationship(
    'DonationRequest',
    back_populates='ngo',
    lazy=True,
    cascade="all, delete-orphan"
)

    

    def __repr__(self):
        return f'<NGOProfile {self.organization_name}>'