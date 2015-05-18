<?php
$con = mysql_connect("localhost","Adwords","tSy92WTqsVsDLh9e") or die('MySQL error: '.mysql_error());
$db = mysql_select_db("Adwords_automated_bidding") or die("MySQL error: ".mysql_error());

$weekstart 		= utf8_decode($_GET['weekstart']);
$weekend 		= utf8_decode($_GET['weekend']);
$client 		= utf8_decode($_GET['client']);
$campaign 		= utf8_decode($_GET['campaign']);
$adgroup 		= utf8_decode($_GET['adgroup']);
$keyword 		= utf8_decode(str_replace('%2B','+',$_GET['keyword']));
$qs 			= utf8_decode($_GET['qs']);
$impressies 	= utf8_decode($_GET['impressions']);
$clicks 		= utf8_decode($_GET['clicks']);
$conversies 	= utf8_decode($_GET['conversions']);
$cost 			= utf8_decode($_GET['cost']);
$sumpos 		= utf8_decode($_GET['sumpos']);

$query = "DELETE FROM `data` WHERE WeekStart = '$weekstart' AND WeekEnd = '$weekend' AND Client = '$client' AND Campaign = '$campaign' AND Adgroup = '$adgroup' AND Keyword = '$keyword'";
mysql_query($query) or die(mysql_error());


$query = "INSERT INTO `data`(WeekStart,WeekEnd,Client,Campaign,Adgroup,Keyword,QualityScore,Impressies,Clicks,Conversies,Cost,SumPos) VALUES ('$weekstart','$weekend','$client','$campaign','$adgroup','$keyword','$qs','$impressies','$clicks','$conversies','$cost','$sumpos')";
mysql_query($query) or die(mysql_error());


?>
