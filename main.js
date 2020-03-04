//-------------フォームパーツ-------------//
//退会フォーム
Vue.component('my-withdraw', {
	template: `<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
 		   <div><h2>退会しますか？<span v-on:click="$parent.counter = 0"></span></h2></div>
 		   <div class="form_content">
 		   <div class="form"> 
  <div><button v-on:click="submit">退会する</button></div>
  <div><button class="cancel" v-on:click="$parent.counter = 0">キャンセル</button></div>
 </div>
</div>
</article>`
 ,    
methods: {
  submit: function(e) {
    _this = this;
    var params = new URLSearchParams()
    params.append('data', 'withdraw_user');      
    axios
        .post('main.php', params)
        .then(function(response) {
        _this.result = response.data;
        console.log(response);
          vm.jobcount = 1;
          vm.counter = 0;
          vm.main_counter = 0;
          vm.jobmes = "退会しました";
          setTimeout(function(){
            vm.jobcount = 0;
          },1000
          );
        })
        .catch(function(error) {
            // error 処理
        })
      }
  }        
  });

//コメントフォーム
Vue.component('my-comment',{
  template: `<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
		   <div><h2>コメントする<span v-on:click="$parent.counter = 0"></span></h2></div>
		   <div class="form_content">
		   <form class="form">
	           <div><p>コメント:<span></span><br><span class="err_mes">{{err_post}}</span></p><textarea type="text" name="textarea" v-model="type"></textarea></div>
 		   <div class="js_count"><span id="js_count">{{type.length}}/100</span></div>
  		   <div><button type="button" v-on:click="submit">コメント</button></div>
		   </form>
 		   </div>
</article>`
, data:function(){
    return{
      type:"",
      err_post:"",
    }
},
  methods: {
  submit: function(e) {
    _this = this;
    var params = new URLSearchParams();
    params.append('data', 'comment_user');
    params.append('comment', _this.type);
    params.append('post_id', _this.$parent.post_id);
    axios
        .post('main.php', params)
        .then(function(response) {
      _this.err_post = response.data;
        if(response.data == null){
        _this.$parent.jobcount = 1;
        _this.$parent.counter = 0;
        _this.$parent.jobmes = "コメントしました";
        var c_check = _this.$parent.main_counter;
        _this.$parent.main_counter = 10;
         setTimeout(function(){
          if(c_check == 0){
            _this.$parent.main_counter = 0;
          } else {
            _this.$parent.main_counter = 1;
          }
        },10);
        setTimeout(function(){
          vm.jobcount = 0;
        },1000
      );  
    }
    })
    .catch(function(error) {
        })
     },
},created:function(){
    _this = this;
    var params = new URLSearchParams();
    params.append('data', 'login_check');
    axios
        .post('main.php', params)
        .then(function(response) {
        if(response.data !== 0){
          vm.counter = 2;
        }
    })
    .catch(function(error) {
    })
 }     
});

//コメント表示
Vue.component('my-comment-show',{
  template:`<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
  <div><h2>コメント<span v-on:click="$parent.counter = 0"></span></h2></div>
  <div class="com_show" v-for="item in result">
    <div class="com_form">
    <img v-bind:src="item.image">
    <p>{{item.name}}</p>
    <time>{{item.time}}</time>
    </div>
    <p class="text_p">{{item.comment}}</p>
  </div>
</article>`
  ,data:function(){
    return{
      result:{},
    }
  },created:function(){
    this.result = this.$parent.comment;
  },
});

//メール認証フォーム
Vue.component('my-mail',{
	template: `<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
 <div><h2>ご登録のメールアドレスに<br>仮パスワードを送信します<span v-on:click="$parent.counter = 0"></span></h2></div>
 <div class="form_content">
 <div class="form">
  <label>
   <p>ご登録のメールアドレスを入力してください:<br><span class="err_mes">{{result.err_address}}</span></p>
   <input type="text" name="address" v-model="address"> 
  </label>
  <div><button v-on:click="submit">送信</button></div>
 </div>
 </div>
</article>`
,    data:function(){
      return {
        address:"",
        result:{},
      }
},
  methods: {
  submit: function(e) {
      _this = this;
      var params = new URLSearchParams()
      params.append('data', 'reset_mail');
      params.append('address', _this.address);

      axios
          .post('main.php', params)
          .then(function(response) {
          _this.result = response.data;
          if(_this.result.err_address == null){
            vm.jobcount = 1;
            vm.counter = 0;
            vm.jobmes = "仮パスワードを送信しました";
            setTimeout(function(){
              vm.jobcount = 0;
            },1000
             );
           }
          })
          .catch(function(error) {
          })
       }
    }
});

