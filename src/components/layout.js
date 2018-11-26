import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Layout extends Component {
  render() {
    return (
      <div className="app">
        <header className="header">
          <div className="max-width">
            <nav>
              <ul className="nav-list">
                <li>
                  <Link to="/">Home</Link>
                </li>
                {
                  this.props.patient ?
                    <li className="nav-list__right">
                      { this.props.patient.firstName  + ' ' + this.props.patient.lastName + '  ' }
                      <Link to="/sign-in">Sign Out</Link>
                    </li>
                  : null
                }
              </ul>
            </nav>
          </div>
        </header>
        <div className="content max-width">
          { this.props.children }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  patient: state.setPatient.patient
})

export default connect(mapStateToProps)(Layout);
