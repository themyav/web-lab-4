<template>
  <div id="point_list">
    <point-form :points="points" :pointAttr="point" :token="token" :user="user" @onPointAdd="add"/>
    <table>
      <point-row v-for="point in points" :key="point.id" :point="point" :points="points"/>
    </table>
    <button @click="del">Очистить таблицу</button>
  </div>

</template>

<script>

import axios from 'axios'
import PointForm from "@/components/PointForm.vue";
import PointRow from "@/components/PointRow.vue";

export default {
  props: ['content', 'token', 'user'],
  data: function () {
    return {
      point: null,
      points: []
    }
  },
  components : {
    PointRow,
    PointForm
  },
  created: function () {
    let token = 'Bearer ' + this.token;
    console.log("going to send " + token);
    axios.get('http://localhost:8081/point/' + this.user + '/points', {
      headers: {
        'Authorization': token
      }
    }).then(response =>
            response.data.forEach(point => this.points.push(point))
    )
  },
  methods: {
    del: function () {
      let token = 'Bearer ' + this.token;
      axios.delete('http://localhost:8081/point', {
        headers: {
          'Authorization': token
        }
      }).then(() => {
            while (this.points.length > 0) this.points.pop();
          }, () => {
            console.log("Error!");
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
}

td {
  border: 2px solid #ccc;
}
</style>