//パスワードフォーム
Vue.component('my-new-pass',{
	template: `<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
  <div><h2>新しいパスワードを<br>入力してください<span v-on:click="$parent.counter = 0"></span></h2></div>
  <div class="form_content">
 <div class="form">
  <label>
   <p>ご登録パスワード:</p>
   <p class="err_mes">{{result.err_pass}}</p>
   <input type="password" name="pass1" v-model="password"> 
  </label>
  <label>
   <p>新しいパスワード:</p>
   <p class="err_mes">{{result.err_passreset}}</p>
   <input type="password" name="pass2" v-model="new_password"> 
  </label>
  <div><button type="button" v-on:click="submit">登録</button></div>
 </div>
 </div>
</article>`
, data:function(){
   return {
      result:{},
      password:"",     
      new_password:"",     
   }
 },  
  methods: {
submit: function(e) {
  _this = this;
  var params = new URLSearchParams()
  params.append('password', _this.password);
  params.append('new_password', _this.new_password);
  params.append('data', 'pass_reset');
  axios
      .post('main.php', params)
      .then(function(response) {
      _this.result = response.data;
      if(_this.result.err_pass == null && _this.result.err_passreset == null){
          vm.jobcount = 1;
          vm.counter = 0;
          vm.jobmes = "パスワードを変更しました";
          setTimeout(function(){
            vm.jobcount = 0;
          },1000
          );
       }
      })
      .catch(function(error) {
      })
   }
 }        
});

//投稿編集フォーム
Vue.component('my-edit',{
	template: `<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
  <div><h2>投稿する<span v-on:click="$parent.counter = 0"></span></h2></div>
  <div class="form_content">
  <div class="form">
      <div><span class="err_mes">{{result.err_post}}</span><br>
      <textarea type="text" name="text" v-model="type"></textarea></div>
      <p style="text-align:right">{{type.length}}/200<p>
      <div class="post_img">
        <label class="preview">
        <input type="hidden" name="MAX_FILE_SIZE" value="4194304">
        <input type="file" name="img_file" id="up_img" style="display:none" ref="file" v-on:change="onFileChange">
        <img v-bind:src="image" v-if="image.length > 0" style="width:120px;">
        </label>  
      </div>  
    <div><button type="button" v-on:click="submitImage">編集</button></div>
    <div><button class="cancel" type="button" v-on:click="submitDelete">削除</button></div>
  </div>
  </div>
</article>`
,data: function() {
  return {
    result:{},
    type: '',
    image: '',
    imgName: '',
    uploadFile: ''
  }
},methods: {      
  onFileChange: function(e){
    var files = e.target.files || e.dataTransfer.files;
    if(!files.length) {
        return;
     }
  if(!files[0].type.match('image.*')) {
      return;
  }
  _this = this;
  const fileImg = files[0];
  if (fileImg.type.startsWith("image/")) {
    _this.image = window.URL.createObjectURL(fileImg);  
  _this.uploadFile = files[0];
  }
},
submitImage: function(e) {
  _this = this;
  var formData = new FormData();
  formData.append('img_file', this.uploadFile);
  formData.append("data","post_edit");
  formData.append("textarea",_this.type);
  formData.append("post_id",_this.$parent.post_id);
  formData.append("image",_this.image);
  var config = {
      headers: {
          'content-type': 'multipart/form-data'
      },
  };
  axios
      .post('main.php', formData, config,)
      .then(function(response) {
          _this.$parent.post_id = "";
          _this.result = response.data;
          vm.jobcount = 1;
          vm.counter = 0;
          vm.jobmes = "投稿を編集しました";
          var c_check = vm.main_counter;   
          vm.main_counter = 10;
          setTimeout(function(){
            if(c_check == 0){
              vm.main_counter = 0;
            }else {
              vm.main_counter = 1;
            }
          },10);
          setTimeout(function(){
            vm.jobcount = 0;
          },1000
        ); 
      })
      .catch(function(error) {
      })
}, submitDelete: function(e) {
  _this = this;
  var params = new URLSearchParams();
  params.append('data', 'post_edit');
  params.append('delete', 1);
  params.append("post_id",_this.$parent.post_id);
  axios
  .post('main.php', params)
  .then(function(response) {
    _this.result = response.data;
      vm.jobcount = 1;
      vm.counter = 0;
      vm.jobmes = "投稿を削除しました";
      var c_check = vm.main_counter;   
      vm.main_counter = 10;
      setTimeout(function(){
        if(c_check == 0){
          vm.main_counter = 0;
        }else {
          vm.main_counter = 1;
        }
      },10);
      setTimeout(function(){
        vm.jobcount = 0;
      },1000
    ); 
  })
  .catch(function(error) {
   })
 }
},created:function(){
var post = this.$parent.post_id;
  _this = this;
  var params = new URLSearchParams();
  params.append('data', 'post_result');
  params.append('post_id', post);
  axios
      .post('main.php', params)
      .then(function(response) {
      _this.result = response.data;
      _this.type = _this.result['post'];
      _this.image = _this.result['image'];
    })
      .catch(function(error) {
      })
   },
})

