from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.extensions import db
from app.models.ngo import NGOProfile
from app.models.cause import Category
from app.models.donation import DonationRequest
from app.schemas.donation_schema import DonationRequestSchema
from app.utils.decorators import approved_ngo_required
from decimal import Decimal
from marshmallow import ValidationError

ngo_bp = Blueprint('ngo_bp', __name__, url_prefix='/api/ngo')

# Initialize Marshmallow schemas
donation_request_schema = DonationRequestSchema()
donation_requests_schema = DonationRequestSchema(many=True)

@ngo_bp.route('/causes', methods=['POST'])
@jwt_required()
@approved_ngo_required
def create_donation_request():
    claims = get_jwt()
    user_id = claims.get('sub', {}).get('id')
    ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
    if not ngo_profile:
        return jsonify({"message": "NGO profile not found."}), 404

    data = request.get_json()
    try:
        # Use the full schema to validate the incoming data
        validated_data = donation_request_schema.load(data)
        
        new_request = DonationRequest(
            ngo_id=ngo_profile.id,
            category_id=validated_data['category_id'],
            title=validated_data['title'],
            description=validated_data['description'],
            amount_needed=Decimal(validated_data['amount_needed'])
        )
        db.session.add(new_request)
        db.session.commit()
        return jsonify(donation_request_schema.dump(new_request)), 201
    except ValidationError as err:
        return jsonify({"message": "Validation error", "errors": err.messages}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating donation request", "error": str(e)}), 500

@ngo_bp.route('/causes', methods=['GET'])
@jwt_required()
@approved_ngo_required
def get_my_donation_requests():
    claims = get_jwt()
    user_id = claims.get('sub', {}).get('id')
    ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
    if not ngo_profile:
        return jsonify({"message": "NGO profile not found."}), 404

    donation_requests = DonationRequest.query.filter_by(ngo_id=ngo_profile.id).all()
    return jsonify(donation_requests_schema.dump(donation_requests)), 200

@ngo_bp.route('/causes/<string:request_id>', methods=['PUT'])
@jwt_required()
@approved_ngo_required
def update_donation_request(request_id):
    claims = get_jwt()
    user_id = claims.get('sub', {}).get('id')
    ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
    if not ngo_profile:
        return jsonify({"message": "NGO profile not found."}), 404

    donation_request = DonationRequest.query.filter_by(id=request_id, ngo_id=ngo_profile.id).first()
    if not donation_request:
        return jsonify({"message": "Donation request not found or you do not have permission to edit it."}), 404

    data = request.get_json()
    donation_request.title = data.get('title', donation_request.title)
    donation_request.description = data.get('description', donation_request.description)
    if 'amount_needed' in data:
        donation_request.amount_needed = Decimal(data.get('amount_needed'))
    donation_request.category_id = data.get('category_id', donation_request.category_id)
    
    db.session.commit()
    return jsonify(donation_request_schema.dump(donation_request)), 200

@ngo_bp.route('/causes/<string:request_id>', methods=['DELETE'])
@jwt_required()
@approved_ngo_required
def delete_donation_request(request_id):
    claims = get_jwt()
    user_id = claims.get('sub', {}).get('id')
    ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
    if not ngo_profile:
        return jsonify({"message": "NGO profile not found."}), 404

    donation_request = DonationRequest.query.filter_by(id=request_id, ngo_id=ngo_profile.id).first()
    if not donation_request:
        return jsonify({"message": "Donation request not found or you do not have permission to delete it."}), 404

    db.session.delete(donation_request)
    db.session.commit()
    return jsonify({"message": "Donation request deleted successfully."}), 200
