import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import './WithTransition.sass'

/**
 * Transition higher-order component (HOC)
 * Allows to easily extend any component to have transitions
 */
const WithTransition = Component => {
    return props =>
        <ReactCSSTransitionGroup
            transitionAppear={true}
            transitionAppearTimeout={600}
            transitionEnterTimeout={600}
            transitionLeaveTimeout={200}
            transitionName={'FadeIn'}>
            <Component {...props} />
        </ReactCSSTransitionGroup>
}

export { WithTransition }