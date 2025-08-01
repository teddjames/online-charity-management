from flask import Blueprint, jsonify
from app.models.donation import DonationRequest
from app.models.cause import Category
from app.schemas.donation_schema import DonationRequestSchema
from app.schemas.cause_schema import CategorySchema

cause_bp = Blueprint('cause_bp', __name__, url_prefix='/api/causes')

# Initialize schemas
donation_request_schema = DonationRequestSchema()
donation_requests_schema = DonationRequestSchema(many=True)
categories_schema = CategorySchema(many=True)

@cause_bp.route('/approved', methods=['GET'])
def get_approved_donation_requests():
    """
    Returns a list of all approved donation requests. Publicly accessible.
    """
    approved_requests = DonationRequest.query.filter_by(status='Approved').all()
    return jsonify(donation_requests_schema.dump(approved_requests)), 200

@cause_bp.route('/categories', methods=['GET'])
def get_all_categories():
    """
    Returns a list of all categories. Publicly accessible.
    """
    categories = Category.query.all()
    return jsonify(categories_schema.dump(categories)), 200

# --- NEW ROUTE TO GET A SINGLE CAUSE ---
@cause_bp.route('/<string:request_id>', methods=['GET'])
def get_single_approved_request(request_id):
    """
    Returns the details of a single approved donation request. Publicly accessible.
    """
    donation_request = DonationRequest.query.filter_by(id=request_id, status='Approved').first_or_404()
    return jsonify(donation_request_schema.dump(donation_request)), 200
