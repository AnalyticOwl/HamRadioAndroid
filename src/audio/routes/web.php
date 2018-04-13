<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('confirm-email/{id}', 'APIController@confirm_email');
Route::get('reset-password/{id}', 'APIController@resetPassword');
Route::post('changePassword', 'APIController@changePassword');
