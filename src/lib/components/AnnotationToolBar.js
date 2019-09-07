import React from 'react';


class AnnotationToolBar extends React.Component {
  render() {
    let options = ''
    if ((this.props.info.length || 0) > 0) {
      options = this.props.info.map((data) => this.renderAnnotationTypeOption(data));
    }

    return (
      <div className="col rounded border p-1">
        <div className="d-inline mx-1">
          Tipo de anotación:
        </div>
        {options}
      </div>
    );
  }

  renderAnnotationTypeOption(data) {
    let className = "border p-2 mx-1 shadow-sm btn ";

    if (this.props.active && this.props.selected === data.annotation_type) {
      className += 'btn-primary';
    } else {
      className += 'btn-light';
    }

    let content;
    if (data.icon) {
      content = (
        <img src={data.icon} alt="Logo tipo de anotación" style={{width: '100%'}}/>
      );
    } else {
      content = (
        <small>
          {data.annotation_type}
        </small>
      );
    }

    return (
      <div
        className={className}
        style={{width: '2.5em'}}
        onClick={() => this.selectAnnotationType(data.annotation_type)}
      >
        {content}
      </div>
    );
  }

  selectAnnotationType(annotationType) {
    if (this.props.selected !== annotationType || !(this.props.active)) {
      this.props.select(annotationType);
    }
  }
}

export default AnnotationToolBar;
