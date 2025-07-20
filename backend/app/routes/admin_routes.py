from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User # Needed for admin_required to check role
from app.models.cause import Category # Import the new Category model
from app.schemas.cause_schema import CategorySchema # Import the new Category schema
from app.utils.decorators import admin_required # Import the admin_required decorator

admin_bp = Blueprint('admin_bp', __name__, url_prefix='/api/admin')

# Initialize schemas
category_schema = CategorySchema()
categories_schema = CategorySchema(many=True) # For lists of categories

@admin_bp.route('/categories', methods=['POST'])
@jwt_required()
@admin_required # Only admins can create categories
def create_category():
    """
    Creates a new donation category. Admin only.
    Expects JSON data with 'name' and optional 'description'.
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    try:
        # Validate input data using Marshmallow schema
        validated_data = category_schema.load(data)
    except Exception as e:
        return jsonify({"message": "Validation error", "errors": str(e)}), 400

    name = validated_data.get('name')
    description = validated_data.get('description')

    # Check if category with this name already exists
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
@admin_required # Or you might make this public later if donors need to see categories
def get_all_categories():
    """
    Retrieves all donation categories. Admin only.
    """
    categories = Category.query.all()
    return jsonify(categories_schema.dump(categories)), 200

@admin_bp.route('/categories/<category_id>', methods=['GET'])
@jwt_required()
@admin_required # Or public
def get_category_by_id(category_id):
    """
    Retrieves a single donation category by ID. Admin only.
    """
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404
    return jsonify(category_schema.dump(category)), 200

@admin_bp.route('/categories/<category_id>', methods=['PUT'])
@jwt_required()
@admin_required # Only admins can update categories
def update_category(category_id):
    """
    Updates an existing donation category by ID. Admin only.
    Expects JSON data with 'name' and/or 'description'.
    """
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    try:
        # Load and validate data, updating the existing category instance
        # partial=True allows sending only fields you want to update
        updated_category_data = category_schema.load(data, instance=category, partial=True)
        # Marshmallow's load with instance=category automatically updates the object
        # but we iterate to ensure all fields are set (useful if not using instance directly)
        for key, value in updated_category_data.items():
            setattr(category, key, value)
    except Exception as e:
        return jsonify({"message": "Validation error", "errors": str(e)}), 400

    # Check for duplicate name if name is being updated
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
@admin_required # Only admins can delete categories
def delete_category(category_id):
    """
    Deletes a donation category by ID. Admin only.
    """
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"message": "Category not found"}), 404

    try:
        db.session.delete(category)
        db.session.commit()
        return jsonify({"message": "Category deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        # Consider handling IntegrityError if categories are linked to donation requests
        return jsonify({"message": "An error occurred while deleting the category", "error": str(e)}), 500