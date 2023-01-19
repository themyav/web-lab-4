const NotFound = { template: '<div><p>Страница не найдена</p>Сменить страницу</button></div>' }
const Home = { template: '<div><p>главная</p></div>' }
const About = { template: '<div><p>о нас</p></div>' }

const routes = {
    '/': Home,
    '/about': About
}

var app = new Vue({
    el: '#app',
    data: {
        currentRoute: '/'
    },
    computed: {
        ViewComponent () {
            return routes[this.currentRoute] || NotFound
        }
    },
    render (h) { return h(this.ViewComponent) },
    methods: {
        changePage : function (){
            this.currentRoute = '/about';
        }
    }
})

// Now the app has started!