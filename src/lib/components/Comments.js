import React from 'react';


class CommentsForm extends React.Component {
  render() {
    return (
      <div className="form-group w-100 p-3">
        <label htmlFor="inputCommentaries">
          Comentarios:
        </label>
        <textarea
          type="text"
          value={this.props.commentaries}
          onChange={(e) => this.props.changeComment(e.target.value)}
          id="inputCommentaries"
          className="form-control w-100" />
      </div>
    );
  }
}

export default CommentsForm
