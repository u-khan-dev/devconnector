import { useState } from 'react';

const SocialInput = props => {
  const { placeholder, name, handleChange, formData } = props;

  const [tempValue, setTempValue] = useState(formData[name]);

  const updateItem = e => {
    setTempValue(e.target.value);
  };

  return (
    <div className="form-group social-input">
      <i className={`fab fa-${name} fa-2x`}></i>
      <input
        type="text"
        placeholder={placeholder}
        name={name}
        onChange={updateItem}
        onBlur={handleChange}
        value={tempValue}
      />
    </div>
  );
};

export default SocialInput;
