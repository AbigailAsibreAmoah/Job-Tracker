import React, { useState } from 'react';

const DeleteModal = ({ onConfirm, onCancel }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleDelete = () => {
    if (dontShowAgain) {
      localStorage.setItem('dontAskDeleteConfirm', 'true');
    }
    onConfirm();
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Delete this application?</h3>
        <p>Are you sure you want to delete this application?</p>
        
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
          />
          Don't show this warning again
        </label>

        <div className="modal-actions">
          <button onClick={handleDelete} className="btn-delete-confirm">Delete</button>
          <button onClick={onCancel} className="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
