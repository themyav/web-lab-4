<template>
  <div>
    <h3>Войдите или зарегестрируйтесь</h3>
    <label for="login">Логин</label>
    <input type="text" id="login" maxlength="15" v-model="login"/><br>

    <label for="password">Пароль</label>
    <input type="password" id="password" maxlength="15" v-model="password"/><br>

    <div v-if="!this.registration">
      <button id="enter" @click="validateEnter">Войти</button>
      <button @click="switchToRegistration">У меня нет аккаунта</button>
    </div>

    <div v-else><label for="password2">Повторите пароль</label><input type="password" id="password2" maxlength="15"
                                                                      v-model="passwordRepeated"/><br>
      <button @click="switchToRegistration">Назад</button>
      <button id="register" @click="validateRegistration">Зарегистрироваться</button>
    </div>

    <p>{{ message }}</p></div>
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
    switchToRegistration : function(){
      this.registration = !this.registration;
    },
    validateData: function () {
      if (this.password.length !== 0 && this.login.length !== 0) {
        this.message = "";
        document.getElementById("login").style.backgroundColor = 'white';
        document.getElementById("password").style.backgroundColor = 'white';
        if(this.registration && this.passwordRepeated !== this.password){
          this.message = 'Пароли не совпадают!';
          return false;
        }
        return true;
      } else {
        this.message = 'Поля <<логин>> и <<пароль>> должны быть заполнены!';
        document.getElementById("login").style.backgroundColor = (this.login.length ? 'white' : 'red');
        document.getElementById("password").style.backgroundColor = (this.password.length ? 'white' : 'red');
        return false;
      }
    },
    createNewUser: function () {
      let user = {
        login: this.login,
        password: this.password
      }
      axios.post('http://localhost:8081/users/register', user
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

        let token = 'Bearer ' + this.accessToken;
        axios.get('http://localhost:8081/api/hello/user', {
          headers: {
            'Authorization': token,
            "Access-Control-Allow-Origin" : "*"
          }
        }).then(response => {
              console.log(response);
              this.length = "Вы успешно авторизованы!";
              this.$emit('onRegistrated', this.accessToken, this.login)
            },
            response => {
              console.log("wrong!", response);
            });
      } else this.length = "Ошибка входа";
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
        response.then(result => {
          console.log(result.status);
          this.message = "Пользователь с таким логином уже есть";
        }, result => {
          if (result.status === 404) this.createNewUser();
          else if (result.status === 403) this.message = "Пользователь с таким логином уже есть";
          else this.message = "Невозможно создать пользователя";
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
          console.log(result.status);
          if (result.status === 404) this.message = "Пользователь с такими логином не найден!";
          else if (result.status === 403) this.message = "Неверное имя пользователя или пароль!";
          else this.message = "Доступ к сайту запрещен!";
        });
      }
    },
  },
};
</script>
