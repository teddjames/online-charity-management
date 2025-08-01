from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from app.extensions import db
from app.models.user import User
from app.models.cause import Category
from app.models.donation import DonationRequest, Donation
from app.schemas.cause_schema import CategorySchema
from app.schemas.donation_schema import DonationRequestSchema
from app.utils.decorators import admin_required
from datetime import datetime
from sqlalchemy import func

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api/admin')

category_schema = CategorySchema()
categories_schema = CategorySchema(many=True)
donation_request_schema = DonationRequestSchema()
donation_requests_schema = DonationRequestSchema(many=True)

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_dashboard_stats():
    try:
        total_ngos = User.query.filter_by(role='NGO').count()
        pending_approvals = User.query.filter_by(role='NGO', is_approved=False).count()
        total_donations = db.session.query(func.sum(Donation.amount_donated)).scalar() or 0

        stats = {
            "totalNgos": total_ngos,
            "pendingApprovals": pending_approvals,
            "totalDonations": float(total_donations)
        }
        return jsonify(stats), 200
    except Exception as e:
        return jsonify({"message": "Failed to retrieve stats", "error": str(e)}), 500

@admin_bp.route('/ngos/pending', methods=['GET'])
@jwt_required()
@admin_required
def get_pending_ngos():
    pending_ngos = User.query.filter_by(role='NGO', is_approved=False).all()
    output = []
    for ngo in pending_ngos:
        output.append({
            'id': ngo.id,
            'name': ngo.username,
            'email': ngo.email,
            'date_joined': ngo.created_at.strftime('%Y-%m-%d')
        })
    return jsonify(output), 200

@admin_bp.route('/ngos/<string:ngo_id>/approve', methods=['POST'])
@jwt_required()
@admin_required
def approve_ngo(ngo_id):
    ngo = User.query.get(ngo_id)
    if not ngo or ngo.role != 'NGO':
        return jsonify({"message": "NGO not found"}), 404
    ngo.is_approved = True
    db.session.commit()
    return jsonify({"message": f"NGO {ngo.username} has been approved."}), 200

@admin_bp.route('/ngos/<string:ngo_id>/reject', methods=['POST'])
@jwt_required()
@admin_required
def reject_ngo(ngo_id):
    ngo = User.query.get(ngo_id)
    if not ngo or ngo.role != 'NGO':
        return jsonify({"message": "NGO not found"}), 404
    db.session.delete(ngo)
    db.session.commit()
    return jsonify({"message": f"NGO {ngo.username} has been rejected and removed."}), 200

@admin_bp.route('/donation-requests', methods=['GET'])
@jwt_required()
@admin_required
def get_all_donation_requests():
    donation_requests = DonationRequest.query.order_by(DonationRequest.created_at.desc()).all()
    return jsonify(donation_requests_schema.dump(donation_requests)), 200

@admin_bp.route('/donation-requests/<string:request_id>/approve', methods=['POST'])
@jwt_required()
@admin_required
def approve_donation_request(request_id):
    donation_request = DonationRequest.query.get(request_id)
    if not donation_request:
        return jsonify({"message": "Donation request not found"}), 404

    if donation_request.status != 'Pending':
        return jsonify({"message": f"Request is already '{donation_request.status}'."}), 400

    donation_request.status = 'Approved'
    db.session.commit()
    return jsonify({"message": "Donation request approved successfully"}), 200

@admin_bp.route('/donation-requests/<string:request_id>/reject', methods=['POST'])
@jwt_required()
@admin_required
def reject_donation_request(request_id):
    donation_request = DonationRequest.query.get(request_id)
    if not donation_request:
        return jsonify({"message": "Donation request not found"}), 404

    if donation_request.status != 'Pending':
        return jsonify({"message": f"Request is already '{donation_request.status}'."}), 400

    donation_request.status = 'Rejected'
    db.session.commit()
    return jsonify({"message": "Donation request rejected successfully"}), 200

@admin_bp.route('/categories', methods=['POST'])
@jwt_required()
@admin_required
def create_category():
    data = request.get_json()
    validated_data = category_schema.load(data)
    new_category = Category(**validated_data)
    db.session.add(new_category)
    db.session.commit()
    return jsonify(category_schema.dump(new_category)), 201

@admin_bp.route('/categories', methods=['GET'])
@jwt_required()
@admin_required
def get_categories():
    categories = Category.query.all()
    return jsonify(categories_schema.dump(categories)), 200
