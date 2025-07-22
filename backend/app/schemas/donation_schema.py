from marshmallow import Schema, fields, validate
from app.schemas.user_schema import NGOProfileSchema, DonorProfileSchema # Import DonorProfileSchema
from app.schemas.cause_schema import CategorySchema

class DonationSchema(Schema):
    """Schema for serializing/deserializing individual Donation model data."""
    id = fields.String(dump_only=True)
    donor_id = fields.String(required=True, load_only=True) # Donor ID is required for creation
    donation_request_id = fields.String(required=True, load_only=True) # Request ID is required for creation

    amount_donated = fields.Float(required=True, validate=validate.Range(min=0.01))
    transaction_id = fields.String(allow_none=True) # Placeholder for payment gateway ID

    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    # Nested schemas for richer data representation on GET requests
    donor = fields.Nested(DonorProfileSchema, dump_only=True)
    # We might nest the DonationRequest summary here if needed, but often
    # it's better to get the request details separately or limit nested depth.
    # donation_request = fields.Nested(DonationRequestSchema, dump_only=True) # Careful with circular dependencies or too much nesting

class DonationRequestSchema(Schema):
    """Schema for serializing/deserializing DonationRequest model data."""
    id = fields.String(dump_only=True)
    ngo_id = fields.String(required=True, load_only=True)
    category_id = fields.String(required=True, load_only=True)

    title = fields.String(required=True, validate=validate.Length(min=5, max=255))
    description = fields.String(required=True, validate=validate.Length(min=20))
    amount_needed = fields.Float(required=True, validate=validate.Range(min=0.01))
    amount_received = fields.Float(dump_only=True)
    image_url = fields.Url(allow_none=True)

    status = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    approved_by_admin_id = fields.String(dump_only=True)
    approval_date = fields.DateTime(dump_only=True)

    # Nested schemas for richer data representation on GET requests
    ngo = fields.Nested(NGOProfileSchema, dump_only=True)
    category = fields.Nested(CategorySchema, dump_only=True)