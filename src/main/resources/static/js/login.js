
const userAuth = Vue.resource('/api/auth/login');

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
                this.$http.get('/main.html', {
                    headers: {
                        'Authorization': token
                    }
                }).then(response => {
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
});