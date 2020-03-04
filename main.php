<?php
session_start();
include('user_class.php');
include('sql_class.php');

//ログインチェック
function login_check(){
  if(empty($_SESSION['id'])){
    echo json_encode(1);
  } else {
    echo json_encode(0);
  }
}
if($_POST['data'] == 'login_check'){
  login_check();
}
//新規登録用
function new_user(){
    $new_user = new user();
  //エスケープ処理後にデータを格納する
    $new_user->address = $new_user->h($_POST['address']);
    $new_user->name = $new_user->h($_POST['name']);
    $new_user->password = $new_user->h($_POST['password']);
  //各データの未入力と正規表現チェック  
    $new_user->err_name = $new_user->str_check($new_user->name);
    $new_user->err_pass = $new_user->str_check($new_user->password);
    $new_user->err_address = $new_user->address_check($new_user->address);
  //値checkにエラーが返らない場合
    if($new_user->err_name === null && $new_user->err_pass === null && $new_user->err_address === null){
      $sql_check = new sql();
      //DBにIDが登録済みかcheckする
      if(!empty($sql_check->select_one("SELECT * FROM user_data WHERE name = '$new_user->name'"))){
        $new_user->err_name = "IDが既に使用されています";
        //DBにアドレスが登録済みかcheckする
        if(!empty($sql_check->select("SELECT * FROM user_data WHERE address = '$new_user->address'"))){
          $new_user->err_address = "メールアドレスが既に使用されています";
        }
      } else {
      //IDとアドレスに重複がなければ登録する
      $sql_check->plural("INSERT user_data (name,password,address) VALUES ('$new_user->name','$new_user->password','$new_user->address')");
      }
    }
  $list = array("err_name" => $new_user->err_name,"err_pass" => $new_user->err_pass,"err_address" => $new_user->err_address);
  //JSONデータを出力
  echo json_encode($list);
  
}
if($_POST['data'] == 'new_user'){
  new_user();
}
//ログイン用
function login(){
  $login_user = new user();
  $sql_check = new sql();
  //エスケープ処理をして格納する
  $login_user->name = $login_user->h($_POST['name']);
  $login_user->password = $login_user->h($_POST['password']);
  //DBにIDが登録されてなければエラーを登録
  if(empty($sql_check->select_one("SELECT * FROM user_data WHERE name = '$login_user->name'"))){
    $login_user->err_name = "IDが登録されていません";
  //DBにIDが登録されていてパスワードが間違っていればエラーを登録  
  } elseif(empty($sql_check->select_one("SELECT * FROM user_data WHERE password = '$login_user->password' AND name ='$login_user->name'"))){
    $login_user->err_pass = "パスワードが間違っています";
  //パスワードを再登録用のアドレスを表示する  
    $login_user->err_passreset = '<a style="color:#0000ee;" href="password_mail.php">パスワードをお忘れですか？</a>';
  } else {
  //DBにIDとパスワードが登録されていればSESSIONにIDデータを格納する
  }
  $_SESSION['id'] = $sql_check->select_one("SELECT id FROM user_data WHERE password = '$login_user->password' AND name ='$login_user->name'")['id'];
  $list = array('id' => $_SESSION['id'],'err_name' => $login_user->err_name,'err_pass' => $login_user->err_pass);
  echo json_encode($list);
}
if($_POST['data'] == 'login_user'){
  login();
}
//ログアウト用
function logout(){
  if(!empty($_SESSION['id'])){
  $_SESSION = array();
  session_destroy();
    echo json_encode('logout');
  }
}
if($_POST['data'] == 'logout_user'){
  logout();
}
//投稿データ用
function post_data(){
  $post_user = new user();
  $post_user->id = $_SESSION['id'];
  if(isset($_FILES['img_file'])){
  $post_user->post_img = $_FILES['img_file'];
  }
  //エスケープ処理後に格納する
  $post_user->text = $post_user->h($_POST['textarea']);
  if($post_user->post_img == null && $post_user->text == null){
    $post_user->err_post = '画像かテキストを入力してください';
  } else {
  if(isset($post_user->post_img['name'])){
    //画像名に稿日時を付与する
    $today = date("YmdHis");
    $post_user->img_address = 'upload/'.$today.basename($post_user->post_img['name']);
    move_uploaded_file($post_user->post_img['tmp_name'],$post_user->img_address);
  }
    //投稿データ処理
  if(!empty($post_user->text) || !empty($post_user->post_img)){
    $post_user->id = $_SESSION['id'];
    $sql_check = new sql();
    $sql_check->plural("INSERT board (user_id,post,image,time) VALUES ('$post_user->id','$post_user->text','$post_user->img_address',NOW())");
  }
} 
  $list = array('err_post' => $post_user->err_post);
  echo json_encode($list);
}
if($_POST['data'] == 'new_post'){
  post_data();
}

