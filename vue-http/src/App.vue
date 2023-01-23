
<template>
  <div>
  <header>
    <h2>Лабораторная работа 4</h2>
    <p>Бернятцкая Кристина, вариант XXXXXX</p>
    <p>Текущее время: {{ time }}</p>
  </header>
  <div v-if="!this.authorized"><enter-form @onRegistrated="showContent"/></div>
  <div v-else-if="this.authorized"><points-list :access="accessToken" :refresh="refreshToken" :user="login" @refreshEvent="refreshEvent"/></div>
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
      refreshToken: "",
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
    showContent : function (access, refresh, login){
      this.accessToken = access;
      this.refreshToken = refresh;
      this.login = login;
      //console.log(access);
      //console.log(refresh);
      //console.log("I have got : " + this.login);
      this.authorized = true;
    },
    refreshEvent : function (access){
        this.accessToken = access;
        //console.log("Now my values is : ", access);
        //console.log("refresh event is happening")

    }
  }
};
</script>

<style>
#app{
  font-family: 'Nunito', sans-serif;
  max-width: 500px;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
header{
}
button{
  background-color: #b945ee;
  border: 0;
  margin: 10px;
  height: 30px;
  font-size: 18px;
  border-radius: 15px 5px 15px 5px;
  font-family: 'Nunito', sans-serif;
  font-weight: bold;
  color: white;
}
button:hover{
  background-color: #b945ee;
}
h2{
  color: #6e00b3;
  font-family : 'Caveat', 'sans-serif';
  font-size: 40px
}
input{
  border-radius: 15px 5px 15px 5px;
  height: 30px;
  font-size: 20px;
  font-weight: bold;
  color: #6e00b3;
  font-family: 'Nunito', sans-serif;
}
label{
  display: block;
  font-weight: bold;
  color: #6e00b3;
  margin-top: 10px;
  font-family: 'Caveat', sans-serif;
  font-size: 25px;

}
</style>