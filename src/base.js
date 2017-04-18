import { h, render, Component } from 'preact';
import { endpoint } from './config';

import Bolita from './Components/Bolita/Bolita';
import Box from './Components/Box/Box';

import s from './base.css';

class Base extends Component {

  constructor() {
    super();

    this.state = {
      data: [],
      boxes: []
    }
  }

  componentWillMount() {
    this.fetchData();
  }

  fetchData() {
    fetch(endpoint.dataUrl)
      .then((response) => {
        return response.json()
      }).then((json) => {
      console.log('parsed json', json)
      const items = [];
      const boxes = [];
      json.map((item) => {
        items.push({
          name: item.nombre,
          region: item.region,
          description: item.explicacion,
          destination: item.paraDondeVa,
          photo: item.linkFoto
        });

        if (item.paraDondeVa && boxes.indexOf(item.paraDondeVa) === -1) {
          boxes.push(item.paraDondeVa);
        }
      });

      this.setState({ data: items, boxes });
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  getBolitas() {
    const rows = 5;
    const BolitaSize = 48;
    const items = this.state.data;
    const numberOfItems = items.length;
    let width = 1000;
    if (this.items) {
      width = this.items.offsetWidth;
    }

    const itemsPerLine = Math.round(numberOfItems / rows);
    const totalWidth = itemsPerLine * BolitaSize;
    const startWidth = (width / 2) - (totalWidth * 0.5);

    let y = -BolitaSize,
      x = startWidth;

    return items.map((item, index) => {
      if ((index / itemsPerLine) % 1 === 0) {
        y += BolitaSize;
        x = startWidth;
      } else {
        x += BolitaSize;
      }
      item.y = y;
      item.x = x;
      return (
        <Bolita {...item} key={index} />
      )
    })
  }

  getBoxes() {
    const { boxes } = this.state;
    return boxes.map((item, index) => {
      return (
        <Box key={index}>{item}</Box>
      );
    })
  }

  render() {
    const bolitas = this.getBolitas();
    const boxes = this.getBoxes();

    return (
      <div className={s.container}>
        <aside className={s.sidebar}>
          <button className={s.button}>HOI</button>
          <button className={s.button}>EN 2018</button>
        </aside>
        <div className={s.items} ref={ c => this.items=c }>
          <div className={s.cloud}>
            {bolitas}
          </div>
          <div className={s.boxes}>
            {boxes}
          </div>
        </div>
      </div>
    )
  }
}
;

export default Base;