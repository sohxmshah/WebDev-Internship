document.addEventListener('DOMContentLoaded', () => {
// DOM Elements
    const employeeForm = document.getElementById('employeeForm');
    const employeeModalEl = document.getElementById('employeeModal');
    const employeeModal = new bootstrap.Modal(employeeModalEl);
    const employeeTableBody = document.getElementById('employeeTableBody');
    const searchInput = document.getElementById('searchInput');
    const filterStatus = document.getElementById('filterStatus');
    const addEmployeeBtn = document.getElementById('addEmployeeBtn');
    const paginationEl = document.getElementById('pagination');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importFileInput = document.getElementById('importFileInput');
  
        // Delete confirmation modal elements
    const confirmDeleteModalEl = document.getElementById('confirmDeleteModal');
    const confirmDeleteModal = new bootstrap.Modal(confirmDeleteModalEl);
    const deleteEmployeeNameSpan = document.getElementById('deleteEmployeeName');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  
        // Form input elements
    const employeeIdInput = document.getElementById('employeeId');
    const nameInput = document.getElementById('employeeName');
    const positionInput = document.getElementById('employeePosition');
    const departmentInput = document.getElementById('employeeDepartment');
    const emailInput = document.getElementById('employeeEmail');
    const phoneInput = document.getElementById('employeePhone');
    const statusSelect = document.getElementById('employeeStatus');
    const dateOfJoiningInput = document.getElementById('employeeDateOfJoining');
  
    // Initialize data
    let employees = [];
    let currentPage = 1;
    const itemsPerPage = 6;
    let currentSortKey = 'name';
    let currentSortOrder = 'asc';
    let employeeIdToDelete = null;
  
    // Set max date for dateOfJoining input to today
    const todayStr = new Date().toISOString().split('T')[0];
    dateOfJoiningInput.setAttribute('max', todayStr);
  
    // Load employees from localStorage
    function loadEmployees() {
        const stored = localStorage.getItem('employees');
        employees = stored ? JSON.parse(stored) : [];
    }
  
    // Save employees to localStorage
    function saveEmployees() {
          localStorage.setItem('employees', JSON.stringify(employees));
    }
  
    // Escape HTML for safety
    function escapeHtml(text) {
          const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
          return text.replace(/[&<>"']/g, m => map[m]);
    }
  
    // Compare helper for sorting
    function compare(a, b, key) {
        const valA = (a[key] || '').toString().toLowerCase();
        const valB = (b[key] || '').toString().toLowerCase();
        if(valA < valB) return -1;
        if(valA > valB) return 1;
        return 0;
    }
  
    // Sort employees
    function sortEmployees(arr) {
      return arr.sort((a, b) => {
        const cmp = compare(a, b, currentSortKey);
        return currentSortOrder === 'asc' ? cmp : -cmp;
      });
    }
  
    // Filter employees by search and status
    function filterEmployees(data, searchVal, statusVal) {
          const filterText = searchVal.trim().toLowerCase();
          return data.filter(emp => {
            const matchesSearch = !filterText || 
              Object.keys(emp).some(key =>
                typeof emp[key] === 'string' && 
                emp[key].toLowerCase().includes(filterText)
              );
            const matchesStatus = !statusVal || emp.status === statusVal;
            return matchesSearch && matchesStatus;
          });
    }
  
    // Paginate filtered + sorted employees
        function paginateEmployees(data) {
          const totalItems = data.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
          if (currentPage > totalPages) currentPage = totalPages;
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          return {
            pagedItems: data.slice(start, end),
            totalPages,
            totalItems
          };
        }
  
        // Render pagination controls
        function renderPagination(totalPages) {
          paginationEl.innerHTML = '';
          if (totalPages <= 1) return;
  
          // Previous button
          const prevLi = document.createElement('li');
          prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
          prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous">&laquo;</a>`;
          prevLi.addEventListener('click', (e) => {
            e.preventDefault();
            if(currentPage > 1) {
              currentPage--;
              renderTable();
            }
          });
          paginationEl.appendChild(prevLi);
  
          // Page buttons
          const maxPagesToShow = 7;
          let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
          let endPage = startPage + maxPagesToShow - 1;
          
          if(endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
          }
  
          for(let page = startPage; page <= endPage; page++) {
            const li = document.createElement('li');
            li.className = `page-item ${page === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${page}</a>`;
            li.addEventListener('click', (e) => {
              e.preventDefault();
              if(page !== currentPage) {
                currentPage = page;
                renderTable();
              }
            });
            paginationEl.appendChild(li);
          }
  
          // Next button
          const nextLi = document.createElement('li');
          nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
          nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next">&raquo;</a>`;
          nextLi.addEventListener('click', (e) => {
            e.preventDefault();
            if(currentPage < totalPages) {
              currentPage++;
              renderTable();
            }
          });
          paginationEl.appendChild(nextLi);
        }
  
        // Render employee table
        function renderTable() {
          const filtered = filterEmployees(employees, searchInput.value, filterStatus.value);
          const sorted = sortEmployees(filtered);
          const { pagedItems, totalPages } = paginateEmployees(sorted);
          
          employeeTableBody.innerHTML = '';
  
          if (pagedItems.length === 0) {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td colspan="8" class="text-muted fst-italic">No employees found.</td>`;
            employeeTableBody.appendChild(tr);
            return;
          }
  
          pagedItems.forEach(emp => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${escapeHtml(emp.name)}</td>
              <td>${escapeHtml(emp.position)}</td>
              <td>${escapeHtml(emp.department)}</td>
              <td>${escapeHtml(emp.email)}</td>
              <td>${escapeHtml(emp.phone || '')}</td>
              <td>${escapeHtml(emp.status)}</td>
              <td>${escapeHtml(emp.dateOfJoining)}</td>
              <td>
                <button type="button" class="btn btn-sm btn-outline-primary me-2 edit-btn" data-id="${emp.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l2.854 2.854a.5.5 0 0 1 0 .708L5.207 13.207a.5.5 0 0 1-.168.11l-4 1.5a.5.5 0 0 1-.65-.65l1.5-4a.5.5 0 0 1 .11-.168L12.146.146zM11.207 2L4 9.207V11h1.793L14 4.793 11.207 2z"/>
                  </svg>
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger delete-btn" data-id="${emp.id}">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 0A.5.5 0 0 1 9 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5z"/>
                    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H4.118l-.401 6.428a1 1 0 0 0 1 .999h6.962a1 1 0 0 0 1-.999L13.882 4H15a1 1 0 0 1 1-1h-1.5zM5.118 4l.401-1.5h4.962l.401 1.5H5.118z"/>
                  </svg>
                </button>
              </td>
            `;
            employeeTableBody.appendChild(tr);
          });
  
          renderPagination(totalPages);
          updateSortIndicators();
        }
  
        // Update sort indicators in table headers
        function updateSortIndicators() {
          document.querySelectorAll('th.sortable').forEach(th => {
            th.classList.remove('sorted-asc', 'sorted-desc');
            if (th.dataset.key === currentSortKey) {
              th.classList.add(`sorted-${currentSortOrder}`);
            }
          });
        }
  
        // Reset form to empty state
        function resetForm() {
          employeeForm.reset();
          employeeForm.classList.remove('was-validated');
          employeeIdInput.value = '';
        }
  
        // Fill form with employee data for editing
        function fillForm(emp) {
          employeeIdInput.value = emp.id;
          nameInput.value = emp.name;
          positionInput.value = emp.position;
          departmentInput.value = emp.department;
          emailInput.value = emp.email;
          phoneInput.value = emp.phone || '';
          statusSelect.value = emp.status;
          dateOfJoiningInput.value = emp.dateOfJoining;
        }
  
        // Generate unique ID for new employees
        function generateId() {
          return '_' + Math.random().toString(36).substr(2, 9);
        }
  
        // Event Listeners
  
        // Sorting on table headers
        document.querySelectorAll('th.sortable').forEach(th => {
          th.addEventListener('click', () => {
            const key = th.dataset.key;
            if (currentSortKey === key) {
              currentSortOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
            } else {
              currentSortKey = key;
              currentSortOrder = 'asc';
            }
            renderTable();
          });
        });
  
        // Search input
        searchInput.addEventListener('input', () => {
          currentPage = 1;
          renderTable();
        });
  
        // Status filter
        filterStatus.addEventListener('change', () => {
          currentPage = 1;
          renderTable();
        });
  
        // Add employee button
        addEmployeeBtn.addEventListener('click', () => {
          resetForm();
          document.getElementById('employeeModalLabel').textContent = 'Add Employee';
        });
  
        // Form submission (add/edit employee)
        employeeForm.addEventListener('submit', (e) => {
          e.preventDefault();
          e.stopPropagation();
  
          // Validate form
          if (!employeeForm.checkValidity()) {
            employeeForm.classList.add('was-validated');
            return;
          }
  
          // Validate date is not in future
          if (dateOfJoiningInput.value > todayStr) {
            dateOfJoiningInput.setCustomValidity('Date cannot be in the future');
            dateOfJoiningInput.reportValidity();
            return;
          }
  
          const id = employeeIdInput.value;
          const employeeData = {
            id: id || generateId(),
            name: nameInput.value.trim(),
            position: positionInput.value.trim(),
            department: departmentInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            status: statusSelect.value,
            dateOfJoining: dateOfJoiningInput.value
          };
  
          if (id) {
            // Update existing employee
            const index = employees.findIndex(emp => emp.id === id);
            if (index !== -1) {
              employees[index] = employeeData;
            }
          } else {
            // Add new employee
            employees.push(employeeData);
          }
  
          saveEmployees();
          employeeModal.hide();
          renderTable();
        });
  
        // Edit and Delete buttons
        employeeTableBody.addEventListener('click', (e) => {
          const editBtn = e.target.closest('.edit-btn');
          const deleteBtn = e.target.closest('.delete-btn');
          
          if (editBtn) {
            e.preventDefault();
            const id = editBtn.dataset.id;
            const employee = employees.find(emp => emp.id === id);
            if (employee) {
              fillForm(employee);
              document.getElementById('employeeModalLabel').textContent = 'Edit Employee';
              employeeModal.show();
            }
          }
          
          if (deleteBtn) {
            e.preventDefault();
            const id = deleteBtn.dataset.id;
            const employee = employees.find(emp => emp.id === id);
            if (employee) {
              employeeIdToDelete = id;
              deleteEmployeeNameSpan.textContent = employee.name;
              confirmDeleteModal.show();
            }
          }
        });
  
        // Confirm delete
        confirmDeleteBtn.addEventListener('click', () => {
          if (employeeIdToDelete) {
            const index = employees.findIndex(emp => emp.id === employeeIdToDelete);
            if (index !== -1) {
              employees.splice(index, 1);
              saveEmployees();
              renderTable();
            }
            confirmDeleteModal.hide();
            employeeIdToDelete = null;
          }
        });
  
        // Export to CSV
        exportBtn.addEventListener('click', () => {
          if (employees.length === 0) {
            alert('No employees to export');
            return;
          }
  
          const headers = ['Name', 'Position', 'Department', 'Email', 'Phone', 'Status', 'DateOfJoining'];
          const csvRows = employees.map(emp => [
            `"${emp.name.replace(/"/g, '""')}"`,
            `"${emp.position.replace(/"/g, '""')}"`,
            `"${emp.department.replace(/"/g, '""')}"`,
            `"${emp.email.replace(/"/g, '""')}"`,
            `"${emp.phone ? emp.phone.replace(/"/g, '""') : ''}"`,
            `"${emp.status.replace(/"/g, '""')}"`,
            `"${emp.dateOfJoining.replace(/"/g, '""')}"`
          ]);
  
          const csvContent = [
            headers.join(','),
            ...csvRows.map(row => row.join(','))
          ].join('\n');
  
          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'employees.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
  
        // Import from CSV
        importBtn.addEventListener('click', () => {
          importFileInput.click();
        });
  
        importFileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
  
          const reader = new FileReader();
          reader.onload = (event) => {
            try {
              const csvData = event.target.result;
              const parsed = parseCSV(csvData);
              
              if (parsed.length === 0) {
                alert('No valid data found in CSV');
                return;
              }
  
              if (!confirm(`Import ${parsed.length} employee(s)?`)) {
                return;
              }
  
              const newEmployees = parsed.map(row => ({
                id: generateId(),
                name: row.Name || '',
                position: row.Position || '',
                department: row.Department || '',
                email: row.Email || '',
                phone: row.Phone || '',
                status: row.Status || 'Active',
                dateOfJoining: row.DateOfJoining || todayStr
              }));
  
              employees = [...employees, ...newEmployees];
              saveEmployees();
              renderTable();
              alert(`${newEmployees.length} employee(s) imported successfully`);
            } catch (error) {
              console.error('Error parsing CSV:', error);
              alert('Error parsing CSV file');
            }
          };
          reader.readAsText(file);
        });
  
        // Simple CSV parser
        function parseCSV(text) {
          const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
          if (lines.length < 2) return [];
          
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          const rows = [];

          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
            const row = {};
            
            headers.forEach((header, index) => {
              let value = values[index] || '';
              value = value.trim().replace(/^"|"$/g, '');
              row[header] = value;
            });
            
            rows.push(row);
          }
          
          return rows;
        }
  
        // Initialize the app
        loadEmployees();
        renderTable();
      });
