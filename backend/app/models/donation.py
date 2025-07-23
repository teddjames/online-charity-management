import uuid
from datetime import datetime
from app.extensions import db

class DonationRequest(db.Model):
    """
    DonationRequest model representing a request for donations made by an NGO.
    """
    __tablename__ = 'donation_requests'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ngo_id = db.Column(db.String(36), db.ForeignKey('ngo_profiles.id'), nullable=False)
    category_id = db.Column(db.String(36), db.ForeignKey('categories.id'), nullable=False)

    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    amount_needed = db.Column(db.Numeric(10, 2), nullable=False) # Decimal for currency
    amount_received = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    image_url = db.Column(db.String(255), nullable=True) # URL from Cloudinary

    status = db.Column(db.String(20), nullable=False, default='Pending') # 'Pending', 'Approved', 'Rejected', 'Completed'

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    approved_by_admin_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=True) # Admin who approved
    approval_date = db.Column(db.DateTime, nullable=True)

    # Relationships
    # Use back_populates to explicitly link to the 'donation_requests' relationship in NGOProfile
    ngo = db.relationship('NGOProfile', back_populates='donation_requests', lazy=True)
    # Use back_populates to explicitly link to the 'donation_requests' relationship in Category
    category = db.relationship('Category', back_populates='donation_requests', lazy=True)
    approved_by = db.relationship('User', backref='approved_requests', lazy=True) # Link to User (Admin) who approved

    # Relationship to individual donations made to this request
    # Use back_populates to explicitly link to the 'donation_request' relationship in Donation
    donations = db.relationship('Donation', back_populates='donation_request', lazy=True, cascade="all, delete-orphan")


class Donation(db.Model):
    """
    Donation model representing an individual donation transaction.
    """
    __tablename__ = 'donations'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    donor_id = db.Column(db.String(36), db.ForeignKey('donor_profiles.id'), nullable=False)
    donation_request_id = db.Column(db.String(36), db.ForeignKey('donation_requests.id'), nullable=False)
    amount_donated = db.Column(db.Numeric(10, 2), nullable=False)
    transaction_id = db.Column(db.String(255), nullable=True) # Placeholder for payment gateway transaction ID

    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    # Use back_populates to explicitly link to the 'donations' relationship in DonorProfile
    donor = db.relationship('DonorProfile', back_populates='donations', lazy=True)
    # Use back_populates to explicitly link to the 'donations' relationship in DonationRequest
    donation_request = db.relationship('DonationRequest', back_populates='donations', lazy=True)

    def __repr__(self):
        return f'<Donation {self.amount_donated} to Request {self.donation_request_id}>'