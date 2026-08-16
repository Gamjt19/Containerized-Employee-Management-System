import os
import sys

import pytest

# Ensure backend root is on sys.path
sys.path.insert(
    0,
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from models import db, Employee
from config import TestingConfig
from app import create_app


@pytest.fixture
def app():
    """Create and configure a Flask application instance for testing."""
    test_app = create_app(TestingConfig)

    with test_app.app_context():
        db.create_all()
        yield test_app
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def sample_employee(app):
    """Fixture providing a sample employee inserted in the test DB."""
    with app.app_context():
        emp = Employee(
            name="Alice Smith",
            email="alice.smith@example.com",
            department="Engineering",
            position="Software Engineer",
            salary=85000.00
        )

        db.session.add(emp)
        db.session.commit()

        return emp.to_dict()
