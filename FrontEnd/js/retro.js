const tabla = document.getElementById("tablaRetrospectivas").querySelector("tbody");
const form = document.getElementById("retrospectivaForm");
const sprintSelect = document.getElementById("sprint");
const categoriaSelect = document.getElementById("categoriaSelect");
const registrarBtn = document.getElementById("registrarBtn");
const cancelarBtn = document.getElementById("cancelarBtn");
let operacion = "";

const categoriasValidas = ["accion", "logro", "impedimento", "comentario", "otro"]; // Valores permitidos por ENUM

class RetroServicios {
    static async getAllRetros() {
        try {
            const resp = await fetch("http://127.0.0.1:8000/api/retro");
            const bodyResp = await resp.json();
            return bodyResp.data;
        } catch (error) {
            console.error("Error al obtener retrospectivas: " + error);
            return null;
        }
    }

    static async saveNewRetro(retro) {
        if (!categoriasValidas.includes(retro.categoria)) {
            alert("Error: La categoría no es válida. Debe ser una de " + categoriasValidas.join(", "));
            return false;
        }
        try {
            const resp = await fetch("http://127.0.0.1:8000/api/retro", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sprint: retro.sprint,
                    categoria: retro.categoria,
                    created_at: retro.created_at,
                    updated_at: retro.updated_at
                })
            });
            const bodyResp = await resp.json();
            return bodyResp.data === "Retrospectiva Creada";
        } catch (error) {
            console.error("Error al crear retrospectiva: " + error);
            return false;
        }
    }

    static async updateRetro(id, retro) {
        try {
            const resp = await fetch("http://127.0.0.1:8000/api/retro/" + id, {
                method: "put",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sprint: retro.sprint,
                    categoria: retro.categoria,
                    updated_at: retro.updated_at
                })
            });
            const bodyResp = await resp.json();
            return bodyResp.data === "Retrospectiva actualizada";
        } catch (error) {
            console.error("Error al actualizar retrospectiva: " + error);
            return false;
        }
    }

    static async deleteRetro(id) {
        try {
            const resp = await fetch("http://127.0.0.1:8000/api/retro/" + id, {
                method: "delete"
            });
            const bodyResp = await resp.json();
            return bodyResp.data === "Retrospectiva eliminada";
        } catch (error) {
            console.error("Error al eliminar retrospectiva: " + error);
            return false;
        }
    }
}

const cargarTabla = async () => {
    const retros = await RetroServicios.getAllRetros();
    const tbody = tabla;
    tbody.innerHTML = "";
    for (let item of retros) {
        const tr = generarFila(item);
        tbody.appendChild(tr);
    }
};

const generarFila = (item) => {
    const tdId = document.createElement("td");
    tdId.textContent = item.id;

    const tdSprint = document.createElement("td");
    tdSprint.textContent = item.sprint;

    const tdCategoria = document.createElement("td");
    tdCategoria.textContent = item.categoria;

    const tdCreated_at = document.createElement("td");
    tdCreated_at.textContent = new Date(item.created_at).toLocaleString();

    const tdUpdated_at = document.createElement("td");
    tdUpdated_at.textContent = new Date(item.updated_at).toLocaleString();

    const modificarBtn = document.createElement("button");
    modificarBtn.textContent = "Modificar";
    modificarBtn.addEventListener("click", () => {
        operacion = "modificar";
        form["id"].value = item.id;
        form["sprint"].value = item.sprint;
        form["categoria"].value = item.categoria;
    });

    const eliminarBtn = document.createElement("button");
    eliminarBtn.textContent = "Eliminar";
    eliminarBtn.addEventListener("click", () => {
        eliminarRetro(item.id);
    });

    const tdBotones = document.createElement("td");
    tdBotones.appendChild(modificarBtn);
    tdBotones.appendChild(eliminarBtn);

    const tr = document.createElement("tr");
    tr.appendChild(tdId);
    tr.appendChild(tdSprint);
    tr.appendChild(tdCategoria);
    tr.appendChild(tdCreated_at);
    tr.appendChild(tdUpdated_at);
    tr.appendChild(tdBotones);
    return tr;
};

const registrarRetro = async () => {
    const retro = {
        sprint: form["sprint"].value,
        categoria: form["categoria"].value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const res = await RetroServicios.saveNewRetro(retro);
    if (res) {
        cargarTabla();
    }
};

const modificarRetro = async () => {
    const retro = {
        sprint: form["sprint"].value,
        categoria: form["categoria"].value,
        updated_at: new Date().toISOString()
    };

    const id = form["id"].value;
    const res = await RetroServicios.updateRetro(id, retro);
    if (res) {
        cargarTabla();
    }
};

const eliminarRetro = async (id) => {
    const res = await RetroServicios.deleteRetro(id);
    if (res) {
        cargarTabla();
    }
};

registrarBtn.addEventListener("click", () => {
    operacion = "crear";
    form.reset();
});

cancelarBtn.addEventListener("click", () => {
    form.reset();
});

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (operacion === "crear") {
        registrarRetro();
    } else if (operacion === "modificar") {
        modificarRetro();
    }
});