//投稿フォーム
Vue.component('my-post',{
 template:`<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
  <div><h2>投稿する<span v-on:click="$parent.counter = 0"></span></h2></div>
  <div class="form_content">
  <div class="form">
      <div><span class="err_mes">{{result.err_post}}</span><br>
      <textarea type="text" name="text" v-model="type"></textarea></div>
      <p style="text-align:right">{{type.length}}/200<p>
      <div class="post_img">
        <label class="preview">
        <input type="hidden" name="MAX_FILE_SIZE" value="4194304">
        <input type="file" name="img_file" id="up_img" style="display:none" ref="file" v-on:change="onFileChange">
        <img v-bind:src="image" v-if="image.length > 0" style="width:120px;">
        </label>  
      </div>  
    <div><button type="button" v-on:click="submitImage">投稿</button></div>
  </div>
  </div>
</article>`
,data: function() {
  return {
    result:{},
    type: '',
    image: '',
    imgName: '',
    uploadFile: ''
  }
},methods: {     
    onFileChange: function(e){
    var files = e.target.files || e.dataTransfer.files;
    if(!files.length) {return;}
    if(!files[0].type.match('image.*')){return;}
    _this = this;
    const fileImg = files[0];
    if (fileImg.type.startsWith("image/")) {
      _this.image = window.URL.createObjectURL(fileImg);  
      _this.uploadFile = files[0];
    }
  },
  submitImage: function(e) {
    _this = this;
    var formData = new FormData();
    formData.append('img_file', this.uploadFile);
    formData.append("data","new_post");
    formData.append("textarea",_this.type);
    var config = {
        headers: {
        'content-type': 'multipart/form-data'
      },
    };
    axios
      .post('main.php', formData, config,)
      .then(function(response) {
          _this.result = response.data;
        if(_this.result.err_post == null){
          vm.jobcount = 1;
          vm.counter = 0;
          vm.jobmes = "投稿しました";
          var c_check = vm.main_counter;
          vm.main_counter = 10;
          setTimeout(function(){
            if(c_check == 0){
             vm.main_counter = 0;
            } else {
             vm.main_counter = 1;  
            }
          },10);
          setTimeout(function(){
            vm.jobcount = 0;
          },1000
        );
      }  
      })
      .catch(function(error) {
      })
      }
    },
})

