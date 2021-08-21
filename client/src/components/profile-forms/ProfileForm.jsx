import { useState, useEffect } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  createProfile,
  getCurrentProfile
} from '../../store/actions/profile.actions.js';
import ProfessionalInputs from './ProfessionalInputs';
import StatusInput from './StatusInput';
import BioInput from './BioInput';
import SocialToggleButton from './SocialToggleButton';
import SocialInputs from './SocialInputs';

const initialState = {
  status: '',
  company: '',
  location: '',
  skills: '',
  website: '',
  githubusername: '',
  bio: '',
  twitter: '',
  instagram: '',
  facebook: '',
  youtube: '',
  linkedin: ''
};

const ProfileForm = ({
  profile: { profile, loading },
  createProfile,
  getCurrentProfile,
  history
}) => {
  const [formData, setFormData] = useState(initialState);

  const creatingProfile = useRouteMatch('/create-profile');

  const [displaySocialInputs, toggleSocialInputs] = useState(false);

  useEffect(() => {
    if (!profile) getCurrentProfile();

    if (!loading && profile) {
      const profileData = { ...initialState };

      for (const key in profile)
        if (key in profileData) profileData[key] = profile[key];

      for (const key in profile.social)
        if (key in profileData) profileData[key] = profile.social[key];

      if (Array.isArray(profileData.skills))
        profileData.skills = profileData.skills.join(',');

      setFormData(profileData);
    }
  }, [loading, getCurrentProfile, profile]);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSocialClick = e => {
    e.preventDefault();
    toggleSocialInputs(!displaySocialInputs);
  };

  const handleSubmit = e => {
    e.preventDefault();
    createProfile(formData, history, profile ? true : false);
  };

  return (
    <>
      <h1 className="large text-primary">
        {creatingProfile ? 'Create Your Profile' : 'Edit Your Profile'}
      </h1>
      <p className="lead">
        <i className="fas fa-user"></i> Let's get some information to make your
        profile stand out
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={handleSubmit}>
        <StatusInput formData={formData} handleChange={handleChange} />
        <ProfessionalInputs handleChange={handleChange} formData={formData} />
        <BioInput formData={formData} handleChange={handleChange} />
        <SocialToggleButton handleSocialClick={handleSocialClick} />

        {displaySocialInputs && (
          <SocialInputs handleChange={handleChange} formData={formData} />
        )}

        <input type="submit" className="btn btn-primary my-1" />

        <Link to="/dashboard" className="btn btn-light my-1">
          Go Back
        </Link>
      </form>
    </>
  );
};

ProfileForm.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

//withRouter enables the history object inside of React component
export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  ProfileForm
);
