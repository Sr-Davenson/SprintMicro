<?php

use App\Http\Controllers\RetroController;
use App\Http\Controllers\SprintController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(RetroController::class)->group(function(){
    Route::get('retro','index');
    Route::post('retro','store');
    Route::put('retro/{id}','update');
    Route::delete('retro/{id}','destroy');
    Route::get('retro/{id}','show');
});

Route::controller(SprintController::class)->group(function(){
    Route::get('sprint','index');
    Route::post('sprint','store');
    Route::put('sprint/{id}','update');
    Route::delete('sprint/{id}','destroy');
});
