import React from 'react';

const SuggestionsModal = ({ show, onClose, suggestions, onSelect, onRegenerate, isLoading }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">AI-Generated Suggestions</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {isLoading && suggestions.length === 0 ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <ul className="list-group">
                {suggestions.map((desc, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="me-3">{desc}</span>
                    <button className="btn btn-sm btn-outline-primary" onClick={() => onSelect(desc)}>
                      Select
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={onRegenerate}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Regenerating...
                </>
              ) : (
                'Regenerate'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsModal;