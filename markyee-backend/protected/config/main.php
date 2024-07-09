<?php

return array(
    'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
    'name' => 'Markyee',

    // Preloading 'log' component
    'preload' => array('log'),

    // Autoloading model and component classes
    'import' => array(
        'application.models.*',
        'application.components.*',
    ),

    // Modules configuration if any
    'modules' => array(
        // 'gii' => array(
        //     'class' => 'system.gii.GiiModule',
        //     'password' => 'Enter Your Password Here',
        //     'ipFilters' => array('127.0.0.1', '::1'),
        // ),
    ),

    // Application components
    'components' => array(

        'user' => array(
            'allowAutoLogin' => true,
        ),

        // URL Manager setup for path-format URLs
        'urlManager' => array(
            'urlFormat' => 'path',
            'rules' => array(
                'api/users' => 'user/index',
                'api/signin' => 'user/signin',
                'api/signup' => 'user/signup',
                'api/signout' => 'user/signout',
                'api/user/update/<id:\d+>' => 'user/update',
                'api/user/delete/<id:\d+>' => 'user/delete',
                'api/user/detail/<auth_key:\w+>' => 'user/activateuser',
                'api/user/auth/<auth_key:\w+>' => 'user/getuserauthkey',
                'api/user/username/<username:\w+>' => 'user/getuserbyusername',
                'api/user/usernamebytoken/<access_token:\w+>' => 'user/getuserbytoken',
            ),
            
        ),

        // Database settings configured in database.php
        'db' => require(dirname(__FILE__) . '/database.php'),

        'errorHandler' => array(
            // Use 'site/error' action to display errors
            'errorAction' => YII_DEBUG ? null : 'site/error',
        ),

        'log' => array(
            'class' => 'CLogRouter',
            'routes' => array(
                array(
                    'class' => 'CFileLogRoute',
                    'levels' => 'error, warning',
                ),
                // Uncomment the following to show log messages on web pages
                /*
                array(
                    'class' => 'CWebLogRoute',
                ),
                */
            ),
        ),

    ),

    // Application-level parameters that can be accessed
    // using Yii::app()->params['paramName']
    'params' => array(
        // This is used in the contact page
        'adminEmail' => 'webmaster@example.com',
    ),
);
