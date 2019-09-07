import React from 'react';

import FormControlerUpdate from './detail/FormControlerUpdate';
import VisualizerControler from './detail/VisualizerControler';


class AnnotationDetail extends React.Component {
  constructor(props) {
    super(props);

    this.annotationData = {};
    this.state = {
      ready: false,
      loaded: false,
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row p-2">
          <div className="col-7 p-2">
            <div className="container-fluid w-100 description_object">
              {this.renderVisualizer()}
            </div>
          </div>
          <div className="col-5 p-2">
            <div className="container-fluid w-100 description_object">
              {this.renderForms()}
            </div>
          </div>
        </div>
        {this.renderModals()}
      </div>
    );
  }

  renderModals() {
    let updateSuccessModal = (
      <div className="modal fade" id="updateModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <span className="text-center text-success w-100">Anotación editada correctamente</span>
            </div>
          </div>
        </div>
      </div>
    );

    let updateDeleteModal = (
      <div className="modal fade" id="deleteModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <span className="text-center text-success w-100">Anotación eliminada correctamente</span>
            </div>
          </div>
        </div>
      </div>
    );

    let noPermissionModal = (
      <div className="modal fade" id="noPermissionModal" tabIndex="-1" role="dialog" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <span className="text-center text-danger w-100">Lo sentimos. No tienes permiso para realizar esta acción.</span>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div>
        {updateSuccessModal}
        {updateDeleteModal}
        {noPermissionModal}
      </div>
    )
  }

  renderVisualizer() {
    if (!(this.state.loaded)) {
      return this.renderLoading();
    }

    return (
      <VisualizerControler
        components={this.props.components}
        initial={this.initialData}
        info={this.props.info}
        urls={this.props.urls}
        setAnnotationInfo={(data) => this.setAnnotationData(data)}
      />
    );
  }

  renderForms() {
    if (!(this.state.loaded)) {
      return this.renderLoading();
    }

    return (
        <FormControlerUpdate
          ready={this.state.ready}
          info={this.props.info}
          urls={this.props.urls}
          initial={this.initialData}
          selectType={false}
          setFormInfo={(data) => this.setAnnotationData(data)}
          submit={() => this.submit()}
          delete={() => this.delete()}
        />
      )
  }

  renderLoading() {
    return (
      <div className="d-flex flex-column justify-content-center w-100 h-100">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status" style={{width: '5rem', height: '5rem'}}>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <div className="w-100 text-center text-muted my-4">
          Cargando...
        </div>
      </div>
    )
  }

  renderSuccessDialog() {
    return  (
      <div className="modal fade" id="sucessModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <span className="text-center text-success w-100">Anotación registrada</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  setAnnotationData(data) {
    if ('annotation' in data) {
      this.annotationData['annotation'] = data['annotation'];
    }

    if ('labels' in data) {
      this.annotationData['labels'] = data['labels'];
    }

    if ('commentaries' in data) {
      this.annotationData['commentaries'] = data['commentaries'];
    }

    if ('quality' in data) {
      this.annotationData['quality'] = data['quality'];
    }

    if ('certainty' in data) {
      this.annotationData['certainty'] = data['certainty'];
    }

    if ('annotationConfiguration' in data) {
      this.annotationData['annotation_configuration'] = data['annotationConfiguration'];
    }

    if ('annotation_configuration' in data) {
      this.annotationData['annotation_configuration'] = data['annotation_configuration'];
    }

    this.checkIfReady();
  }

  checkIfReady() {
    let ready = true;
    if (!('annotation' in this.annotationData)) ready = false;
    if (!('labels' in this.annotationData) || this.annotationData.labels.length === 0) ready = false;

    if (!(this.state.ready) && ready) {
      this.setState({ready: true});
    }

    if (this.state.ready && !(ready)) {
      this.setState({ready: false});
    }
  }

  getAnnotationInfo() {
    let url = this.props.urls.annotation_detail.replace(
      'annotation_pk', this.props.selectedAnnotation);

    fetch(url)
      .then(result => result.json())
      .then(result => {
        this.setAnnotationData(result);
        this.initialData = Object.assign({}, result);
        this.setState({loaded: true})
      }
    );
  }

  componentDidMount() {
    this.getAnnotationInfo();
  }

  submit() {
    let url = this.props.urls.annotation_detail.replace(
      'annotation_pk', this.props.selectedAnnotation);
    $.ajax({
      type: "PUT",
      url: url,
      data: JSON.stringify(this.annotationData),
      contentType: 'application/json',
      success: () => this.changeSuccess(),
    }).catch((error) => {
        if (error.status === 403) {
          this.showForbidden();
        }
    });
  }

  delete() {
    let url = this.props.urls.annotation_detail.replace(
      'annotation_pk', this.props.selectedAnnotation);
    $.ajax({
      type: "DELETE",
      url: url,
      contentType: 'application/json',
      success: () => this.deleteSuccess(),
    }).catch((error) => {
        if (error.status === 403) {
          this.showForbidden();
        }
    });
  }

  deleteSuccess() {
    $('#deleteModal').modal('show')
    setTimeout(() => {
      $('#deleteModal').modal('hide');
      setTimeout(() => this.props.changePhase(), 200);
    }, 800)
  }

  changeSuccess(){
    $('#updateModal').modal('show')
    setTimeout(() => {
      $('#updateModal').modal('hide');
      setTimeout(() => this.props.changePhase(), 200);
    }, 800)
  }

  showForbidden() {
    $('#noPermissionModal').modal('show')
    setTimeout(() => {
      $('#noPermissionModal').modal('hide');
    }, 1200)
  }
}

export default AnnotationDetail;
