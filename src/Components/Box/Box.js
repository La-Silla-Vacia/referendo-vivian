import { h, render, Component } from 'preact';

import s from './Box.css';

export default class Box extends Component {
  render(props, state) {
    const { children } = props;

    return (
      <div className={s.container}>
        <h3 className={s.name}>{children}</h3>
      </div>
    )
  }
}