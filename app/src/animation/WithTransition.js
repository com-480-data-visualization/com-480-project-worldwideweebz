import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { useHistory } from 'react-router-dom'

import styles from './WithTransition.scss'

/**
 * Transition higher-order component (HOC)
 * Allows to easily extend any component to have transitions
 * @param {React.Component} Component the React component to animate
 * @param {String} transitionName optional, the name of the transition to apply (defaults to "FadeInOut")
 */
const WithTransition = (Component, transitionName = 'FadeInOut') => {
    /**
     * Inner functional component to keep track of wether to display
     * the child or not. This is a functional component rather
     * than a class component to be able to call useHistory()
     */
    function _WithTransition(props) {
        // useState hook to keep track of renderChild state
        const [renderChild, setRenderChild] = React.useState(true)
        // get access to router with history object
        const history = useHistory()
        // duration of transitions
        const transitionTimeouts = {
            appear: parseInt(styles.transitionDurationAppear),
            leave: parseInt(styles.transitionDurationLeave),
        }

        /**
         * This function (passed as props to the child component) should
         * be used to go to another route while respecting transitions
         * @param {String} route the route to go to after transition end
         */
        const linkTo = (route) => {
            // Unmount child (this will trigger the fade-out animation)
            setRenderChild(false)
            // After the transition finished, go the the passed route
            setTimeout(() => {
                history.push(route)
            }, transitionTimeouts.leave)
        }

        return (
            <ReactCSSTransitionGroup
                transitionAppear={true}
                transitionAppearTimeout={transitionTimeouts.appear}
                transitionLeaveTimeout={transitionTimeouts.leave}
                transitionName={transitionName}>
                {renderChild ? <Component {...props} linkTo={linkTo} /> : null}
            </ReactCSSTransitionGroup>
        )
    }
    return _WithTransition
}

export { WithTransition }