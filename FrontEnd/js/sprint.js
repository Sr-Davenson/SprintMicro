const table = document.getElementById('personasTable');
const form = document.forms['personaForm'];
const tituloForm = document.getElementById('tituloForm');
const registrarBtn = document.getElementById('registrarBtn');
const formContent = document.getElementById('personaFormContent');
const cancelarBtn = document.getElementById('cancelarBtn');
let operacion = '';

class Servicios {
    static async getAllPersons() {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/personas');
            const bodyResp = await resp.json();
            return bodyResp.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static async saveNewPerson(person) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/persona', {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: person.id,
                    name: person.nombre,
                    email: person.email,
                    age: person.edad
                })
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Resgitro creado';
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async updatePerson(id, person) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/persona/' + id, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: person.nombre,
                    email: person.email,
                    age: person.edad
                })
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Resgitro modificao';
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async deletePerson(id) {
        try {
            const resp = await fetch('http://127.0.0.1:8000/api/persona/' + id, {
                method: 'delete'
            });
            const bodyResp = await resp.json();
            return bodyResp.data == 'Resgitro eliminado';
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

const cargarTabla = async () => {
    const personas = await Servicios.getAllPersons();
    const tbody = table.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    for (let item of personas) {
        const tr = generarFila(item);
        tbody.appendChild(tr);
    }
}

const generarFila = (item) => {
    const tdId = document.createElement('td');
    tdId.textContent = item.id;

    const tdNombre = document.createElement('td');
    tdNombre.textContent = item.nombre;

    const tdEmail = document.createElement('td');
    tdEmail.textContent = item.email;

    const tdEdad = document.createElement('td');
    tdEdad.textContent = item.edad;

    const modificarBtn = document.createElement('button');
    modificarBtn.textContent = 'Modificar';
    modificarBtn.addEventListener('click', () => {
        operacion = 'modificar';
        tituloForm.textContent = 'Modificar persona';
        formContent.classList.remove('ocultarForm');
        form['idInput'].value = item.id;
        form['idInput'].setAttribute('readonly', true);
        form['nombreInput'].value = item.nombre;
        form['emailInput'].value = item.email;
        form['edadInput'].value = item.edad;
    });

    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.addEventListener('click', () => {
        eliminarPersona(item.id);
    });

    const tdBotones = document.createElement('td');
    tdBotones.appendChild(modificarBtn);
    tdBotones.appendChild(eliminarBtn);

    const tr = document.createElement('tr');
    tr.appendChild(tdId);
    tr.appendChild(tdNombre);
    tr.appendChild(tdEmail);
    tr.appendChild(tdEdad);
    tr.appendChild(tdBotones);
    return tr;
}

cargarTabla();

const registrarPersona = async () => {
    const persona = {
        id: form['idInput'].value,
        nombre: form['nombreInput'].value,
        email: form['emailInput'].value,
        edad: form['edadInput'].value
    };
    const res = await Servicios.saveNewPerson(persona);
    if (res) {
        cargarTabla();
    }
}

const modificarPersona = async () => {
    const persona = {
        nombre: form['nombreInput'].value,
        email: form['emailInput'].value,
        edad: form['edadInput'].value
    };
    const id = form['idInput'].value;
    const res = await Servicios.updatePerson(id, persona);
    if (res) {
        cargarTabla();
    }
}

const eliminarPersona = async (id) => {
    const res = await Servicios.deletePerson(id);
    if (res) {
        cargarTabla();
    }
}


registrarBtn.addEventListener('click', () => {
    operacion = 'crear';
    tituloForm.textContent = 'Registrar persona';
    form['idInput'].removeAttribute('readonly');
    form.reset();
    formContent.classList.remove('ocultarForm');
});

cancelarBtn.addEventListener('click', () => {
    formContent.classList.add('ocultarForm');
});

form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (operacion == 'crear') {
        registrarPersona();
    } else if (operacion == 'modificar') {
        modificarPersona();
    }
    formContent.classList.add('ocultarForm');
});