import re
from . import db

EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w+$"

class Employee(db.Model):
    __tablename__ = "employees"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    department = db.Column(db.String(100), nullable=False)
    position = db.Column(db.String(100), nullable=False)
    salary = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "department": self.department,
            "position": self.position,
            "salary": float(self.salary) if self.salary is not None else 0.0,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

    @staticmethod
    def validate_payload(data, is_update=False, current_employee_id=None):
        """
        Validate employee input payload.
        Returns (is_valid: bool, errors: list[str])
        """
        errors = []

        if not isinstance(data, dict):
            return False, ["Invalid request payload. Expected JSON object."]

        # Check required fields if not an update or if field provided
        fields = ["name", "email", "department", "position", "salary"]
        if not is_update:
            for field in fields:
                if field not in data:
                    errors.append(f"Field '{field}' is required.")

        # Name validation
        if "name" in data:
            val = str(data.get("name", "")).strip()
            if not val:
                errors.append("Name cannot be empty.")
            elif len(val) > 100:
                errors.append("Name cannot exceed 100 characters.")

        # Email validation
        if "email" in data:
            val = str(data.get("email", "")).strip()
            if not val:
                errors.append("Email cannot be empty.")
            elif not re.match(EMAIL_REGEX, val):
                errors.append("Email format is invalid.")
            else:
                # Check for uniqueness
                existing = Employee.query.filter_by(email=val).first()
                if existing and (not is_update or existing.id != current_employee_id):
                    errors.append(f"Email '{val}' is already registered to another employee.")

        # Department validation
        if "department" in data:
            val = str(data.get("department", "")).strip()
            if not val:
                errors.append("Department cannot be empty.")
            elif len(val) > 100:
                errors.append("Department cannot exceed 100 characters.")

        # Position validation
        if "position" in data:
            val = str(data.get("position", "")).strip()
            if not val:
                errors.append("Position cannot be empty.")
            elif len(val) > 100:
                errors.append("Position cannot exceed 100 characters.")

        # Salary validation
        if "salary" in data:
            raw_salary = data.get("salary")
            try:
                salary_val = float(raw_salary)
                if salary_val < 0:
                    errors.append("Salary must be non-negative.")
            except (ValueError, TypeError):
                errors.append("Salary must be a valid number.")

        return len(errors) == 0, errors
