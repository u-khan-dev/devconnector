import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AuthLinks from './AuthLinks';
import GuestLinks from './GuestLinks';

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> DevConnector
        </Link>
      </h1>

      {!loading && <>{isAuthenticated ? <AuthLinks /> : <GuestLinks />}</>}
    </nav>
  );
};

Navbar.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Navbar);
