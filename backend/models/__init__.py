from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from .employee import Employee

__all__ = ["db", "Employee"]
