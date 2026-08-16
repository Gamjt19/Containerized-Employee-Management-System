import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import get_config, DevelopmentConfig
from models import db
from routes import health_bp, employees_bp

def create_app(config_class=None):
    """Application factory for Flask Employee Management API."""
    app = Flask(__name__)

    # Load configuration
    if config_class is None:
        config_obj = get_config()
    elif isinstance(config_class, type):
        config_obj = config_class()
    else:
        config_obj = config_class

    app.config.from_object(config_obj)

    # Initialize CORS for local frontend communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize database
    db.init_app(app)

    # Register blueprints under /api prefix
    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(employees_bp, url_prefix="/api")

    # Global Error Handlers returning JSON
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed_error(error):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    # Auto-create tables if database is accessible
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            app.logger.warning(f"Could not initialize database tables on startup: {e}")

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development").lower() == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
