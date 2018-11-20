import React, { Component } from 'react'
import axios from 'axios'

class Patient extends Component {
  constructor(props) {
    super(props)

    this.state = {
      encounters: []
    }
  }

  componentDidMount() {
    axios.get(`https://syntheticmass.mitre.org/fhir/Encounter?patient=${this.props.match.params.patientId}`)
      .then(res => {
        const encounters = res.data.entry;
        this.setState({ encounters });
      })
  }

  render() {
    return (
      <div>
        {/* <h1>{this.props.patient.firstName} {this.props.patient.lastName}</h1> */}
        <ul>
          { this.state.encounters.map(encounter => {
            return (
              <li key={encounter.resource.id}>{encounter.resource.id}</li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default Patient
