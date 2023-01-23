<template>
    <tr>
      <td>{{ point.x.toFixed(3) }}</td>
      <td>{{ point.y.toFixed(3) }}</td>
      <td>{{ point.r.toFixed(3) }}</td>
      <td>{{ point.result }}</td>
      <td>{{ point.time }}</td>
      <td>{{ point.creationDate }}</td>
    </tr>
</template>

<script>
export default {
  props: ['point', 'points']
}
</script>

<style scoped>

</style>