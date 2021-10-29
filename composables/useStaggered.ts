import Velocity from 'velocity-animate'

const STAGGER_DURATION = 200

export function useStaggered(duration = STAGGER_DURATION) {
  function beforeEnter(el) {
    el.style.opacity = 0
    /*  el.style.height = 0; */
  }

  function enter(el, done) {
    // Each element requires a data-index attribute in order for the transition to work properly
    const index = el.dataset.index || 1
    var delay = index * duration
    setTimeout(() => {
      Velocity(el, { opacity: 1 /*  height: 'auto' */ }, { complete: done })
    }, delay)
  }

  function leave(el, done) {
    // Each element requires a data-index attribute in order for the transition to work properly
    const index = el.dataset.index || 1
    var delay = index * duration
    setTimeout(() => {
      Velocity(el, { opacity: 0 /* height: 0  */ }, { complete: done })
    }, delay)
  }

  return {
    beforeEnter,
    enter,
    leave,
  }
}
