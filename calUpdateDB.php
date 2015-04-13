<?php

// Connect to a MySQL database using PHP PDO
	
$dsn      = 'mysql:host=blu-ray.student.bth.se;dbname=alsv13;';
$login    = 'alsv13';
$password = 'kvNwfA6%';
$data = null;
$sql = '';
$ye = null;
$mo = null;
$da = null;
$res = null;

$options  = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'UTF8'");

if($_POST['event'] === 'update'){
	$data = isset($_POST['value']) ? json_decode($_POST['value']) : null;
}

try{
	if($data){
		$pdo = new PDO($dsn, $login, $password, $options);
		$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
	
	//echo var_dump($data);
		
	
	foreach($data as $d){	// ->ac 1 = delete
		if($d->ac == 1){
			$stmt = $pdo->prepare("DELETE FROM calendar WHERE year=? AND month=? AND day=?");
			$stmt->execute([$d->y,$d->m,$d->d]);
			echo 'del<br> year = '.$d->y.'<br> month = '.$d->m.'<br>Day = '.$d->d;
		}
	}
	foreach($data as $d){	// ->ac 2 = insert
		if($d->ac == 2){
			$stmt = $pdo->prepare("INSERT INTO calendar VALUES(?,?,?,?,?,?,?,?,?,?)");
			$stmt->execute([$d->y,$d->m,$d->d,isset($d->t)?:null,isset($d->h)?$d->h:null,isset($d->s)?$d->s:null,isset($d->e)?$d->e:null,isset($d->p)?$d->p:null,isset($d->v)?$d->v:null,isset($d->te)?$d->te:null]);
		}
	}
	
	}
	//$sql = 'INSERT INTO calendar VALUES (?,?,?,?,?,?,?,?,?,?)';
	//$stmt = $pdo->prepare($sql);
	//$stmt->execute([$yr,$mo,$da,$ty,$he,$st,$en,$pl,$vs,$te]);
	//echo var_dump(json_decode($data));


}catch(Exception $e) {
  //throw 'Error message: '.$e->getMessage(); // For debug purpose, shows all connection details
  throw new PDOException('Could not connect to database, hiding connection details.'); // Hide connection details.
  die();
}
?>