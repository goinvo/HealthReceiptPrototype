import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Layout from './layout'

class Home extends Component {
  constructor(props) {
    super(props)

    this.state = {
      encounters: [],
      carePlans: [],
    }
  }

  componentDidMount() {
    if (this.props.patient) {
      axios.get(`https://syntheticmass.mitre.org/fhir/Encounter?patient=${this.props.patient.id}`)
        .then(res => {
          const encounters = res.data.entry;
          this.setState({ encounters });
        })

      axios.get(`https://syntheticmass.mitre.org/fhir/CarePlan?patient=${this.props.patient.id}`)
        .then(res => {
          this.parseCarePlanData(res.data.entry);
        });
    }
  }

  parseCarePlanData = (data) => {
    let carePlans = []

    data.forEach(({ resource }) => {
      if (!resource.completed) {
        carePlans.push({
          name: resource.category[0].coding[0].display,
          activity: resource.activity.map(activity => activity.detail.code.coding[0].display),
        })
      }
    })

    this.setState({ carePlans })
  }

  render() {
    return (
        <Layout>
          {
            this.state.carePlans && this.state.carePlans.length ?
              <div>
                <h4 className="text--uppercase text--gray">Your Care Plan</h4>
                <ul className="list--unstyled">
                  { this.state.carePlans.map(plan => {
                    return (
                      <li className="margin-bottom">
                        {plan.name}:
                        <ul className="list--unstyled">
                          {plan.activity.map(activity => <li>{activity}</li>)}
                        </ul>
                      </li>
                    )
                  })}
                </ul>
              </div>
            : null
          }


          <h4 className="text--uppercase text--gray">Your past visits</h4>
          <ul className="list--unstyled">
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
