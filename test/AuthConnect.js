import React from 'react'
import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import expect from 'expect'
import sinon from 'sinon'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { INITIAL_STATE } from '../src/constants'
import { AuthConnect } from '../src/components/AuthConnect'
import * as actions from '../src/actions'

const Foo = ( props ) => {
  return (
    <div>{'hello world'}</div>
  )
}

const ErrorComp = ( props ) => {
  return (
    <div>{'oops'}</div>
  )
}

configure({ adapter: new Adapter() });

describe('AuthConnect component', () => {
  
  const middlewares = [ thunk ]
  let store
  let wrapper
  let sandbox
  beforeEach(() => {
    store = configureMockStore(middlewares)({
      auth: INITIAL_STATE
    })
    sinon.spy(AuthConnect.prototype, 'componentDidMount')
    wrapper = mount(
      <AuthConnect 
        dispatch={store.dispatch} 
        loading={false}
        httpClient={axios}
        tokenUrl={'/api/access'}
      >
        <Foo />
      </AuthConnect>
    )
  })
  
  afterEach(() => {
    wrapper.unmount()
    AuthConnect.prototype.componentDidMount.restore()
  })
  
  it('should render', () => {
    const wrapper = shallow(
      <AuthConnect 
        dispatch={store.dispatch} 
        loading={false}
        httpClient={axios}
        tokenUrl={'api/access'}
      />
    )
    expect(wrapper.length).toBe(1)
  })
  
  it('calls componentDidMount', () => {
    expect(AuthConnect.prototype.componentDidMount.calledOnce).toEqual(true);
  })
  
  it('should render null default', () => {
    expect(wrapper.isEmptyRender()).toEqual(true)
  })
  
  it('should render null default', () => {
    expect(wrapper.isEmptyRender()).toEqual(true)
  })
  
  it('should not update on token update', () => {
    wrapper.setProps({ loading: true, token: 'bar' })
    expect(wrapper.isEmptyRender()).toEqual(true)
  })
  
  it('should render with token and loading update', () => {
    wrapper.setProps({ loading: true, token: 'bar' })
    wrapper.setProps({ loading: false })
    expect(wrapper.html()).toEqual('<div><div>hello world</div></div>')
  })
  
  it('should render error component', () => {
    wrapper.setProps({ loading: true, errorComponent: ErrorComp })
    wrapper.setProps({ loading: false })
    expect(wrapper.html()).toEqual('<div>oops</div>')
  })

})