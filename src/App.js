import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';

import './App.css';

class App extends Component {
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
      !this.props.patient ?
        <Redirect to='/sign-in' />
      :
        <div className="App">
          <Link to="/sign-in">Sign Out</Link>

          <div>
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
          </div>
        </div>
    );
  }
}

const mapStateToProps = state => ({
  patient: state.setPatient.patient
})

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(App);
