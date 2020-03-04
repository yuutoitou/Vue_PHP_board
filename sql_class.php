<?php

class sql {
  //SQL変数
//  const user = "sample_user";
//  const password = "hide2002";
//  const dbname = "testdb";
//  const host = "localhost:3306";
  
  const user = "econalife_user";
  const password = "deepco2hide2002";
  const dbname = "econalife_testdb";
  const host = 'mysql8086.xserver.jp';
  
  const dsn = "mysql:host=".self::host.";dbname=".self::dbname.";charset=utf8";

  function pdo(){
    try {
      $pdo = new PDO(self::dsn,self::user,self::password);
      $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
      $pdo->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
      return $pdo;
    } catch (exception $e) {
      $e->getMessage();
      return;
    }
  }
  function select($sql){
    $hoge=$this->pdo();
    $stmt=$hoge->prepare($sql);
    $stmt->execute();
    $items=$stmt->fetchAll(PDO::FETCH_ASSOC);
    return $items;
  }
    function select_one($sql){
    $hoge=$this->pdo();
    $stmt=$hoge->prepare($sql);
    $stmt->execute();
    $items=$stmt->fetch(PDO::FETCH_ASSOC);
    return $items;
  }
    function plural($sql){
    $hoge=$this->pdo();
    $stmt=$hoge->prepare($sql);
    $stmt->execute();
    return $stmt;
 }
}

?>