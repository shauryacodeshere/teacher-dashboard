<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->options('(:any)', 'Home::index');

$routes->group('api', function($routes) {
    $routes->post('register', 'AuthController::register');
    $routes->post('login', 'AuthController::login');
    
    $routes->group('', ['filter' => 'auth'], function($routes) {
        $routes->get('users', 'DataController::users');
        $routes->put('users/(:num)', 'DataController::updateUser/$1');
        $routes->delete('users/(:num)', 'DataController::deleteUser/$1');
        $routes->get('teachers', 'DataController::teachers');
    });
});
