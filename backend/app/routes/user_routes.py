from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.extensions import db
from app.models.user import User
from app.models.ngo import NGOProfile
from app.models.donor import DonorProfile
from app.schemas.user_schema import UserSchema, NGOProfileSchema, DonorProfileSchema
from app.utils.decorators import ngo_required, donor_required

user_bp = Blueprint('user_bp', __name__, url_prefix='/api/users')

# Initialize schemas
user_schema = UserSchema()
ngo_profile_schema = NGOProfileSchema()
donor_profile_schema = DonorProfileSchema()

@user_bp.route('/me', methods=['GET'])
@jwt_required()
def get_my_profile():
    """
    Retrieves the profile of the currently authenticated user based on their role.
    """
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    user_role = current_user_identity['role']

    user = User.query.get(user_id)
    if not user:
        print(f"DEBUG: User not found for ID: {user_id}")
        return jsonify({"message": "User not found"}), 404

    response_data = user_schema.dump(user)

    if user_role == 'NGO':
        ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
        if ngo_profile:
            response_data['ngo_profile'] = ngo_profile_schema.dump(ngo_profile)
        else:
            print(f"DEBUG: NGO profile not found for user ID: {user_id}")
    elif user_role == 'Donor':
        donor_profile = DonorProfile.query.filter_by(user_id=user_id).first()
        if donor_profile:
            response_data['donor_profile'] = donor_profile_schema.dump(donor_profile)
        else:
            print(f"DEBUG: Donor profile not found for user ID: {user_id}")

    return jsonify(response_data), 200

@user_bp.route('/me', methods=['PUT'])
@jwt_required()
def update_my_profile():
    """
    Updates the profile of the currently authenticated user.
    Allows updating general user info and role-specific profile data.
    """
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    user_role = current_user_identity['role']

    user = User.query.get(user_id)
    if not user:
        print(f"DEBUG: PUT - User not found for ID: {user_id}")
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    print(f"DEBUG: PUT - Received data: {data}")

    if not data:
        print("DEBUG: PUT - Invalid JSON or empty body.")
        return jsonify({"message": "Invalid JSON"}), 400

    # Update general user fields (username, email, password)
    if 'username' in data and data['username'] != user.username:
        if User.query.filter_by(username=data['username']).first():
            print(f"DEBUG: PUT - Username '{data['username']}' already taken.")
            return jsonify({"message": "Username already taken"}), 409
        user.username = data['username']
        print(f"DEBUG: PUT - Updated username to: {user.username}")
    if 'email' in data and data['email'] != user.email:
        if User.query.filter_by(email=data['email']).first():
            print(f"DEBUG: PUT - Email '{data['email']}' already taken.")
            return jsonify({"message": "Email already taken"}), 409
        user.email = data['email']
        print(f"DEBUG: PUT - Updated email to: {user.email}")
    if 'password' in data:
        user.set_password(data['password'])
        print("DEBUG: PUT - Password updated.")

    # Update role-specific profile
    if user_role == 'NGO':
        ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
        print(f"DEBUG: PUT - NGO Profile found: {ngo_profile is not None}")
        # Create NGOProfile if it doesn't exist (e.g., if user registered as NGO but profile wasn't created yet)
        if not ngo_profile:
            print("DEBUG: PUT - Creating new NGOProfile.")
            ngo_profile = NGOProfile(user_id=user_id, organization_name=data.get('ngo_profile', {}).get('organization_name', 'Default NGO Name'))
            db.session.add(ngo_profile)

        # Load and validate NGO profile data using schema
        ngo_profile_data = data.get('ngo_profile', {})
        print(f"DEBUG: PUT - NGO profile data from request: {ngo_profile_data}")
        try:
            # Load data without instance, then manually update the object
            loaded_data = ngo_profile_schema.load(data=ngo_profile_data, partial=True)
            for key, value in loaded_data.items():
                setattr(ngo_profile, key, value)
            print(f"DEBUG: PUT - NGO Profile loaded and updated via schema. Updated fields: {loaded_data.keys()}")
        except Exception as e:
            db.session.rollback()
            print(f"DEBUG: PUT - Error loading NGO profile data: {e}")
            return jsonify({"message": "Invalid NGO profile data", "errors": str(e)}), 400

    elif user_role == 'Donor':
        donor_profile = DonorProfile.query.filter_by(user_id=user_id).first()
        print(f"DEBUG: PUT - Donor Profile found: {donor_profile is not None}")
        # Create DonorProfile if it doesn't exist
        if not donor_profile:
            print("DEBUG: PUT - Creating new DonorProfile.")
            donor_profile = DonorProfile(user_id=user_id, first_name=data.get('donor_profile', {}).get('first_name', 'Default'), last_name=data.get('donor_profile', {}).get('last_name', 'Donor'))
            db.session.add(donor_profile)

        # Load and validate Donor profile data using schema
        donor_profile_data = data.get('donor_profile', {})
        print(f"DEBUG: PUT - Donor profile data from request: {donor_profile_data}")
        try:
            # Load data without instance, then manually update the object
            loaded_data = donor_profile_schema.load(data=donor_profile_data, partial=True)
            for key, value in loaded_data.items():
                setattr(donor_profile, key, value)
            print(f"DEBUG: PUT - Donor Profile loaded and updated via schema. Updated fields: {loaded_data.keys()}")
        except Exception as e:
            db.session.rollback()
            print(f"DEBUG: PUT - Error loading Donor profile data: {e}")
            return jsonify({"message": "Invalid Donor profile data", "errors": str(e)}), 400

    try:
        db.session.commit()
        print("DEBUG: PUT - Database commit successful.")
        return jsonify({"message": "Profile updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        print(f"DEBUG: PUT - Database commit failed: {e}")
        return jsonify({"message": "An error occurred during profile update", "error": str(e)}), 500

# Example of a role-specific endpoint (will be moved to donor_routes.py later)
@user_bp.route('/donor_specific_data', methods=['GET'])
@donor_required # Only donors can access this
@jwt_required()
def get_donor_specific_data():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    donor_profile = DonorProfile.query.filter_by(user_id=user_id).first()
    if not donor_profile:
        return jsonify({"message": "Donor profile not found"}), 404
    return jsonify(donor_profile_schema.dump(donor_profile)), 200

# Example of a role-specific endpoint (will be moved to ngo_routes.py later)
@user_bp.route('/ngo_specific_data', methods=['GET'])
@ngo_required # Only NGOs can access this
@jwt_required()
def get_ngo_specific_data():
    current_user_identity = get_jwt_identity()
    user_id = current_user_identity['id']
    ngo_profile = NGOProfile.query.filter_by(user_id=user_id).first()
    if not ngo_profile:
        return jsonify({"message": "NGO profile not found"}), 404
    return jsonify(ngo_profile_schema.dump(ngo_profile)), 200
