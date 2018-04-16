<?php
ini_set('display_errors', 'off');
// Параметры для подключения
/*$db_host = "localhost";
$db_user = "root"; // Логин БД
$db_password = "z"; // Пароль БД
$database = "allinsol_reg"; // БД*/

 $db_host = "mysqldb3.ehost-services.com:3306";
$db_user = "decca_leads"; // Логин БД
$db_password = "N1or7r4%"; // Пароль БД
$database = "deccamp_leads"; // БД

// Подключение к базе данных
$db = mysql_connect($db_host,$db_user,$db_password) or die("Не могу создать соединение ");
 
// Выборка базы
mysql_select_db($database, $db);

mysql_query("SET NAMES 'utf8'"); 
mysql_query("SET CHARACTER SET 'utf8'");
mysql_query("SET SESSION collation_connection = 'utf8_general_ci'");
/* Log*/

# получаем все инфу с формы и пакуем массив с данными
$d['date_time'] = date("F j, Y, g:i:s a");
$d['REMOTE_ADDR'] = $_SERVER["REMOTE_ADDR"];
//$d['HTTP_USER_AGENT'] = trim($_SERVER['HTTP_USER_AGENT']);

$file = fopen('log.txt', "a+");
fwrite($file, ' #---Log--  ');
fwrite($file, print_r($d, 1));
fwrite($file, print_r(' --GET-- ', 1));
fwrite($file, print_r($_GET, 1));
fwrite($file, print_r(' --POST-- ', 1));
fwrite($file, print_r($_POST, 1));
fwrite($file, ' ------#  ');
fclose($file);





function getVar($name)
{
  $name = isset($_POST[$name]) ? trim($_POST[$name]) : null;
  $name = mysql_real_escape_string($name);
  return $name;
}

function GetClearPhoneNumber($number) {
  if (empty($number)) {
    return "";
  }
  $number = str_replace('(', '', $number);
  $number = str_replace(')', '', $number);
  $number = str_replace('-', '', $number);
  $number = str_replace('+', '', $number);
  return $number;
}

  $name = getVar('name');
  $phone = getVar('phone');
  $email = getVar('email');


$data = array(
  'orderType' => getVar('orderType'),
  'name' => $name,
  'phone'     => GetClearPhoneNumber($phone),
  'email'     => !empty($email) ? $email : 'callme@email.com',
  'date_visited' => date("d.m.Y"),
  'time_visited' => date("G:i:s"),
  'page_url' => getVar('page_url'),
  'user_agent' => $_SERVER['HTTP_USER_AGENT'],
  'utm_source' => getVar('utm_source') ? getVar('utm_source')  :  '(direct)',
  'utm_campaign' => getVar('utm_campaign') ? getVar('utm_campaign')  :  '(not set)',
  'utm_medium' => getVar('utm_medium') ? getVar('utm_medium')  :  '(none)',
  'utm_term' => getVar('utm_term') ? getVar('utm_term')  :  '(not set)',
  'utm_content' => getVar('utm_content') ? getVar('utm_content')  :  '(not set)',
  'ref' => getVar('ref'),
  'ip_address' => getVar('ip_address'),
  'city' => getVar('city'),
  'client_id' => getVar('client_id'),
  'utmcsr' => getVar('utmcsr'),
  'utmccn' => getVar('utmccn'),
  'utmcmd' => getVar('utmcmd'),
  'affiliate_id' => getVar('affiliate_id'),
  'form_subject' => getVar('form_subject'),
  'click_id' => getVar('click_id')
);

require 'mail.php'; 

$fullName = explode(' ', $data['name'], 2);

// Построение SQL-оператора, отправка в базу
  $query = "INSERT INTO
            `leads`(
                      `first_name`,
                      `last_name`,
                      `email`,
                      `phone`,
                      `orderType`,
                      `date_visited`,
                      `time_visited`,
                      `page_url`,
                      `user_agent`,
                      `utm_source`,
                      `utm_campaign`,
                      `utm_medium`,
                      `utm_term`,
                      `utm_content`,
                      `ref`,
                      `ip_address`,
                      `city`,
                      `client_id`,
                      `utmcsr`,
                      `utmccn`,
                      `utmcmd`,
                      `affiliate_id`,
                      `click_id`
                      ) 
            VALUES('".$fullName[0]."',
                    '".(empty($fullName[1]) ? '-' : $fullName[1])."',
                    '".$data['email']."',
                    '".$data['phone']."',
                    '".$data['orderType']."',
                    '".$data['date_visited']."',
                    '".$data['time_visited']."',
                    '".$data['page_url']."',
                    '".$data['user_agent']."',
                    '".$data['utm_source']."',
                    '".$data['utm_campaign']."',
                    '".$data['utm_medium']."',
                    '".$data['utm_term']."',
                    '".$data['utm_content']."',
                    '".$data['ref']."',
                    '".$data['ip_address']."',
                    '".$data['city']."',
                    '".$data['client_id']."',
                    '".$data['utmcsr']."',
                    '".$data['utmccn']."',
                    '".$data['utmcmd']."',
                    '".$data['affiliate_id']."',
                    '".$data['click_id']."')";
// SQL-оператор выполняется
mysql_query($query) or die (mysql_error());

// Закрытие соединения
mysql_close();


die(json_encode([
  'status' => 'success'
]));