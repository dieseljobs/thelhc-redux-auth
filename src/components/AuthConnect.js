import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { resolveToken } from '../actions'
import { isAsyncInProgress, selectToken } from '../selectors'

export class AuthConnect extends React.Component {
  constructor( props ) {
    super( props )
    this.state = {
      checked: false
    }
  }
  componentDidMount() {
    const { dispatch, 
            httpClient, 
            tokenUrl, 
            tokenParams, 
            loading,
            token,
            children,
            errorComponent,
            ...callbacks } = this.props 
    dispatch( resolveToken( httpClient, tokenUrl, tokenParams, callbacks ) )
    this.setState( {
      checked: true
    })
  }
  shouldComponentUpdate( nextProps ) {
    const { loading } = this.props 
    const { nextLoading } = nextProps
    
    return ( loading && !nextLoading )
  }
  render() {
    const { loading, token, children, errorComponent: ErrorComp } = this.props 
    const { checked } = this.state
    
    if ( checked && !loading && token ) {
      return (
        <React.Fragment>{children}</React.Fragment>
      )
    } else if ( checked && !loading && !token && ErrorComp ) {
      return <ErrorComp />
    } else {
      return null
    }
  }
}

AuthConnect.propTypes = {
  dispatch: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  token: PropTypes.string,
  tokenUrl: PropTypes.string.isRequired,
  tokenParams: PropTypes.object,
  httpClient: PropTypes.func.isRequired,
  errorComponent: PropTypes.func,
  afterSessionSuccess: PropTypes.func,
  onSessionReject: PropTypes.func,
  afterSessionReject: PropTypes.func
}

const mapStateToProps = state => {
  return {
    loading: isAsyncInProgress( state ),
    token: selectToken( state )
  }
}

export default connect( mapStateToProps )( AuthConnect )