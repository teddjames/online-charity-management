from flask import Blueprint, request, jsonify
from app.models.user import User
from app.models.donor import DonorProfile
from app.models.ngo import NGOProfile
from app.extensions import db
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth_bp', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'Donor')

    if not all([username, email, password]):
        return jsonify({"message": "Missing required fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 409
    
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already taken"}), 409

    new_user = User(username=username, email=email, role=role)
    new_user.set_password(password)
    
    if role == 'NGO':
        new_user.is_approved = False
    else:
        new_user.is_approved = True

    db.session.add(new_user)
    db.session.flush() 

    try:
        if role == 'Donor':
            donor_profile = DonorProfile(
                user_id=new_user.id,
                first_name=username,
                last_name="" 
            )
            db.session.add(donor_profile)
        elif role == 'NGO':
            # FIX: Provide default values for required NGO fields
            ngo_profile = NGOProfile(
                user_id=new_user.id,
                organization_name=username,
                contact_person=username, # Use username as a default
                phone_number="",        # Provide empty string
                address=""              # Provide empty string
            )
            db.session.add(ngo_profile)
        
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error during profile creation: {e}") 
        return jsonify({"message": "An error occurred during profile creation."}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        if user.role == 'NGO' and not user.is_approved:
            return jsonify({"message": "Your NGO account is pending admin approval."}), 403

        additional_claims = {
            "role": user.role,
            "username": user.username 
        }
        access_token = create_access_token(
            identity={"id": user.id}, 
            additional_claims=additional_claims
        )
        return jsonify(access_token=access_token, role=user.role)

    return jsonify({"message": "Invalid credentials"}), 401
