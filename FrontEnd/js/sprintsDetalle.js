// Elementos del DOM
const sprintsTable = document.getElementById('sprintsTable');
const retrospectivasTable = document.getElementById('retrospectivasTable');
const sprintsMap = {};

// Servicios para llamadas API
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

// Cargar tabla de sprints
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
            
            // Guardar nombre del sprint para referencia
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

        // Agregar event listeners a los botones
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

// Mostrar retrospectivas para un sprint específico
const mostrarRetrospectivas = async (sprintId) => {
    try {
        const data = await Servicios.getRetrospectivasBySprint(sprintId);
        if (!data) {
            console.error('No se recibieron datos de retrospectivas');
            return;
        }

        const tbody = retrospectivasTable.querySelector('tbody') || retrospectivasTable.createTBody();
        tbody.innerHTML = '';

        // Mostrar retrospectivas actuales
        if (data.retros_actuales && data.retros_actuales.length > 0) {
            data.retros_actuales.forEach(retro => {
                tbody.appendChild(crearFilaRetrospectiva(retro));
            });
        } else {
            tbody.innerHTML = '<tr><td colspan="6">No hay retrospectivas para este sprint</td></tr>';
        }

        // Mostrar acciones no cumplidas del sprint anterior
        if (data.acciones_no_cumplidas_Sprint_anterior && data.acciones_no_cumplidas_Sprint_anterior.length > 0) {
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <td colspan="6">
                    Acciones pendientes del Sprint Anterior (${data.sprint_anterior})
                </td>
            `;
            tbody.appendChild(headerRow);

            data.acciones_no_cumplidas_Sprint_anterior.forEach(retro => {
                tbody.appendChild(crearFilaRetrospectiva(retro, true));
            });
        }

        // Mostrar la tabla
        retrospectivasTable.style.display = 'table';

    } catch (error) {
        console.error('Error al mostrar retrospectivas:', error);
    }
};

// Crear fila de retrospectiva (función modificada)
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

    // Determinar el texto de cumplimiento
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

// Formatear fecha
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    // Crear tbody si no existen
    if (!sprintsTable.querySelector('tbody')) sprintsTable.createTBody();
    if (!retrospectivasTable.querySelector('tbody')) retrospectivasTable.createTBody();
    
    // Cargar datos iniciales
    cargarTablaSprints();
});