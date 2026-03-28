<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return view('welcome_message');
    }

    public function diag()
    {
        $db = \Config\Database::connect();
        try {
            $db->connect();
            $connected = $db->connID ? "Yes" : "No";
        } catch (\Exception $e) {
            $connected = "Error: " . $e->getMessage();
        }

        return $this->response->setJSON([
            'environment' => ENVIRONMENT,
            'db_driver' => $db->DBDriver,
            'db_connected' => $connected,
            'hostname_env' => env('database.default.hostname'),
            'port_env' => env('database.default.port'),
            'username_env' => env('database.default.username'),
            'full_db_config' => [
                'hostname' => $db->hostname,
                'username' => $db->username,
                'database' => $db->database,
                'DBDriver' => $db->DBDriver,
                'port'     => $db->port,
            ]
        ]);
    }
}
