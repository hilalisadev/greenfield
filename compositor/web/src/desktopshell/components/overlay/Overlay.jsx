import './style.css'
import { h, Component } from 'preact'
import Login from '../login/Login'

class Overlay extends Component {
  render (props, state, context) {
    return (
      <div className={'overlay'}>
        <Login />
      </div>
    )
  }
}

export default Overlay