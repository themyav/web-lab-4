<template>
  <div>
    <canvas v-on:click="processGraphClick" id="graph" height="300" width="300"></canvas>
    <label for="x">Выберите X: </label>
    <span><input type="radio" name="x" value="-5" v-model="x">-5</span>
    <span><input type="radio" name="x" value="-4" v-model="x"> -4</span>
    <span><input type="radio" name="x" value="-3" v-model="x"> -3</span>
    <span><input type="radio" name="x" value="-2" v-model="x"> -2</span>
    <span><input type="radio" name="x" value="-1" v-model="x"> -1</span>
    <span><input type="radio" name="x" value="0" v-model="x"> 0</span>
    <span><input type="radio" name="x" value="1" v-model="x"> 1</span>
    <span><input type="radio" name="x" value="2" v-model="x"> 2</span>
    <span><input type="radio" name="x" value="3" v-model="x"> 3</span>


    <label htmlFor="y">Введите значение Y</label> <input type="text" id="y" v-model="y"/> <br>
    <label for="r">Выберите R: </label>
    <span><input type="radio" name="r" value="1" v-model="r" @change="changeR"> 1</span>
    <span><input type="radio" name="r" value="1" v-model="r" @change="changeR"> 1</span>
    <span><input type="radio" name="r" value="1" v-model="r" @change="changeR"> 1</span>
    <span><input type="radio" name="r" value="1" v-model="r" @change="changeR"> 1</span>
    <span><input type="radio" name="r" value="2" v-model="r" @change="changeR"> 2</span>
    <span><input type="radio" name="r" value="3" v-model="r" @change="changeR"> 3</span><br>
    <button @click="validate">Отправить!</button>
    <form action="/">
      <button>Вернуться на главную</button>
    </form>
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
    changeR: function (e) {
      //console.log(e.target.value);
      this.draw(e.target.value);
    },
    validate: function () {
      // TODO add method to validate values
      this.save();
    },
    //отправка запроса для точки
    save: function (currentToken = this.token) {
      //console.log("current token is : ", currentToken);
      //передаем токен, чтобы он при необходимости был обновленный
      //this.token = currentToken;
      //console.log(this.x, this.y, this.r);
      let point = {
        x: parseFloat(this.x),
        y: parseFloat(this.y),
        r: parseFloat(this.r),
        login: this.user.toString()
      };
      let token = 'Bearer ' + currentToken;
      console.log(token);
      axios.post('http://localhost:8081/point',
          point,
          {
            headers: {
              Authorization: token
            }
          }
      ).then(result => {
        //console.log("put " + result.data + " to points")
        //console.log(result);
        this.$emit('onPointAdd', result.data);
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