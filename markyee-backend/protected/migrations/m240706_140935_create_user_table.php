<?php

class m240706_140935_create_user_table extends CDbMigration
{
    public function up()
    {
        $this->createTable('user', array(
            'id' => 'pk',
            'username' => 'string NOT NULL',
            'email' => 'string NOT NULL',
			'mobile' => 'string',
            'password_hash' => 'string NOT NULL',
            'auth_key' => 'string NOT NULL',
            'verification_token' => 'string',
            'access_token' => 'string',
            'is_verified' => 'boolean DEFAULT 0',
            'created_at' => 'datetime NOT NULL',
            'updated_at' => 'datetime NOT NULL',
        ));
    }

    public function down()
    {
        $this->dropTable('user');
    }
}
