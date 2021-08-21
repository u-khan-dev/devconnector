import { useState } from 'react';

const ProfessionalInput = props => {
  const { placeholder, name, description, formData, handleChange } = props;

  const [tempValue, setTempValue] = useState(formData[name]);

  const updateItem = e => {
    setTempValue(e.target.value ? e.target.value : '');
  };

  return (
    <div className="form-group">
      <input
        type="text"
        placeholder={placeholder}
        name={name}
        onChange={updateItem}
        onBlur={handleChange}
        value={tempValue}
      />
      <small className="form-text">{description}</small>
    </div>
  );
};

export default ProfessionalInput;
