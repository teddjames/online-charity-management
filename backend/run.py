from app import create_app
from seed import seed_data
# Create the Flask application instance
app = create_app()
app.cli.add_command(seed_data)
if __name__ == '__main__':
    # Run the Flask development server
    # In a production environment, use a WSGI server like Gunicorn or uWSGI
    app.run(debug=True, port=5000)
