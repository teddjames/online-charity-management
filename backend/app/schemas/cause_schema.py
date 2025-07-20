from marshmallow import Schema, fields, validate

class CategorySchema(Schema):
    """Schema for serializing/deserializing Category model data."""
    id = fields.String(dump_only=True) # Read-only for existing categories
    name = fields.String(required=True, validate=validate.Length(min=3, max=100))
    description = fields.String(allow_none=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
