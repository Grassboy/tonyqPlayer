<?
header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.                                                                                                                                 
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.
header('Access-Control-Allow-Origin: *');
function curl_send($isPost, $url, $args=array(), $cookies="", $config = array()) 
{
    $curl_handler = curl_init();    
    curl_setopt($curl_handler, CURLOPT_URL, $url);
    curl_setopt($curl_handler, CURLOPT_FOLLOWLOCATION, 1); 
    curl_setopt($curl_handler, CURLOPT_POST, $isPost=="POST"?1:0);
    curl_setopt($curl_handler, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl_handler, CURLOPT_SSL_VERIFYHOST, 2); 
    curl_setopt($curl_handler, CURLOPT_SSL_VERIFYPEER, false);
    if($config["USER_AGENT"]){
        curl_setopt($curl_handler, CURLOPT_USERAGENT,$config["USER_AGENT"]);
    }
    if($isPost=="POST")
    {
        curl_setopt($curl_handler, CURLOPT_POSTFIELDS, $args);  
    }
    
    if(isset($config["header"])){
        curl_setopt($curl_handler, CURLOPT_HTTPHEADER, $config["header"]);
    }
    
    if(isset($config["refer"])){
        curl_setopt($curl_handler, CURLOPT_REFERER, $config["refer"]);
    }
    
    $result = curl_exec($curl_handler);
    curl_close($curl_handler);
}
if($_POST['msg']) {
    $json = array(
        "msg"=>$_POST['msg']
    );
    echo json_encode($json);
    curl_send('POST', 'https://grassboy.firebaseio-demo.com/tonyqplayer/.json', json_encode($json));
}
?>

