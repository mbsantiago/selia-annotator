import React from 'react';



const QUALITY_FORM_HELP = 'Selecciona la calidad de contenido del artículo'
const QUALITY_OPTIONS = [
  ['L', 'baja'],
  ['M', 'media'],
  ['H', 'alta'],
]

const CERTAINTY_FORM_HELP = 'Selecciona el nivel de certeza del etiquetado'
const CERTAINTY_OPTIONS = [
  ['L', 'inseguro'],
  ['M', 'medianamente seguro'],
  ['H', 'seguro'],
]


class QualityAndCertaintyForm extends React.Component {
  bootstrapRadio(value, label, checked, onClickFunction) {
      return (
        <div className="form-check">
          <label className="form-check-label" htmlFor={`${label}Radio`}>
            <input
              className="form-check-input"
              type="radio"
              id={`${label}Radio`}
              value={value}
              onChange={onClickFunction}
              checked={checked}
            />
            {label}
          </label>
        </div>
      )
  }

  renderColumn(title, contents, helpText) {
    return (
      <div className="container-fluid">
        <div className="row">
          <p className="mb-0">{title}:</p>
        </div>
        <div className="row">
          <div className="col">
            {contents}
          </div>
        </div>
        <div className="row">
          <small className="text-muted">{helpText}</small>
        </div>
      </div>
    );
  }

  renderQualityOptions() {
    let options = QUALITY_OPTIONS.map(([value, label], i) => {
      return this.bootstrapRadio(
        value,
        label,
        this.props.quality === value,
        () => this.props.changeQuality(value))
    })

    return this.renderColumn('Calidad', options, QUALITY_FORM_HELP);
  }

  renderCertaintyOptions() {
    let options = CERTAINTY_OPTIONS.map(([value, label], i) => {
      return this.bootstrapRadio(
        value,
        label,
        this.props.certainty === value,
        () => this.props.changeCertainty(value))
    })

    return this.renderColumn('Certeza', options, CERTAINTY_FORM_HELP);
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col">
            {this.renderQualityOptions()}
          </div>
          <div className="col">
            {this.renderCertaintyOptions()}
          </div>
        </div>
      </div>
    )
  }
}

export default QualityAndCertaintyForm
