import cloudinary
import cloudinary.uploader
from flask import current_app # To access app.config

def init_cloudinary():
    """
    Initializes Cloudinary configuration from Flask app config.
    Should be called within an app context.
    """
    cloudinary.config(
        cloud_name=current_app.config.get('CLOUDINARY_CLOUD_NAME'),
        api_key=current_app.config.get('CLOUDINARY_API_KEY'),
        api_secret=current_app.config.get('CLOUDINARY_API_SECRET')
    )

def upload_image(file):
    """
    Uploads an image file to Cloudinary.
    Args:
        file: A file-like object (e.g., from request.files).
    Returns:
        The URL of the uploaded image.
    Raises:
        Exception: If the upload fails.
    """
    if not file:
        raise ValueError("No file provided for upload.")

    # Ensure Cloudinary is configured
    init_cloudinary()

    try:
        # Upload the file
        # folder parameter helps organize uploads in Cloudinary
        upload_result = cloudinary.uploader.upload(file, folder="charity_requests")
        return upload_result['secure_url']
    except Exception as e:
        print(f"Cloudinary upload error: {e}")
        raise Exception(f"Failed to upload image to Cloudinary: {e}")