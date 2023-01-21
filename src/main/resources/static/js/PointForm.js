Vue.component('enter-form', {
    props: ["save", "authorize"],
    data: function () {
        return {
            firstName: '',
            lastName: '',
            login: '',
            password: '',
            passwordRepeated : '',
            message: '',
            registration : false
        }
    },
    //TODO сравнение пароля и повторного пароля + возврат к странице входа когда зарегался и подстановка твоих данных в форму
    template :
        '<div><h3>Войдите или зарегестрируйтесь</h3>\n' +
        '  <label for="login">Логин</label>\n' +
        '  <input type="text" id="login" maxlength="15" v-model="login"/><br>\n' +
        '  <label for="password">Пароль</label>\n' +
        '  <input type="password" id="password" maxlength="15" v-model="password"/><br>\n' +
        '  <div v-if="!this.registration"><button id ="enter" @click="validateEnter">Войти</button><button @click="switchToRegistration">У меня нет аккаунта</button></div>' +
        '  <div v-else><label for="password2">Повторите пароль</label><input type="password" id="password2" maxlength="15" v-model="passwordRepeated"/><br><button @click="switchToRegistration">Назад</button><button id ="register" @click="validateRegistration">Зарегистрироваться</button></div>\n' +
        '  <p>{{ message }}</p></div>',
    methods: {
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
            this.$http.post('/users/register', user
            ).then(result => {
                this.message = 'Вы успешно зарегестрированы! Зайдите в аккаунт.';
                this.switchToRegistration();
            }, result => {
                this.message = 'Невозможно добавить пользователя';
            });
        },
        validateRegistration: function () {
            if (this.validateData()) {
                console.log(this.password.length, this.login.length);
                let response = this.save(this.login, this.password, false);
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
                let response = this.save(this.login, this.password, true);
                response.then(result => {
                    this.authorize(result);
                }, result => {
                    console.log(result.status);
                    if (result.status === 404) this.message = "Пользователь с такими логином не найден!";
                    else if (result.status === 403) this.message = "Неверное имя пользователя или пароль!";
                    else this.message = "Доступ к сайту запрещен!";
                });
            }
        },
    }
})
