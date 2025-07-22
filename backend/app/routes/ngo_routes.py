from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.ngo import NGOProfile
from app.models.cause import Category
from app.models.donation import DonationRequest # Import the new DonationRequest model
from app.schemas.donation_schema import DonationRequestSchema # Import the new schema
from app.utils.decorators import approved_ngo_required # Ensure NGO is approved
from app.utils.cloudinary_helpers import upload_image # For image uploads

ngo_bp = Blueprint('ngo_bp', __name__, url_prefix='/api/ngo')

# Initialize schemas
donation_request_schema = DonationRequestSchema()
donation_requests_schema = DonationRequestSchema(many=True)

@ngo_bp.route('/donation-requests', methods=['POST'])
@jwt_required()
@approved_ngo_required # Only approved NGOs can create requests
def create_donation_request():
    """
    Allows an approved NGO to create a new donation request.
    Expects form-data for image and JSON for other fields.
    """
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']

    ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
    if not ngo_profile:
        return jsonify({"message": "NGO profile not found. Please complete your NGO profile first."}), 404

    # Get JSON data from form-data (if using multipart/form-data)
    # For file uploads, data often comes as form-data, not raw JSON
    try:
        data = request.form.to_dict() # Get form fields as dictionary
        # Handle amount_needed as a float
        if 'amount_needed' in data:
            data['amount_needed'] = float(data['amount_needed'])
    except Exception as e:
        return jsonify({"message": "Invalid form data format", "error": str(e)}), 400

    image_file = request.files.get('image')
    image_url = None

    if image_file:
        try:
            image_url = upload_image(image_file)
        except Exception as e:
            return jsonify({"message": "Image upload failed", "error": str(e)}), 500

    # Validate input data using Marshmallow schema
    # Use load_only fields for ngo_id and category_id
    try:
        # Pass ngo_id directly, as it's derived from the authenticated user
        data['ngo_id'] = ngo_profile.id
        validated_data = donation_request_schema.load(data)
    except Exception as e:
        return jsonify({"message": "Validation error for donation request data", "errors": str(e)}), 400

    # Verify category exists
    category = Category.query.get(validated_data['category_id'])
    if not category:
        return jsonify({"message": "Category not found"}), 404

    new_request = DonationRequest(
        ngo_id=ngo_profile.id,
        category_id=validated_data['category_id'],
        title=validated_data['title'],
        description=validated_data['description'],
        amount_needed=validated_data['amount_needed'],
        image_url=image_url # Store the Cloudinary URL
    )

    try:
        db.session.add(new_request)
        db.session.commit()
        # Return the dumped object with nested NGO and Category data
        return jsonify(donation_request_schema.dump(new_request)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while creating the donation request", "error": str(e)}), 500

@ngo_bp.route('/donation-requests', methods=['GET'])
@jwt_required()
@approved_ngo_required
def get_my_donation_requests():
    """
    Allows an approved NGO to view all their own donation requests.
    """
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']

    ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
    if not ngo_profile:
        return jsonify({"message": "NGO profile not found."}), 404

    donation_requests = DonationRequest.query.filter_by(ngo_id=ngo_profile.id).all()
    # Dump the requests with nested NGO and Category data
    return jsonify(donation_requests_schema.dump(donation_requests)), 200

@ngo_bp.route('/donation-requests/<request_id>', methods=['GET'])
@jwt_required()
@approved_ngo_required
def get_my_single_donation_request(request_id):
    """
    Allows an approved NGO to view a specific one of their own donation requests.
    """
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']

    ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
    if not ngo_profile:
        return jsonify({"message": "NGO profile not found."}), 404

    donation_request = DonationRequest.query.filter_by(id=request_id, ngo_id=ngo_profile.id).first()
    if not donation_request:
        return jsonify({"message": "Donation request not found or does not belong to your NGO"}), 404

    return jsonify(donation_request_schema.dump(donation_request)), 200