// components/common/StateSelector.js
import { useState } from "react";
import styles from "../../styles/StateSelector.module.css"; // optional

export default function InputDropdownCheckbox({
  inputObjectArray,
  setInputObjectArray,
  displayName,
  inputDefaultText = "Select...",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSelect = (stateId) => {
    const updated = inputObjectArray.map((elem) =>
      elem.id === stateId ? { ...elem, selected: !elem.selected } : elem
    );
    setInputObjectArray(updated);
  };

  const selectedStates = inputObjectArray.filter((st) => st.selected);

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selectorInput} onClick={() => setIsOpen(true)}>
        {selectedStates.length > 0
          ? selectedStates.map((st) => st.name).join(", ")
          : inputDefaultText}
      </div>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
            >
              ×
            </button>
          </div>
          <div className={styles.dropdownList}>
            {inputObjectArray.map((elem) => (
              <div
                key={elem.id}
                className={styles.dropdownItem}
                onClick={() => handleToggleSelect(elem.id)}
              >
                <input type="checkbox" readOnly checked={elem.selected} />
                {elem[displayName]}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
