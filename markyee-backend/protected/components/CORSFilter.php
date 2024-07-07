<?php
class CORSFilter extends CFilter {
    protected function preFilter($filterChain) {
        Yii::app()->request->enableCsrfValidation = false; 

        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
        header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            Yii::app()->end(); 
        }

        return true;
    }
}
