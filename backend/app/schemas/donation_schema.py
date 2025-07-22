from marshmallow import Schema, fields, validate
from app.schemas.user_schema import NGOProfileSchema # Import NGOProfileSchema
from app.schemas.cause_schema import CategorySchema # Import CategorySchema

class DonationRequestSchema(Schema):
    """Schema for serializing/deserializing DonationRequest model data."""
    id = fields.String(dump_only=True)
    ngo_id = fields.String(required=True, load_only=True) # NGO ID is required for creation, but dumped as nested object
    category_id = fields.String(required=True, load_only=True) # Category ID is required for creation, but dumped as nested object

    title = fields.String(required=True, validate=validate.Length(min=5, max=255))
    description = fields.String(required=True, validate=validate.Length(min=20))
    amount_needed = fields.Float(required=True, validate=validate.Range(min=0.01))
    amount_received = fields.Float(dump_only=True) # Can only be updated by donations, not directly via this schema
    image_url = fields.Url(allow_none=True) # Cloudinary URL

    status = fields.String(dump_only=True) # Status is managed by the system (Pending, Approved, etc.)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    approved_by_admin_id = fields.String(dump_only=True)
    approval_date = fields.DateTime(dump_only=True)

    # Nested schemas for richer data representation on GET requests
    ngo = fields.Nested(NGOProfileSchema, dump_only=True)
    category = fields.Nested(CategorySchema, dump_only=True)
