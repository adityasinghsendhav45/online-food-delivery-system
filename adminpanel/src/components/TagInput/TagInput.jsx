import React from 'react';
import './TagInput.css';

const TagInput = ({ tags, setTags }) => {
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="tag-input-container">
      {tags.map((tag, index) => (
        <span key={index} className="badge bg-secondary me-2 mb-2">
          {tag}
          <button type="button" className="btn-close btn-close-white ms-2" onClick={() => removeTag(tag)}></button>
        </span>
      ))}
    </div>
  );
};

export default TagInput;