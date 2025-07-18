from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    """Schema for serializing User model data."""
    id = fields.String(dump_only=True)
    username = fields.String(required=True, validate=validate.Length(min=3, max=80))
    email = fields.Email(required=True)
    role = fields.String(dump_only=True) # Role is set during registration, not updated via this schema
    is_approved = fields.Boolean(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class NGOProfileSchema(Schema):
    """Schema for serializing/deserializing NGOProfile model data."""
    id = fields.String(dump_only=True)
    user_id = fields.String(dump_only=True) # User ID is derived from auth
    organization_name = fields.String(required=True, validate=validate.Length(min=3, max=120))
    registration_number = fields.String(allow_none=True, validate=validate.Length(max=80))
    contact_person = fields.String(required=True, validate=validate.Length(min=3, max=100))
    phone_number = fields.String(allow_none=True, validate=validate.Length(max=20))
    address = fields.String(allow_none=True, validate=validate.Length(max=255))
    website_url = fields.Url(allow_none=True, validate=validate.Length(max=255))
    description = fields.String(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

class DonorProfileSchema(Schema):
    """Schema for serializing/deserializing DonorProfile model data."""
    id = fields.String(dump_only=True)
    user_id = fields.String(dump_only=True) # User ID is derived from auth
    first_name = fields.String(required=True, validate=validate.Length(min=2, max=80))
    last_name = fields.String(required=True, validate=validate.Length(min=2, max=80))
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
