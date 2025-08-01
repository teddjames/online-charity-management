import os
import click
from datetime import datetime, timedelta
from flask.cli import with_appcontext
from app.extensions import db
from app.models.user import User
from app.models.ngo import NGOProfile
from app.models.donor import DonorProfile
from app.models.cause import Category
from app.models.donation import DonationRequest, Donation
from decimal import Decimal

@click.command(name='seed')
@with_appcontext
def seed_data():
    """Clears existing data and seeds the database with sample data."""
    print("Starting database seed...")

    # --- 1. Clear Existing Data ---
    print("Clearing existing data...")
    Donation.query.delete()
    DonationRequest.query.delete()
    Category.query.delete()
    NGOProfile.query.delete()
    DonorProfile.query.delete()
    User.query.delete()
    db.session.commit()

    try:
        # --- 2. Create Categories ---
        print("Creating categories...")
        cat_education = Category(name='Education', description='Causes related to educational support.')
        cat_health = Category(name='Health', description='Causes related to medical and health support.')
        cat_environment = Category(name='Environment', description='Causes related to environmental conservation.')
        cat_animals = Category(name='Animals', description='Causes related to animal welfare.')
        cat_shelter = Category(name='Shelter', description='Causes related to providing housing and shelter.')
        db.session.add_all([cat_education, cat_health, cat_environment, cat_animals, cat_shelter])
        db.session.commit()

        # --- 3. Create Users and Profiles ---
        print("Creating users and profiles...")
        # Admin User
        admin_user = User(username='AdminUser', email='admin@example.com', role='Admin', is_approved=True)
        admin_user.set_password('password123')
        db.session.add(admin_user)

        # Approved NGO
        ngo_user_approved = User(username='Hope Foundation', email='ngo_approved@example.com', role='NGO', is_approved=True)
        ngo_user_approved.set_password('password123')
        db.session.add(ngo_user_approved)
        db.session.flush() # Flush to get the user ID
        ngo_profile_approved = NGOProfile(user_id=ngo_user_approved.id, organization_name='Hope Foundation', contact_person='John Doe', phone_number='123-456-7890', address='123 Hope St')
        db.session.add(ngo_profile_approved)

        # Pending NGO
        ngo_user_pending = User(username='Green World Initiative', email='ngo_pending@example.com', role='NGO', is_approved=False)
        ngo_user_pending.set_password('password123')
        db.session.add(ngo_user_pending)
        db.session.flush()
        ngo_profile_pending = NGOProfile(user_id=ngo_user_pending.id, organization_name='Green World Initiative', contact_person='Jane Smith', phone_number='987-654-3210', address='456 Green Ave')
        db.session.add(ngo_profile_pending)

        # Donor Users
        donor1 = User(username='Alice', email='alice@example.com', role='Donor', is_approved=True)
        donor1.set_password('password123')
        donor2 = User(username='Bob', email='bob@example.com', role='Donor', is_approved=True)
        donor2.set_password('password123')
        db.session.add_all([donor1, donor2])
        db.session.flush()
        donor1_profile = DonorProfile(user_id=donor1.id, first_name='Alice', last_name='Wonder')
        donor2_profile = DonorProfile(user_id=donor2.id, first_name='Bob', last_name='Builder')
        db.session.add_all([donor1_profile, donor2_profile])
        db.session.commit()

        # --- 4. Create Donation Requests (Causes) ---
        print("Creating donation requests (causes)...")
        cause1 = DonationRequest(ngo_id=ngo_profile_approved.id, category_id=cat_education.id, title='School Supplies for Kids', description='Help us provide books and stationery for 100 underprivileged children.', amount_needed=Decimal('5000.00'), status='Approved')
        cause2 = DonationRequest(ngo_id=ngo_profile_approved.id, category_id=cat_health.id, title='Medical Camp for Rural Village', description='Funding for a one-day medical camp providing free check-ups and medicine.', amount_needed=Decimal('15000.00'), status='Approved')
        cause3 = DonationRequest(ngo_id=ngo_profile_approved.id, category_id=cat_animals.id, title='New Shelter for Rescued Dogs', description='We need funds to build a new, larger shelter for rescued stray dogs.', amount_needed=Decimal('25000.00'), status='Pending')
        db.session.add_all([cause1, cause2, cause3])
        db.session.commit()

        # --- 5. Create Donations ---
        print("Creating donations...")
        # Donation for Cause 1 from Donor 1
        donation1 = Donation(donor_id=donor1_profile.id, donation_request_id=cause1.id, amount_donated=Decimal('150.00'))
        cause1.amount_received += Decimal('150.00')
        # Donation for Cause 2 from Donor 1
        donation2 = Donation(donor_id=donor1_profile.id, donation_request_id=cause2.id, amount_donated=Decimal('500.00'))
        cause2.amount_received += Decimal('500.00')
        # Donation for Cause 2 from Donor 2
        donation3 = Donation(donor_id=donor2_profile.id, donation_request_id=cause2.id, amount_donated=Decimal('750.00'))
        cause2.amount_received += Decimal('750.00')
        db.session.add_all([donation1, donation2, donation3])
        db.session.commit()

        print("Database seed completed successfully!")

    except Exception as e:
        print(f"An error occurred: {e}")
        db.session.rollback()

