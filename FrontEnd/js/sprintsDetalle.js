const sprintsTable = document.getElementById('sprintsTable');
const retrospectivasTable = document.getElementById('retrospectivasTable');
const sprintsMap = {};

class Servicios {
    static async getAllSprints() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/sprint');
            if (!response.ok) throw new Error('Error al obtener sprints');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    static async getRetrospectivasBySprint(sprintId) {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/retro/${sprintId}`);
            if (!response.ok) throw new Error('Error al obtener retrospectivas');
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}

const cargarTablaSprints = async () => {
    try {
        const data = await Servicios.getAllSprints();
        if (!data || !data.data) {
            console.error('No se recibieron datos de sprints');
            return;
        }

        const tbody = sprintsTable.querySelector('tbody') || sprintsTable.createTBody();
        tbody.innerHTML = '';

        data.data.forEach(sprint => {
            const tr = document.createElement('tr');
            
            sprintsMap[sprint.id] = sprint.nombre;
            
            tr.innerHTML = `
                <td>${sprint.id}</td>
                <td>${sprint.nombre}</td>
                <td>${formatDate(sprint.fecha_inicio)}</td>
                <td>${formatDate(sprint.fecha_fin)}</td>
                <td><button class="btn-ver" data-sprint-id="${sprint.id}">Ver Detalle</button></td>
            `;
            
            tbody.appendChild(tr);
        });

        document.querySelectorAll('.btn-ver').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sprintId = e.target.getAttribute('data-sprint-id');
                mostrarRetrospectivas(sprintId);
            });
        });

    } catch (error) {
        console.error('Error al cargar sprints:', error);
    }
};

const mostrarRetrospectivas = async (sprintId) => {
    try {
        const data = await Servicios.getRetrospectivasBySprint(sprintId);
        if (!data) {
            console.error('No se recibieron datos de retrospectivas');
            return;
        }

        const tbody = retrospectivasTable.querySelector('tbody') || retrospectivasTable.createTBody();
        tbody.innerHTML = '';

        if (data.retros_actuales && data.retros_actuales.length > 0) {
            data.retros_actuales.forEach(retro => {
                tbody.appendChild(crearFilaRetrospectiva(retro));
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6">No hay retrospectivas para este sprint</td></tr>';
        }

        if (data.acciones_no_cumplidas_Sprint_anterior && data.acciones_no_cumplidas_Sprint_anterior.length > 0) {
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <td colspan="6">
                    Acciones pendientes del Sprint Anterior
                </td>
            `;
            tbody.appendChild(headerRow);

            data.acciones_no_cumplidas_Sprint_anterior.forEach(retro => {
                tbody.appendChild(crearFilaRetrospectiva(retro, true));
            });
        }

        retrospectivasTable.style.display = 'table';

    } catch (error) {
        console.error('Error al mostrar retrospectivas:', error);
    }
};

const crearFilaRetrospectiva = (retro, isPending = false) => {
    const tr = document.createElement('tr');
    if (isPending) tr.classList.add('fila-pendiente');
    
    const categorias = {
        "accion": "Acción",
        "logro": "Logro",
        "impedimento": "Impedimento",
        "comentario": "Comentario",
        "otro": "Otro"
    };

    let cumplimientoTexto = '';
    if (retro.categoria === 'accion') {
        cumplimientoTexto = retro.cumplida ? ' Si' : 'No';
    }

    tr.innerHTML = `
        <td>${retro.id}</td>
        <td>${sprintsMap[retro.sprint_id] || retro.sprint_id}</td>
        <td>${categorias[retro.categoria] || retro.categoria}</td>
        <td>${retro.descripcion}</td>
        <td>${cumplimientoTexto}</td>
        <td>${retro.fecha_revision ? formatDate(retro.fecha_revision) : ''}</td>
    `;
    
    return tr;
};


const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
};

document.addEventListener('DOMContentLoaded', () => {
    if (!sprintsTable.querySelector('tbody')) sprintsTable.createTBody();
    if (!retrospectivasTable.querySelector('tbody')) retrospectivasTable.createTBody();
    cargarTablaSprints();
});