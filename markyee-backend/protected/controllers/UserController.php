<?php

class UserController extends CController
{
    public function filters()
    {
        return array(
            'accessControl',
            array(
                'application.components.CORSFilter + signup, activateUser, index, signin, signout, update, delete, getuserbytoken, getUserByUsername, getUserAuthKey',
            ),
        );
    }

    public function accessRules()
    {
        return array(
            array(
                'allow',
                'actions' => array('signup', 'activateUser', 'index', 'signin', 'signout', 'update', 'delete', 'getUserAuthKey', 'getuserbytoken', 'getUserByUsername'), 
                'users' => array('*'),
            ),
        );
    }

    function generateRandomString($length = 6) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }
    public function actionSignup()
    {
        $rawData = Yii::app()->request->getRawBody();
        $postData = json_decode($rawData, true);

        $requiredFields = ['username', 'email', 'password'];
        $missingFields = [];
        foreach ($requiredFields as $field) {
            if (!isset($postData[$field]) || empty($postData[$field])) {
                $missingFields[] = $field;
            }
        }

        if (!empty($missingFields)) {
            $error = ['error' => 'Missing required fields', 'fields' => $missingFields];
            $this->sendResponse(422, $error);
        }

        if (!filter_var($postData['email'], FILTER_VALIDATE_EMAIL)) {
            $error = ['error' => 'Invalid email format'];
            $this->sendResponse(422, $error);
        }

        $existingUser = User::model()->findByAttributes(['email' => $postData['email']]);
        if ($existingUser !== null) {
            $error = ['error' => 'Email already exists'];
            $this->sendResponse(422, $error);
        }

        $passwordHash = Yii::app()->getSecurityManager()->hashData($postData['password']);
        $authKey = $authKey = $this->generateRandomString(6);

        $user = new User;
        $user->username = $postData['username'];
        $user->email = $postData['email'];
        $user->password_hash = $passwordHash;
        $user->auth_key = $authKey;
        $user->created_at = new CDbExpression('NOW()');
        $user->updated_at = new CDbExpression('NOW()');

        if ($user->save()) {
            $response = [
                'auth_key' => $authKey,
                'username' => $user->username,
                'email' => $user->email,
            ];
            $this->sendResponse(200, $response);
        } else {
            $error = ['error' => 'Failed to save user'];
            $this->sendResponse(500, $error);
        }
    }

    public function actionGetUserAuthKey($auth_key)
    {
        $user = User::model()->findByAttributes(['auth_key' => $auth_key]);

        if ($user) {
            $responseData = [
                'auth_key' => $user->auth_key,
                'is_verified' => $user->is_verified,
                'username' => $user->username,
                'access_token' => $user->access_token,
            ];
            $this->sendResponse(200, $responseData);
        } else {
            $this->sendResponse(404, ['error' => 'User not found']);
        }
    }

    public function actionGetUserByUsername($username)
    {
        $user = User::model()->findByAttributes(array('username' => $username));

        if ($user) {
            $responseData = array(
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'is_verified' => $user->is_verified,
                'access_token' => $user->access_token,
            );
            $this->sendResponse(200, $responseData);
        } else {
            $this->sendResponse(404, array('error' => 'User not found'));
        }
    }

    public function actionActivateUser($auth_key)
    {
        if (!$auth_key) {
            $this->sendResponse(400, 'Auth key is required');
        }

        $user = User::model()->findByAttributes(['auth_key' => $auth_key]);

        if (!$user) {
            $this->sendResponse(404, 'User not found');
        }

        $user->is_verified = 1;
        $user->verification_token = $user->auth_key;

        if ($user->save()) {
            $responseData = [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'auth_key' => $user->auth_key,
                'is_verified' => $user->is_verified,
            ];
            $this->sendResponse(200, $responseData);
        } else {
            $this->sendResponse(500, ['error' => 'Failed to activate user']);
        }
    }

    public function actionIndex()
    {
        $users = User::model()->findAll();
        $this->sendResponse(200, $users);
    }

    public function actionSignin()
    {
        $rawData = Yii::app()->request->getRawBody();
        $postData = json_decode($rawData, true);

        $usernameOrEmail = isset($postData['username']) ? $postData['username'] : null;
        $password = isset($postData['password']) ? $postData['password'] : null;

        if (!$usernameOrEmail || !$password) {
            $this->sendResponse(400, ['error' => 'Username/email and password are required']);
            return;
        }

        $user = User::model()->findByAttributes(['username' => $usernameOrEmail]);

        if (!$user) {
            $user = User::model()->findByAttributes(['email' => $usernameOrEmail]);
        }

        if ($user) {
            $enteredPasswordHash = Yii::app()->getSecurityManager()->hashData($password);

            if ($user->password_hash === $enteredPasswordHash) {
                $accessToken = bin2hex(openssl_random_pseudo_bytes(16));
                $user->access_token = $accessToken;
                $user->save();
                $responseData = [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'mobile' => $user->mobile,
                    'auth_key' => $user->auth_key,
                    'access_token' => $accessToken,
                ];

                $this->sendResponse(200, $responseData);
            } else {
                $this->sendResponse(422, ['error' => 'User credentials do not match']);
            }
        } else {
            $this->sendResponse(404, ['error' => 'User not found']);
        }
    }

    public function actionGetuserbytoken($access_token)
    {
        $user = User::model()->findByAttributes(['access_token' => $access_token]);

        if ($user) {
            $responseData = [
                'username' => $user->username,
            ];
            $this->sendResponse(200, $responseData);
        } else {
            $this->sendResponse(404, ['error' => 'User not found']);
        }
    }

    public function actionSignout()
    {
        echo CJSON::encode(['message' => 'Signout endpoint']);
    }

    public function actionUpdate($id)
    {
        $user = User::model()->findByPk($id);

        if ($user === null) {
            $this->sendResponse(404, ['error' => 'User not found.']);
            return;
        }

        $rawData = Yii::app()->request->getRawBody();
        $params = json_decode($rawData, true);

        if (isset($params['username']) && $params['username'] !== $user->username) {
            $existingUser = User::model()->findByAttributes(['username' => $params['username']]);
            if ($existingUser !== null && $existingUser->id !== $id) {
                $this->sendResponse(400, ['error' => 'Username already exists.']);
                return;
            }
        }

        if (isset($params['email']) && $params['email'] !== $user->email) {
            $existingUser = User::model()->findByAttributes(['email' => $params['email']]);
            if ($existingUser !== null && $existingUser->id !== $id) {
                $this->sendResponse(400, ['error' => 'Email already exists.']);
                return;
            }
        }
        
        if(isset($params['password']) ){
            if($params['password'] !== ''){
                $params['password_hash'] =  $params['password'];
            }
            unset($params['password']); 
        }
        
        foreach ($params as $attribute => $value) {
            if($params[$attribute] === $user->$attribute){
                unset($params[$attribute]); 
            }
            if ($attribute === 'password_hash') {
                $user->password_hash = Yii::app()->getSecurityManager()->hashData($value);
            }elseif ($user->hasAttribute($attribute)) {
                $user->$attribute = $value;
            }
        }
        
        if ($user->save()) {
            $updatedUser = User::model()->findByPk($id);

            $responseData = array(
                'id' => $updatedUser->id,
                'username' => $updatedUser->username,
                'email' => $updatedUser->email,
                'mobile' => $updatedUser->mobile,
                'is_verified' => $updatedUser->is_verified,
                'password' => '',
                'access_token' => $updatedUser->access_token,
            );
            $this->sendResponse(200, $responseData);
        } else {
            $this->sendResponse(400, ['error' => $user->getErrors()]);
        }
    }

    public function actionDelete($id)
    {
        $user = User::model()->findByPk($id);
        $username = $user->username;
        if ($user) {
            if ($user->is_verified == 1) {
                if ($user->delete()) {
                    $this->sendResponse(200, array('username' => $username));
                } else {
                    $this->sendResponse(500, array('error' => 'Failed to delete user'));
                }
            } else {
                $this->sendResponse(403, array('error' => 'User is not verified'));
            }
        } else {
            $this->sendResponse(404, array('error' => 'User not found'));
        }
    }

    private function sendResponse($status, $body)
    {
        header('Content-Type: application/json');
        http_response_code($status);
        echo CJSON::encode($body);
        Yii::app()->end();
    }
}
