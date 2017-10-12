<?php 
header("Access-Control-Allow-Origin: *"); 
header("Content-Type: application/json; charset=UTF-8"); 
require_once 'db_connect.php' ; 
$str = $_GET['str'];

$data = array(); 
$result = mysqli_query($con, $str); 

if(mysqli_num_rows($result) > 0){ 
  while($row = mysqli_fetch_assoc($result)){ 
    $data[] = $row; 
  } 
} 
mysqli_close($con); 
echo $json_response = json_encode($data); 
?>