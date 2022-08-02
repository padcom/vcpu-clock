import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import EventEmitter from 'eventemitter3'

export function useClock(maxFrequency, { autostart = true } = {}) {
  const frequency = ref(1)
  const state = ref(false)
  const counter = ref(0)
  const timer = ref(null)
  const running = computed(() => Boolean(timer.value))
  const events = new EventEmitter()

  const simulate = () => {
    state.value = true
    events.emit('tick', counter.value)
    if (frequency.value) {
      setTimeout(() => state.value = false, (10 * maxFrequency) / (frequency.value * 2))
    } else {
      setTimeout(() => state.value = false, (10 * maxFrequency) / 2)
    }
  }

  const tick = () => {
    counter.value = ++counter.value & 0xFFFF
    simulate()
  }

  const start = () => {
    if (!timer.value && frequency.value > 0) {
      timer.value = setInterval(tick, (10 * maxFrequency) / frequency.value)
    }
  }

  const stop = (reset = true) => {
    if (timer.value) {
      clearInterval(timer.value)
      timer.value = null
      counter.value = reset ? 0 : counter.value
    }
  }

  const update = (...args) => {
    if (timer.value) {
      stop(false)
      start()
    }
  }

  if (autostart) onMounted(start)
  onBeforeUnmount(stop)
  watch(frequency, update)

  const on = (event, handler) => events.on(event, handler)
  const off = (event, handler) => events.off(event, handler)

  return { frequency, start, stop, state: computed(() => state.value), step: counter, tick, running, on, off }
}
