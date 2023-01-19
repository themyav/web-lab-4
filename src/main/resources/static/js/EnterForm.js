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
            /*R = val.value
            draw(R)*/
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