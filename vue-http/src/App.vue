
<template>
  <div>
  <header>
    <h3>Лабораторная работа №4</h3>
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