import React from 'react'
import { configure, mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import axios from 'axios'
import { INITIAL_STATE } from '../src/constants'
import { AuthConnect } from '../src/components/AuthConnect'

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
    jest.spyOn(AuthConnect.prototype, 'componentDidMount')
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
    AuthConnect.prototype.componentDidMount.mockRestore()
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
    expect(AuthConnect.prototype.componentDidMount).toHaveBeenCalled()
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
    expect(wrapper.html()).toEqual('<div>hello world</div>')
  })
  
  it('should render error component', () => {
    wrapper.setProps({ loading: true, errorComponent: ErrorComp })
    wrapper.setProps({ loading: false })
    expect(wrapper.html()).toEqual('<div>oops</div>')
  })

})
