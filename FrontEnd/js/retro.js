const table = document.getElementById('sprintTable');
const form = document.forms['retroForm'];
const tituloForm = document.getElementById('tituloForm');
const registrarBtn = document.getElementById('registrarBtn');
const formContent = document.getElementById('retroFormContent');
const cancelarBtn = document.getElementById('cancelarBtn');
let operacion = '';

class Servicios {
    static async getAllRetros() {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/retro');
            const bodyResp = await resp.json();
            return bodyResp.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async saveNewRetro(retro) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/retro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sprint: retro.sprint,
                    positivo: retro.positivo,
                    negativo: retro.negativo,
                    accion: retro.accion
                })
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Registro creado';
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async updateRetro(id, retro) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/retro' +id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sprint: retro.sprint,
                    positivo: retro.positivo,
                    negativo: retro.negativo,
                    accion: retro.accion
                })
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Registro modificado';
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async deleteRetro(id) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/retro'+id, {
                method: 'DELETE'
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Registro eliminado';
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

const cargarTabla = async () => {
    const retros = await Servicios.getAllRetros();
    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    for (let item of retros) {
        const tr = generarFila(item);
        tbody.appendChild(tr);
    }
}

const generarFila = (item) => {
    const tdSprint = document.createElement('td');
    tdSprint.textContent = item.sprint;

    const tdPositivo = document.createElement('td');
    tdPositivo.textContent = item.positivo;

    const tdNegativo = document.createElement('td');
    tdNegativo.textContent = item.negativo;

    const tdAccion = document.createElement('td');
    tdAccion.textContent = item.accion;

    const modificarBtn = document.createElement('button');
    modificarBtn.textContent = 'Modificar';
    modificarBtn.addEventListener('click', () => {
        operacion = 'modificar';
        tituloForm.textContent = 'Modificar retrospectiva';
        formContent.classList.remove('ocultarForm');
        form['sprintInput'].value = item.sprint;
        form['positivoInput'].value = item.positivo;
        form['negativoInput'].value = item.negativo;
        form['accionInput'].value = item.accion;
    });

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.addEventListener('click', () => {
        eliminarRetro(item.id);
    });

    const tdBotones = document.createElement('td');
    tdBotones.appendChild(modificarBtn);
    tdBotones.appendChild(eliminarBtn);

    const tr = document.createElement('tr');
    tr.appendChild(tdSprint);
    tr.appendChild(tdPositivo);
    tr.appendChild(tdNegativo);
    tr.appendChild(tdAccion);
    tr.appendChild(tdBotones);
    return tr;
}

cargarTabla();

const registrarRetro = async () => {
    const retro = {
        sprint: form['sprintInput'].value,
        positivo: form['positivoInput'].value,
        negativo: form['negativoInput'].value,
        accion: form['accionInput'].value
    };
    const res = await Servicios.saveNewRetro(retro);
    if (res) {
        cargarTabla();
    }
}

const modificarRetro = async () => {
    const retro = {
        sprint: form['sprintInput'].value,
        positivo: form['positivoInput'].value,
        negativo: form['negativoInput'].value,
        accion: form['accionInput'].value
    };
    const id = form['idInput'].value;
    const res = await Servicios.updateRetro(id, retro);
    if (res) {
        cargarTabla();
    }
}

const eliminarRetro = async (id) => {
    const res = await Servicios.deleteRetro(id);
    if (res) {
        cargarTabla();
    }
}

registrarBtn.addEventListener('click', () => {
    operacion = 'crear';
    tituloForm.textContent = 'Registrar retrospectiva';
    form.reset();
    formContent.classList.remove('ocultarForm');
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