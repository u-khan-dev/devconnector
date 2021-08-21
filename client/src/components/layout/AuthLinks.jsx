import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../store/actions/auth.actions.js';

const AuthLinks = ({ logout }) => {
  return (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>
      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>
          <span className="hide-sm"> Dashboard</span>
        </Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>
          <span className="hide-sm"> Logout</span>
        </a>
      </li>
    </ul>
  );
};

AuthLinks.propTypes = {
  logout: PropTypes.func.isRequired
};

export default connect(null, { logout })(AuthLinks);
