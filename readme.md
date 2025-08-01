# PlsFundMe
- PlsFundMe is an online charity management system designed to connect donors with local organizations in need. By leveraging technology, we aim to streamline funding, expand the reach of charities, and build transparency and trust in every transaction.

## Developers
- Tedd James,Brian Omuga,Arnold Korir,Dedan Kiarie,Moriaso Salaon.

## The Challenge
- Local charity organizations have been profoundly affected by recent economic shifts. As donors face tighter budgets, support for essential community programs has dwindled, leaving beneficiaries vulnerable. Simultaneously, NGOs struggle to find new donors, creating a bleak funding landscape.

### Our Vision
- Empowering Kindness Through Technology
- PlsFundMe transforms the charity landscape by providing a seamless platform for organizations and individuals to secure vital funding and connect with a broader, diverse donor base.

## Pillars of Impact
- Streamlined Funding: Charities can request and receive donations with ease.
- Expanded Reach: Organizations gain access to a diverse pool of potential donors.
- Transparency & Trust: Clear reporting and accountability for every transaction.

## Key Features
- Robust user authentication (Log in & Sign up)
- Role-based access control (Donor, NGO, Admin)
- Admin-managed donation categories
- NGO request approval workflow
- Flexible donation amounts and category filtering
- Centralized data storage for all records
  
## Architecture & Modules
- PlsFundMe is composed of three interconnected modules to serve all stakeholders:

### Admin Module
- System oversight, user and category management, and approvals.

### NGO Module
- Create, view, and track donation requests; manage impact reporting.

### Donor Module
- Browse categories, make donations, and track giving history.

### Minimum Viable Product
- Our MVP focuses on delivering essential capabilities that create immediate value:
 1. User Authentication & Sign-up
 2. Role-Based Access Control
 3. Admin Donation Category Management
 4. NGO Donation Request Creation & Approval Workflow
 5. Flexible Donation Options
 6. Category-Based Filtering for Donors
 7. Centralized Data Persistence

## Technical Stack
- Backend: Python Flask
- Database: PostgreSQL
- Frontend: React.js & Redux Toolkit
- Design/Wireframes: Figma (Mobile-First)
- Testing: Pytest (backend) & Jest (frontend)

## Design & UX
- Our Figma wireframes emphasize a mobile-first approach, prioritizing accessibility and ease of use. Intuitive navigation and clear presentation of information enable NGOs and donors to interact with the platform effortlessly.

## Getting Started
- Follow these steps to run PlsFundMe locally:

  ### Clone the repository
    ```bash
    git clone git@github.com:teddjames/online-charity-management.git
    cd online-charity-management.git
    ```

  ### Backend setup
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    flask db upgrade
    flask run
    ```
    
  ### Frontend setup
    ```bash
    cd frontend
    npm install
    npm start
    ```
    
## Environment Variables
- Create a .env file in backend/ with your database URL and secret keys:
  ```bash
  DATABASE_URL=postgresql://user:pass@localhost:5432/plsfundme
  SECRET_KEY=your_secret_key
  ```

## Next Steps
- User Testing: Gather feedback from NGOs, donors, and admins for refinements.
- Launch & Iterate: Deploy MVP, collect usage data, and continuously improve.
- Feature Roadmap: Expand payment gateways, add social sharing, and advanced analytics.

## Contribution
- We welcome contributions! Please follow our feature branching strategy and descriptive commit guidelines:
  - Fork the repository
  - Create a feature branch (git checkout -b feat/YourFeature)
  - Commit your changes with descriptive messages
  - Push to your branch and open a Pull Request

