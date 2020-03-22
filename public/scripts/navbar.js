const editAccountForm = document.getElementById('editAccountForm');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const logoutForm = document.getElementById('logoutForm');
const alertsArea = document.getElementById('alertsArea');

editAccountForm.addEventListener('submit', async e => {
    e.preventDefault();
    const inpsToChange = [];
    const changes = [
        editAccountForm.email,
        editAccountForm.name,
        editAccountForm.age,
        editAccountForm.password
    ].reduce((changes, inp) => {
        const name = inp.getAttribute('name');
        if (inp.value !== inp.getAttribute('value')) {
            if (name === 'name' && inp.value.length <= 25 && inp.value.length > 0) {
                document.getElementById('navarBrand').textContent = inp.value;
            }
            inpsToChange.push(inp);
            return { [name]: inp.value, ...changes };
        }
        return changes;
    }, {});
    if (Object.keys(changes).length) {
        const response = await sendRequest('/users/', 'PATCH', changes); 
        if (!response.success) {
            alertsArea.innerHTML = response.error.reduce((alerts, err) => `${alerts}<div class="alert alert-warning">${err}</div>`, '');
        } else {
            inpsToChange.forEach(inp => inp.setAttribute('value', inp.value));
            alertsArea.innerHTML = '<div class="alert alert-info">Changes has been saved</div>';
        }
    } else {
        alertsArea.innerHTML = '';
    }
});

deleteAccountBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete your account?')) {
        sendRequest('/users', 'DELETE');
        window.location.assign('../');
    }
});

logoutForm.addEventListener('submit', e => {
    e.preventDefault();
    sendRequest('/users/logout', 'POST', false, logoutForm.logoutAllCb.checked ? { type: 'all' } : false);
    window.location.assign('../');
});