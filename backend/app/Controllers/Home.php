<?php

namespace App\Controllers;

class Home extends BaseController
{
    public function index(): string
    {
        return view('welcome_message');
    }

    public function migrate()
    {
        $migrate = \Config\Services::migrations();
        try {
            $migrate->latest();
            return $this->response->setJSON(['status' => 'success', 'message' => 'Migrations ran successfully!']);
        } catch (\Exception $e) {
            return $this->response->setJSON(['status' => 'error', 'message' => $e->getMessage()]);
        }
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
            'db_driver'   => $db->DBDriver,
            'db_connected'=> $connected,
            'database_url_set' => getenv('DATABASE_URL') ? 'Yes' : 'No',
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
