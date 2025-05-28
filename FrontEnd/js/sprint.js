const table = document.getElementById('sprintsTable');
const form = document.forms['sprintForm'];
const tituloForm = document.getElementById('tituloForm');
const registrarBtn = document.getElementById('registrarBtn');
const formContent = document.getElementById('sprintFormContent');
const cancelarBtn = document.getElementById('cancelarBtn');
let operacion = '';

class Servicios {
    static async getAllSprints() {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/sprint');
            const bodyResp = await resp.json();
            return bodyResp.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async saveNewSprint(sprint) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/sprint', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: sprint.nombre,
                    fecha_inicio: sprint.fecha_inicio,
                    fecha_fin: sprint.fecha_fin,
                    created_at: sprint.created_at,
                    updated_at: sprint.updated_at
                })
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Sprint Creado';
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async updateSprint(id, sprint) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/sprint/' + id, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: sprint.nombre,
                    fecha_inicio: sprint.fecha_inicio,
                    fecha_fin: sprint.fecha_fin,
                    created_at: sprint.created_at,
                    updated_at: sprint.updated_at
                })
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Sprint actualizada';
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async deleteSprint(id) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/sprint/' + id, {
                method: 'delete'
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Sprint eliminada';
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

const cargarTabla = async () => {
    const sprints = await Servicios.getAllSprints();
    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    for (let item of sprints) {
        const tr = generarFila(item);
        tbody.appendChild(tr);
    }
}

const generarFila = (item) => {
    const tdId = document.createElement('td');
    tdId.textContent = item.id;

    const tdNombre = document.createElement('td');
    tdNombre.textContent = item.nombre;

    const tdFechaini = document.createElement('td');
    tdFechaini.textContent = new Date(item.fecha_inicio).toLocaleDateString();

    const tdFechaFin = document.createElement('td');
    tdFechaFin.textContent = new Date(item.fecha_fin).toLocaleDateString();

    const tdCreated_at = document.createElement('td');
tdCreated_at.textContent = new Date(item.created_at).toLocaleString();


    const tdUpdated_at = document.createElement('td');
    tdUpdated_at.textContent = new Date(item.updated_at).toLocaleString();


    const modificarBtn = document.createElement('button');
    modificarBtn.textContent = 'Modificar';
    modificarBtn.addEventListener('click', () => {
        operacion = 'modificar';
        tituloForm.textContent = 'Modificar Sprint';
        formContent.classList.remove('ocultarForm');
        form['id'].value = item.id;
        form['nombre'].value = item.nombre;
        form['fechaIni'].value = item.fecha_inicio;
        form['fechaFin'].value = item.fecha_fin;
        form['created'].value = item.created_at.slice(0, 16);
        form['updated'].value = item.updated_at.slice(0, 16);
    });

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.addEventListener('click', () => {
        eliminarSprint(item.id);
    });

    const tdBotones = document.createElement('td');
    tdBotones.appendChild(modificarBtn);
    tdBotones.appendChild(eliminarBtn);

    const tr = document.createElement('tr');
    tr.appendChild(tdId);
    tr.appendChild(tdNombre);
    tr.appendChild(tdFechaini);
    tr.appendChild(tdFechaFin);
    tr.appendChild(tdCreated_at);
    tr.appendChild(tdUpdated_at);
    tr.appendChild(tdBotones);
    return tr;
}

cargarTabla();

const registrarRetro = async () => {
    const sprint = {
        nombre: form['nombre'].value,
        fecha_inicio: form['fechaIni'].value,
        fecha_fin: form['fechaFin'].value,
        created_at: form['created'].value,
        updated_at: form['updated'].value
    };

    const res = await Servicios.saveNewSprint(sprint);
    if (res) {
        cargarTabla();
    }
};

const modificarRetro = async () => {
    const sprint = {
        nombre: form['nombre'].value,
        fecha_inicio: form['fechaIni'].value,
        fecha_fin: form['fechaFin'].value,
        created_at: form['created'].value,
        updated_at: form['updated'].value
    };

    const id = form['id'].value;
    const res = await Servicios.updateSprint(id, sprint);
    if (res) {
        cargarTabla();
    }
};

const eliminarSprint = async (id) => {
    const res = await Servicios.deleteSprint(id);
    if (res) {
        cargarTabla();
    }
}

registrarBtn.addEventListener('click', () => {
    operacion = 'crear';
    tituloForm.textContent = 'Registrar Sprint';
    form.reset();
    document.getElementById("sprintFormContent").classList.remove('ocultarForm');
});

cancelarBtn.addEventListener('click', () => {
    formContent.classList.add('ocultarForm');
});

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (operacion == 'crear') {
        registrarRetro();
    } else if (operacion == 'modificar') {
        modificarRetro();
    }
    formContent.classList.add('ocultarForm');
});



