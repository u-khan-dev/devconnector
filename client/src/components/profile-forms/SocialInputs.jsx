import { profileFormInputs } from './formInputs.js';
import { v4 as uuidv4 } from 'uuid';
import ProfessionalInput from './ProfessionalInput.jsx';

const SocialInputs = ({ handleChange, formData }) => {
  return (
    <>
      {profileFormInputs
        .filter(input => input.category === 'social')
        .map(input => {
          return (
            <ProfessionalInput
              key={uuidv4()}
              name={input.name}
              placeholder={input.placeholder}
              handleChange={handleChange}
              formData={formData}
            />
          );
        })}
    </>
  );
};

export default SocialInputs;
