import React from 'react'
import Switch from '@material-ui/core/Switch'
import { withStyles } from '@material-ui/core/styles'
import { blue } from '@material-ui/core/colors'

/**
 * This class stores the global configuration of the application by
 * implementing an observer pattern. The observers MUST implement
 * onConfigUpdate(configState) and subscribe / remove from it.
 */
class ConfigObservable {
    // List of NSFW genres
    static NSFWGenres = ["Hentai", "Ecchi"]
    constructor() {
        this.state = {
            // Set to true to hide NSFW content
            disableNSFW: true
        }
        this.observers = []

        // bind methods
        this.addObserver = this.addObserver.bind(this)
        this.removeObserver = this.removeObserver.bind(this)
        this.notifyObservers = this.notifyObservers.bind(this)
        this.getConfig = this.getConfig.bind(this)
        this.setConfig = this.setConfig.bind(this)
        this.detectNSFW = this.detectNSFW.bind(this)
    }

    addObserver(observer) {
        this.observers.push(observer)
    }

    removeObserver(observer) {
        const index = this.observers.indexOf(observer)
        if (index > -1) { this.observers.splice(index, 1) }
    }

    notifyObservers() {
        this.observers.forEach(o => o.onConfigUpdate(this.state))
    }

    getConfig() {
        return this.state
    }

    setConfig(changes) {
        const newState = Object.assign({}, this.state)
        Object.entries(changes).forEach(entry => {
            const [key, value] = entry
            newState[key] = value
        })
        this.state = newState
        this.notifyObservers()
    }

    /**
     * Returns true if NSFW mode is enabled and the parameter string contains a sensitive genre
     * @param {String} genreString which may contain a NSFW genre substring
     */
    detectNSFW(genreString) {
        return genreString != null && typeof genreString === 'string' &&
            this.state.disableNSFW && ConfigObservable.NSFWGenres.some(genre => genreString.includes(genre))
    }
}

// Instance of the config observable
const Config = new ConfigObservable()


/**
 * Custom blue switch
 */
const BlueSwitch = withStyles({
    switchBase: {
        color: blue[300],
    },
    checked: {
        color: blue[500],
    },
    track: {
        color: blue[500],
    },
})(Switch)

/**
 * Component of the config panel
 */
class ConfigPanel extends React.Component {
    constructor() {
        super()
        this.handleNSFWSwitch = this.handleNSFWSwitch.bind(this)
        this.state = {
            config: Config.getConfig()
        }

        this.onConfigUpdate = this.onConfigUpdate.bind(this)
    }

    componentDidMount() {
        Config.addObserver(this)
    }

    componentWillUnmount() {
        Config.removeObserver(this)
    }

    onConfigUpdate(newConfig) {
        this.setState({
            config: newConfig
        })
    }

    handleNSFWSwitch() {
        Config.setConfig({
            disableNSFW: !Config.getConfig().disableNSFW
        })
    }

    render() {
        return (
            <div>
                <label>
                    <p>Disable NSFW imagery</p>
                    <BlueSwitch onClick={this.handleNSFWSwitch} checked={this.state.config.disableNSFW} color="custom" />
                </label>
            </div>
        )
    }
}

export { Config, ConfigPanel }