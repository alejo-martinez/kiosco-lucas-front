"use client";

import { useRef } from "react";

const Modal = ({ children, className, closable, isOpen, setIsOpen, title }) => {
  const modalRef = useRef(null);

  const handleCloseModal = (e) => {
    if (e.target === e.currentTarget) {
      if (modalRef.current) {
        setIsOpen(false);
      }
    }
  };

  return (
    <div
      ref={modalRef}
      className={`modal-overlay${isOpen ? " modal-overlay--is-open" : ""}`}
      onClick={closable ? handleCloseModal : undefined}
    >
      <div
        className={`modal${className ? ` ${className}` : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal__title">
          <p>{title}</p>
          {closable && (
            <div
              className="modal__close-button"
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
          )}
        </div>
        <div className="modal__content">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
