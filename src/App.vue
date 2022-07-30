<template>
  <Clock />
</template>

<script>
import { defineComponent } from 'vue'

import Clock from './components/Clock.vue'

export default defineComponent({
  components: {
    Clock,
  },
})
</script>
