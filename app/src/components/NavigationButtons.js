import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

import './NavigationButton.sass'

class NavigationButtons extends React.Component {
    render() {
        return (
            <div id="NavigationButtons">
                <div id="NavigationPrev" onClick={() => this.props.linkTo(this.props.prevRoute.path)}>
                    <FontAwesomeIcon icon={ faChevronLeft } />
                    {this.props.prevRoute.text}
                </div>
                <div id="NavigationNext" onClick={() => this.props.linkTo(this.props.nextRoute.path)}>
                    {this.props.nextRoute.text}
                    <FontAwesomeIcon icon={ faChevronRight } />
                </div>
            </div>
        )
    }
}

export { NavigationButtons }