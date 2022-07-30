import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'

export function useClock(maxFrequency, { callback = () => {}, autostart = true } = {}) {
  const frequency = ref(1)
  const state = ref(false)
  const counter = ref(0)
  const timer = ref(null)
  const running = computed(() => Boolean(timer.value))

  const simulate = () => {
    state.value = true
    callback(counter.value)
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

  return { frequency, start, stop, state: computed(() => state.value), step: counter, tick, running }
}
