<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use Illuminate\Http\Request;

class SprintController extends Controller
{

    public function index()
    {
        $rows = Sprint::all();
        return response()
            ->json(["data" => $rows], 200);
    }

    public function store(Request $request)
    {
        $data = $request->all();
        $newSprint = new Sprint();
        $newSprint->nombre = $data['nombre'];
        $newSprint->fecha_inicio = $data['fecha_inicio'];
        $newSprint->fecha_fin = $data['fecha_fin'];
        $newSprint->created_at = now()->setTimezone('America/Bogota');
        $newSprint->updated_at = now()->setTimezone('America/Bogota');
        $newSprint->save();
        return response()->json(["data" => "Sprint Creado"], 201);
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $sprint = Sprint::find($id);
        if (empty($sprint)) {
            return response()->json(['data' => 'No hay informacion sobre el sprint'], 404);
        }
        $sprint->nombre = $data['nombre'];
        $sprint->fecha_inicio = $data['fecha_inicio'];
        $sprint->fecha_fin = $data['fecha_fin'];
        $sprint->updated_at = now()->setTimezone('America/Bogota');
        $sprint->save();
        return response()->json(["data" => "Sprint actualizada"], 200);
    }

    public function destroy(string $id)
    {
        $sprint = Sprint::find($id);
        if (empty($sprint)) {
            return response()->json(['data' => 'No hay informacion sobre el spritn'], 404);
        }
        $sprint->delete();
        return response()->json(["data" => "Sprint eliminada"], 200);
    }
}
