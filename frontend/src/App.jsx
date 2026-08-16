import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from './services/api';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchFilter from './components/SearchFilter';
import EmployeeTable from './components/EmployeeTable';
import EmployeeModal from './components/EmployeeModal';
import DeleteModal from './components/DeleteModal';
import AlertBanner from './components/AlertBanner';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Confirmation State
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert State
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = 'success') => {
    setAlert({ message, type });
  };

  const dismissAlert = () => setAlert(null);

  // Check health and fetch employees
  const loadData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    try {
      // Check backend health
      try {
        const health = await api.checkHealth();
        setBackendHealthy(health.status === 'healthy');
      } catch (err) {
        setBackendHealthy(false);
      }

      // Fetch employees
      const data = await api.getEmployees();
      setEmployees(data.employees || []);
    } catch (err) {
      showAlert(err.message || 'Failed to connect to the backend server.', 'error');
    } finally {
      setIsLoading(false);
      if (showRefreshing) setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Extract unique departments for filter dropdown
  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department).filter(Boolean));
    return Array.from(set).sort();
  }, [employees]);

  // Client-side + Search filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !searchTerm ||
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDept =
        !departmentFilter || emp.department === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [employees, searchTerm, departmentFilter]);

  // Handle Add/Edit modal open
  const handleOpenAdd = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  // Handle Create or Update submission
  const handleFormSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingEmployee && editingEmployee.id) {
        // Update
        const updated = await api.updateEmployee(editingEmployee.id, formData);
        showAlert(updated.message || 'Employee updated successfully!');
      } else {
        // Create
        const created = await api.createEmployee(formData);
        showAlert(created.message || 'Employee created successfully!');
      }
      setIsModalOpen(false);
      setEditingEmployee(null);
      await loadData();
    } catch (err) {
      showAlert(err.message || 'Operation failed.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Confirmation & Action
  const handleOpenDelete = (employee) => {
    setDeletingEmployee(employee);
  };

  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await api.deleteEmployee(id);
      showAlert(res.message || 'Employee deleted successfully.');
      setDeletingEmployee(null);
      await loadData();
    } catch (err) {
      showAlert(err.message || 'Failed to delete employee.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-container">
      <Header
        backendHealthy={backendHealthy}
        onRefresh={() => loadData(true)}
        onAddEmployee={handleOpenAdd}
        isRefreshing={isRefreshing}
      />

      <AlertBanner alert={alert} onClose={dismissAlert} />

      <StatsCards employees={employees} />

      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        departments={departments}
        onClear={() => {
          setSearchTerm('');
          setDepartmentFilter('');
        }}
      />

      <EmployeeTable
        employees={filteredEmployees}
        isLoading={isLoading}
        onEdit={handleOpenEdit}
        onDelete={handleOpenDelete}
        onAddNew={handleOpenAdd}
        searchTerm={searchTerm || departmentFilter}
      />

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
        isSubmitting={isSubmitting}
      />

      <DeleteModal
        isOpen={Boolean(deletingEmployee)}
        onClose={() => setDeletingEmployee(null)}
        onConfirm={handleConfirmDelete}
        employee={deletingEmployee}
        isDeleting={isDeleting}
      />
    </div>
  );
}