//新規登録フォーム
Vue.component('my-new-user',{
 template: `<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
  <div><h2>新規会員登録<span v-on:click="$parent.counter = 0"></span></h2></div>
  <div class="form_content">
  <div class="form">
    <div>
      <label>
        <p>会員ID:<span></span></p>
        <p class="err_mes">{{result.err_name}}</p>
        <input type="text" name="name" placeholder="半角英数8~16文字で登録してください" v-model="name">
      </label><br>
      <label>
        <p>パスワード:<span></span></p>
        <p class="err_mes">{{result.err_pass}}</p>
        <input type="password" name="password" placeholder="半角英数8~16文字で登録してください" v-model="password">
      </label><br>
      <label>
        <p>メールアドレス：<span></span></p>
          <p class="err_mes">{{result.err_address}}</p>
          <input type="text" name="address" placeholder="メールアドレスを入力してください" v-model="address">
      </label>
    </div>
    <div><button v-on:click="submit">登録</button></div>
  </div>
  </div>
</article>`
, data:function(){
    return {
      result:{},
      password:"",
      name:"",
      address:"",
    }
}, methods: {
    submit: function(e) {
        _this = this;
        var params = new URLSearchParams()
        params.append('name', _this.name);
        params.append('password', _this.password);
        params.append('address', _this.address);
        params.append('data', 'new_user');

        axios
            .post('main.php', params)
            .then(function(response) {
            _this.result = response.data;
            if(_this.result.err_name == null && _this.result.err_pass == null && _this.result.err_address == null){
                vm.jobcount = 1;
                vm.counter = 0;
                vm.jobmes = "新規登録が完了しました";
                setTimeout(function(){
                  vm.jobcount = 0;
                },1000
                );
            }
          })
          .catch(function(error) {
          })
       }
     }
 });

//ログインフォーム
Vue.component('my-login',{
 template: `<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
  <div><h2>ログイン<span v-on:click="$parent.counter = 0"></span></h2></div>
  <div class="form_content">
  <div class="form">
    <div>
      <label>
        <p>会員ID:<span></span></p>
        <p class="err_mes">{{result.err_name}}</p>
        <input type="text" name="name" placeholder="ご登録のIDを入力してください" v-model="name">
      </label><br>
      <label>
        <p>パスワード:<span></span></p>
        <p class="err_mes">{{result.err_pass}}</p>
        <input type="password" name="password" placeholder="ご登録のパスワードを入力してください" v-model="password">
      </label><br>
        <p v-html="passmail" v-on:click="$parent.counter = 9"></p>
    </div>
    <div><button v-on:click="submit">ログイン</button></div>
  </div>
  </div>
</article>`
, data:function(){
    return {
      result:"",
      password:"",
      name:"",
      passmail:"",
    }
}, methods: {
    submit: function(e) {
      _this = this;
      var params = new URLSearchParams()
      params.append('name', _this.name);
      params.append('password', _this.password);
      params.append('data', 'login_user');
      axios
          .post('main.php', params)
          .then(function(response) {
          _this.result = response.data;
          if(_this.result.err_pass != null){
            _this.passmail = `<span>パスワードをお忘れですか？</span>`;
          }
          if(_this.result.err_name == null && _this.result.err_pass == null){
              vm.jobcount = 1;
              vm.counter = 0;
              vm.jobmes = "ログインしました";
              vm.nav_counter = 1;
              setTimeout(function(){
                vm.jobcount = 0;
              },1000
              );
            }
          })
          .catch(function(error) {
          })
      }
  }
});

