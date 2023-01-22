<template>
  <div>
    <tr>
      <td>{{ point.x }}</td>
      <td>{{ point.y }}</td>
      <td>{{ point.r }}</td>
      <td>{{ point.result }}</td>
      <td>{{ point.time }}</td>
      <td>{{ point.creationDate }}</td>
    </tr>
  </div>

</template>

<script>
export default {
  props: ['point', 'points']
}
</script>

<style scoped>

</style>