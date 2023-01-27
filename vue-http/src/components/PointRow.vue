<template>
    <tr>
      <td>{{ point.x.toFixed(3) }}</td>
      <td>{{ point.y.toFixed(3) }}</td>
      <td>{{ point.r.toFixed(3) }}</td>
      <td>{{ point.result ? 'Попал' : 'Промах' }}</td>
      <td>{{ point.time.toFixed(4) }}</td>
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