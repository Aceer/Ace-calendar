<?php

// Connect to a MySQL database using PHP PDO
	
$dsn      = 'mysql:host=blu-ray.student.bth.se;dbname=alsv13;';
$login    = 'alsv13';
$password = '';

$options  = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'");

$row = '';
$stmt = '';
$sql = '';
$data = [];

try{
	$pdo = new PDO($dsn, $login, $password, $options);
	$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
	$sql = 'SELECT * FROM calendar';
	$stmt = $pdo->prepare($sql);
	$stmt->execute();
	$row = $stmt->fetchAll();
	
	foreach($row as $r){
		$data[] = ['d' => $r->day,'h' => $r->head,'st' => $r->start];
	}
	header('content-type: application/json');
	echo json_encode($data);

	/*
	foreach($row as $r){
		echo 'Res year = '.$r->year.'<br>';
	}
	*/
}catch(Exception $e) {
  //throw 'Error message: '.$e->getMessage(); // For debug purpose, shows all connection details
  throw new PDOException('Could not connect to database, hiding connection details.'); // Hide connection details.
  die();
}


?>