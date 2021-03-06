import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import Layout from './layout'

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
      redirectToReferrer: false,
      patients: []
    }
  }

  componentDidMount() {
    this.props.setPatient(null)
    localStorage.removeItem('patient')

    let patients = []

    patientIds.forEach(id => {
      axios.get(`https://syntheticmass.mitre.org/fhir/Patient/${id}`)
        .then(res => {
          const patient = res.data;
          const name = patient.name.filter(name => name.use === "official")[0];

          patients.push({
            id: patient.id,
            firstName: name.given[0],
            lastName: name.family,
            birthDate: patient.birthDate,
            gender: patient.gender,
            address: patient.address[0],
          })

          if (patients.length === patientIds.length) {
            patients = patients.sort((a, b) => (a.lastName > b.lastName) ? 1 : (b.lastName > a.lastName) ? -1 : 0);
            this.setState({patients});
          }
        })
    })
  }

  setPatient = (patient) => {
    localStorage.setItem('patient', JSON.stringify(patient))
    this.props.setPatient(patient);
    this.setState({ redirectToReferrer: true });
  }

  render() {
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return (
        <Redirect to='/' />
      )
    }

    return (
      <Layout>
        <h1>Sign In</h1>
        {
          this.state.patients && this.state.patients.length ?
            <ul className="list--box">
              {
                this.state.patients.map(patient => {
                  return (
                    <li key={patient.id}>
                      <div onClick={() => this.setPatient(patient)}>
                        <h3 className="margin-none--top">{patient.firstName} {patient.lastName}</h3>
                        Sex: {patient.gender} <br/>
                        Birth date: {patient.birthDate} <br/>
                      </div>
                    </li>
                  )
                })
              }
            </ul>
          :
            <div>Loading...</div>
        }
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  ...state
})

const mapDispatchToProps = dispatch => ({
  setPatient: (patient) => dispatch(setPatient(patient))
})

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
