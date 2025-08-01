from marshmallow import Schema, fields, validate
from app.schemas.user_schema import NGOProfileSchema
from app.schemas.cause_schema import CategorySchema
from decimal import Decimal

class DonationRequestSummarySchema(Schema):
    """A simplified schema for nesting inside other schemas."""
    id = fields.String(dump_only=True)
    title = fields.String(dump_only=True)
    ngo = fields.Nested(NGOProfileSchema, dump_only=True, only=("organization_name",))
    
    class Meta:
        fields = ("id", "title", "ngo")

class DonationSchema(Schema):
    """Schema for serializing individual Donation model data."""
    id = fields.String(dump_only=True)
    amount_donated = fields.Float(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    donation_request = fields.Nested(DonationRequestSummarySchema)

    class Meta:
        fields = ("id", "amount_donated", "created_at", "donation_request")

class DonationRequestSchema(Schema):
    """Full schema for validating and serializing DonationRequest model data."""
    id = fields.String(dump_only=True)
    ngo_id = fields.String(required=True, load_only=True)
    category_id = fields.String(required=True) # Required for loading

    title = fields.String(required=True, validate=validate.Length(min=5, max=255))
    description = fields.String(required=True, validate=validate.Length(min=20))
    amount_needed = fields.Decimal(
    required=True,
    as_string=True,
    validate=validate.Range(min=Decimal("0.01"))
)
    amount_received = fields.Float(dump_only=True)
    image_url = fields.Url(allow_none=True)

    status = fields.String(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    
    # Nested schemas for richer data representation on output
    ngo = fields.Nested(NGOProfileSchema, dump_only=True)
    category = fields.Nested(CategorySchema, dump_only=True)

