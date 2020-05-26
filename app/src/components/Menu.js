import React from "react"
import { withRouter } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons"

import "./Menu.sass"

const menuRoutes = [
    { path: "/history", text: "History" },
    { path: "/bubble", text: "Genres" },
    { path: "/sankey", text: "Studios" },
    { path: "/chord", text: "Actors" },
]

/**
 * Menu HOC, must be augmented with react-router-dom's "withRouter" HOC
 * to have route path as props.location.pathname
 */
const WithMenu = (Component) => {
    class _Menu extends React.Component {
        constructor() {
            super()
            this.routeChangeCallbacks = []

            this.linkTo = this.linkTo.bind(this)
            this.onRouteChange = this.onRouteChange.bind(this)
        }

        // generates the "current" classname if path matches
        current(path) {
            return this.props.location.pathname === path ? "current" : null
        }

        // link transition with animation
        linkTo(path) {
            return (this.props.location.pathname === path) ? () => { /* do nothing if path is current */ } :
            () => {
                // trigger callback in children
                this.routeChangeCallbacks.forEach(cb => cb(path))
                this.props.linkTo(path)
            }
        }

        // finds the neighbor link path
        // @param next boolean: finds next if true, otherwise finds prev
        findNeighbor(next) {
            const idx = menuRoutes.findIndex(e => e.path == this.props.location.pathname)
            if (idx < 0 || idx >= menuRoutes.length) { return "/" }
            else if (next) {
                if (idx == menuRoutes.length - 1) return "/"
                return menuRoutes[idx + 1].path
            }
            else {
                if (idx == 0) return "/"
                return menuRoutes[idx - 1].path
            }
        }

        // allows children to register a route change callback
        onRouteChange(callback) {
            this.routeChangeCallbacks.push(callback)
        }

        render() {
            const navContent = menuRoutes.map(e =>
                <a onClick={this.linkTo(e.path)} className={this.current(e.path)}>{e.text}</a>)
            return (
                <div className="Main">
                    <div className="Menu">
                        <h2 onClick={this.linkTo("/")}>Anime Data Visualization</h2>

                        <nav>
                            {navContent}
                        </nav>

                        <div class="NavButtons">
                            <a onClick={this.linkTo(this.findNeighbor(false))}>
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </a>
                            <a onClick={this.linkTo(this.findNeighbor(true))}>
                                <FontAwesomeIcon icon={faArrowRight} />
                            </a>
                        </div>
                    </div>
                    <div className="Content">
                        <Component onRouteChange={this.onRouteChange} />
                    </div>
                </div>
            )
        }
    }

    return withRouter(_Menu)
}

export { WithMenu }