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
    ngo = db.relationship('NGOProfile', backref='donation_requests', lazy=True)
    category = db.relationship('Category', backref='donation_requests', lazy=True)
    approved_by = db.relationship('User', backref='approved_requests', lazy=True) # Link to User (Admin) who approved

    def __repr__(self):
        return f'<DonationRequest {self.title} (Status: {self.status})>'