//プロフィール編集
Vue.component('my-plofile-edit',{
	template: `<article class="form_box" :style="{'--height':$parent.windowHeight + 5 + 'px'}">
  <div><h2>プロフィールを編集する<span v-on:click="$parent.counter = 0"></span></h2></div>
  <div class="form_content">
  <div class="form">
    <div class="post_img">
      <label class="preview">
       <input type="hidden" name="MAX_FILE_SIZE" value="4194304">
       <input type="file" style="display:none" ref="file" v-on:change="onFileChange">
       <img v-bind:src="image">
      </label>  
    </div>
      <label>
   <p>ID:<br><span></span></p>
   <p class="err_mes">{{result.err_name}}</p>
   <input type="text" name="name" v-model="name"> 
  </label>
  <label>
   <p>メールアドレス:<br><span></span></p>
   <p class="err_mes">{{result.err_address}}</p>
   <input type="text" name="address" v-model="address"> 
  </label>
    <p>コメント:<br><span></span></p>
      <textarea type="text" name="text" style="height:100px;" v-model="message"></textarea>
      <p style="text-align: right;">{{message.length}}/100</p>
    <div><button type="button" v-on:click="submitImage">編集</button></div>
  </div>
  </div>
</article>`
 , data:function(){
   return {
     name:"",
     address:"",
     image:"",
     message:"",
     uploadFile:"",
     result:{},
   }
}, methods: {
    onFileChange: function(e){
    var files = e.target.files || e.dataTransfer.files;
    if(!files.length){return;}
    if(!files[0].type.match('image.*')){return;}
    _this = this;
    const fileImg = files[0];
    if (fileImg.type.startsWith("image/")) {
      _this.image = window.URL.createObjectURL(fileImg);  
    _this.uploadFile = files[0];
    }
},submitImage: function(e) {
    _this = this;
    var formData = new FormData();
    formData.append('img_file', this.uploadFile);
    formData.append('image', _this.image);
    formData.append("data","plofile-edit");
    formData.append("name",_this.name);
    formData.append("address",_this.address);
    formData.append("textarea",_this.message);
    var config = {
        headers: {
            'content-type': 'multipart/form-data'
        },
    };
    axios
        .post('main.php', formData, config,)
        .then(function(response) {
            _this.result = response.data;
          if(_this.result.err_name == null && _this.result.err_address == null){
            vm.jobcount = 1;
            vm.counter = 0;
            vm.jobmes = "プロフィールを変更しました";
            setTimeout(function(){
              vm.jobcount = 0;
            },1000
          );
        }  
        })
        .catch(function(error) {
      })
    }
},created:function(){
    _this = this;
    var params = new URLSearchParams();
    params.append('data', 'profile_data');
    axios
        .post('main.php', params)
        .then(function(response) {
        _this.name = response.data.user_name;
        _this.address = response.data.user_address;
        _this.image = response.data.user_img;
        _this.message = response.data.user_message;
    });
  },  
});
//-------------フォームパーツ-------------//
//-------------ヘッダーナビパーツ-------------//
Vue.component('my-nav-p',{
 template:`<nav class="pc_nav">
      <ul>
        <li v-if="$parent.nav_counter === 0" v-on:click="$parent.counter = 1">sign up</li>
        <li v-if="$parent.nav_counter === 0" v-on:click="$parent.counter = 2">login</li>
        <li v-if="$parent.nav_counter === 1" v-on:click="submit">logout</li>
        <li v-if="$parent.nav_counter === 1" v-on:click="$parent.counter = 3">post</li>
        <li v-if="$parent.nav_counter === 1" v-on:click="countup(),$parent.user_name = ''">profile</li>
      </ul>
    </nav>`
, methods: {
    countup: function(){
      _this = this;
      this.$parent.main_counter = 10;
          setTimeout(function(){
          _this.$parent.main_counter = 1;
        },10
        );
    },
    submit: function(e) {
    _this = this;
    var params = new URLSearchParams();
    params.append('data', 'logout_user');
    axios
        .post('main.php', params)
        .then(function(response) {
        _this.result = response.data;
        vm.jobcount = 1;
        vm.counter = 0;
        vm.jobmes = "ログアウトしました";
        vm.main_counter = 0;
        vm.nav_counter = 0;
        setTimeout(function(){
          vm.jobcount = 0;
        },1000
        ); 
      })
        .catch(function(error) {
        })
     }
    }
});

//投稿表示用
Vue.component('my-post-show',{
 template:`<div>
<transition-group name="post-index" tag="article">
<article id="user_meaadage" v-for="item in result" :key="item.time">
          <div class="user_name">
            <div class="user_box">
              <div><img v-bind:src="item.user_image" v-bind:id="item.name" v-on:click="countup(100,arguments[0])"></div>
            </div>
            <div class="user_box2">
              <p v-bind:id="item.name" v-on:click="countup(100,arguments[0])">{{item.name}}</p>
              <p class="post_id" style="display:none;">{{item.board_id}}</p>
              <time>{{item.time}}</time>
            </div>  
          </div>
          <div class="text_contents">
            <p>{{item.post}}</p>
            <img v-bind:src="item.post_image">
          </div>
          <div class="good_contents">
              <span v-bind:class="item.delete" v-on:click="countup(4,arguments[0])" v-bind:id="item.board_id"></span>
           <div class="g_c">
              <p v-on:click="comment_show(item.board_id,arguments[0])" ><span class="com_open" v-if="item.comment > 0"></span></p>  
              <p class="coments_p" v-on:click="countup(5,arguments[0])"><span class="coments" v-bind:id="item.board_id">{{item.comment}}</span>
              <p><span v-bind:class="item.good_check" v-on:click="good_submit($event)" v-bind:id="item.board_id">{{item.good}}</span></p>
            </div>  
        </div>
      </article>
</transition-group>
</div>`
 , data:function(){
   return {
     result:{},
     result2:{},
     result3:{},
   }
 },methods: {
    countup:function(c,event){
       _this = this;
      if(c != 100){
       this.$parent.counter = c;
        if(c == 4){
          _this.$parent.post_id = event.target.id; 
        } else if(c == 5){
          _this.$parent.post_id = event.target.id;
        } 
      } else {
          _this.$parent.main_counter = 1;
          _this.$parent.user_name = event.target.id;
        }
    },comment_show:function(id,event){
      _this = this;
      var params = new URLSearchParams();
      params.append('data', 'comment_show');
      params.append('id', id);
      axios
          .post('main.php', params)
          .then(function(response) {
          _this.$parent.comment = response.data;
          _this.$parent.counter = 10;
        })
          .catch(function(error) {
       })
}, good_submit:function(event){
      _this = this;
      var id = event.target.id;
      var params = new URLSearchParams();
      params.append('data', 'good_button');
      params.append('board_id', id);
      axios
          .post('main.php', params)
          .then(function(response) {
        if(response.data !== 'guest'){
           event.target.className = response.data.good_check;
           event.target.innerHTML = response.data.good;
        } else {
          vm.counter = 2;
        }
      })
      .catch(function(error) { 
      })
  } 
},beforeCreate:function(e) {
  _this = this;
  var params = new URLSearchParams();
  params.append('data', 'post_show');
  axios
      .post('main.php', params)
      .then(function(response) {
      _this.result = response.data;
    })
      .catch(function(error) {
      })
   },
});

