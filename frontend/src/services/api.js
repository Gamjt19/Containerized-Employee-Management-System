const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to handle fetch responses and extract JSON or throw descriptive errors.
 */
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorMsg = data?.details?.join(', ') || data?.error || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  /**
   * Health check endpoint
   */
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(response);
  },

  /**
   * Fetch all employees
   */
  async getEmployees() {
    const response = await fetch(`${API_BASE_URL}/employees`);
    return handleResponse(response);
  },

  /**
   * Search employees by keyword
   */
  async searchEmployees(query) {
    const trimmed = (query || '').trim();
    const url = trimmed
      ? `${API_BASE_URL}/employees/search?q=${encodeURIComponent(trimmed)}`
      : `${API_BASE_URL}/employees`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Get single employee by ID
   */
  async getEmployeeById(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    return handleResponse(response);
  },

  /**
   * Create a new employee
   */
  async createEmployee(employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing employee
   */
  async updateEmployee(id, employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  /**
   * Delete an employee
   */
  async deleteEmployee(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};
