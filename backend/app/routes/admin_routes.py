from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.cause import Category
from app.models.donation import DonationRequest # Import DonationRequest
from app.schemas.cause_schema import CategorySchema
from app.schemas.donation_schema import DonationRequestSchema # Import DonationRequestSchema
from app.utils.decorators import admin_required
from datetime import datetime

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api/admin')

# Initialize schemas
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
donation_request_schema = DonationRequestSchema() # For single request
donation_requests_schema = DonationRequestSchema(many=True) # For lists of requests

# --- Category Management Routes (already implemented, keeping for context) ---
@admin_bp.route('/categories', methods=['POST'])
@jwt_required()
@admin_required
def create_category():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400
    try:
        validated_data = category_schema.load(data)
    except Exception as e:
        return jsonify({"message": "Validation error", "errors": str(e)}), 400
    name = validated_data.get('name')
    description = validated_data.get('description')
    if Category.query.filter_by(name=name).first():
        return jsonify({"message": f"Category '{name}' already exists"}), 409
    new_category = Category(name=name, description=description)
    try:
        db.session.add(new_category)
        db.session.commit()
        return jsonify(category_schema.dump(new_category)), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while creating the category", "error": str(e)}), 500

@admin_bp.route('/categories', methods=['GET'])
@jwt_required()
@admin_required
def get_all_categories():
    categories = Category.query.all()
    return jsonify(categories_schema.dump(categories)), 200

@admin_bp.route('/categories/<category_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_category_by_id(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404
    return jsonify(category_schema.dump(category)), 200

@admin_bp.route('/categories/<category_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    try:
        # Validate input without 'instance'
        validated_data = category_schema.load(data, partial=True)

        # Manually update fields on the model
        for key, value in validated_data.items():
            setattr(category, key, value)

    except Exception as e:
        return jsonify({"message": "Validation error", "errors": str(e)}), 400

    # Unique name constraint check
    if 'name' in data and data['name'] != category.name:
        if Category.query.filter(Category.name == data['name'], Category.id != category_id).first():
            return jsonify({"message": f"Category with name '{data['name']}' already exists"}), 409

    try:
        db.session.commit()
        return jsonify(category_schema.dump(category)), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while updating the category", "error": str(e)}), 500

@admin_bp.route('/categories/<category_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_category(category_id):
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404
    try:
        db.session.delete(category)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while deleting the category", "error": str(e)}), 500

# --- NEW Donation Request Management Routes for Admin ---

@admin_bp.route('/donation-requests', methods=['GET'])
@jwt_required()
@admin_required
def get_all_donation_requests():
    """
    Admin can view all donation requests (pending, approved, rejected, completed).
    """
    donation_requests = DonationRequest.query.all()
    return jsonify(donation_requests_schema.dump(donation_requests)), 200

@admin_bp.route('/donation-requests/<request_id>', methods=['GET'])
@jwt_required()
@admin_required
def get_single_donation_request(request_id):
    """
    Admin can view a single donation request by ID.
    """
    donation_request = DonationRequest.query.get(request_id)
    if not donation_request:
        return jsonify({"message": "Donation request not found"}), 404
    return jsonify(donation_request_schema.dump(donation_request)), 200

@admin_bp.route('/donation-requests/<request_id>/approve', methods=['PUT'])
@jwt_required()
@admin_required
def approve_donation_request(request_id):
    """
    Admin can approve a pending donation request.
    """
    donation_request = DonationRequest.query.get(request_id)
    if not donation_request:
        return jsonify({"message": "Donation request not found"}), 404

    if donation_request.status != 'Pending':
        return jsonify({"message": f"Donation request is already '{donation_request.status}'. Only 'Pending' requests can be approved."}), 400

    current_user_identity = get_jwt_identity()
    admin_user_id = current_user_identity['id']

    donation_request.status = 'Approved'
    donation_request.approved_by_admin_id = admin_user_id
    donation_request.approval_date = datetime.utcnow()

    try:
        db.session.commit()
        return jsonify({"message": "Donation request approved successfully", "request": donation_request_schema.dump(donation_request)}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while approving the request", "error": str(e)}), 500

@admin_bp.route('/donation-requests/<request_id>/reject', methods=['PUT'])
@jwt_required()
@admin_required
def reject_donation_request(request_id):
    """
    Admin can reject a pending donation request.
    """
    donation_request = DonationRequest.query.get(request_id)
    if not donation_request:
        return jsonify({"message": "Donation request not found"}), 404

    if donation_request.status != 'Pending':
        return jsonify({"message": f"Donation request is already '{donation_request.status}'. Only 'Pending' requests can be rejected."}), 400

    current_user_identity = get_jwt_identity()
    admin_user_id = current_user_identity['id'] # Store who rejected it, if desired

    donation_request.status = 'Rejected'
    # Optional: store which admin rejected it, and date
    donation_request.approved_by_admin_id = admin_user_id
    donation_request.approval_date = datetime.utcnow()

    try:
        db.session.commit()
        return jsonify({"message": "Donation request rejected successfully", "request": donation_request_schema.dump(donation_request)}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while rejecting the request", "error": str(e)}), 500