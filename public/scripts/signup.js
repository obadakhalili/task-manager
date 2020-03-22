const signupForm = document.getElementById('signupForm');
const alertsArea = document.getElementById('alertsArea');

signupForm.addEventListener('submit', async e => {
    e.preventDefault();
    const email = signupForm.email.value;
    const name = signupForm.name.value;
    const age = signupForm.age.value;
    const password = signupForm.password.value;
    const response = await sendRequest('/users/', 'POST', { email, name, age, password });
    if (!response.success) {
        alertsArea.innerHTML = response.error.reduce((alerts, err) => `${alerts}<div class="alert alert-warning">${err}</div>`, '');
    } else {
        window.location.assign('/dashboard');
    }
});