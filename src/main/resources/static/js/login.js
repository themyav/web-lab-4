
const userAuth = Vue.resource('/api/auth/login');

Vue.component('message-row', {
    props: ['message', 'messages'],
    template: '<div><tr><td>{{ message.x }}</td><td>{{ message.y }}</td><td>{{ message.r}}</td><td>{{ message.result}}</td><td>{{message.time}}</td><td>{{message.creationDate }}</td></tr></div>',
});


Vue.component('messages-list', {
    props: ['content', 'messages', 'token', 'user'],
    data: function () {
        return {
            message: null,
        }
    },
    template: '<div>' +
        '<message-form :messages="messages" :messageAttr="message" :token="token" :user="user"/>' +
        '<table><message-row v-for="message in messages" :key="message.id" :message="message" :messages="messages"/></table>' +
        '<button @click="del">Очистить таблицу</button>' +
        '</div>',
    created: function () {
        let token = 'Bearer ' + this.token;
        console.log("going to send " + token);
        this.$http.get('/message/' + this.user + '/points', {
            headers: {
                'Authorization': token
            }
        }).then(result =>
            result.json().then(data =>
                data.forEach(message => this.messages.push(message))
            )
        )
    },
    methods: {
        del: function () {
            let token = 'Bearer ' + this.token;
            this.$http.delete('/message', {
                headers: {
                    'Authorization': token
                }
            }).then(result =>{
                    while (this.messages.length > 0) this.messages.pop();
                }, result => {
                    console.log("Error!");
                }
            )
        }
    }
});

var app = new Vue({
    el: "#app", data: {
        login: "",
        accessToken: "",
        refreshToken: "",
        authorized: false,
        page_cont: 0,
        messages: []
    },
    template: '<div v-if="!this.authorized"><enter-form :save="save" :authorize="authorize"/></div>' +
        '<div v-else><messages-list :messages="messages" :token="accessToken" :content="page_cont" :user="login"/></div>',
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