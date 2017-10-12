<?php
$host="localhost";
$user="root";
$passw="12345678";
$dbname="shoppinglist";
$con=mysqli_connect($host,$user,$passw,$dbname);
mysqli_set_charset( $con, 'utf8');
//mysqli_query("SET NAMES UTF8");
if(!$con){
	echo "ไม่สามารถติดต่อฐานข้อมูลได้";
	exit();
}
?>