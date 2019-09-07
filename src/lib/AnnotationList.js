import React from 'react';
import VisualizerControler from './list/VisualizerControler';


class AnnotationList extends React.Component {
  STARTING_PAGE = 1;

  constructor(props) {
    super(props);

    this.pageSize = 6;
    this.state = {
      page: this.STARTING_PAGE,
      annotationInfo: {},
      selectedAnnotationType: null,
      annotation: null,
    }
  }

  render() {
    let annotator = this.props.components.annotators[this.state.selectedAnnotationType] || null;

    return (
      <div className="container-fluid">
        <div className="row p-2">
          <div className="col-7 p-2">
            <div className="container-fluid w-100 description_object">
              <VisualizerControler
                components={this.props.components}
                annotator={annotator}
                annotation={this.state.annotation}
                info={this.props.info}
              />
            </div>
          </div>
          <div className="col-5 p-2">
            <div className="container-fluid w-100 description_object">
              <div className="row" style={{overflowY: 'auto', height: '35em'}}>
                {this.renderPage()}
              </div>
              {this.renderPaginator()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderPaginator() {
    if (!(this.STARTING_PAGE in this.state.annotationInfo)) {
      return '';
    }

    let page = this.state.annotationInfo[this.STARTING_PAGE];
    let pages = Math.ceil(page.count / this.pageSize);

    if (pages === 1) {
      return '';
    }

    let elements = [];
    if (this.state.page === 1) {
      elements.push(
        <li className="page-item disabled">
          <div className="page-link" tabIndex="-1" aria-disabled="true">
            <i className="fas fa-angle-left"></i>
          </div>
        </li>
      )
    } else {
      elements.push(
        <li className="page-item">
          <div
            className="page-link"
            onClick={() => this.changePage(this.state.page - 1)}
          >
            <i className="fas fa-angle-left"></i>
          </div>
        </li>
      )
    }

    for (let pageNum = 1; pageNum <= pages; pageNum++) {
      if (this.state.page === pageNum) {
        elements.push(
          <li className="page-item active" aria-current="page">
            <div className="page-link">
              {pageNum} <span className="sr-only">(current)</span>
            </div>
          </li>
        )
      } else {
        elements.push(
          <li className="page-item">
            <div className="page-link" onClick={() => this.changePage(pageNum)}>
              {pageNum}
            </div>
          </li>
        )
      }
    }

    if (this.state.page === pages) {
      elements.push(
        <li className="page-item disabled">
          <div className="page-link" tabIndex="-1" aria-disabled="true">
            <i className="fas fa-angle-right"></i>
          </div>
        </li>
      )
    } else {
      elements.push(
        <li className="page-item">
          <div
            className="page-link"
            onClick={() => this.changePage(this.state.page + 1)}
          >
            <i className="fas fa-angle-right"></i>
          </div>
        </li>
      )
    }

    return (
      <nav className="w-100 p-2" aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          {elements}
        </ul>
      </nav>
    )
  }

  renderPage() {
    if (!(this.state.page in this.state.annotationInfo)) {
      return this.renderLoadingPage();
    }

    let pageInfo = this.state.annotationInfo[this.state.page];
    let annotations = pageInfo.results;

    if (annotations.length === 0) {
      return this.renderEmptyList();
    }

    let annotationListItems = annotations.map(
      (annotation) => this.renderAnnotationItem(annotation));

    return (
      <div className="container-fluid bg-light p-0 list-group my-4">
        {annotationListItems}
      </div>
    );
  }

  changePage(page) {
    if (!(page in this.state.annotationInfo)){
      this.loadAnnotations(page);
    }

    this.setState({page: page});
  }

  getAnnotationTypeInfo(annotation_type) {
    let annotationTypes = this.props.info.annotationTypes
    for (var index = 0; index < annotationTypes.length; index++) {
      let annotation = annotationTypes[index];

      if (annotation.annotation_type === annotation_type) {
        return annotation;
      }
    }
  }

  getEventTypeInfo(event_type) {
    let eventTypes = this.props.info.itemType.event_types
    for (var index = 0; index < eventTypes.length; index++) {
      let eventType = eventTypes[index];

      if (eventType.name === event_type) {
        return eventType;
      }
    }
  }

  renderAnnotationItem(annotation) {
    let annotationTypeInfo = this.getAnnotationTypeInfo(annotation.annotation_type);
    let eventTypeInfo = this.getEventTypeInfo(annotation.event_type);
    let date = new Date(annotation.created_on);

    let annotationType;
    if (annotationTypeInfo.icon) {
      annotationType = (
        <img src={annotationTypeInfo.icon} alt="Logo tipo de anotación" style={{width: '3em'}}/>
      );
    } else {
      annotationType = (
        <p>{annotation.annotation_type}</p>
      )
    }

    let eventType;
    if (eventTypeInfo.icon) {
      eventType = (
        <img src={eventTypeInfo.icon} alt="Logo tipo de evento" style={{width: '3em'}}/>
      );
    } else {
      eventType = (
        <p>{annotation.event_type}</p>
      )
    }

    let isSelected = this.props.selectedAnnotation === annotation.id;
    let className = isSelected ? 'm-1 lavander-dark list_item' : 'm-1 list_item';

    return (
      <div
        className={className}
        onClick={() => this.selectAnnotation(annotation)}
      >
        <div className="row px-3">
          <div className="col-2">
            {annotationType}
          </div>
          <div className="col-2">
            {eventType}
          </div>
          <div className="col-8">
            {this.renderLabels(annotation.labels)}
          </div>
        </div>
        <div className="row d-flex justify-content-end">
          <small className="text-muted mx-2">
            Creado el {date.toLocaleString()}
          </small>
          <small className="text-muted mx-2">
            Creado por {annotation.created_by.username}
          </small>
          <small
            className="btn-link text-primary mx-2"
            onClick={() => this.editAnnotation(annotation)}
          >
            Editar <i className="fas fa-edit"></i>
          </small>
        </div>
      </div>
    )
  }

  editAnnotation(annotation) {
    this.setState({
      annotation: annotation.annotation,
      selectedAnnotationType: annotation.annotation_type,
    });
    this.props.editAnnotation(annotation.id);
  }

  selectAnnotation(annotation) {
    this.setState({
      annotation: annotation.annotation,
      selectedAnnotationType: annotation.annotation_type,
    });
    this.props.selectAnnotation(annotation.id);
  }

  renderLabels(labels) {
    return labels.map((label) => {
      return (
        <span className="badge badge-dark m-1">{label.value}</span>
      )
    })
  }

  renderEmptyList() {
    return (
      <div className="d-flex flex-column justify-content-center" style={{height: '20em'}}>
        <div className="jumbotron">
          <h5 className="text-center w-100">Este artículo no tiene anotaciónes</h5>
          <p className="btn btn-link text-center w-100" onClick={() => this.props.goToCreate()}>
            Crear nueva anotación
          </p>
        </div>
      </div>
    )
  }

  renderLoadingPage() {
    return (
      <div className="d-flex flex-column justify-content-center w-100 h-100">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" style={{width: '5rem', height: '5rem'}}>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <div className="w-100 text-center text-muted my-4">
          Cargando anotaciones...
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.loadAnnotations(this.STARTING_PAGE);
  }

  loadAnnotations(page) {
    let url = this.props.urls['annotations'] + `?page=${page}&page_size=${this.pageSize}`;

    fetch(url)
      .then(result => result.json())
      .then(result => {
        this.setState((state) => {
          state.annotationInfo[page] = result;
          return state;
        });
      });
  }

}

export default AnnotationList;
