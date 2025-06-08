"use client";

import { useState, useEffect, useRef } from "react";

const DropdownItem = ({ children, onClick, keyId }) => {
  return (
    <div key={keyId} className="dropdown__option" onClick={onClick}>
      <span>{children}</span>
    </div>
  );
};

const Dropdown = ({ children, placeholder, value, modifier, keyId }) => {
  const dropdownRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleOpenDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  
  if (!mounted) return null;
  else return (
    <div
    key={`${keyId}d`}
      ref={dropdownRef}
      className={`dropdown${isOpen ? ` dropdown--is-open` : ""}${
        modifier ? ` dropdown--${modifier}` : ""
      }`}
      onClick={handleOpenDropdown}
    >
      <span>{value || placeholder}</span>
      <div key={`${keyId}i`}>
        <i className="fa-solid fa-chevron-down"></i>
      </div>

      {isOpen && <div key={`${keyId}di`} className="dropdown__options">{children}</div>}
    </div>
  );
};

export { Dropdown, DropdownItem };
