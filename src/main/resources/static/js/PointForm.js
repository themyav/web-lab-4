Vue.component('enter-form', {
    props: ["save", "authorize"],
    data: function () {
        return {
            firstName: '',
            lastName: '',
            login: '',
            password: '',
            point: ''
        }
    },
    template :
        '<div><h3>Войдите или зарегестрируйтесь</h3>\n' + '  <label for="firstName">Имя</label>\n' +
        '  <input type="text" id="firstName" v-model="firstName"/><br>\n' +
        '  <label for="lastName">Фамилия</label>\n' +
        '  <input type="text" id="lastName" v-model="lastName"/><br>\n' +
        '  <label for="login">Логин</label>\n' +
        '  <input type="text" id="login" maxlength="15" v-model="login"/><br>\n' +
        '  <label for="password">Пароль</label>\n' +
        '  <input type="text" id="password" maxlength="15" v-model="password"/><br>\n' +
        '  <button id ="enter" @click="validateEnter">Войти</button>\n' +
        '  <button id ="register" @click="validateRegistration">Зарегистрироваться</button>\n' +
        '  <p>{{ point }}</p></div>',
    methods: {
        validateData: function () {
            if (this.password.length !== 0 && this.login.length !== 0) {
                this.point = "";
                document.getElementById("login").style.backgroundColor = 'white';
                document.getElementById("password").style.backgroundColor = 'white';
                return true;
            } else {
                this.point = 'Поля <<логин>> и <<пароль>> должны быть заполнены!';
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
                this.point = 'Вы успешно авторизованы!';
            }, result => {
                this.point = 'Невозможно добавить пользователя';
            });
        },
        validateRegistration: function () {
            if (this.validateData()) {
                console.log(this.password.length, this.login.length);
                let response = this.save(this.login, this.password, false);
                response.then(result => {
                    console.log(result.status);
                    this.point = "Пользователь с таким логином уже есть";
                }, result => {
                    if (result.status === 404) this.createNewUser();
                    else if (result.status === 403) this.point = "Пользователь с таким логином уже есть";
                    else this.point = "Невозможно создать пользователя";
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
                    if (result.status === 404) this.point = "Пользователь с такими логином не найден!";
                    else if (result.status === 403) this.point = "Неверное имя пользователя или пароль!";
                    else this.point = "Доступ к сайту запрещен!";
                });
            }
        },
    }
})
