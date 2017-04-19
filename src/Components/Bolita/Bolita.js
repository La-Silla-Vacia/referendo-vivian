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
    callback(id + 1);
  }

  render(props, state) {
    const {x, y, name, destination, current, size, photo} = props;
    // console.log(destination);
    const style = {
      left: x,
      top: y,
      width: size,
      height: size
    };

    const insideStyle = {
      backgroundImage: `url(${photo}`
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
        <div className={s.inside}>
          <img className={s.image} src={photo} alt={name} />
        </div>
      </button>
    )
  }
}