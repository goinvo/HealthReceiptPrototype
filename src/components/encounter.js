import React, { Component } from 'react'
import { connect } from 'react-redux';
import axios from 'axios'

import Layout from './layout'

class Encounter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      classType: null,
      conditions: [],
      existingMedications: [],
      newMedications: []
    }
  }

  componentDidMount() {
    axios.get(`https://syntheticmass.mitre.org/fhir/Encounter/${this.props.match.params.encounterId}/$everything`)
      .then(res => {
        this.parseEncounterData(res.data.entry);
      })
  }

  parseCondition = (condition) => {
    return condition.code.coding[0].display
  }

  parseMedication = (med) => {
    return med.medicationCodeableConcept.coding[0].display
  }

  parseEncounterData = (data) => {
    let {
      classType,
      conditions,
      existingMedications,
      newMedications
    } = this.state;

    data.forEach(({ resource }) => {
      switch (resource.resourceType) {
        case 'Encounter':
          classType = resource.class.code
          break
        case 'Condition':
          conditions.push(this.parseCondition(resource))
          break
        case 'MedicationRequest':
          newMedications.push(this.parseMedication(resource))
          break
        default:
          console.log(`Didn't parse resource of type ${resource.resourceType}`)
          break
      }
    })

    console.log(conditions)

    this.setState({
      classType,
      conditions,
      existingMedications,
      newMedications,
    })
  }

  render() {
    return (
      <Layout>
        <h1>{this.props.patient.firstName} {this.props.patient.lastName}'s</h1>
        <h2>{ this.state.classType } visit with Dr. Michelle Bach</h2>

        {
          this.state.conditions && this.state.conditions.length ?
            <div>
              <b>Conditions you reviewed today</b>
              <ul>
                { this.state.conditions.map(condition => <li>{ condition }</li>) }
              </ul>
            </div>
          : null
        }

        {
          this.state.newMedications && this.state.newMedications.length ?
            <div>
              <h3>Your care plan</h3>
              <b>Begin taking these medications</b>
              <ul>
                { this.state.newMedications.map(med => <li>{ med }</li>) }
              </ul>

              {/* <b>Keep taking these medications</b>
              <ul>
                { this.state.existingMedications.map(med => <li>{ med }</li>) }
              </ul> */}
            </div>
          : null
        }
      </Layout>
    )
  }
}

const mapStateToProps = state => ({
  patient: state.setPatient.patient
})

export default connect(mapStateToProps)(Encounter);
