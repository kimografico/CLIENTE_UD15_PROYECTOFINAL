<?php
	require ('conexion.php');
	$result = mysqli_query($link,"SELECT * FROM productos");


    while($row = mysqli_fetch_array($result))
    {
		$objeto = new stdClass();
		$objeto->id = $row["idProducto"];
		$objeto->nombre = $row["nombre"];
		$objeto->precio = $row["precio"];
		$objeto->foto = $row["foto"];
		$datos[]=$objeto;
	}

	header('Content-Type: application/json');
	echo json_encode($datos);

	mysqli_free_result($result); 
	mysqli_close($link); 


?>