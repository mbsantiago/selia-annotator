import React from 'react';
import FormControler from '../components/FormControler';


class FormControlerUpdate extends FormControler {
  renderExtra() {
      return (
        <div className="row d-flex justify-content-end px-2">
          <div className="btn btn-light text-primary" onClick={() => this.restore()}>
            Restaurar <i className="fas fa-undo"></i>
          </div>
        </div>
      )
  }

  restore() {
    this.setState(this.createInitialState(), () => {
      if (this.labelsNode) {
        this.labelsNode.initLabels();
      }
    });
  }

  renderSubmitButton() {
    var changeButton, unready;

    if (this.props.ready) {
      changeButton = (
        <div className="btn btn-link" onClick={() => this.props.submit()}>
          Actualizar
        </div>
      );
    } else {
      changeButton = (
        <div className="btn btn-link disabled">Actualizar</div>
      );
      unready = (
        <div className="d-flex w-100 justify-content-center">
          <span className="text-info">
          Llena toda la información antes de poder actualizar la anotación.
          </span>
        </div>
      )
    }

    let deleteButton = (
      <div className="btn btn-link text-danger" onClick={() => this.props.delete()}>Eliminar</div>
    )

    return (
      <React.Fragment>
        {unready}
        <div className="d-flex w-100 justify-content-center">
          {changeButton} {deleteButton}
        </div>
      </React.Fragment>
    );
  }
}

export default FormControlerUpdate;
