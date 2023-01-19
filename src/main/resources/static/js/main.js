var messageApi = Vue.resource('/message{/id}')

function getIndex(list, id){
    for(var i = 0; i < list.length; i++){
        if(list[i].id === id){
            return i;
        }
    }
    return -1;
}

Vue.component('message-form', {
    props: ['messages', 'messageAttr'],
    data: function () { //нельзя создать объект, тк он общий для всех
        return{
            text: '',
            id : ''
        }
    },
    watch: {
        messageAttr: function (newVal, oldVal) {
            this.text = newVal.text;
            this.id = newVal.id;
        }
    },
    template:
        '<div>' +
        '<input type="button" value="Тык" placeholder="Save" @click="save"/>' + //@click -- сокращенная запись
        '</div>',
    methods: {
        save: function (){
            var message = {text: this.text};
            if(this.id){
                messageApi.update({id: this.id}, message).then(result =>
                    result.json().then(data => {
                        var index = getIndex(this.messages, data.id);
                        this.messages.splice(index, 1, data);
                        this.message = ''; //не работает чет, но в целом не надо
                        this.id = '';
                    })
                )
            }else {
                messageApi.save({}, message).then(result =>
                    result.json().then(data => {
                        this.messages.push(data);
                        this.text = ''; //можно и не очищать ввод
                    })
                )
            }
        }
    }
});

Vue.component('message-row', {
    props : ['message', 'editMethod', 'messages'],
    template : '<div><i>( {{ message.id }} )</i> {{message.text}} ' +
        '<span><input type="button" value="Edit" @click="edit"/></span>' +
        '<span><input type="button" value="delete" @click="del"/></span>' +
        '</div>',
    methods: {
        edit : function (){
            this.editMethod(this.message);
        },
        del: function () {
            messageApi.remove({id: this.message.id}).then(result => {
                if(result.ok){
                    this.messages.splice(this.messages.indexOf(this.message), 1);
                }
            })
        }
    }
});

Vue.component('messages-list', {
    props: ['messages'],
    data: function (){
        return{
            message : null
        }
    },
    template: '<div>' +
        '<message-form :messages="messages" :messageAttr="message"/>' +
        '<message-row v-for="message in messages" :key="message.id" :message="message" :editMethod="editMethod" :messages="messages"/>' +
        '</div>',
    created: function(){
        messageApi.get().then(result =>
            result.json().then(data =>
                data.forEach(message => this.messages.push(message))
            )
        )
    },
    methods : {
        editMethod: function (message) {
            this.message = message;
        }
    }
});

var app = new Vue({
    el: '#app',
    template: '<messages-list :messages="messages" />',
    data: {
        messages: []
    }
});