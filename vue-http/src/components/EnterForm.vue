<template>
  <div>
    <h3>Войдите или зарегестрируйтесь</h3>

    <div id="enter_form">
    <label for="login">Логин</label>
    <input type="text" id="login" maxlength="15" placeholder="Введите логин"
           title="Введите логин не длинее 15 символов" v-model="login" @input="validateLength"/><br>

     <div>
       <label for="password">Пароль</label>
       <input type="password" id="password" maxlength="15" placeholder="Введите пароль" @input="validateLength" v-model="password" />
       <button class="show_button" @click="showPassword"><img id="passwordImage" src="../../public/hide.png" width="40" height="40"/></button><br/>
     </div>

    <div v-if="!this.registration">
      <button id="enter" @click="validateEnter">Войти</button>
      <button @click="switchToRegistration">У меня нет аккаунта</button>
    </div>


    <div v-else>
      <div>
        <label for="password2">Повторите пароль</label>
        <input type="password" id="password2" maxlength="15" v-model="passwordRepeated"/>
        <button class="show_button" @click="showPassword"><img id="passwordImage2" src="../../public/hide.png" width="40" height="40"/></button><br/>
      </div>

      <button @click="switchToRegistration">Назад</button>
      <button id="register" @click="validateRegistration">Зарегистрироваться</button>
    </div>

    </div>
  <p>{{ message }}</p>
    <img id="hideImg" hidden src="../../public/hide.png"/>
    <img id="showImg" hidden src="../../public/show.png"/>
  </div>

</template>

<script>

import axios from 'axios'


export default {
  data: function () {
    return {
      firstName: '',
      lastName: '',
      login: '',
      password: '',
      passwordRepeated : '',
      message: '',
      registration : false,
      accessToken: "",
      refreshToken: "",
    }
  },
  methods : {
    changeVisibility : function (input, button, type){
      document.getElementById(input).setAttribute("type", type);
      let id = (type === 'text' ? 'showImg' : 'hideImg');
      let src = document.getElementById(id).getAttribute("src");
      document.getElementById(button).setAttribute("src", src);
    },
    showPassword : function (e){
      let id = e.target.id;
      let src = e.target.src;
      if(id === "passwordImage"){
        if(src.match(/hide/)) this.changeVisibility("password", id, "text");
        else this.changeVisibility("password", id, "password");
      }
      else{
        if(src.match(/hide/)) this.changeVisibility("password2", id, "text");
        else this.changeVisibility("password2", id, "password");
      }
    },
    switchToRegistration : function(){
      this.registration = !this.registration;
    },
    isLengthValid : function (length){
      return length >= 4 && length <= 15;
    },
    validateLength : function (e){
      console.log(e.target.value.length);
      if(!this.isLengthValid(e.target.value.length)){
        this.message = 'Длина логина и пароля должна быть от 4 до 15 символов';
        e.target.style.backgroundColor = 'pink';
      }
      else {
        if(this.isLengthValid(this.password.length) && this.isLengthValid(this.login.length)) this.message = '';
        e.target.style.backgroundColor = 'white';
      }
    },
    validateData: function () {
      if (this.password.length !== 0 && this.login.length !== 0) {
        if(!this.isLengthValid(this.password.length) || !this.isLengthValid(this.login.length)) return false;
        this.message = "";
        document.getElementById("login").style.backgroundColor = 'white';
        document.getElementById("password").style.backgroundColor = 'white';
        if(this.registration && this.passwordRepeated !== this.password){
          this.message = 'Пароли не совпадают!';
          return false;
        }
        return true;
      } else {
        this.message = 'Поля "логин" и "пароль" должны быть заполнены!';
        document.getElementById("login").style.backgroundColor = (this.login.length ? 'white' : 'pink');
        document.getElementById("password").style.backgroundColor = (this.password.length ? 'white' : 'pink');
        return false;
      }
    },
    createNewUser: function () {
      let user = {
        login: this.login,
        password: this.password
      }
      let headers = {
        "Access-Control-Allow-Origin" : "*"
      }
      axios.post('http://localhost:8081/api/user', user, {headers}
      ).then(result => {
        this.message = 'Вы успешно зарегестрированы! Зайдите в аккаунт.';
        this.switchToRegistration();
        console.log(result);
      }, result => {
        this.message = 'Невозможно добавить пользователя';
        console.log(result);
      });
    },
    authorize: function (response) {
      if (response.data.type === "Bearer") {

        this.accessToken = response.data.accessToken;
        this.refreshToken = response.data.refreshToken;
        this.authorized = true;
        this.$emit('onRegistrated', this.accessToken, this.refreshToken, this.login)
      }
    },
    saveUser: function (login, password) {
      this.login = login;
      this.password = password;
      let jwtRequest = {
        login: login,
        password: password
      }
      let headers = {
        "Access-Control-Allow-Origin" : "*"
      }
      return axios.post("http://localhost:8081/api/auth/login", jwtRequest, {headers});
    },
    validateRegistration: function () {
      if (this.validateData()) {
        console.log(this.password.length, this.login.length);
        let response = this.saveUser(this.login, this.password, false);
        response.then(() => {
          //console.log(result.response.status);
          this.message = "Пользователь с таким логином уже есть";
        }, result => {
          if (result.response.status === 404) this.createNewUser();
          else if (result.response.status === 403) this.message = "Пользователь с таким логином уже есть";
          else {
            console.log(result);
            this.message = "Невозможно создать пользователя";
          }
        });
      }
    },
    validateEnter: function () {
      if (this.validateData()) {
        console.log(this.password.length, this.login.length);
        let response = this.saveUser(this.login, this.password, true);
        response.then(result => {
          console.log(result.data);
          this.authorize(result);
        }, result => {
          console.log(result.response.status);
          if (result.response.status === 404) this.message = "Пользователь с такими логином не найден!";
          else if (result.response.status === 403) this.message = "Неверное имя пользователя или пароль!";
          else this.message = "Доступ к сайту запрещен!";
        });
      }
    },
  },
};
</script>

<style scoped>
div#enter_form{
  background-color: #fff001;
  border-radius: 30px 10px 30px 10px;
  padding-top: 5px;
  padding-bottom: 5px;
}
p{
  color: #6e00b3;
  font-weight: bold;
}
title{
  color: red;
}
input{
  user-select: none;
}
label{
  margin-top: 10px;
}
div{
  position: relative;
}
.show_button{
  background-color: lightgoldenrodyellow;
  border-radius: 20px;
  height: 40px;
  position:absolute; /* добавили */
  bottom:0; /* добавили */
  margin: 0 0 0 5px;

}
.show_button:hover{
  background-color: #6e00b3;
  border-radius: 20px;
}

</style>
