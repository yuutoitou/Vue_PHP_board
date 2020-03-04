<?php

class user {
  //データ受取
  public $id;
  public $name;
  public $password;
  public $profile_img;
  public $profile_text;
  public $good;
  public $post_count;
  public $pass_reset;
  public $get_check;
  public $address;
  public $text;
  public $post_img;
  public $img_address;
  public $comment;
  public $sql_data;
  //エラー受取用
  public $err_name;
  public $err_pass;
  public $err_post;
  public $err_address;
  public $err_passreset;
  
  //データチェック関数
  //エスケープ関数
  public function h($s) {
    return htmlspecialchars($s, ENT_QUOTES, "UTF-8");
 }
  //正規表現関数
  public function str_match($str) {
    //半角英数8~16文字
    $check = '/\A[a-z\d]{8,16}+\z/i';
    if(preg_match($check,$str)){
    return true;
    } else {
    return false;
    }
  }
  //入力文字check
  public function str_check($str) {
    if($str == ""){
      return "入力必須項目です";
    }
    if(!$this->str_match($str)){
      return "半角英数字8~16文字で登録してください";
    }
  }

  //アドレスcheck
  public function address_check($address) {
    if(!(bool)filter_var($address, FILTER_VALIDATE_EMAIL)){
      return 'メールアドレスを正しく入力してください';
    }
  }
}

?>