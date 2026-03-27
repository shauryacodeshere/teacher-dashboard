<?php

namespace App\Models;

use CodeIgniter\Model;

class TeacherModel extends Model
{
    protected $table = 'teachers';
    protected $primaryKey = 'id';
    protected $allowedFields = ['user_id', 'university_name', 'gender', 'year_joined', 'created_at', 'updated_at'];
    protected $useTimestamps = true;
}
