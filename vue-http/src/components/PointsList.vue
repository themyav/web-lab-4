<template>
  <div id="point_list" v-if="loaded">
    <point-form :points="points" :pointAttr="point" :token="token" :user="user" @onPointAdd="add" @refreshEvent="refreshTokens" ref="Form"/>
    <table>
      <point-row v-for="point in points" :key="point.id" :point="point" :points="points"/>
    </table>
    <button @click="del">Очистить таблицу</button>
  </div>
  <div v-else><p>Доступ запрещен!</p></div>

</template>

<script>

import axios from 'axios'
import PointForm from "@/components/PointForm.vue";
import PointRow from "@/components/PointRow.vue";

export default {
  props: ['content', 'access', 'refresh','user'],
  data: function () {
    return {
      point: null,
      points: [],
      loaded : true,
      token : '',
      refreshed : false
    }
  },
  components : {
    PointRow,
    PointForm
  },
  created: function () {
    console.log('my access is ', this.access)
    this.token = this.access;
    let response = this.getPoints();
    response.then(response =>{
        response.data.forEach(point => this.points.push(point))},

        () =>{
          console.log("can't get points...");
          this.loaded = false;
          //this.token = this.refresh;
        }
    )
    /*let token = 'Bearer ' + this.token;
    console.log("going to send " + token);
    axios.get('http://localhost:8081/point/' + this.user + '/points', {
      headers: {
        'Authorization': token
      }
    }).then(response =>
            response.data.forEach(point => this.points.push(point))
    )*/
  },
  methods: {
    refreshTokens : function (isPointAdded=true){
      let data = {
        refreshToken : this.refresh
      };
      axios.post('http://localhost:8081/api/auth/token', data).then(result => {
        console.log("before event token was ", this.token);
        this.$emit('refreshEvent', result.data.accessToken);
        this.token = result.data.accessToken;
        console.log("after event token became ", this.token)
        console.log("refreshed succesfully");
        if(isPointAdded) this.$refs.Form.save(this.token);
        else this.del();
      }, () =>{
        console.log("error!");
      })
    },
    getPoints: function (){
      let token = 'Bearer ' + this.token;
      console.log("going to send " + token);
      return axios.get('http://localhost:8081/point/' + this.user + '/points', {
        headers: {
          'Authorization': token
        }
      });
    },
    del: function () {
      console.log(this.token);
      let token = 'Bearer ' + this.token;
      axios.delete('http://localhost:8081/point', {
        headers: {
          'Authorization': token
        }
      }).then(() => {
            while (this.points.length > 0) this.points.pop();
          }, () => {
            if(!this.refreshed){
              this.refreshed = true;
              this.refreshTokens(false);
            }
            else console.log("Error!");
          }
      )
    },
    add : function (point){
        this.points.push(point);
    }
  }
}
</script>

<style>
table {
  border-collapse: collapse;
  border-radius: 10px;
  border-style: hidden; /* hide standard table (collapsed) border */
  box-shadow: 0 0 0 2px #666; /* this draws the table border  */
  margin: auto;
}

td {
  border: 2px solid #ccc;
}
</style>