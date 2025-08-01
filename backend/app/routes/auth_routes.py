from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.extensions import db,jwt
from app.models.user import User
from datetime import timedelta

#create a blueprint for Authentication routes
auth_bp= Blueprint('auth_bp', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Registers a new user.
    Expects JSON data with 'username', 'email', 'password', and 'role'.
    Role can be 'Donor', 'NGO', or 'Admin'.
    """
    data = request.get_json()
    print("Received register payload:", data) 
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role', 'Donor') # Default role is 'Donor'

    # Basic input validation
    if not all([username, email, password]):
        return jsonify({"message": "Missing username, email, or password"}), 400

    if role not in ['Donor', 'NGO', 'Admin']:
        return jsonify({"message": "Invalid role specified"}), 400

    # Check if user already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 409
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 409

    # Create new user
    new_user = User(username=username, email=email, role=role)
    new_user.set_password(password) # Hash the password

    # NGOs need to be approved by an admin
    if role == 'NGO':
        new_user.is_approved = False
    elif role == 'Admin':
        # For initial setup, allow admin registration.
        # In a real app, admin creation might be a separate, more restricted process.
        new_user.is_approved = True # Admins are self-approved
    else: # Donor
        new_user.is_approved = True # Donors are self-approved

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": f"User {username} registered successfully. Role: {role}. Approval status: {'Pending' if not new_user.is_approved else 'Approved'}"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred during registration", "error": str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Logs in a user and returns a JWT access token.
    Expects JSON data with 'email' and 'password'.
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "Invalid JSON"}), 400

    email = data.get('email')
    password = data.get('password')

    if not all([email, password]):
        return jsonify({"message": "Missing email or password"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid email or password"}), 401

    # Check if NGO is approved before allowing login
    if user.role == 'NGO' and not user.is_approved:
        return jsonify({"message": "Your NGO account is pending admin approval."}), 403

    # Create an access token
    # The identity can be any data that is used to identify the user
    # in subsequent requests (e.g., user ID, email)
    access_token = create_access_token(identity={'id': user.id, 'role': user.role}, expires_delta=timedelta(hours=1))
    return jsonify(access_token=access_token, user_id=user.id, role=user.role), 200

@auth_bp.route('/protected', methods=['GET'])
@jwt_required() # This decorator protects the route
def protected():
    """
    A protected route to test JWT authentication.
    Requires a valid JWT in the Authorization header.
    """
    current_user_identity = get_jwt_identity() # Get the identity from the JWT
    return jsonify(logged_in_as=current_user_identity), 200
