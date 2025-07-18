from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity

def role_required(required_role):
    """
    Decorator to restrict access to a route based on user role.
    Assumes JWT is already validated and user identity (including role) is available.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            current_user_identity = get_jwt_identity()
            if not current_user_identity or current_user_identity.get('role') != required_role:
                return jsonify({"message": f"Access denied: {required_role} role required"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def admin_required(fn):
    """Decorator to ensure only Admin users can access the route."""
    return role_required('Admin')(fn)

def ngo_required(fn):
    """Decorator to ensure only NGO users can access the route."""
    return role_required('NGO')(fn)

def donor_required(fn):
    """Decorator to ensure only Donor users can access the route."""
    return role_required('Donor')(fn)

# You can also create a decorator to check if a user is an NGO and approved
def approved_ngo_required(fn):
    """
    Decorator to ensure only approved NGO users can access the route.
    Requires fetching user from DB to check is_approved status.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        current_user_identity = get_jwt_identity()
        if not current_user_identity or current_user_identity.get('role') != 'NGO':
            return jsonify({"message": "Access denied: NGO role required"}), 403

        # You'll need to import User model here or pass it
        from app.models.user import User
        user = User.query.get(current_user_identity['id'])
        if not user or not user.is_approved:
            return jsonify({"message": "Access denied: Your NGO account is not yet approved by an admin."}), 403
        return fn(*args, **kwargs)
    return wrapper
