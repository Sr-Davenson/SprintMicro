const tabla = document.getElementById("tablaRetrospectivas");
const form = document.forms['retrospectivaForm'];
const tituloForm = document.getElementById('tituloForm');
const sprintSelect = document.getElementById("sprint");
const categoriaSelect = document.getElementById("categoriaSelect");
const registrarBtn = document.getElementById('registrarBtn');
const formContent = document.getElementById('retroFormContent');
const cancelarBtn = document.getElementById('cancelarBtn');
let operacion = "";
let sprintsMap = {};


class RetroServicios {
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
            const resp = await fetch("http://127.0.0.1:8000/api/retro", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(retro)
            });
            const bodyResp = await resp.json();
            return bodyResp.data == "Retro Creada";
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async updateRetro(id, retro) {
        try {
            const resp = await fetch(`http://127.0.0.1:8000/api/retro/${id}`, {
                method: "put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(retro)
            });
            const bodyResp = await resp.json();
            return bodyResp.data == "Retrospectiva actualizada";
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    static async deleteRetro(id) {
        try {
            const resp = await fetch(`http://127.0.0.1:8000/api/retro/${id}`, {
                method: "delete"
            });
            const bodyResp = await resp.json();
            return bodyResp.data == "Retro eliminada";
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

const cargarTabla = async () => {
    const retros = await RetroServicios.getAllRetros();
    const tbody = tabla.getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    for (let item of retros) {
        const tr = generarFila(item);
        tbody.appendChild(tr);
    }
};

const categoriasConTilde = {
    "accion": "Acción",
    "logro": "Logro",
    "impedimento": "Impedimento",
    "comentario": "Comentario",
    "otro": "Otro"
};

const generarFila = (item) => {
    const tdId = document.createElement("td");
    tdId.textContent = item.id;

    const tdSprint = document.createElement("td");
    tdSprint.textContent = sprintsMap[item.sprint_id];

    const tdCategoria = document.createElement("td");
    tdCategoria.textContent = categoriasConTilde[item.categoria];

    const tdDescripcion = document.createElement("td");
    tdDescripcion.textContent = item.descripcion;

    const tdCumplida = document.createElement("td");
    tdCumplida.textContent = item.cumplida ? "Sí" : "No";

    const tdFechaRevision = document.createElement("td");
    tdFechaRevision.textContent = new Date(item.fecha_revision).toLocaleDateString();

    const tdCreated = document.createElement("td");
    tdCreated.textContent = new Date(item.created_at).toLocaleString();

    const tdUpdated = document.createElement("td");
    tdUpdated.textContent = new Date(item.updated_at).toLocaleString();

    const modificarBtn = document.createElement("button");
    modificarBtn.textContent = "Modificar";
    modificarBtn.addEventListener("click", () => {
        operacion = "modificar";
        tituloForm.textContent = "Modificar Retrospectiva";
        formContent.classList.remove("ocultarForm");

        form['id'].value = item.id;
        sprintSelect.value = item.sprint_id;
        categoriaSelect.value = item.categoria;
        form['descripcion'].value = item.descripcion;
        form['cumplida'].checked = item.cumplida;
        form['fecha_revision'].value = item.fecha_revision;
        form['created'].value = item.created_at.slice(0, 16);
        form['updated'].value = item.updated_at.slice(0, 16);

        manejarCambioCategoria();
    });

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.addEventListener("click", () => eliminarRetro(item.id));

    const tdBotones = document.createElement("td");
    tdBotones.appendChild(modificarBtn);
    tdBotones.appendChild(eliminarBtn);

    const tr = document.createElement("tr");
    tr.appendChild(tdId);
    tr.appendChild(tdSprint);
    tr.appendChild(tdCategoria);
    tr.appendChild(tdDescripcion);
    tr.appendChild(tdCumplida);
    tr.appendChild(tdFechaRevision);
    tr.appendChild(tdCreated);
    tr.appendChild(tdUpdated);
    tr.appendChild(tdBotones);

    return tr;
};


const registrarRetro = async () => {
    const retro = {
        sprint_id: sprintSelect.value,
        categoria: categoriaSelect.value,
        descripcion: form['descripcion'].value,
        cumplida: form['cumplida'].checked,
        fecha_revision: form['fecha_revision'].value,
        created_at: form['created'].value,
        updated_at: form['updated'].value
    };

    const res = await RetroServicios.saveNewRetro(retro);
    if (res) cargarTabla();
};

const modificarRetro = async () => {
    const retro = {
        sprint_id: sprintSelect.value,
        categoria: categoriaSelect.value,
        descripcion: form['descripcion'].value,
        cumplida: form['cumplida'].value,
        fecha_revision: form['fecha_revision'].value,
        created_at: form['created'].value,
        updated_at: form['updated'].value
    };

    const id = form['id'].value;
    const res = await RetroServicios.updateRetro(id, retro);
    if (res) cargarTabla();
};

const eliminarRetro = async (id) => {
    const res = await RetroServicios.deleteRetro(id);
    if (res) cargarTabla();
};

const cargarSprints = async () => {
    try {
        const resp = await fetch('http://127.0.0.1:8000/api/sprint');
        const json = await resp.json();

        const sprints = json.data;
        sprintSelect.innerHTML = '<option value="">Selecciona un sprint</option>';
        sprints.forEach(sprint => {
            const option = document.createElement('option');
            option.value = sprint.id;
            option.textContent = sprint.nombre;
            sprintSelect.appendChild(option);

            sprintsMap[sprint.id] = sprint.nombre;
        });
    } catch (error) {
        console.error(error);
    }
};


const cargarCategorias = () => {
    const categorias = ["accion", "logro", "impedimento", "comentario", "otro"];
    categoriaSelect.innerHTML = '<option value="">Elige una categoría</option>';
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        categoriaSelect.appendChild(option);
    });
};



const manejarCambioCategoria = () => {
    if (categoriaSelect.value !== "accion") {
        form['cumplida'].checked = false;       
        form['cumplida'].disabled = true;        
    } else {
        form['cumplida'].disabled = false;     
    }
};

categoriaSelect.addEventListener('change', manejarCambioCategoria);

registrarBtn.addEventListener("click", () => {
    operacion = "crear";
    tituloForm.textContent = "Registrar Retrospectiva";
    form.reset();
    formContent.classList.remove("ocultarForm");
    manejarCambioCategoria();
});


cancelarBtn.addEventListener("click", () => {
    formContent.classList.add("ocultarForm");
});

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (operacion === "crear") {
        registrarRetro();
    } else if (operacion === "modificar") {
        modificarRetro();
    }
    formContent.classList.add("ocultarForm");
});
cargarSprints();
cargarTabla();



