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

addTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    modifyTask(addTaskForm, '/tasks', taskCompletedCbForAdd, document.getElementById('alertsAreaForAdd'), 'POST');
});

editTaskForm.addEventListener('submit', e => {
    e.preventDefault();
    modifyTask(addTaskForm, `/tasks/${editTaskForm.userID.value}`, taskCompletedCbForEdit, document.getElementById('alertsAreaForEdit'), 'PATCH');
});

async function modifyTask(form, url, completedInp, alertBox, method) {
    const descreption = form.descreption.value;
    const completed = completedInp.checked;
    const response = await sendRequest(url, method, { descreption, completed });
    if (!response.success) {
        alertBox.innerHTML = `<div class="alert alert-warning">${response.error}</div>`;
    } else {
        alertBox.innerHTML = '';
        getTasks();
    }
}