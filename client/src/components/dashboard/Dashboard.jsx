import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  deleteAccount,
  getCurrentProfile
} from '../../store/actions/profile.actions.js';
import DashboardLinker from './DashboardLinker.jsx';
import Experience from './Experience.jsx';
import Education from './Education.jsx';
import Spinner from '../layout/Spinner';

const Dashboard = ({
  auth: { user },
  profile: { profile, loading },
  getCurrentProfile,
  deleteAccount
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user"></i>
        {`Welcome ${user && user.name}`}
      </p>
      {profile !== null ? (
        <>
          <DashboardLinker />
          <Experience experience={profile.experience} />
          <Education education={profile.education} />

          <div className="my-2">
            <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus"></i> Delete My Account
            </button>
          </div>
        </>
      ) : (
        <>
          <p>You haven't set up a profile; please add one.</p>
          <Link to="/create-profile" className="btn btn-primary my-1">
            Create Profile
          </Link>
        </>
      )}
    </>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Dashboard
);
