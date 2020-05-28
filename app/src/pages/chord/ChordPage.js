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
		this.renderSidebar = this.renderSidebar.bind(this)
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

	renderSidebar() {
		if (this.state.actor === null) {
			return (
				<div>
					<h1>11292</h1>
					<h2>voice actors giving life to characters</h2>
				</div>
			)
		} else {
			const actor = this.state.actor
			return (
				<div className="ActorDetails">
					<FontAwesomeIcon icon={faTimesCircle} color="#fff" size="3x"
						onClick={() => this.setActor(null)}
						style={{ float: "right", margin: "0 0 15px 15px", cursor: "pointer" }} />
					<h2>{actor.name}</h2>
					<img src={actor.image_url} alt={actor.name} />
					<p>{actor.about}</p>
					<p><b>Birthday:</b> {new Date(actor.birthday).toDateString()}</p>
					<p><b>Top characters played by this actor:</b></p>
					<table>
						{actor.animes.map(e =>
							<tr>
								<td class="ImageCell"><img src={e.image} alt={e.anime} /></td>
								<td>
									<p>{e.character}</p>
									<p>{e.anime}</p>
								</td>
							</tr>)
						}
					</table>
				</div>
			)
		}
	}

	render() {
		return (
			<Wrapper>
				<GraphView position={{ right: 0 }}>
					<div id="Chord">
						<div id="chartdiv"></div>
						<table id="chart-options">
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
				<Sidebar position={{ top: 0, left: 0 }}>
					<div className="SidebarContent">
						{this.renderSidebar()}
					</div>
				</Sidebar>
			</Wrapper>
		)
	}
}

export { ChordPage }