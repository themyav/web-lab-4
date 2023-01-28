<template>
  <div>
    <canvas v-on:click="processGraphClick" id="graph" height="300" width="300"></canvas>
    <label for="x">Выберите X от -5 до 3 </label>
    <span><input type="radio" name="x" value="-5" v-model="x">-5</span>
    <span><input type="radio" name="x" value="-4" v-model="x"> -4</span>
    <span><input type="radio" name="x" value="-3" v-model="x"> -3</span>
    <span><input type="radio" name="x" value="-2" v-model="x"> -2</span>
    <span><input type="radio" name="x" value="-1" v-model="x"> -1</span>
    <span><input type="radio" name="x" value="0" v-model="x"> 0</span>
    <span><input type="radio" name="x" value="1" v-model="x"> 1</span>
    <span><input type="radio" name="x" value="2" v-model="x"> 2</span>
    <span><input type="radio" name="x" value="3" v-model="x"> 3</span>


    <label htmlFor="y">Введите значение Y от -5 до 3</label> <input type="text" id="y" v-model="y" @input="replaceValue"/> <br>
    <label for="r">Выберите R от 1 до 3</label>
    <span><input type="radio" name="r" value="-5" v-model="r" @change="changeR"> -5</span>
    <span><input type="radio" name="r" value="-4" v-model="r" @change="changeR"> -4</span>
    <span><input type="radio" name="r" value="-3" v-model="r" @change="changeR"> -3</span>
    <span><input type="radio" name="r" value="-2" v-model="r" @change="changeR"> -2</span>
    <span><input type="radio" name="r" value="-1" v-model="r" @change="changeR"> -1</span>
    <span><input type="radio" name="r" value="0" v-model="r" @change="changeR"> 0</span>
    <span><input type="radio" name="r" value="1" v-model="r" @change="changeR"> 1</span>
    <span><input type="radio" name="r" value="2" v-model="r" @change="changeR"> 2</span>
    <span><input type="radio" name="r" value="3" v-model="r" @change="changeR"> 3</span><br>
    <button @click="validate">Отправить!</button>
    <p>{{ errorY }}</p>
    <p>{{ errorR }}</p>
  </div>
</template>

<script>
import axios from 'axios'
import drawer from "@/js/drawer";

export default {
  props: ['points', 'token', 'user'],
  mixins: [drawer],
  data: function () {
    return {
      x: 0,
      y: 0,
      r: 0,
      text: '',
      id: '',
      errorY : '',
      errorR : '',
      refreshed: false
    }
  },
  mounted() {
    this.x = 1;
    this.r = 1;
    this.draw(1);
  },
  methods: {
    processGraphClick: function (e) {
      let values = this.processClick(e, this.r)
      if (values !== null) {
        console.log(values[0], values[1])
        this.x = values[0];
        this.y = values[1];
        this.save();
      }
    },
    replaceValue: function (e){
        e.target.value = e.target.value.replace(/[^0-9.,-]/g, '');
    },
    changeR: function (e) {
      console.log("r is changed", this.r)
      if(e.target.value <= 0) this.errorR = 'Некорректное значение R! Выберите R > 0'
      else {
        this.draw(e.target.value);
        this.errorR = '';
      }
    },
    validate: function () {
      let isYCorrect = this.checkValue(this.y, this.y_min, this.y_max, false);
      let isRCorrect = this.checkValue(this.r, 1, 3, true);
      console.log(isYCorrect, isRCorrect);
      this.errorY = (isYCorrect ? '' : 'Некорректное значение Y!');
      this.errorR = (isRCorrect ? '' :'Некорректное значение R! Выберите R > 0');
      if(isYCorrect && isRCorrect) this.save();
    },
    //отправка запроса для точки
    save: function (currentToken = this.token) {
      let point = {
        x: parseFloat(this.x),
        y: parseFloat(this.y),
        r: parseFloat(this.r),
        login: this.user.toString()
      };
      let token = 'Bearer ' + currentToken;
      console.log(token);
      axios.post('http://localhost:8081/api/point',
          point,
          {
            headers: {
              Authorization: token
            }
          }
      ).then(result => {
        this.$emit('onPointAdd', result.data);
        this.x = Math.round(this.x);
      }, () => {
        console.log("error! token " + currentToken + " is invalid");
        if (!this.refreshed) {
          this.refreshed = true;
          this.$emit('refreshEvent');
        }
      });
    }
  }
}
</script>

<style scoped>
div {
  background-color: #fff001;
  border-radius: 5px;
}

canvas {
  border-radius: 5px;
  margin: 10px;
}
span{
  margin: 0;
  font-weight: bold;
  color: #020530;
}
input[type="radio"]{
  margin: 0 0 0 10px;
  vertical-align: bottom;
  height: 25px;
}
</style>