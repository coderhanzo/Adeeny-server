import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
}) => {
  // Handle modal dismiss when clicking outside
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={handleOverlayClick} // Dismiss modal on click outside
    >
      <div className="bg-white rounded-lg shadow-lg w-[90%] sm:w-[400px]">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold">{title}</h3>
        </div>
        <div className="p-4">
          <p>{content}</p>
        </div>
        <div className="p-4 flex justify-end gap-2">
          {onConfirm && (
            <button
              onClick={onConfirm}
              className=" bg-primary text-white rounded hover:bg-gray-600 transition h-10 w-15"
            >
              {confirmLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className=" bg-primary text-white rounded hover:bg-gray-600 transition h-10 w-15"
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;