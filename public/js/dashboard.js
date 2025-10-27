// public/js/dashboard.js

// SET API BASE URL (WORKS FOR BOTH LOCALHOST AND DEPLOYED HOST)
const API_BASE = window.location.origin + '/api/v1';

// GET TOKEN FROM LOCAL STORAGE
const token = localStorage.getItem('adminToken');

const userTableBody = document.getElementById('userTableBody');
const alertMessage = document.getElementById('alertMessage');
const createUserForm = document.getElementById('createUserForm');

// SHOW ALERT MESSAGE
const showAlert = (message, type = 'success') => {
  alertMessage.textContent = message;
  alertMessage.className = `alert alert-${type}`;
  alertMessage.style.display = 'block';
  setTimeout(() => {
    alertMessage.style.display = 'none';
  }, 5000);
};

// LOGOUT HANDLER
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('adminToken');
  window.location.href = window.location.origin + '/api/v1/admin/login';
});

// FETCH USERS FROM SERVER
const fetchUsers = async () => {
  if (!token) {
    window.location.href = API_BASE + '/admin/login';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const users = await response.json();
      renderUserTable(users);
    } else {
      if (response.status === 401) {
        showAlert('Session expired. Please log in again.', 'danger');
        localStorage.removeItem('adminToken');
        setTimeout(
          () => (window.location.href = API_BASE + '/admin/login'),
          2000
        );
        return;
      }
      const data = await response.json();
      showAlert(data.message || 'Failed to fetch user data from server.', 'danger');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    showAlert('Network error. Check server console or CORS settings.', 'danger');
  }
};

// RENDER USER TABLE
const renderUserTable = (users) => {
  userTableBody.innerHTML = '';

  if (!users || users.length === 0) {
    userTableBody.innerHTML =
      '<tr><td colspan="5" class="text-center">No client users found in the database.</td></tr>';
    return;
  }

  users.forEach((user) => {
    const row = userTableBody.insertRow();
    const statusBadge =
      user.subscriptionStatus === 'premium'
        ? `<span class="badge bg-success">Premium</span>`
        : `<span class="badge bg-warning text-dark">Trial</span>`;

    const scanCount = user.scanCount !== undefined ? user.scanCount : 0;
    const joinedDate = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : 'N/A';
    const userId = user._id || '';

    row.innerHTML = `
      <td>${user.username}</td>
      <td>${statusBadge}</td>
      <td>${scanCount}</td>
      <td>${joinedDate}</td>
      <td>
        <button class="btn btn-sm ${
          user.subscriptionStatus === 'premium'
            ? 'btn-outline-danger'
            : 'btn-outline-success'
        } status-btn me-2" 
          data-user-id="${userId}" 
          data-target-status="${
            user.subscriptionStatus === 'premium' ? 'trial' : 'premium'
          }">
          ${
            user.subscriptionStatus === 'premium' ? 'Downgrade' : 'Upgrade'
          }
        </button>
        <button class="btn btn-sm btn-danger delete-btn" data-user-id="${userId}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </td>
    `;
  });

  document.querySelectorAll('.status-btn').forEach((button) => {
    button.addEventListener('click', handleStatusUpdate);
  });
  document.querySelectorAll('.delete-btn').forEach((button) => {
    button.addEventListener('click', handleUserDeletion);
  });
};

// HANDLE SUBSCRIPTION STATUS UPDATE
const handleStatusUpdate = async (e) => {
  const button = e.currentTarget;
  const userId = button.dataset.userId;
  const targetStatus = button.dataset.targetStatus;

  if (!confirm(`Confirm change status to ${targetStatus.toUpperCase()}?`)) return;

  button.disabled = true;
  button.textContent = 'Updating...';

  try {
    const response = await fetch(`${API_BASE}/admin/user-status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, newStatus: targetStatus }),
    });

    const data = await response.json();

    if (response.ok) {
      showAlert(data.message, 'success');
      fetchUsers();
    } else {
      showAlert(data.message || 'Status update failed.', 'danger');
      button.disabled = false;
    }
  } catch (error) {
    console.error('Update Error:', error);
    showAlert('Network error during status update.', 'danger');
    button.disabled = false;
  }
};

// HANDLE NEW USER CREATION
if (createUserForm) {
  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const subscriptionStatus = document.getElementById('newSubscription').value;

    try {
      const response = await fetch(`${API_BASE}/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username, subscriptionStatus }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert(data.message, 'success');

        const modalElement = document.getElementById('createUserModal');
        const modal =
          bootstrap.Modal.getInstance(modalElement) ||
          new bootstrap.Modal(modalElement);
        modal.hide();

        e.target.reset();
        fetchUsers();
      } else {
        showAlert(data.message || 'User creation failed.', 'danger');
      }
    } catch (error) {
      console.error('Create User Error:', error);
      showAlert('Network error during user creation.', 'danger');
    }
  });
}

// HANDLE USER DELETION
const handleUserDeletion = async (e) => {
  const button = e.currentTarget;
  const userId = button.dataset.userId;

  if (!confirm('Are you sure you want to permanently delete this user?')) return;

  button.disabled = true;
  button.innerHTML = 'Deleting...';

  try {
    const response = await fetch(`${API_BASE}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      showAlert(data.message, 'success');
      fetchUsers();
    } else {
      showAlert(data.message || 'User deletion failed.', 'danger');
      button.disabled = false;
      button.innerHTML = '<i class="fas fa-trash"></i> Delete';
    }
  } catch (error) {
    console.error('Delete User Error:', error);
    showAlert('Network error during user deletion.', 'danger');
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-trash"></i> Delete';
  }
};

// FETCH USERS ON PAGE LOAD
window.onload = fetchUsers;