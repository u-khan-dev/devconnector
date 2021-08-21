import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { deleteComment } from '../../store/actions/post.actions.js';
import formatDate from '../../utils/formatDate.js';

const CommentItem = ({
  postId,
  deleteComment,
  comment: { _id, text, name, avatar, user, date },
  auth
}) => (
  <div className="post bg-white p-1 my-1">
    <div>
      <Link to={`/profile/${user}`}>
        <img className="round-img" src={avatar} alt="avatar" />
        <h4>{name}</h4>
      </Link>
    </div>
    <div>
      <p className="my-1">{text}</p>
      <p className="post-date">Posted on {formatDate(date)}</p>
      {!auth.loading && user === auth.user._id && (
        <button
          className="btn btn-danger"
          onClick={() => deleteComment(postId, _id)}
          type="button"
        >
          <i className="fas fa-times" />
        </button>
      )}
    </div>
  </div>
);

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  deleteComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ auth: state.auth });

export default connect(mapStateToProps, { deleteComment })(CommentItem);
