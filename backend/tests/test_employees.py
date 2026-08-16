def test_get_employees_empty(client):
    """Test listing employees when the database is empty."""
    response = client.get("/api/employees")
    assert response.status_code == 200
    data = response.get_json()
    assert data["employees"] == []
    assert data["count"] == 0


def test_create_employee_success(client):
    """Test creating an employee with valid data."""
    payload = {
        "name": "Jane Doe",
        "email": "jane.doe@example.com",
        "department": "Human Resources",
        "position": "HR Manager",
        "salary": 72000.00
    }
    response = client.post("/api/employees", json=payload)
    assert response.status_code == 201
    data = response.get_json()
    assert data["message"] == "Employee created successfully."
    assert data["employee"]["name"] == "Jane Doe"
    assert data["employee"]["email"] == "jane.doe@example.com"
    assert data["employee"]["salary"] == 72000.00
    assert "id" in data["employee"]


def test_create_employee_validation_errors(client):
    """Test creating an employee with missing or invalid fields."""
    # Missing fields
    res = client.post("/api/employees", json={})
    assert res.status_code == 400
    assert "details" in res.get_json()

    # Invalid email
    invalid_email_payload = {
        "name": "John Smith",
        "email": "invalid-email-string",
        "department": "Engineering",
        "position": "Developer",
        "salary": 60000
    }
    res = client.post("/api/employees", json=invalid_email_payload)
    assert res.status_code == 400
    assert any(
        "Email format is invalid" in d for d in res.get_json()["details"])

    # Negative salary
    negative_salary_payload = {
        "name": "John Smith",
        "email": "john.smith@example.com",
        "department": "Engineering",
        "position": "Developer",
        "salary": -500
    }
    res = client.post("/api/employees", json=negative_salary_payload)
    assert res.status_code == 400
    assert any("non-negative" in d for d in res.get_json()["details"])


def test_create_employee_duplicate_email(client, sample_employee):
    """Test creating an employee with an email that already exists."""
    duplicate_payload = {
        "name": "Another Alice",
        "email": sample_employee["email"],
        "department": "Finance",
        "position": "Analyst",
        "salary": 65000
    }
    response = client.post("/api/employees", json=duplicate_payload)
    assert response.status_code == 400
    assert any(
        "already registered" in d for d in response.get_json()["details"])


def test_get_employee_by_id(client, sample_employee):
    """Test retrieving an employee by ID."""
    emp_id = sample_employee["id"]
    response = client.get(f"/api/employees/{emp_id}")
    assert response.status_code == 200
    data = response.get_json()
    assert data["employee"]["id"] == emp_id
    assert data["employee"]["name"] == sample_employee["name"]

    # Non-existent ID
    res_404 = client.get("/api/employees/99999")
    assert res_404.status_code == 404


def test_search_employees(client, sample_employee):
    """Test searching employees across fields."""
    # Search by part of name
    res = client.get("/api/employees/search?q=Alice")
    assert res.status_code == 200
    data = res.get_json()
    assert len(data["employees"]) == 1
    assert data["employees"][0]["name"] == "Alice Smith"

    # Search by department
    res = client.get("/api/employees/search?q=Engineering")
    assert res.status_code == 200
    assert len(res.get_json()["employees"]) == 1

    # Search with no matching term
    res = client.get("/api/employees/search?q=NonExistentTermXYZ")
    assert res.status_code == 200
    assert len(res.get_json()["employees"]) == 0


def test_update_employee(client, sample_employee):
    """Test updating employee details."""
    emp_id = sample_employee["id"]
    update_payload = {
        "name": "Alice Johnson",
        "salary": 95000.00
    }
    response = client.put(f"/api/employees/{emp_id}", json=update_payload)
    assert response.status_code == 200
    data = response.get_json()
    assert data["employee"]["name"] == "Alice Johnson"
    assert data["employee"]["salary"] == 95000.00
    # Original email should remain intact
    assert data["employee"]["email"] == sample_employee["email"]

    # Non-existent employee
    res_404 = client.put("/api/employees/99999", json={"name": "Ghost"})
    assert res_404.status_code == 404


def test_delete_employee(client, sample_employee):
    """Test deleting an employee."""
    emp_id = sample_employee["id"]
    response = client.delete(f"/api/employees/{emp_id}")
    assert response.status_code == 200
    assert "deleted successfully" in response.get_json()["message"]

    # Verify employee no longer exists
    get_res = client.get(f"/api/employees/{emp_id}")
    assert get_res.status_code == 404

    # Deleting again should return 404
    del_res = client.delete(f"/api/employees/{emp_id}")
    assert del_res.status_code == 404
