<template>
  <div class="clock">
    <h2>Clock</h2>
    <fieldset>
      <legend>Current state</legend>
      <div>
        State: <Led :state="clock.state" :size="16" />
        {{ this.clock.running ? 'running' : this.clock.state ? 'stepping' : 'stopped' }}
      </div>
      <div>Step: {{ clock.step }}</div>
      <div>Running: {{ clock.running }}</div>
    </fieldset>
    <fieldset>
      <legend>Speed {{ clock.running ? '' : '(stopped)' }}</legend>
      <div>Current clock speed: {{ clock.frequency }}Hz</div>
      <input v-model="clock.frequency" type="range" min="1" max="100" :disabled="clock.running">
    </fieldset>
    <div class="actions">
      <button @click="clock.start" :disabled="clock.running">Start</button>
      <button @click="clock.stop(false)" :disabled="!clock.running">Pause</button>
      <button @click="clock.stop(true)" :disabled="!clock.running">Stop</button>
      <button @click="clock.tick" v-if="clock.frequency === 0 || !clock.running" :disabled="clock.state">Step</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, provide, reactive } from 'vue'
import { useClock } from '../clock'
import { Led } from '@padcom/virtualcpu-common-vue-led'

export default defineComponent({
  components: {
    Led,
  },
  setup() {
    const clock = useClock(100, {
      autostart: false,
      callback(counter) {
        console.log('counter', counter)
      }
    })
    provide('clock', reactive(clock))

    return { clock: reactive(clock) }
  },
})
</script>