//プロフィール画面
Vue.component('my-profile',{
	template: `<div class="profile_container">
      <aside id="profile">
        <div>
          <div class="profile_img">
            <img v-bind:src="result.user_img">
            <p class="profile_name">{{result.user_name}}</p>
          </div><p class="text">{{result.user_message}}</p>
        </div>
    <ul class="profile_list" v-if="result.my_user">
      <li v-on:click="countup(6)">プロフィール編集</li>
        <li v-on:click="countup(7)">パスワード変更</li>
      <li v-on:click="submit">ログアウト</li>
      <li v-on:click="countup(8)">退会する</li>
    </ul>        
      </aside>
      <article class="user_text">
        <p class="post_check"><span class="post_icon" v-on:click="counter = 0">{{result.post_count}}</span><span  v-on:click="counter = 1" style="display:inline-block;" class="good good_on">{{result.good_count}}</span></p>
        <div id="text_contents">
          <div class="main_text">
<transition-group name="post-index" tag="article">
          <article v-if="counter === 0" id="user_meaadage" v-for="item in result2" :key="item.time">
          <div class="user_name">
            <div class="user_box">
              <div><img v-bind:src="item.user_image" v-bind:id="item.name"></div>
            </div>
            <div class="user_box2">
              <p v-bind:id="item.name">{{item.name}}</p>
              <p class="post_id" style="display:none;">{{item.board_id}}</p>
              <time>{{item.time}}</time>
            </div>  
          </div>
          <div class="text_contents">
            <p>{{item.post}}</p>
            <img v-bind:src="item.post_image">
          </div>
          <div class="good_contents">
              <span v-bind:class="item.delete" v-on:click="countup(4,arguments[0])" v-bind:id="item.board_id"></span>
           <div class="g_c">
              <p v-on:click="comment_show(item.board_id,arguments[0])" ><span class="com_open" v-if="item.comment > 0"></span></p>  
              <p class="coments_p" v-on:click="countup(5,arguments[0])"><span class="coments" v-bind:id="item.board_id">{{item.comment}}</span>
              <p><span v-bind:class="item.good_check" v-on:click="good_submit($event)" v-bind:id="item.board_id">{{item.good}}</span></p>
            </div>  
        </div>
      </article>
</transition-group>
          </div>
          <div class="good_text">
<transition-group name="post-index" tag="article">
          <article id="user_meaadage" v-if="counter === 1" v-for="item in result3" :key="item.time">
          <div class="user_name">
            <div class="user_box">
              <div><img v-bind:src="item.user_image" v-bind:id="item.name"></div>
            </div>
            <div class="user_box2">
              <p v-bind:id="item.name">{{item.name}}</p>
              <p class="post_id" style="display:none;">{{item.board_id}}</p>
              <time>{{item.time}}</time>
            </div>  
          </div>
          <div class="text_contents">
            <p>{{item.post}}</p>
            <img v-bind:src="item.post_image">
          </div>
          <div class="good_contents">
              <span v-bind:class="item.delete" v-on:click="countup(4,arguments[0])" v-bind:id="item.board_id"></span>
           <div class="g_c">
              <p v-on:click="comment_show(item.board_id,arguments[0])" ><span class="com_open" v-if="item.comment > 0"></span></p>  
              <p class="coments_p" v-on:click="countup(5,arguments[0])"><span class="coments" v-bind:id="item.board_id">{{item.comment}}</span>
              <p><span v-bind:class="item.good_check" v-on:click="good_submit($event)" v-bind:id="item.board_id">{{item.good}}</span></p>
            </div>  
        </div>
      </article>
</transition-group>
          </div>
        </div>
      </article>
    </div>`
 ,data:function(){
    return {
      result:{},
      result2:{},
      result3:{},
      counter:0,
    }
 },    
      methods: {
        countup:function(c,event){
         this.$parent.counter = c;
          _this = this;
          if(c == 4){
            _this.$parent.post_id = event.target.id; 
          } else if(c == 5){
            _this.$parent.post_id = event.target.id;
          } else if(c == 10){
            _this.$parent.post_id = event.target.id;
          }
        },  submit: function(e) {
            _this = this;
            var params = new URLSearchParams();
            params.append('data', 'logout_user');
            axios
                .post('main.php', params)
                .then(function(response) {
                vm.jobcount = 1;
                vm.counter = 0;
                vm.jobmes = "ログアウトしました";
                vm.main_counter = 0;
                setTimeout(function(){
                  vm.jobcount = 0;
                },1000
                ); 
              })
                .catch(function(error) {
                    // error 処理
                })
             }, good_submit:function(event){
      _this = this;
      var id = event.target.id;
      var params = new URLSearchParams();
      params.append('data', 'good_button');
      params.append('board_id', id);
      axios
          .post('main.php', params)
          .then(function(response) {
        if(response.data !== 'guest'){
           event.target.className = response.data.good_check;
           event.target.innerHTML = response.data.good;
        } else {
          vm.counter = 2;
        }
      })
      .catch(function(error) { 
      })
    },comment_show:function(id,event){
      _this = this;
      var params = new URLSearchParams();
      params.append('data', 'comment_show');
      params.append('id', id);
      axios
          .post('main.php', params)
          .then(function(response) {
          _this.$parent.comment = response.data;
          _this.$parent.counter = 10;
        })
          .catch(function(error) {
       })
    }
},created:function(){
            _this = this;
            var params = new URLSearchParams();
            params.append('data', 'profile_data');
            params.append('user_name', _this.$parent.user_name);
            axios
                .post('main.php', params)
                .then(function(response) {
                _this.result = response.data;
              })
                .catch(function(error) {
                    // error 処理
                });
            var params = new URLSearchParams();
            params.append('data', 'profile_post');
            params.append('user_name', _this.$parent.user_name);
            axios
                .post('main.php', params)
                .then(function(response) {
                _this.result2 = response.data;
              })
                .catch(function(error) {
                    // error 処理
                });
            var params = new URLSearchParams();
            params.append('data', 'profile_good');
            params.append('user_name', _this.$parent.user_name);
            axios
                .post('main.php', params)
                .then(function(response) {
                _this.result3 = response.data;
              })
                .catch(function(error) {
                    // error 処理
                });
       },
                  
});

var vm = new Vue({
  el: '#example',
  data:{
 	counter: 11,
    main_counter: 0,
    nav_counter:0,
    post_id:"",
    jobcount:0,
    jobmes:"",
    user_name:"",
    windowHeight: 0,
 	typetext:'',
 	imgsrc:'aaaa',
    result:{},
    comment:'',
  },   
  mounted() {
   window.addEventListener('load', this.loadcounter);
   window.addEventListener('load', this.loadheight);
   window.addEventListener('scroll', this.loadheight);
  },methods: {
   loadheight(e) {
    this.windowHeight = window.scrollY;
   },
   loadcounter() {
    this.counter = 0;
   },
   Created:function(e) {
            _this = this;
            var params = new URLSearchParams();
            params.append('data', 'post_show');
            axios
                .post('main.php', params)
                .then(function(response) {
                _this.result = response.data;
              })
                .catch(function(error) {
                    // error 処理
                })
             },   
  }
  
});
