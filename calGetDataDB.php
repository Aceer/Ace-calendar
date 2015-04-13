<?php

// Connect to a MySQL database using PHP PDO
	
$dsn      = 'mysql:host=blu-ray.student.bth.se;dbname=alsv13;';
$login    = 'alsv13';
$password = 'kvNwfA6%';
$data = '';
$sql = '';

$options  = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'");

if($_GET['type'] === 'getData'){

	try{
		$pdo = new PDO($dsn, $login, $password, $options);
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
		
		$sql = 'SELECT * FROM calendar';
		$stmt = $pdo->prepare($sql);
		$stmt->execute();
		$res = $stmt->fetchAll();
		
		//echo var_dump(json_encode($res));
		
		header('content-type: application/json');
		echo json_encode($res);
		
		//header('content-type: application/json');
		//echo jason_encode(array("message" => $messages[rand(0, count($messages)-1)]));


	}catch(Exception $e){
		// throw 'Error msg: '.$e->getMessage(); // For degug
		throw new PDOExeption('could not connect to the database');
		die();
	}
}
?>