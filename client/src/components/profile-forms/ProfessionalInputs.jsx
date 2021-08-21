import { profileFormInputs } from './formInputs.js';
import { v4 as uuidv4 } from 'uuid';
import ProfessionalInput from './ProfessionalInput';

const ProfessionalInputs = ({ formData, handleChange }) => {
  return (
    <>
      {profileFormInputs
        .filter(input => input.category === 'professional')
        .map(input => (
          <ProfessionalInput
            key={uuidv4()}
            name={input.name}
            placeholder={input.placeholder}
            description={input.description}
            handleChange={handleChange}
            formData={formData}
          />
        ))}
    </>
  );
};

export default ProfessionalInputs;
