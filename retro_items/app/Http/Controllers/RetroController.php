<?php

namespace App\Http\Controllers;

use App\Models\Retro;
use Illuminate\Http\Request;

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
        $newRetro->sprint_id = $data['sprint_id'];
        $newRetro->categoria = $data['categoria'];
        $newRetro->descripcion = $data['descripcion'];
        $newRetro->cumplida = $data['cumplida'];
        $newRetro->fecha_revision = $data['fecha_revision'];
        $newRetro->created_at = $data['created_at'];
        $newRetro->updated_at = $data['updated_at'];
        $newRetro->save();
        return response()->json(["data" => "Retro Creada"], 201);
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
        $retro = Retro::find($id);
        if (empty($retro)) {
            return response()->json(['data' => 'No hay informacion sobre la retro'], 404);
        }
        $retro->sprint_id = $data['sprint_id'];
        $retro->categoria = $data['categoria'];
        $retro->descripcion = $data['descripcion'];
        $retro->cumplida = $data['cumplida'];
        $retro->fecha_revision = $data['fecha_revision'];
        $retro->created_at = $data['created_at'];
        $retro->updated_at = $data['updated_at'];
        $retro->save();
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
