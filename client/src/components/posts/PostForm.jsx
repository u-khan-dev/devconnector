import { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addPost } from '../../store/actions/post.actions.js';

const PostForm = ({ addPost }) => {
  const [text, setText] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    addPost({ text });
    setText('');
  };

  return (
    <div className="post-form">
      <div className="bg-primary p">
        <h3>Say something...</h3>
      </div>
      <form className="form my-1" onSubmit={handleSubmit}>
        <textarea
          name="text"
          cols="30"
          rows="5"
          placeholder="Comments..."
          value={text}
          onChange={e => setText(e.target.value)}
          required
        ></textarea>
        <input type="submit" className="btn btn-dark my-1" value="Submit" />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired
};

export default connect(null, { addPost })(PostForm);
