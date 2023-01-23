<template>
  <div>
    <canvas v-on:click="processGraphClick" id="graph" height="300" width="300"></canvas>
    <label for="x">Выберите X: </label>
    <input type="radio" name="x" value="1" v-model="x"> 1
    <input type="radio" name="x" value="2" v-model="x"> 2<br>
    <label htmlFor="y">Введите значение Y</label> <input type="text" id="y" v-model="y"/> <br>
    <label for="r">Выберите R: </label>
    <input type="radio" name="r" value="1" v-model="r" @change="changeR"> 1
    <input type="radio" name="r" value="2" v-model="r" @change="changeR"> 2<br>
    <input type="button" value="Отправить!" @click="validate"/>
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
  mixins : [drawer],
  data: function () {
    return {
      x: 0,
      y: 0,
      r: 0,
      text: '',
      id: '',
      refreshed : false
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
        this.x = values[0];
        this.y = values[1];
        this.save();
      }
    },
    changeR: function (e) {
      console.log(e.target.value);
      this.draw(e.target.value);
    },
    validate: function () {
      // TODO add method to validate values
      this.save();
    },
    //отправка запроса для точки
    save: function (currentToken=this.token) {
      console.log("current token is : ", currentToken);
      //передаем токен, чтобы он при необходимости был обновленный
      //this.token = currentToken;
      console.log(this.x, this.y, this.r);
      let point = {
        x: parseInt(this.x),
        y: parseInt(this.y),
        r: parseInt(this.r),
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
          console.log("put " + result.data + " to points")
          console.log(result);
          this.$emit('onPointAdd', result.data);
        }, () => {
        console.log("error! token " + currentToken + " is invalid");
        if(!this.refreshed){
          this.refreshed = true;
          this.$emit('refreshEvent');
        }
      });
    }
  }
}
</script>

<style scoped>
div{
  background-color: #fff001;
  border-radius: 5px;
}
canvas{
  border-radius: 5px;
  margin: 10px;
}
</style>