<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use CodeIgniter\RESTful\ResourceController;
use Firebase\JWT\JWT;

class AuthController extends ResourceController
{
    private $jwtSecret = 'my_super_secret_jwt_key_12345_for_ci4_app';

    public function register()
    {
        $db = \Config\Database::connect();
        $userModel = new AuthUserModel();
        $teacherModel = new TeacherModel();

        $vData = $this->request->getJSON(true) ?? $this->request->getPost();
        
        $rules = [
            'email'           => 'required|valid_email|is_unique[auth_user.email]',
            'password'        => 'required|min_length[5]',
            'first_name'      => 'required',
            'last_name'       => 'required',
            'university_name' => 'required',
            'gender'          => 'required',
            'year_joined'     => 'required|numeric'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        // Transaction to ensure 1-1 relationship integrity
        $db->transStart();

        $userId = $userModel->insert([
            'email'      => $vData['email'],
            'first_name' => $vData['first_name'],
            'last_name'  => $vData['last_name'],
            'password'   => password_hash($vData['password'], PASSWORD_BCRYPT),
        ], true); // true returns the inserted id

        if ($userId) {
            $teacherModel->insert([
                'user_id'         => $userId,
                'university_name' => $vData['university_name'],
                'gender'          => $vData['gender'],
                'year_joined'     => $vData['year_joined']
            ]);
        }

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->failServerError('Failed to create user and teacher record.');
        }

        return $this->respondCreated(['message' => 'User and Teacher registered successfully']);
    }

    public function login()
    {
        $userModel = new AuthUserModel();
        $teacherModel = new TeacherModel();
        
        $vData = $this->request->getJSON(true) ?? $this->request->getPost();
        $email = $vData['email'] ?? '';
        $password = $vData['password'] ?? '';

        $user = $userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->failUnauthorized('Invalid email or password');
        }

        $teacher = $teacherModel->where('user_id', $user['id'])->first();

        $payload = [
            'iat' => time(),
            'exp' => time() + 3600 * 24, // 1 day
            'uid' => $user['id'],
            'email' => $user['email']
        ];

        $token = JWT::encode($payload, $this->jwtSecret, 'HS256');

        return $this->respond([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'email' => $user['email'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name']
            ],
            'teacher' => $teacher
        ]);
    }
}
