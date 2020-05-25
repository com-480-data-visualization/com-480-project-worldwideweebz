/**
 * This file contains global layout definitions that can be reused
 */
import React from 'react'

import "./Layout.sass"

/**
 * Wrapper component: ensures that width is 100% and that
 * children will follow a flex display
 */
class Wrapper extends React.Component {
    render() {
        return (
            <div className="Wrapper">
                {this.props.children}
            </div>
        )
    }
}

/**
 * GraphView component: occupies 70% of the viewport width
 * @param position CSS position property set (defaults to {top: 0, left: 0})
 */
class GraphView extends React.Component {
    static defaultProps = {
        position: { top: 0, left: 0 },
    }

    render() {
        return (
            <div className="GraphView" style={this.props.position}>
                {this.props.children}
            </div>
        )
    }
}

/**
 * Sidebar component: occupies 30% of the viewport width
 * @param appearTransitionClass CSS transition class name from
 *        {@link https://animate.style/} (defaults to "fadeInRight")
 * @param position CSS position property set (defaults to {top: 0, right: 0})
 */
class Sidebar extends React.Component {
    static defaultProps = {
        appearTransitionClass: "fadeInRight",
        position: { top: 0, right: 0 },
    }

    render() {
        return (
            <div className={`Sidebar animated ${this.props.appearTransitionClass}`}
                style={this.props.position}>
                {this.props.children}
            </div>
        )
    }
}

export { Wrapper, GraphView, Sidebar }