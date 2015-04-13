<?php
	function autoLoadClass($class)
	{
		$path = "{$class}.php";
		if(is_file($path))
		{
			include($path);
			echo "</br>PATCH = $path </br>";
		}
	}
	spl_autoload_register('autoLoadClass');
?>