const alertBox = document.getElementById('alertBox');
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;
    const response = await sendRequest('/users/login', 'POST', { email, password });
    if (response.success) {
        window.location.assign('/dashboard');
    } else {
        alertBox.textContent = response.error;
        alertBox.classList.remove('d-none');
    }
});