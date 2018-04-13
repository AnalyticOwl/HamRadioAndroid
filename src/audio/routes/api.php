<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('songs', 'APIController@songs');
Route::get('songs/{pageId}','APIController@offsetSongs'); 
Route::get('songs/{id}/{songid}','APIController@specific_songs'); 


Route::post('registeruser', 'APIController@register_user');

Route::post('loginuser', 'APIController@login_user');


Route::get('getprofile', 'APIController@getProfile');
Route::get('getprofile/{id}','APIController@getProfileById'); 
Route::post('addprofile', 'APIController@addNewProfile');

Route::post('addplaylist', 'APIController@addplaylist');
Route::post('updateplaylist', 'APIController@updateplaylist');

Route::post('upplaylist', 'APIController@upplaylist');

Route::post('updateprofile', 'APIController@updateProfile');
Route::get('getplaylist/{id}', 'APIController@getplaylists');
Route::get('getplaylist/{id}/{pid}', 'APIController@getplaylist');
Route::get('deleteplaylist/{id}', 'APIController@deleteplaylist');
Route::post('forgetpassword', 'APIController@forgetPassword');
Route::post('change-password', 'APIController@changeUserPassword');



