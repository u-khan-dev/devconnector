import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getPost } from '../../store/actions/post.actions.js';
import PropTypes from 'prop-types';
import PostItem from '../posts/PostItem';
import CommentItem from './CommentItem';
import CommentForm from './CommentForm';

const Post = ({ getPost, post: { post, loading }, match }) => {
  useEffect(() => {
    getPost(match.params.id);
  }, [getPost, match]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <>
      <Link to="/posts" className="btn">
        Back to Posts
      </Link>
      <PostItem showActions={false} post={post} />
      <CommentForm postId={post._id} />
      <div class="comments">
        {post.comments.map(comment => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </>
  );
};

Post.propTypes = {
  getPost: PropTypes.func.isRequired,
  post: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  post: state.post
});

export default connect(mapStateToProps, { getPost })(Post);
