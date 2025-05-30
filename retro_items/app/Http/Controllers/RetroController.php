<?php

namespace App\Http\Controllers;

use App\Models\Retro;
use App\Models\Sprint;
use Illuminate\Http\Request;

use function PHPUnit\Framework\isEmpty;

class RetroController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rows = Retro::all();
        return response()
            ->json(["data" => $rows], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $newRetro = new Retro();
        $sprint = Sprint::find($data['sprint_id']);

        $newRetro->sprint_id = $data['sprint_id'];
        $newRetro->categoria = $data['categoria'];
        $newRetro->descripcion = $data['descripcion'];
        $newRetro->cumplida = $data['cumplida'];
        $newRetro->fecha_revision = isset($data['fecha_revision']) ? $data['fecha_revision'] : null;
        $newRetro->created_at = now()->setTimezone('America/Bogota');
        $newRetro->updated_at = now()->setTimezone('America/Bogota');
        $newRetro->save();

        $sprint->updated_at = now()->setTimezone('America/Bogota');
        $sprint->save();
        return response()->json(["data" => "Retro Creada"], 201);
    }

    /**
     * Display the specified resource.
     */

    public function show(string $sprint_id)
    {
        $sprintActual = Sprint::find($sprint_id);
        if (!$sprintActual) {
            return response()->json(["error" => "Sprint no encontrado"], 404);
        }

        $sprintAnterior = Sprint::where('id', '<', $sprint_id)->orderBy('id', 'desc')->first();

        $retrosActuales = Retro::where('sprint_id', $sprint_id)->get();

        $retrosAnteriores = $sprintAnterior ? Retro::where('sprint_id', $sprintAnterior->id)->get() : collect([]);

        return response()->json([
            "sprint_actual" => $sprint_id,
            "retros_actuales" => $retrosActuales,
            "sprint_anterior" => $sprintAnterior ? $sprintAnterior->id : null,
            "retros_anteriores" => $retrosAnteriores
        ], 200);
    }
    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $retro = Retro::find($id);

        if (!$retro) {
            return response()->json(['data' => 'No hay información sobre la retro'], 404);
        }


        $sprint = Sprint::find($data['sprint_id']);

        $retro->sprint_id = $data['sprint_id'];
        $retro->categoria = $data['categoria'];
        $retro->descripcion = $data['descripcion'];
        $retro->cumplida = filter_var($data['cumplida'], FILTER_VALIDATE_BOOLEAN);
        $retro->fecha_revision = $data['fecha_revision'];
        $retro->updated_at = now()->setTimezone('America/Bogota');

        $retro->save();

        $sprint->updated_at = now()->setTimezone('America/Bogota');
        $sprint->save();

        return response()->json(["data" => "Retro actualizada"], 200);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $retro = Retro::find($id);
        if (empty($retro)) {
            return response()->json(['data' => 'No hay informacion sobre la retro'], 404);
        }
        $retro->delete();

        return response()->json(["data" => "Retro eliminada"], 200);
    }
}
