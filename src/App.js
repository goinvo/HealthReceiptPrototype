import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

import { simpleAction } from './actions/setPatientId';

import './App.css';

const patientIds = [
  '58b3663e3425def0f0f6a229',
  '58b3663e3425def0f0f6a4ce',
  '58b367533425def0f023c20e',
  '58b3663f3425def0f0f6c0fa'
]

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      patients: []
    }
  }

  componentDidMount() {
    const patients = this.state.patients.map(patient => patient);

    patientIds.forEach(id => {
      axios.get(`https://syntheticmass.mitre.org/fhir/Patient/${id}`)
        .then(res => {
          const patient = res.data;
          const name = patient.name.filter(name => name.use === "official")[0];

          patients.push({
            id: patient.id,
            firstName: name.given,
            lastName: name.family,
            birthDate: patient.birthDate,
            gender: patient.gender,
            address: patient.address[0],
          })

          this.setState({ patients });
        })
    })
  }

  setPatientId = (id) => {
    this.props.simpleAction(id);
  }

  render() {
    return (
      <div className="App">
        <ul>
          {
            this.state.patients.map(patient => {
              return (
                <li key={patient.id}>
                  <h3>{patient.firstName} {patient.lastName}</h3>
                  Sex: {patient.gender} <br/>
                  Birth date: {patient.birthDate} <br/>
                  <button onClick={() => this.setPatientId(patient.id)}>Make active</button>
                </li>
              )
            })
          }
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  simpleAction: (val) => dispatch(simpleAction(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
