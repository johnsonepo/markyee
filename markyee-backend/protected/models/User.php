<?php

class User extends CActiveRecord
{
    public $access_token;

    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'user';
    }

    public function rules()
    {
        return array(
            array('username, email', 'required'),
            array('email', 'email'),
            ['access_token', 'safe'],
        );
    }

    public function attributeLabels()
    {
        return array(
            'id' => 'ID',
            'username' => 'Username',
            'email' => 'Email',
            'mobile' => 'Mobile',
            'password_hash' => 'Password Hash',
            'auth_key' => 'Auth Key',
            'verification_token' => 'Verification Token',
            'access_token' => 'Access Token',
            'is_verified' => 'Is Verified',
            'created_at' => 'Created At',
            'updated_at' => 'Updated At',
        );
    }
}
