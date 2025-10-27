document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const messageDiv = document.getElementById('messageDiv');

  messageDiv.style.display = 'none';
  messageDiv.className = '';

  try {
    const response = await fetch('/api/v1/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // STORE JWT TOKEN IN LOCAL STORAGE
      localStorage.setItem('adminToken', data.token);

      // REDIRECT TO DASHBOARD AFTER SUCCESSFUL LOGIN
      window.location.href = '/api/v1/admin/dashboard';
    } else {
      // SHOW ERROR MESSAGE
      messageDiv.style.display = 'block';
      messageDiv.className = 'alert alert-danger';
      messageDiv.textContent = data.message || 'Login failed. Check credentials.';
    }
  } catch (error) {
    console.error('Login Error:', error);
    messageDiv.style.display = 'block';
    messageDiv.className = 'alert alert-danger';
    messageDiv.textContent = 'Network error or server is down.';
  }
});
