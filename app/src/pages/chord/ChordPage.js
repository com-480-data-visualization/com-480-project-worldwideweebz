import React from 'react'
import { constructChord } from './ChordAmcharts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMouse } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'

import './ChordPage.sass'
import { Wrapper, GraphView, Sidebar } from '../../components/Layout'

/**
 * Component of the cluster graph page
 */
class ChordPage extends React.Component {
	constructor() {
		super()
		this.state = {
			actor: null,
		}

		this.setActor = this.setActor.bind(this)
	}

	setActor(actor) {
		this.setState({
			actor: actor,
		})
	}

	componentDidMount() {
		fetch(`${process.env.PUBLIC_URL}/data/vA_datasets.json`)
			.then(res => res.json())
			.then(json => {
				this.chart = constructChord(json, this.setActor)
			})
	}

	componentWillUnmount() {
		if (this.chart) {
			this.chart.dispose()
		}
	}

	render() {
		return (
			<Wrapper>
				<GraphView>
					<div id="Chord">
						<div id="chartdiv" style={{ top: 60, width: "100%", height: "95vh" }}></div>
						<table id="chart-options" style={{ position: "fixed", top: 60, left: 0 }}>
							<tr>
								<td><label for="filter">Voice actors language: </label></td>
								<td><select id="filter">
									<option className="filterOpt">Japanese</option>
									<option className="filterOpt">English</option>
									<option className="filterOpt">Korean</option>
									<option className="filterOpt">Italian</option>
									<option className="filterOpt">French</option>
									<option className="filterOpt">Spanish</option>
									<option className="filterOpt">German</option>
									<option className="filterOpt">Hungarian</option>
									<option className="filterOpt">Brazilian</option>
									<option className="filterOpt">Hebrew</option>
									<option className="filterOpt">Mandarin</option>
								</select></td>
							</tr>
							<tr>
								<td><label for="top">Top x of voice actors: </label></td>
								<td><select id="top">
									<option className="topOpt">5</option>
									<option className="topOpt">10</option>
									<option selected className="topOpt">20</option>
									<option className="topOpt">30</option>
									<option className="topOpt">40</option>
								</select></td>
							</tr>
						</table>
					</div>
				</GraphView>
				<Sidebar appearTransitionClass="fadeInLeft" position={{ top: 0, left: 0 }}>
					<div className="SidebarContent">
						{ // Show close button if any details info is shown
							this.state.actor === null ? null :
								<FontAwesomeIcon icon={faTimesCircle} color="#fff" size="3x"
									onClick={() => this.setActor(null)}
									style={{ float: "right", margin: "0 0 15px 15px", cursor: "pointer" }} />
						}
					</div>
				</Sidebar>
			</Wrapper>
		)
	}
}

export { ChordPage }