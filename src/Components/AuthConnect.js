import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class AuthConnect extends React.Component {
  render() {
    return (
      <div>
      </div>
    )
  }
}

AuthConnect.propTypes = {
  tokenUrl: PropTypes.string.isRequired,
  tokenParams: PropTypes.object,
  httpClient: PropTypes.object.isRequired,
  afterSessionSuccess: PropTypes.func,
  onSessionReject: PropTypes.func,
  afterSessionReject: PropTypes.func
}

export default connect()( AuthConnect )