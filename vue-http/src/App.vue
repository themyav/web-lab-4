
<template>
  <div>
  <header>
    <h3>Laboratornaya работа №4</h3>
    <p>Бернятцкая Кристина, вариант XXXXXX</p>
    <p>Текущее время: {{ time }}</p>
  </header>
  <div v-if="!this.authorized"><enter-form @onRegistrated="showContent"/></div>
  <div v-else-if="this.authorized"><points-list :token="accessToken" :user="login"/></div>
  </div>
</template>

<script>

import EnterForm from "@/components/EnterForm.vue";
import PointsList from "@/components/PointsList.vue";


export default {
  data: function() {
    return {
      time: "",
      authorized: false,
      accessToken : "",
      login : ""
    };
  },
  components : {
    EnterForm,
    PointsList
  },
  created() {
    this.startTime();
  },
  methods : {
    startTime : function (){
      const today = new Date();
      let h = today.getHours();
      let m = today.getMinutes();
      let s = today.getSeconds();
      m = this.checkTime(m);
      s = this.checkTime(s);
      this.time =  h + ":" + m + ":" + s;
      setTimeout(this.startTime, 1000);
    },
    checkTime : function (i){
      return (i < 10) ? "0" + i : i;
    },
    showContent : function (token, login){
      this.accessToken = token;
      this.login = login;
      console.log("I have got : " + this.login, this.accessToken);
      this.authorized = true;
    }
  }
};
</script>

<style>
#app{
  font-family: 'Nunito', sans-serif;
  max-width: 500px;
  text-align: center;
}
header{
}
button{
  background-color: #b945ee;
  border: 0;
  margin: 10px;
  height: 30px;
  font-size: 20px;
  border-radius: 5px;
  font-family: 'Nunito', sans-serif;

}
h3{
  color: #6e00b3
}
input{
  border-radius: 5px;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
  color: #6e00b3;
  font-family: 'Nunito', sans-serif;
}
label{
  display: block;
  font-weight: bold;
  color: #020530;
  margin-top: 10px;
  margin-bottom: 10px;

}
</style>