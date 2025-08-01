from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.extensions import db
from app.models.donor import DonorProfile
from app.models.donation import DonationRequest, Donation
from app.models.cause import Category
from app.schemas.donation_schema import DonationRequestSchema, DonationSchema
from app.utils.decorators import donor_required
from decimal import Decimal

donor_bp = Blueprint('donor_bp', __name__, url_prefix='/api/donors')

# Initialize schemas
donation_request_schema = DonationRequestSchema()
donation_requests_schema = DonationRequestSchema(many=True)
donation_schema = DonationSchema()
donations_schema = DonationSchema(many=True)

@donor_bp.route('/approved-requests', methods=['GET'])
@jwt_required()
@donor_required
def get_approved_donation_requests():
    """
    Retrieves a list of all approved donation requests.
    Supports filtering by category name.
    """
    category_name = request.args.get('category')
    query = DonationRequest.query.filter_by(status='Approved')

    if category_name:
        category = Category.query.filter_by(name=category_name).first()
        if category:
            query = query.filter_by(category_id=category.id)
        else:
            return jsonify({"message": "Category not found"}), 404

    donation_requests = query.all()
    return jsonify(donation_requests_schema.dump(donation_requests)), 200

@donor_bp.route('/approved-requests/<request_id>', methods=['GET'])
@jwt_required()
@donor_required
def get_single_approved_donation_request(request_id):
    """
    Retrieves details of a single approved donation request.
    """
    donation_request = DonationRequest.query.filter_by(id=request_id, status='Approved').first()
    if not donation_request:
        return jsonify({"message": "Approved donation request not found"}), 404
    return jsonify(donation_request_schema.dump(donation_request)), 200

@donor_bp.route('/donate/<request_id>', methods=['POST'])
@jwt_required()
@donor_required
def make_donation(request_id):
    """
    Allows a donor to make a donation to an approved request.
    """
    claims = get_jwt()
    user_id = claims.get('sub', {}).get('id')

    donor_profile = DonorProfile.query.filter_by(user_id=user_id).first()
    if not donor_profile:
        return jsonify({"message": "Donor profile not found. Please complete your donor profile first."}), 404

    donation_request = DonationRequest.query.filter_by(id=request_id, status='Approved').first()
    if not donation_request:
        return jsonify({"message": "Donation request not found or not approved"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    try:
        amount_donated = Decimal(data.get('amount_donated'))
        if amount_donated <= 0:
            return jsonify({"message": "Amount donated must be a positive number"}), 400
        if amount_donated > (donation_request.amount_needed - donation_request.amount_received):
            return jsonify({"message": "Donation amount exceeds remaining amount needed"}), 400
    except (ValueError, TypeError):
        return jsonify({"message": "Invalid amount_donated format"}), 400

    new_donation = Donation(
        donor_id=donor_profile.id,
        donation_request_id=donation_request.id,
        amount_donated=amount_donated
    )

    donation_request.amount_received += amount_donated

    if donation_request.amount_received >= donation_request.amount_needed:
        donation_request.status = 'Completed'

    try:
        db.session.add(new_donation)
        db.session.commit()
        return jsonify({"message": "Donation successful", "donation": donation_schema.dump(new_donation)}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred during donation", "error": str(e)}), 500

@donor_bp.route('/my-donations', methods=['GET'])
@jwt_required()
@donor_required
def get_my_donations():
    """
    Retrieves the donation history for the authenticated donor.
    """
    claims = get_jwt()
    user_id = claims.get('sub', {}).get('id')

    donor_profile = DonorProfile.query.filter_by(user_id=user_id).first()
    if not donor_profile:
        return jsonify({"message": "Donor profile not found."}), 404

    donations = Donation.query.filter_by(donor_id=donor_profile.id).all()
    return jsonify(donations_schema.dump(donations)), 200
