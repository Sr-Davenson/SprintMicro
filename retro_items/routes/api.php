<?php

use App\Http\Controllers\RetroController;
use App\Http\Controllers\SprintController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(RetroController::class)->group(function(){
    Route::get('retro_items','listarRetro');
    Route::post('retro_item','newRetro');
    Route::put('retro_item/{id}','updateRetro');
    Route::delete('retro_item/{id}','deleteRetro');
});

Route::controller(SprintController::class)->group(function(){
    Route::get('retro_items','index');
    Route::post('retro_item','store');
    Route::put('retro_item/{id}','update');
    Route::delete('retro_item/{id}','destroy');
});