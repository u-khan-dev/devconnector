import { useState } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addEducation } from '../../store/actions/profile.actions';

const AddEducation = ({ addEducation, history }) => {
  const initialState = {
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    current: false,
    to: '',
    description: ''
  };

  const [formData, setFormData] = useState(initialState);
  const [toDateDisabled, toggleToDateDisabled] = useState(false);

  const { school, degree, fieldofstudy, from, to, current, description } =
    formData;

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCurrent = () => {
    setFormData({ ...formData, current: !current });
    toggleToDateDisabled(!toDateDisabled);
  };

  const handleSubmit = e => {
    e.preventDefault();
    addEducation(formData, history);
  };

  return (
    <>
      <h1 className="large text-primary">Add Your Education</h1>

      <p className="lead">
        <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc
        that you have attended
      </p>

      <small>* = required field</small>

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            name="school"
            value={school}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            name="degree"
            value={degree}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Field Of Study"
            name="fieldofstudy"
            value={fieldofstudy}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <h4>* From Date</h4>
          <input type="date" name="from" value={from} onChange={handleChange} />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              name="current"
              value={current}
              checked={current}
              onChange={handleCurrent}
            />{' '}
            Current School or Bootcamp
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            name="to"
            value={to}
            onChange={handleChange}
            disabled={current ? 'disabled' : ''}
          />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={handleChange}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link to="dashboard" className="btn btn-light my-1">
          Go Back
        </Link>
      </form>
    </>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(withRouter(AddEducation));
