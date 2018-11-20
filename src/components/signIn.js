import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { setPatient } from '../actions/setPatient';

const patientIds = [
  '58b3663e3425def0f0f6a229',
  '58b3663e3425def0f0f6a4ce',
  '58b367533425def0f023c20e',
  '58b3663f3425def0f0f6c0fa'
]

class SignIn extends Component {
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

  setPatient = (patient) => {
    this.props.setPatient(patient);
  }

  render() {
    return (
      <div className="App">
        <h1>Sign In</h1>
        <ul className="box-list">
          {
            this.state.patients.map(patient => {
              return (
                <li key={patient.id}>
                  <Link to="/" onClick={() => this.setPatient(patient)}>
                    <h3>{patient.firstName} {patient.lastName}</h3>
                    Sex: {patient.gender} <br/>
                    Birth date: {patient.birthDate} <br/>
                  </Link>
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
  setPatient: (patient) => dispatch(setPatient(patient))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
