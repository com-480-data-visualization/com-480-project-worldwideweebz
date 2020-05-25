import { WOW } from 'wowjs'

/**
 * This singleton component manages the instance for WOW animations
 * (CSStransitions on viewport entry). Should be initialized
 * at top-level in App. See {@link https://wowjs.uk/}
 *
 * IMPORTANT: call WOWAnimation.sync when the DOM changes and an
 * animation should be displayed, as WOWJS is not informed by
 * React updates!
 */
const WOWAnimation = new WOW({
    mobile: true,
    live: true
})

export { WOWAnimation }