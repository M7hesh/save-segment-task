import React, { useState, useEffect, useRef } from "react";
import "./dropdown.css";

function Dropdown({
  options = [],
  selected = [],
  onSelect = () => {},
  placeholder = "",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-header" onClick={() => setOpen(!open)}>
        {selected?.value ? selected.label : placeholder}
        <span className="arrow">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <ul className="dropdown-list">
          {options?.length ? (
            options?.map((opt) => (
              <li
                key={opt?.value}
                className={`dropdown-item ${
                  selected?.value === opt?.value ? "selected" : ""
                }`}
                onClick={() => {
                  onSelect(opt);
                  setOpen(false);
                }}
              >
                {opt?.label}
              </li>
            ))
          ) : (
            <li className="dropdown-no-items">No Data Available</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
