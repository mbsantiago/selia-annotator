import React from 'react';
import AnnotationCreator from './AnnotationCreator';
import AnnotationList from './AnnotationList';
import AnnotationDetail from './AnnotationDetail';

import ImageVisualizer from './visualizer/imageVisualizer';
import PointAnnotator from './visualizer/PointAnnotator';
import BoundingBoxAnnotator from './visualizer/BoundingBox';


class Annotator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phase: 'list',
      selectedAnnotation: null,
      ready: {
        item: false,
        annotationTypes: false,
        visualizer: false,
        annotators: false,
        itemType: false,
      },
      info: {
        itemType: {},
        item: {},
        annotationTypes: {},
      },
      components: {
        visualizer: {},
        annotators: {},
      }
    }
  }

  render() {
    return (
      <div className="container-fluid p-0">
        {this.renderTabs()}
        {this.renderContent()}
      </div>
    );
  }

  renderTabs() {
    let tabs = [
      ['list', (<span className="px-5">Lista <i className="fas fa-list"></i></span>)],
      ['create', (<span className="px-5">Crear <i className="fas fa-plus"></i></span>)]
    ]
    if (this.state.selectedAnnotation) {
      tabs.push(['detail', (<span className="px-5">Detalle <i className="fas fa-info"></i></span>)]);
    }

    let tabsHtml = tabs.map(([phase, label]) => {
      let selected = this.state.phase === phase;
      let className = (selected) ? "light-green nav-link active" : "nav-link";
      return (
        <li className="nav-item" onClick={() => this.setState({phase: phase})}>
          <div className={className}>{label}</div>
        </li>
      );
    });

    return (
      <ul className="nav nav-tabs pt-2 bg-light justify-content-center">
        {tabsHtml}
      </ul>
    );
  }

  renderContent() {
    if (!(this.isReady())) {
      return this.renderIsNotReady();
    }

    switch (this.state.phase) {
      case 'list':
        return (
          <AnnotationList
            info={this.state.info}
            urls={this.props.urls}
            selectedAnnotation={this.state.selectedAnnotation}
            components={this.state.components}
            goToCreate={() => this.setState({phase: 'create'})}
            selectAnnotation={annotation => this.setState({selectedAnnotation: annotation})}
            editAnnotation={annotation => this.setState({
              phase: 'detail',
              selectedAnnotation : annotation
            })}
          />
        );
      case 'create':
        return (
          <AnnotationCreator
            info={this.state.info}
            urls={this.props.urls}
            components={this.state.components}
            changePhase={() => this.setState({phase: 'list'})}
          />
        );
      case 'detail':
        return (
          <AnnotationDetail
            info={this.state.info}
            urls={this.props.urls}
            selectedAnnotation={this.state.selectedAnnotation}
            components={this.state.components}
            changePhase={() => this.setState({phase: 'list'})}
          />
        );
      default:
        return '';
    }
  }

  renderIsNotReady() {
    return (
      <div className="container-fluid bg-light">
        <div className="d-flex flex-column" style={{height: '20em'}}>
          <div className="d-flex justify-content-center p-4">
            <div className="spinner-border" style={{height: '10em', width: '10em'}} role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
          <div className="text-muted w-100 text-center">
            Porfavor espera en lo que cargamos la información
          </div>
        </div>
      </div>
    );
  }

  getAnnotationTypesInfo() {
    let url = this.props.urls['annotation_types'] + '?page_size=99'

    fetch(url)
      .then(result => result.json())
      .then(result => {
        this.setState(state => {
          state.info.annotationTypes = result.results;
          state.ready.annotationTypes = true;
          return state;
        })
      })
  }

  getItemInfo() {
    let url = this.props.urls['item']

    return fetch(url)
      .then(result => result.json())
      .then(result => {
        this.setState((state) => {
          state.info.item = result;
          state.ready.item = true;
          return state;
        });
      })
  }

  getItemTypeInfo() {
    let url = this.props.urls['item_type']

    fetch(url)
      .then(result => result.json())
      .then(result => {
        this.setState((state) => {
          state.info.itemType = result;
          state.ready.itemType = true;
          return state;
        });
      });
  }

  getVisualizer() {
    this.setState(state => {
      state.components.visualizer = ImageVisualizer;
      state.ready.visualizer = true;
      return state;
    })
  }

  getAnnotationTools() {
    this.setState(state => {
      state.components.annotators = {
        'Bounding Box': BoundingBoxAnnotator,
        'Punto': PointAnnotator,
      }
      state.ready.annotators = true;
      return state;
    })
  }

  componentDidMount() {
    this.getItemTypeInfo();
    this.getItemInfo();
    this.getAnnotationTypesInfo();
    this.getVisualizer();
    this.getAnnotationTools();
  }

  isReady() {
    for (let key in this.state.ready){
      if (!(this.state.ready[key])) {
        return false;
      }
    }
    return true;
  }
}

export default Annotator;
