import { h, render, Component } from 'preact';
import cx from 'classnames';

import s from './Bolita.css';

export default class Bolita extends Component {

  constructor() {
    super();

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const {callback, id} = this.props;
    callback(id);
  }

  render(props, state) {
    const {x, y, name, destination, current} = props;
    // console.log(destination);
    const style = {
      left: x,
      top: y
    };

    return (
      <button
        data-destination={destination}
        data-balloon={name}
        data-balloon-pos="down"
        style={style}
        onClick={this.handleClick}
        className={cx(s.container, {[s.current]: current})}
      >
        <span className={s.firstLetter}>{name[0]}</span>
      </button>
    )
  }
}