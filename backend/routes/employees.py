from flask import Blueprint, request, jsonify
from sqlalchemy import or_
from models import db, Employee

employees_bp = Blueprint("employees", __name__)

@employees_bp.route("/employees", methods=["GET"])
def get_all_employees():
    """Retrieve all employees ordered by id descending."""
    try:
        employees = Employee.query.order_by(Employee.id.desc()).all()
        return jsonify({
            "employees": [emp.to_dict() for emp in employees],
            "count": len(employees)
        }), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve employees: {str(e)}"}), 500


@employees_bp.route("/employees/search", methods=["GET"])
def search_employees():
    """
    Search employees by name, email, department, or position.
    Query parameter: ?q=<search_term>
    """
    query = request.args.get("q", "").strip()
    if not query:
        # Return all employees if search query is empty
        employees = Employee.query.order_by(Employee.id.desc()).all()
        return jsonify({
            "employees": [emp.to_dict() for emp in employees],
            "count": len(employees),
            "query": ""
        }), 200

    try:
        search_pattern = f"%{query}%"
        employees = Employee.query.filter(
            or_(
                Employee.name.ilike(search_pattern),
                Employee.email.ilike(search_pattern),
                Employee.department.ilike(search_pattern),
                Employee.position.ilike(search_pattern)
            )
        ).order_by(Employee.id.desc()).all()

        return jsonify({
            "employees": [emp.to_dict() for emp in employees],
            "count": len(employees),
            "query": query
        }), 200
    except Exception as e:
        return jsonify({"error": f"Search failed: {str(e)}"}), 500


@employees_bp.route("/employees/<int:employee_id>", methods=["GET"])
def get_employee_by_id(employee_id):
    """Retrieve a single employee by their ID."""
    try:
        employee = db.session.get(Employee, employee_id)
        if not employee:
            return jsonify({"error": f"Employee with ID {employee_id} not found."}), 404
        return jsonify({"employee": employee.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": f"Failed to retrieve employee: {str(e)}"}), 500


@employees_bp.route("/employees", methods=["POST"])
def create_employee():
    """Create a new employee record."""
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid request. JSON body is required."}), 400

    is_valid, errors = Employee.validate_payload(data, is_update=False)
    if not is_valid:
        return jsonify({"error": "Validation failed.", "details": errors}), 400

    try:
        new_employee = Employee(
            name=data["name"].strip(),
            email=data["email"].strip().lower(),
            department=data["department"].strip(),
            position=data["position"].strip(),
            salary=float(data["salary"])
        )
        db.session.add(new_employee)
        db.session.commit()

        return jsonify({
            "message": "Employee created successfully.",
            "employee": new_employee.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to create employee: {str(e)}"}), 500


@employees_bp.route("/employees/<int:employee_id>", methods=["PUT"])
def update_employee(employee_id):
    """Update an existing employee record."""
    employee = db.session.get(Employee, employee_id)
    if not employee:
        return jsonify({"error": f"Employee with ID {employee_id} not found."}), 404

    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid request. JSON body is required."}), 400

    is_valid, errors = Employee.validate_payload(data, is_update=True, current_employee_id=employee_id)
    if not is_valid:
        return jsonify({"error": "Validation failed.", "details": errors}), 400

    try:
        if "name" in data:
            employee.name = data["name"].strip()
        if "email" in data:
            employee.email = data["email"].strip().lower()
        if "department" in data:
            employee.department = data["department"].strip()
        if "position" in data:
            employee.position = data["position"].strip()
        if "salary" in data:
            employee.salary = float(data["salary"])

        db.session.commit()

        return jsonify({
            "message": "Employee updated successfully.",
            "employee": employee.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to update employee: {str(e)}"}), 500


@employees_bp.route("/employees/<int:employee_id>", methods=["DELETE"])
def delete_employee(employee_id):
    """Delete an employee record by ID."""
    employee = db.session.get(Employee, employee_id)
    if not employee:
        return jsonify({"error": f"Employee with ID {employee_id} not found."}), 404

    try:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({
            "message": f"Employee with ID {employee_id} deleted successfully."
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Failed to delete employee: {str(e)}"}), 500
