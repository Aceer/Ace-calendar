<?php

class CDatabase {

/* ---------- PRIVATE ----------------*/
   
	private $options;                   // Options used when creating the PDO object
	private $db   = null;               // The PDO object
	private $stmt = null;               // The latest statement used to execute a query
	private static $numQueries = 0;     // Count all queries made
	private static $queries = array();  // Save all queries for debugging purpose
	private static $params = array();   // Save all parameters for debugging purpose	

  
/* ----------- PUBLIC -----------------*/
   
  /**
   * Constructor creating a PDO object connecting to a choosen database.
   *
   * @param array $options containing details for connecting to the database.
   *
   */
	public function __construct($options) {
		$default = array(
		'dsn' => null,
		'username' => null,
		'password' => null,
		'driver_options' => null,
		'fetch_style' => PDO::FETCH_OBJ,
		);
		$this->options = array_merge($default, $options);
	 
		try {
			$this->db = new PDO($this->options['dsn'], $this->options['username'], $this->options['password'], $this->options['driver_options']);
		}
		catch(Exception $e) {
			//throw $e; // For debug purpose, shows all connection details
			throw new PDOException('Could not connect to database, hiding connection details.'); // Hide connection details.
		}
 
		$this->db->SetAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, $this->options['fetch_style']); 
	}	
 
 }
?>