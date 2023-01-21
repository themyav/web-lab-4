//import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp({ template: 'Hello world.' })
/*const router = createRouter({
    routes: [{ path: '/:pathMatch(.*)*', component: app }],
    history: createWebHistory()
})
app.use(router)*/

document.addEventListener('DOMContentLoaded', () => app.mount('.app'));



//import Vue from 'vue'
/*import App from 'pages/App.vue'

new Vue({
    el: "#app",
    render: a => a(App)
})*/
/*

const userAuth = Vue.resource('/api/auth/login');

const y_min = -5, y_max = 3;
const x_min = -5, x_max = 5;
const fraction = 4;

function checkValue(value, min, max, positive) {
    value = value.replace(",", ".");
    let ok = (value.search(/^-?\d.?\d{0,5}$/) !== -1 && Number(value) >= min && Number(value) <= max);
    if (positive && value.search("-") !== -1) ok = false;
    return ok;
}
function processClick(e, R){
    canvas = document.querySelector('#graph');
    let width = canvas.width;
    let height = canvas.height;

    let x_pos = e.pageX - document.getElementById('graph').offsetLeft;
    let y_pos = e.pageY - document.getElementById('graph').offsetTop;
    console.log("you clicked to cord ", x_pos, y_pos, R);
    let zero_x = document.getElementById('graph').offsetWidth / 2;
    let zero_y = document.getElementById('graph').offsetHeight / 2;

    let y_cord = -1 * (y_pos - zero_y), x_cord = (x_pos - zero_x);
    console.log("you put point in ", x_cord, y_cord, R);

    //non-rounded coordinates
    x_cord = x_cord/width * SCALE;
    y_cord = y_cord/height * SCALE;

    //round coordinates
    let x_val = x_cord.toFixed(fraction);
    let y_val = y_cord.toFixed(fraction);

    if(!(checkValue(x_val, x_min, x_max, false) && checkValue(y_val, y_min, y_max, false))){
        //console.log("you clicked to invalid point", x_cord.toFixed(fraction), y_cord.toFixed(fraction));
        return null;
    }

    //draw with non-rounded cords
    let good = areaCheck(x_val, y_val, R);
    points.push([x_pos, y_pos, R, good])
    drawPoint(x_pos, y_pos, '', ctx, good);
    return [x_cord, y_cord];

}


Vue.component('point-form', {
    props: ['points', 'pointAttr', 'token', 'user'],
    data: function () { //нельзя создать объект, тк он общий для всех
        return {
            x: 0,
            y: 0,
            r: 0,
            text: '',
            id: ''
        }
    },
    watch: {
        pointAttr: function (newVal, oldVal) {
            console.log("something changed");
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        '<canvas v-on:click="processClick" id="graph" height="300" width="300"></canvas>' +
        '<label for="x">Выберите X: </label>\n' +
        '        <input type="radio" name="x" value="1" v-model="x" > 1\n' +
        '        <input type="radio" name="x" value="2" v-model="x"> 2<br>' +
        '<label htmlFor="y">Введите значение Y</label> <input type="text" id="y" v-model="y"/> <br>' +
        '<label for="r">Выберите R: </label>\n' +
        '        <input type="radio" name="r" value="1" v-model="r" @change="changeR"> 1\n' +
        '        <input type="radio" name="r" value="2" v-model="r" @change="changeR"> 2<br>' +
        '<input type="button" value="Отправить!" @click="validate"/>' +
        '<form action="/">\n' +
        '   <button>Вернуться на главную</button>\n' +
        '  </form>' +
        '</div>',
    mounted() {
        const recaptchaScript = document.createElement("script");
        recaptchaScript.setAttribute(
            "src",
            "/js/drawer.js"
        );
        document.head.appendChild(recaptchaScript);
    },
    methods: {
        processClick : function (e){
            let values = processClick(e, this.r)
            if(values !== null){
                this.x = values[0];
                this.y = values[1];
                this.save();
            }
        },
        changeR :function (e){
            console.log(e.target.value);
            draw(e.target.value);
            /!*R = val.value
            draw(R)*!/
        },
        validate: function () {
            //add method to validate values
            this.save();
        },
        save: function () {
            console.log(this.x, this.y, this.r);
            let point = {
                x: parseInt(this.x),
                y: parseInt(this.y),
                r: parseInt(this.r),
                login: this.user.toString()
            };
            let token = 'Bearer ' + this.token;
            console.log(token);
            this.$http.post('/point',
                point,
                {
                    headers: {
                        Authorization: token
                    }
                }
            ).then(result => {
                result.json().then(data => {
                    this.points.push(data);
                })
            }, result => {
                console.log("error!");
            });
        }
    }
});

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

Vue.component('point-row', {
    props: ['point', 'points'],
    template: '<div><tr><td>{{ point.x }}</td><td>{{ point.y }}</td><td>{{ point.r}}</td><td>{{ point.result}}</td><td>{{point.time}}</td><td>{{point.creationDate }}</td></tr></div>',
});


Vue.component('points-list', {
    props: ['content', 'points', 'token', 'user'],
    data: function () {
        return {
            point: null,
        }
    },
    template: '<div>' +
        '<point-form :points="points" :pointAttr="point" :token="token" :user="user"/>' +
        '<table><point-row v-for="point in points" :key="point.id" :point="point" :points="points"/></table>' +
        '<button @click="del">Очистить таблицу</button>' +
        '</div>',
    created: function () {
        let token = 'Bearer ' + this.token;
        console.log("going to send " + token);
        this.$http.get('/point/' + this.user + '/points', {
            headers: {
                'Authorization': token
            }
        }).then(result =>
            result.json().then(data =>
                data.forEach(point => this.points.push(point))
            )
        )
    },
    methods: {
        del: function () {
            let token = 'Bearer ' + this.token;
            this.$http.delete('/point', {
                headers: {
                    'Authorization': token
                }
            }).then(result =>{
                    while (this.points.length > 0) this.points.pop();
                }, result => {
                    console.log("Error!");
                }
            )
        }
    }
});

let app = new Vue({
    el: "#app", data: {
        login: "",
        accessToken: "",
        refreshToken: "",
        authorized: false,
        page_cont: 0,
        points: []
    },
    template: '<div v-if="!this.authorized"><enter-form :save="save" :authorize="authorize"/></div>' +
        '<div v-else><points-list :points="points" :token="accessToken" :content="page_cont" :user="login"/></div>',
    methods: {
        save: function (login, password) {
            this.login = login;
            this.password = password;
            let jwtRequest = {
                login: login,
                password: password
            }
            return userAuth.save(jwtRequest);
        },

        authorize: function (response) {
            if (response.body.type === "Bearer") {

                this.accessToken = response.body.accessToken;
                this.refreshToken = response.body.refreshToken;

                let token = 'Bearer ' + this.accessToken;
                this.$http.get('/api/hello/user', {
                    headers: {
                        'Authorization': token
                    }
                }).then(response => {
                        console.log("request is ok!");
                        this.length = response.body.substring(1, 10);
                        this.page_cont = response.body;
                        this.length = "Вы успешно авторизованы!";
                        this.authorized = true;
                    },
                    response => {
                        console.log("wrong!", response);
                    });
            } else this.length = "Ошибка входа";
        },
    }
});*/
