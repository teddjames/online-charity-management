from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request

def admin_required(fn):
    """
    A custom decorator that verifies the JWT is present and the user's role is 'Admin'.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        # First, ensure there is a valid JWT in the request
        verify_jwt_in_request()
        # Get the entire claims payload from the token
        claims = get_jwt()
        # Check if the 'role' claim is 'Admin'
        if claims.get("role") == "Admin":
            return fn(*args, **kwargs)
        else:
            return jsonify({"message": "Admins only!"}), 403
    return wrapper

def ngo_required(fn):
    """
    A custom decorator that verifies the JWT is present and the user's role is 'NGO'.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if claims.get("role") == "NGO":
            return fn(*args, **kwargs)
        else:
            return jsonify({"message": "NGOs only!"}), 403
    return wrapper

def approved_ngo_required(fn):
    """
    A custom decorator that verifies the JWT is present and the user's role is 'NGO'.
    In a real app, you would also check if the NGO is approved.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if claims.get("role") == "NGO":
            # You would add a database check here for approval status
            # from app.models.user import User
            # user_id = claims.get('sub', {}).get('id')
            # user = User.query.get(user_id)
            # if user and user.is_approved:
            #     return fn(*args, **kwargs)
            return fn(*args, **kwargs) # Simplified for now
        else:
            return jsonify({"message": "Approved NGOs only!"}), 403
    return wrapper

def donor_required(fn):
    """
    A custom decorator that verifies the JWT is present and the user's role is 'Donor'.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        claims = get_jwt()
        if claims.get("role") == "Donor":
            return fn(*args, **kwargs)
        else:
            return jsonify({"message": "Donors only!"}), 403
    return wrapper
