import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class Layout extends Component {
  render() {
    return (
      <div className="app">
        <header>
          <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/sign-in">Sign Out</Link>
              </li>
            </ul>
          </nav>
        </header>
        { this.props.children }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  patient: state.setPatient.patient
})

export default connect(mapStateToProps)(Layout);
