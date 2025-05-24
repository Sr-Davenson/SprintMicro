<?php

use App\Http\Controllers\RetroController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(RetroController::class)->group(function(){
    Route::get('retro_items','index');
    Route::post('retro_item','store');
    Route::put('retro_item/{id}','update');
    Route::delete('retro_item/{id}','destroy');
});