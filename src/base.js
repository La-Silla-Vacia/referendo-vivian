import { h, render, Component } from 'preact';
import cx from 'classnames';
import { endpoint } from './config';

import Bolita from './Components/Bolita/Bolita';
import Box from './Components/Box/Box';

import s from './base.css';

const MarkdownIt = require('markdown-it'),
  md = new MarkdownIt();

class Base extends Component {

  constructor() {
    super();

    this.state = {
      data: [],
      boxes: [],
      run: false,
      description: false
    };

    this.showDescription = this.showDescription.bind(this);
  }

  componentWillMount() {
    this.fetchData();
  }

  componentDidMount() {
    setInterval(() => {
      // this.handleChange()
    }, 1000);
  }

  fetchData() {
    fetch(endpoint.dataUrl)
      .then((response) => {
        return response.json()
      }).then((json) => {
      // console.log('parsed json', json)
      const items = [];
      const boxes = [];
      json.map((item, index) => {
        let destination = item.paraDondeVa;

        // if (destination && destination !== '') {
        items.push({
          name: item.nombre,
          region: item.region,
          description: item.explicacion,
          destination,
          photo: item.fotoLink,
          id: index
        });
        // }

        if (destination && boxes.indexOf(destination) === -1) {
          boxes.push(destination);
        }
      });
      this.setState({ data: items, boxes });
    }).catch((ex) => {
      console.log('parsing failed', ex)
    })
  }

  getBolitas() {
    const { run, description } = this.state;
    const items = this.state.data;
    const numberOfItems = items.length;
    let width = 1000, height = 600;
    if (this.items) {
      width = this.items.offsetWidth;
      height = this.items.offsetHeight;
    }

    let x, y;

    const containers = [];
    items.map((item) => {
      const { destination } = item;
      if (containers[destination]) {
        containers[destination].push(item);
      } else {
        if (destination)
          containers[destination] = [item];
      }
    });

    let rows = 5;

    const itemsPerGroupRow = 4;
    const numberOfGroups = Object.keys(containers).length;
    const pxPerGroup = width / numberOfGroups;
    let BolitaSize = (pxPerGroup / 4) - 1;
    if (width < 500) {
      BolitaSize = (pxPerGroup / 2) - 1;
      rows = 4;
    } else if (width < 800) {
      BolitaSize = (pxPerGroup / 3) - 1;
      rows = 3;
    }

    const itemsPerLine = Math.round(numberOfItems / rows);
    const totalWidth = itemsPerLine * BolitaSize;
    const startWidth = (width / 2) - (totalWidth * 0.5);
    const startHeight = height - 5;
    y = -20;
    x = startWidth;

    const groups = [];
    // if (!run) {
    return items.map((item, index) => {
      const { destination } = item;
      // if (!destination) return;
      if (run) {
        // if the balls are in the boxes
        const group = Object.keys(containers).indexOf(destination);
        if (!groups[destination]) {
          groups[destination] = [1, 1];
          x = pxPerGroup * group;
        } else {
          if (groups[destination][0] >= itemsPerGroupRow) {
            groups[destination][0] = 1;
            groups[destination][1]++;
            x = 0;
          } else {
            x = pxPerGroup * group + (BolitaSize * groups[destination][0]);
            groups[destination][0]++;
          }
        }
        y = startHeight - (BolitaSize * groups[destination][1]);

        if (!destination) {
          x = startWidth;
          y = 10;
        }

      } else {
        // the default view with balls in the top
        if ((index / itemsPerLine) % 1 === 0) {
          y += BolitaSize;
          x = startWidth;
        } else {
          x += BolitaSize;
        }
      }

      item.current = (description - 1) === item.id;

      item.y = y + 'px';
      item.x = x + 'px';
      item.size = BolitaSize;

      return (
        <Bolita {...item} callback={this.showDescription} key={index} />
      )
    });
  }

  showDescription(id) {
    this.setState({ description: id });
  }

  getBoxes() {
    const { boxes } = this.state;
    return boxes.map((item, index) => {
      return (
        <Box key={index}>{item}</Box>
      );
    })
  }

  handleChange() {
    this.setState({ run: !this.state.run });
  }

  getDescription() {
    const { data, description, run } = this.state;
    if (description) {
      const item = data[description - 1];
      return (
        <div className={cx(s.description, { [s.description__open]: run })}>
          <header>
            <h3 className={s.name}>{item.name}</h3>
            <button className={s.closeButton} onClick={this.showDescription.bind(this, false)}>X</button>
          </header>
          <div dangerouslySetInnerHTML={{ __html: md.render(String(item.description)) }} />
        </div>
      )
    }
  }

  render() {
    const bolitas = this.getBolitas();
    const boxes = this.getBoxes();
    const description = this.getDescription();

    return (
      <div className={s.container}>
        <div className={s.wrap}>
          <aside className={s.sidebar}>
            <button className={s.button} onClick={this.handleChange.bind(this, 'hoi')}>HOY</button>
            <button className={s.button} onClick={this.handleChange.bind(this, 'hoi')}>EN 2018</button>
          </aside>
          <div className={s.items} ref={ c => this.items = c }>
            <div className={s.cloud}>
              {bolitas}
            </div>
            <div className={s.boxes}>
              {boxes}
            </div>
          </div>
        </div>
        {description}
      </div>
    )
  }
}

export default Base;