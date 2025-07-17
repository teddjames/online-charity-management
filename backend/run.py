from app import create_app

# Create the Flask application instance
app = create_app()

if __name__ == '__main__':
    # Run the Flask development server
    # In a production environment, use a WSGI server like Gunicorn or uWSGI
    app.run(debug=True, port=5000)