//投稿編集用データ
function post_edit(){
  $sql_data = new sql();
  $board_id = $_POST['post_id'];
  $post_data = $sql_data->select_one("SELECT * FROM board WHERE board_id = '$board_id'");
  $list = array('post' => $post_data['post'],'image' => $post_data['image']);
  echo json_encode($list);
}
if($_POST['data'] == 'post_result'){
  post_edit();
}
//投稿編集用
function correction(){
  $sql_data = new sql();
  $user_data = new user();
  $board_id = $_POST['post_id'];
  if(empty($_POST['delete'])){ 
  $user_data->text = $user_data->h($_POST['textarea']);
  if(!empty($_POST['image'])){
  $user_data->img_address = $_POST['image'];
  } else {
    $user_data->img_address = null;
  }
  if(isset($_FILES['img_file']['name'])){
     $today = date("YmdHis");
     $user_data->img_address = 'upload/'.$today.basename($_FILES['img_file']['name']);
     move_uploaded_file($_FILES['img_file']['tmp_name'],$user_data->img_address);
  }
  $sql_data->plural("UPDATE board SET post = '$user_data->text',image = '$user_data->img_address' WHERE board_id ='$board_id'");
 } else {
    $sql_data->plural("DELETE FROM board WHERE board_id = '$board_id'");
  }
}
if($_POST['data'] == "post_edit"){
  correction();
}
//コメント入力用
function comment(){
  $user_data = new user();
  $user_data->id = $_SESSION['id'];
  $sql_check = new sql();
  //エスケープ処理後に格納する
  $user_data->text = $user_data->h($_POST['comment']);
  if(empty($user_data->text)){
    $user_data->err_post = 'コメントを入力してください';
  } else {
    $id = $_POST['post_id'];
    $sql_check->plural("INSERT comment (board_id,user_id,comment,time) VALUES ('$id','$user_data->id','$user_data->text',NOW())");
  }
  echo json_encode($user_data->err_post);
}
if($_POST['data'] == 'comment_user'){
  comment();
}
//パスワード変更
function pass_reset(){
  $user_data = new user();
  $sql_check = new sql();
  $user_data->id = $_SESSION['id'];
  $user_data->password = $user_data->h($_POST['password']);
  $user_data->err_pass = $user_data->str_check($user_data->password);
  if($user_data->err_pass == null){
  $user_data->err_passreset = $user_data->str_check($_POST['new_password']);
  if($sql_check->select_one("SELECT password FROM user_data WHERE id = '$user_data->id'")['password'] != $user_data->password){
    $user_data->err_pass = 'ご登録のパスワードと一致しません';
  } elseif($user_data->err_pass == null && $user_data->err_passreset == null) {
    $user_data->password = $user_data->h($_POST['new_password']);
    $sql_check->plural("UPDATE user_data SET password = '$user_data->password' WHERE id = '$user_data->id'");
  }
}
 $list = array('err_pass' => $user_data->err_pass,'err_passreset' => $user_data->err_passreset);
  echo json_encode($list);
}
if($_POST['data'] == 'pass_reset'){
  pass_reset();
}
//退会用
function withdraw(){
  $user_withdraw = new user();
  $user_withdraw->id = $_SESSION['id'];
  $sql_check = new sql();
  $sql_check->plural("DELETE FROM user_data WHERE id = '$user_withdraw->id'");
  $sql_check->plural("DELETE FROM board WHERE user_id = '$user_withdraw->id'");
  if(!empty($_SESSION['id'])){
  $_SESSION = array();
  session_destroy();
    echo json_encode('withdraw');
  }
}
if($_POST['data'] == 'withdraw_user'){
  withdraw();
}
//profile情報
function profile(){
  $user_data = new user();
  $sql_check = new sql();
  if(!empty($_POST['user_name']) && $_POST['user_name'] != ""){
    $user_name = $_POST['user_name'];
    $item = $sql_check->select_one("SELECT * FROM user_data WHERE name = '$user_name'");
    if(!empty($_SESSION['id'])){
      if($_SESSION['id'] == $item['id']){
        $user_data->id = $_SESSION['id'];
        $my_user = true;
      } else {
        $user_data->id = $item['id'];
        $my_user = false;
      }
    } else {
        $user_data->id = $item['id'];
        $my_user = false;
    }
  } else {
      $user_data->id = $_SESSION['id'];
      $my_user = true;
  }
  $item = $sql_check->select_one("SELECT * FROM user_data WHERE id = '$user_data->id'");
  if($item['comment'] == null){
    $user_data->comment = "";
  } else {
    $user_data->comment = $item['comment'];
  }
  $post_count = $sql_check->select_one("SELECT CASE COUNT(*) IS NULL WHEN 1 THEN 0 ELSE COUNT(*) END AS post_count FROM board WHERE user_id = '$user_data->id'")['post_count'];
  $good_count = $sql_check->select_one("SELECT CASE COUNT(*) IS NULL WHEN 1 THEN 0 ELSE COUNT(*) END AS good_count FROM good_check WHERE user_id = '$user_data->id'")['good_count'];
  $list = array('user_id' =>$item['id'],'user_img' => $item['image'],'user_name' => $item['name'],'user_address' => $item['address'],'user_message' => $user_data->comment,'my_user' =>$my_user,'post_count' => $post_count,'good_count' => $good_count);
  echo json_encode($list);
}
if($_POST['data'] == 'profile_data'){
  profile();
}
//profile更新
function user_profile(){
  $user_updata = new user();
  $sql_check = new sql();
  $user_updata->id = $_SESSION['id'];
  $user_updata->name = $user_updata->h($_POST['name']);
  $user_updata->address = $user_updata->h($_POST['address']);
  $user_updata->profile_text = $user_updata->h($_POST['textarea']);
  $user_updata->err_name = $user_updata->str_check($user_updata->name);
  $user_updata->err_address = $user_updata->address_check($user_updata->address);
  if(empty($sql_check->select("SELECT * FROM user_data WHERE name = '$user_updata->name' OR address = '$user_updata->address'"))){
  if($user_updata->err_name == null && $user_updata->err_address == null){
  if(is_uploaded_file($_FILES['img_file']['tmp_name'])){
    $today = date("YmdHis");
    $user_updata->profile_img = $_FILES['img_file'];
    $user_updata->img_address = 'upload/'.$today.basename($user_updata->profile_img['name']);
    move_uploaded_file($user_updata->profile_img['tmp_name'],$user_updata->img_address);
  } else {
    $user_updata->img_address = $_POST['image'];
  }
  $sql_check->plural("UPDATE user_data SET name = '$user_updata->name',address = '$user_updata->address',comment = '$user_updata->profile_text',image = '$user_updata->img_address' WHERE id = '$user_updata->id'");
 }
} else {
    if(!empty($sql_check->select("SELECT * FROM user_data WHERE name = '$user_updata->name' AND (name = '$user_updata->name' AND NOT id = '$user_updata->id')"))){
      $user_updata->err_name = 'IDが既に使用されています';
    } 
    if(!empty($sql_check->select("SELECT * FROM user_data WHERE address = '$user_updata->address' AND (name = '$user_updata->name' AND NOT id = '$user_updata->id')"))){
      $user_updata->err_address = 'メールアドレスが既に使用されています';
    }
  }
  $list = array('err_name' => $user_updata->err_name,'err_address' => $user_updata->err_address,);
  echo json_encode($list);
}
if($_POST['data'] == 'plofile-edit'){
  user_profile();
}
//profile投稿データ
function profile_post(){
    $sql_check = new sql();
  if(!empty($_SESSION['id'])){
    $user_id = $_SESSION['id'];
  } else {
    $user_id = 0;
  }
  if(empty($_POST['user_name'])){
    $user_id = $_SESSION['id'];
    $item = $sql_check->select_one("SELECT * FROM user_data WHERE id = '$user_id'");
    $user_name = $item['name'];
  } else {
  $user_name = $_POST['user_name'];
  }
  $items = $sql_check->select("SELECT *,CASE user_id IS NULL WHEN 0 THEN 'good good_on' ELSE 'good good_off' END AS good_check FROM (SELECT board_id,CASE user_id WHEN '$user_id' THEN 'delete' ELSE 'null' END AS dele,name,post,time,post_image,image AS user_image,CASE good IS NULL WHEN 1 THEN 0 ELSE good END AS good,CASE comment IS NULL WHEN 1 THEN 0 ELSE comment END AS comment FROM (SELECT * FROM (SELECT board.board_id,board.user_id,board.post,board.image AS post_image,board.time,user_data.image,user_data.name FROM board INNER JOIN user_data ON board.user_id = user_data.id) m LEFT JOIN (SELECT board_id AS id,COUNT(*) AS good FROM good_check GROUP BY id) u ON m.board_id = u.id) u LEFT JOIN (SELECT board_id AS com_id,COUNT(*) AS comment FROM comment GROUP BY com_id) m ON u.board_id = m.com_id) u LEFT JOIN (SELECT * FROM good_check WHERE user_id = '$user_id') m on u.board_id = m.board_id WHERE u.name = '$user_name' ORDER BY u.board_id DESC");
  
$list = array();
foreach ($items as $item){
  array_push($list,array(
    'board_id' => $item['board_id'],
    'name' => $item['name'],
    'post' => $item['post'],
    'time' => $item['time'],
    'delete' => $item['dele'],
    'post_image' => $item['post_image'],
    'user_image' => $item['user_image'],
    'good' => $item['good'],
    'comment' => $item['comment'],
    'good_check' => $item['good_check']
  ));
} 
header("Content-type: application/json; charset=UTF-8");
echo json_encode($list);
}
if($_POST['data'] == 'profile_post'){
  profile_post();
}
//profileいいね表示用
function profile_good(){
    $sql_check = new sql();
  if(!empty($_SESSION['id'])){
    $user_id = $_SESSION['id'];
  } else {
    $user_id = 0;
  }
  if(empty($_POST['user_name'])){
    $user_id = $_SESSION['id'];
  } else {
    $user_name = $_POST['user_name'];
    $item = $sql_check->select_one("SELECT * FROM user_data WHERE name = '$user_name'");
    $user_id = $item['id'];
  }
  $items = $sql_check->select("SELECT * FROM (SELECT u.board_id,dele,name,post,time,post_image,user_image,good,comment,CASE user_id IS NULL WHEN 0 THEN 'good good_on' ELSE 'good good_off' END AS good_check FROM (SELECT board_id,CASE user_id WHEN '$user_id' THEN 'delete' ELSE 'null' END AS dele,name,post,time,post_image,image AS user_image,CASE good IS NULL WHEN 1 THEN 0 ELSE good END AS good,CASE comment IS NULL WHEN 1 THEN 0 ELSE comment END AS comment FROM (SELECT * FROM (SELECT board.board_id,board.user_id,board.post,board.image AS post_image,board.time,user_data.image,user_data.name FROM board INNER JOIN user_data ON board.user_id = user_data.id) m LEFT JOIN (SELECT board_id AS id,COUNT(*) AS good FROM good_check GROUP BY id) u ON m.board_id = u.id) u LEFT JOIN (SELECT board_id AS com_id,COUNT(*) AS comment FROM comment GROUP BY com_id) m ON u.board_id = m.com_id) u LEFT JOIN (SELECT * FROM good_check WHERE user_id = '$user_id') m on u.board_id = m.board_id) u INNER JOIN (SELECT * FROM `good_check` WHERE user_id = '$user_id') m ON u.board_id = m.board_id ORDER BY m.board_id DESC");
$list = array();
foreach ($items as $item){
  array_push($list,array(
    'board_id' => $item['board_id'],
    'name' => $item['name'],
    'post' => $item['post'],
    'time' => $item['time'],
    'delete' => $item['dele'],
    'post_image' => $item['post_image'],
    'user_image' => $item['user_image'],
    'good' => $item['good'],
    'comment' => $item['comment'],
    'good_check' => $item['good_check']
  ));
} 
header("Content-type: application/json; charset=UTF-8");
echo json_encode($list);
}
if($_POST['data'] == 'profile_good'){
  profile_good();
}

