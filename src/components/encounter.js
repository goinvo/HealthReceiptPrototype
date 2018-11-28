import React, { Component } from 'react'
import { connect } from 'react-redux';
import axios from 'axios'

import Layout from './layout'

class Encounter extends Component {
  constructor(props) {
    super(props)

    this.state = {
      classType: null,
      date: null,
      conditions: [],
      observations: [],
      newMedications: [],
      procedures: [],
      carePlans: [],
    }
  }

  componentDidMount() {
    axios.get(`https://syntheticmass.mitre.org/fhir/Encounter/${this.props.match.params.encounterId}/$everything`)
      .then(res => {
        this.parseEncounterData(res.data.entry);
      })
    axios.get(`https://syntheticmass.mitre.org/fhir/CarePlan?patient=${this.props.patient.id}`)
      .then(res => {
        this.parseCarePlanData(res.data.entry);
      });
  }

  parseCondition = (condition) => {
    return condition.code.coding[0].display
  }

  parseObservation = (observation) => {
    if (observation.code.coding[0].display === "Blood Pressure") {
      const values = observation.component

      return {
        display: "Blood Pressure",
        value: `${values[0].valueQuantity.value}/${values[1].valueQuantity.value}`,
        unit: values[0].valueQuantity.unit,
      }
    }
    return {
      display: observation.code.coding[0].display,
      value: observation.valueQuantity.value,
      unit: observation.valueQuantity.unit,
    }
  }

  parseMedication = (med) => {
    return med.medicationCodeableConcept.coding[0].display
  }

  parseProcedure = (procedure) => {
    return procedure.code.text
  }

  parseEncounterData = (data) => {
    let classType = null,
        date = null,
        conditions = [],
        observations = [],
        newMedications = [],
        procedures = [];

    data.forEach(({ resource }) => {
      switch (resource.resourceType) {
        case 'Encounter':
          classType = resource.class.code
          date = resource.period.start
          break
        case 'Condition':
          conditions.push(this.parseCondition(resource))
          break
        case 'Observation':
          observations.push(this.parseObservation(resource))
          break
        case 'MedicationRequest':
          newMedications.push(this.parseMedication(resource))
          break
        case 'Procedure':
          procedures.push(this.parseProcedure(resource))
          break
        default:
          console.log(`Didn't parse resource of type ${resource.resourceType}`)
          break
      }
    })

    this.setState({
      classType,
      date,
      conditions,
      observations,
      newMedications,
      procedures,
    })
  }

  parseCarePlanData = (data) => {
    let carePlans = []

    data.forEach(({ resource }) => {
      if (!resource.completed && resource.context.reference.replace('Encounter/', '') === this.props.match.params.encounterId) {
        carePlans.push({
          name: resource.category[0].coding[0].display,
          activity: resource.activity.map(activity => activity.detail.code.coding[0].display),
        })
      }
    })

    this.setState({ carePlans })
  }

  render() {
    const hasCarePlan = this.state.carePlans && this.state.carePlans.length
    const hasNewMedications = this.state.newMedications && this.state.newMedications.length
    const hasTreatmentPlan = hasCarePlan || hasNewMedications

    return (
      <Layout>
        <p>{this.props.patient.firstName} {this.props.patient.lastName}</p>

        <p>
          How your { this.state.classType } visit went on { this.state.date }<br/>
          <span className="text--sm">with Dr. Surya Choudry, Arlington Family Health</span>
        </p>

        {
          this.state.conditions && this.state.conditions.length ?
            <div>
              <h4 className="text--uppercase text--gray">Conditions</h4>
              <ul className="list--unstyled">
                { this.state.conditions.map(condition => <li>{ condition }</li>) }
              </ul>
            </div>
          : null
        }

        {
          this.state.observations && this.state.observations.length ?
            <div>
              <h4 className="text--uppercase text--gray">Observations</h4>
              <ul className="list--unstyled">
                { this.state.observations.map(ob => <li>{ob.display}: {ob.value} {ob.unit}</li>) }
              </ul>
            </div>
          : null
        }

        {
          this.state.procedures && this.state.procedures.length ?
            <div>
              <h4 className="text--uppercase text--gray">Procedures</h4>
              <ul className="list--unstyled">
                { this.state.procedures.map(p => <li>{p}</li>) }
              </ul>
            </div>
          : null
        }

        <h4 className="text--uppercase text--gray">Summary</h4>
        <p>{this.props.patient.firstName} is eating healthy and has started to lower cholesterol and blood pressure, though values are still high. They need to focus on getting more exercise and managing stress.</p>


        {
          hasTreatmentPlan ?
            <div>
              <h4 className="text--uppercase text--gray">Treatment</h4>
              {
                hasCarePlan ?
                  <ul className="list--unstyled">
                    { this.state.carePlans.map(plan => {
                      return (
                        <li>
                          {plan.name}:
                          <ul className="list--unstyled">
                            {plan.activity.map(activity => <li>{activity}</li>)}
                          </ul>
                        </li>
                      )
                    })}
                  </ul>
                : null
              }
              {
                hasNewMedications ?
                  <div>
                    <p>Begin taking these medications:</p>
                    <ul className="list--unstyled">
                      { this.state.newMedications.map(med => <li>{ med }</li>) }
                    </ul>
                  </div>
                : null
              }
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
