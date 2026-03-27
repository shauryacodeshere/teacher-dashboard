<?php

namespace App\Controllers;

use App\Models\AuthUserModel;
use App\Models\TeacherModel;
use CodeIgniter\RESTful\ResourceController;

class DataController extends ResourceController
{
    public function users()
    {
        $userModel = new AuthUserModel();
        $users = $userModel->select('id, email, first_name, last_name, created_at, updated_at')->findAll();
        return $this->respond($users);
    }

    public function teachers()
    {
        $teacherModel = new TeacherModel();
        
        // Let's do a join to return some user details too
        $db = \Config\Database::connect();
        $builder = $db->table('teachers');
        $builder->select('teachers.*, auth_user.first_name, auth_user.last_name, auth_user.email');
        $builder->join('auth_user', 'auth_user.id = teachers.user_id');
        $teachers = $builder->get()->getResult();
        
        return $this->respond($teachers);
    }

    public function updateUser($id)
    {
        $userModel = new AuthUserModel();
        $teacherModel = new TeacherModel();
        
        if (!$userModel->find($id)) {
            return $this->failNotFound('User not found');
        }

        $vData = $this->request->getJSON(true) ?? $this->request->getRawInput();
        
        $userData = [];
        if (isset($vData['first_name'])) $userData['first_name'] = $vData['first_name'];
        if (isset($vData['last_name'])) $userData['last_name'] = $vData['last_name'];
        if (isset($vData['email'])) $userData['email'] = $vData['email'];

        if (!empty($userData)) {
            $userModel->update($id, $userData);
        }

        $teacher = $teacherModel->where('user_id', $id)->first();
        if ($teacher) {
            $teacherData = [];
            if (isset($vData['university_name'])) $teacherData['university_name'] = $vData['university_name'];
            if (isset($vData['gender'])) $teacherData['gender'] = $vData['gender'];
            if (isset($vData['year_joined'])) $teacherData['year_joined'] = $vData['year_joined'];
            
            if (!empty($teacherData)) {
                $teacherId = is_array($teacher) ? $teacher['id'] : $teacher->id;
                $teacherModel->update($teacherId, $teacherData);
            }
        }

        return $this->respond(['message' => 'Profile updated successfully']);
    }

    public function deleteUser($id)
    {
        $userModel = new AuthUserModel();
        $teacherModel = new TeacherModel();

        if (!$userModel->find($id)) {
            return $this->failNotFound('User not found');
        }

        $db = \Config\Database::connect();
        $db->transStart();

        $teacherModel->where('user_id', $id)->delete();
        $userModel->delete($id);

        $db->transComplete();

        if ($db->transStatus() === false) {
            return $this->failServerError('Failed to delete user.');
        }

        return $this->respondDeleted(['id' => $id, 'message' => 'User gracefully deleted']);
    }
}
