import os
from flask.cli import FlaskGroup
from app import create_app
from app.extensions import db
from app.models.user import User # Import your models so Flask-Migrate can detect them

# Create the Flask app instance
app = create_app()

# Create a FlaskGroup instance to enable Flask CLI commands
cli = FlaskGroup(app)

# Add custom commands if needed (e.g., seed database)
@cli.command("create_test_data")
def create_test_data():
    """Creates some test data for development."""
    with app.app_context():
        print("Creating test data...")
        # Example: Create an admin user if not exists
        if not User.query.filter_by(role='Admin').first():
            admin_user = User(username='admin', email='admin@example.com', role='Admin', is_approved=True)
            admin_user.set_password('adminpassword')
            db.session.add(admin_user)
            db.session.commit()
            print("Admin user created.")
        else:
            print("Admin user already exists.")
        print("Test data creation complete.")

if __name__ == '__main__':
    cli()