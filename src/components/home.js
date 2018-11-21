import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Layout from './layout'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      encounters: []
    }
  }

  componentDidMount() {
    if (this.props.patient) {
      axios.get(`https://syntheticmass.mitre.org/fhir/Encounter?patient=${this.props.patient.id}`)
        .then(res => {
          const encounters = res.data.entry;
          this.setState({ encounters });
        })
    }
  }

  render() {
    return (
        <Layout>
          <h1>{this.props.patient.firstName} {this.props.patient.lastName}</h1>
          <ul>
            { this.state.encounters.map(encounter => {
              return (
                <li key={encounter.resource.id}>
                  <Link to={`/encounter/${encounter.resource.id}`}>{encounter.resource.period.start}</Link>
                </li>
              )
            })}
          </ul>
        </Layout>
    );
  }
}

const mapStateToProps = state => ({
  patient: state.setPatient.patient
})

export default connect(mapStateToProps)(Home);
