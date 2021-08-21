const BioInput = ({ formData: { bio }, handleChange }) => {
  return (
    <div className="form-group">
      <textarea
        placeholder="A short bio of yourself"
        name="bio"
        onChange={handleChange}
        value={bio}
      ></textarea>
      <small className="form-text">Tell us a little about yourself</small>
    </div>
  );
};

export default BioInput;
