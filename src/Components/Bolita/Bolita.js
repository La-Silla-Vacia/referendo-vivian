import { h, render, Component } from 'preact';

import s from './Bolita.css';

export default class Bolita extends Component {
  render(props, state) {
    const {x, y} = props;
    const style = {
      left: x,
      top: y
    };

    return (
      <div style={style} className={s.container}>
        {props.children}
      </div>
    )
  }
}