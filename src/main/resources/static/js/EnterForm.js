Vue.component('message-form', {
    props: ['messages', 'messageAttr', 'token', 'user'],
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
        messageAttr: function (newVal, oldVal) {
            console.log("something changed");
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        '<canvas v-on:click="console.log(123)" id="graph" height="300" width="300"></canvas>' +
        '<label for="x">Выберите X: </label>\n' +
        '        <input type="radio" name="x" value="1" v-model="x" checked> 1\n' +
        '        <input type="radio" name="x" value="2" v-model="x"> 2<br>' +
        '<label htmlFor="y">Введите значение Y</label> <input type="text" id="y" v-model="y"/> <br>' +
        '<label for="r">Выберите R: </label>\n' +
        '        <input type="radio" name="r" value="1" v-model="r" checked> 1\n' +
        '        <input type="radio" name="r" value="2" v-model="r"> 2<br>' +
        '<input type="button" value="Отправить!" @click="validate"/>' +
        '<form action="index.html">\n' +
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
            this.$http.post('/message',
                point,
                {
                    headers: {
                        Authorization: token
                    }
                }
            ).then(result => {
                result.json().then(data => {
                    this.messages.push(data);
                })
            }, result => {
                console.log("error!");
            });
        }
    }
});