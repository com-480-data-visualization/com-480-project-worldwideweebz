import React from 'react'
import { LoadingScreen } from '../../components/LoadingScreen'

/**
 * History graph page component
 */
class HistoryPage extends React.Component {
    constructor() {
        super()
        this.state = {
            data: [],
            loading: true,
        }
    }

    componentDidMount() {
        fetch(`${process.env.PUBLIC_URL}/data/history.json`)
            .then(response => response.json())
            .then(newData => this.setState({
                data: newData,
                loading: false,
            }))
    }

    render() {
        return (
            <div className="History">
                {this.state.loading ?  <LoadingScreen /> : <p>Hello history</p>}
                <LoadingScreen />
            </div>
        )
    }
}

export { HistoryPage }