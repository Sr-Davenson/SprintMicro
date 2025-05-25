<?php

namespace App\Http\Controllers;

use App\Models\Sprint;
use Illuminate\Http\Request;

class SprintController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rows = Sprint::all();
        return response()
            ->json(["data" => $rows], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->all();
        $newSprint = new Sprint();
        $newSprint->nombre = $data['nombre'];
        $newSprint->fecha_inicio = $data['fecha_inicio'];
        $newSprint->fecha_fin = $data['fecha_fin'];
        $newSprint->created_at = $data['created_at'];
        $newSprint->updated_at = $data['updated_at'];
        $newSprint->save();
        return response()->json(["data" => "Sprint Creado"], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $data = $request->all();
        $sprint = Sprint::find($id);
        if (empty($retro)) {
            return response()->json(['data' => 'No hay informacion sobre el sprint'], 404);
        }
        $sprint->nombre = $data['nombre'];
        $sprint->fecha_inicio = $data['fecha_inicio'];
        $sprint->fecha_fin = $data['fecha_fin'];
        $sprint->created_at = $data['created_at'];
        $sprint->updated_at = $data['updated_at'];
        $retro->save();
        return response()->json(["data" => "Sprint actualizada"], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
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
