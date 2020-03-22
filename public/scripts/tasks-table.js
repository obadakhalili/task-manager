const deleteAllForm = document.getElementById('deleteAllForm');
const addTaskForm = document.getElementById('addTaskForm');
const editTaskForm = document.getElementById('editTaskForm');
const tableBody = document.getElementById('tableBody');

window.addEventListener('load', getTasks);

async function getTasks() {
    const response = await sendRequest('/tasks', 'GET');

    tableBody.innerHTML = response.tasks.reduce((rows, { descreption, completed, _id }) => {
        return `${rows}
                <tr>
                    <td>${descreption}</td>
                    <td>${completed ? 'Yes' : 'No'}</td>
                    <td>
                        <button data-toggle="modal" data-target="#editTaskModal" data-goal="editTask" data-info="${descreption};${completed};${_id}" class="btn btn-sm btn-success">Edit</button>
                        <form data-goal="deleteTask" data-target="${_id}" class="d-inline">
                            <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                        </form>
                    </td>
               </tr>`;
    }, '');

    document.querySelectorAll('[data-goal=deleteTask]').forEach(form => form.addEventListener('submit', async e => {
        e.preventDefault();
        await sendRequest(`/tasks/${form.getAttribute('data-target')}`, 'DELETE');
        getTasks();
    }));
    document.querySelectorAll('[data-goal=editTask]').forEach(btn => btn.addEventListener('click', (e) => {
        const info = btn.getAttribute('data-info').split(';');
        editTaskForm.descreption.value = info[0];
        editTaskForm.userID.value = info[2];
        if (info[1] === 'true') {
            editTaskForm.taskCompletedCbForEdit.setAttribute('checked', '');
        } else {
            editTaskForm.taskCompletedCbForEdit.removeAttribute('checked');
        }
    }));
}

deleteAllForm.addEventListener('submit', async e => {
    e.preventDefault();
    await sendRequest('/tasks', 'DELETE');
    getTasks();
});

addTaskForm.addEventListener('submit', async e => {
    e.preventDefault();
    const descreption = addTaskForm.descreption.value;
    const completed = taskCompletedCbForAdd.checked;
    const response = await sendRequest('/tasks', 'POST', { descreption, completed });
    if (!response.success) {
        document.getElementById('alertsAreaForAdd').innerHTML = `<div class="alert alert-warning">${response.error}</div>`;
    } else {
        document.getElementById('alertsAreaForAdd').innerHTML = '';
        getTasks();
    }
});

editTaskForm.addEventListener('submit', async e => {
    e.preventDefault();
    const descreption = editTaskForm.descreption.value;
    const completed = taskCompletedCbForEdit.checked;
    const response = await sendRequest(`/tasks/${editTaskForm.userID.value}`, 'PATCH', { descreption, completed });
    if (!response.success) {
        document.getElementById('alertsAreaForEdit').innerHTML = `<div class="alert alert-warning">${response.error}</div>`;
    } else {
        document.getElementById('alertsAreaForEdit').innerHTML = '';
        getTasks();
    }
});