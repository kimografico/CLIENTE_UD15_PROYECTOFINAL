<?php
$link = mysqli_connect("localhost", "root", "");
mysqli_select_db( $link,"virtualmarket");
$tildes = $link->query("SET NAMES 'UTF8'");

?>