//パスワード再登録用（メール認証）
function reset_mail(){
  $user_data = new user();
  $user_data->address = $user_data->h($_POST['address']);
  $user_data->err_address = $user_data->address_check($user_data->address);
  $sql_check = new sql();
  if($user_data->err_address == null){
  if(empty($sql_check->select("SELECT * FROM user_data WHERE address = '$user_data->address'"))){
    $user_data->err_address = 'ご入力頂いたメールアドレスは登録されていません';
  } else {
    mb_language("Japanese");
    mb_internal_encoding("UTF-8");
    //認証コード
    $pass = substr(str_shuffle('1234567890abcdefghijklmnopqrstuvwxyz'), 0, 8);
    //メール送信時間
    $time = date("Y-m-d H:i:s");
    //送信URL
    $to = $user_data->address;
    $title = "パスワード再設定を行ってください";
    $content = "お申込み頂いた「仮パスワード」を送付致します。\n\nご本人様確認の為24時間以内にアクセス頂き、パスワードの再登録をお願い致します。\n\n※当メール送信後24時間を経過しますとセキュリティ保持の為、有効期限切れとなります。\n\nその際は再度、最初から手続きをお願い致します。\n\n仮パスワード：{$pass}";
    $header = "From:エコナ<rice.on.rice.on@gmail.com>";
    if(mb_send_mail($to, $title, $content,$header)){
      //DBに認証用URLパラメタと送信日時を登録
      $sql_check->plural("UPDATE user_data SET password ='$pass',reset_time = '$time' WHERE address = '$to'");
      
    } else { 
      $user_data->err_address = 'メールの送信に失敗しました';
    }
  }
}
   $list = array('err_address' => $user_data->err_address);
  echo json_encode($list);
}
if($_POST['data'] == 'reset_mail'){
  reset_mail();
}
//投稿表示用
function post_show(){
  $sql_check = new sql();
  if(!empty($_SESSION['id'])){
    $user_id = $_SESSION['id'];
  } else {
    $user_id = 0;
  }
    $items = $sql_check->select("SELECT u.board_id,dele,name,post,time,post_image,user_image,good,comment,CASE user_id IS NULL WHEN 0 THEN 'good good_on' ELSE 'good good_off' END AS good_check FROM (SELECT board_id,CASE user_id WHEN '$user_id' THEN 'delete' ELSE 'null' END AS dele,name,post,time,post_image,image AS user_image,CASE good IS NULL WHEN 1 THEN 0 ELSE good END AS good,CASE comment IS NULL WHEN 1 THEN 0 ELSE comment END AS comment FROM (SELECT * FROM (SELECT board.board_id,board.user_id,board.post,board.image AS post_image,board.time,user_data.image,user_data.name FROM board INNER JOIN user_data ON board.user_id = user_data.id) m LEFT JOIN (SELECT board_id AS id,COUNT(*) AS good FROM good_check GROUP BY id) u ON m.board_id = u.id) u LEFT JOIN (SELECT board_id AS com_id,COUNT(*) AS comment FROM comment GROUP BY com_id) m ON u.board_id = m.com_id) u LEFT JOIN (SELECT * FROM good_check WHERE user_id = '$user_id') m on u.board_id = m.board_id ORDER BY u.board_id DESC");
$list = array();
foreach ($items as $item){
  array_push($list,array(
    'board_id' => $item['board_id'],
    'name' => $item['name'],
    'post' => $item['post'],
    'time' => $item['time'],
    'delete' => $item['dele'],
    'post_image' => $item['post_image'],
    'user_image' => $item['user_image'],
    'good' => $item['good'],
    'comment' => $item['comment'],
    'good_check' => $item['good_check']
  ));
} 
header("Content-type: application/json; charset=UTF-8");
echo json_encode($list);
}
if($_POST['data'] == 'post_show'){
  post_show();
}
//コメント表示用
function comment_show(){
  $sql_data = new sql();
  $board_id  = $_POST['id'];
  $items = $sql_data->select("SELECT comment.comment,name,time,image FROM comment inner join user_data on comment.user_id = user_data.id WHERE comment.board_id = '$board_id'");
  $list = array();
foreach ($items as $item){
  array_push($list,array(
    'name' => $item['name'],
    'image' => $item['image'],
    'comment' => $item['comment'],
    'time' => $item['time'],
  ));
 }
  header("Content-type: application/json; charset=UTF-8");
  echo json_encode($list);           
}
if($_POST['data'] == 'comment_show'){
  comment_show();
}
//いいねボタン処理
function good_button(){
  $sql_data = new sql();
  if(empty($_SESSION['id'])){
    echo json_encode('guest');
    return;
  } else {
    $user_id = $_SESSION['id'];
  }
  $board_id = $_POST['board_id'];
  $good_check = $sql_data->select("SELECT * FROM good_check WHERE board_id = '$board_id' AND user_id = '$user_id'");
  if(empty($good_check)){
    $sql_data->plural("INSERT good_check (board_id,user_id) VALUES ('$board_id','$user_id')");
    $good_count = $sql_data->select("SELECT COUNT(*) FROM good_check WHERE board_id = '$board_id'");
    $list = array('good' => $good_count[0]['COUNT(*)'],'good_check' => 'good good_on');
    echo json_encode($list);
  } else {
    $sql_data->plural("DELETE FROM good_check WHERE board_id = '$board_id' AND user_id = '$user_id'");
    $good_count = $sql_data->select("SELECT COUNT(*) FROM good_check WHERE board_id = '$board_id'");
    $list = array('good' => $good_count[0]['COUNT(*)'],'good_check' => 'good good_off');
    echo json_encode($list);
  }
}
if($_POST['data'] == 'good_button'){
  good_button();
}
?>
