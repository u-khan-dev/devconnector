const SocialToggleButton = ({ handleSocialClick }) => {
  return (
    <div className="my-2">
      <button
        type="button"
        className="btn btn-light"
        onClick={handleSocialClick}
      >
        Add Social Network Links
      </button>
      <span>Optional</span>
    </div>
  );
};

export default SocialToggleButton;
