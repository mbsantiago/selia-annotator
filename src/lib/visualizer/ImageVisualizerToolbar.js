import React from 'react';


class ImageVisualizerToolbar extends React.Component {
  render() {
    return (
      <div className="col p-2">
        {this.renderMoveButton()}
        {this.renderHomeButton()}
      </div>
    );
  }

  renderMoveButton() {
    let className = this.props.active ? "btn btn-primary m-1" : "btn btn-light m-1";

    return (
      <button
        type="button"
        className={className}
        onClick={() => this.handleMove()}
      >
        <i className="fas fa-arrows-alt"></i>
      </button>
    );
  }

  renderHomeButton() {
    return (
      <button
        type="button"
        className="btn btn-light m-1"
        onClick={() => this.handleHome()}
      >
        <i className="fas fa-home"></i>
      </button>
    );
  }

  handleMove() {
    this.props.activator();
    this.forceUpdate();
  }

  handleHome() {
    this.props.home()
  }
}


export default ImageVisualizerToolbar;
