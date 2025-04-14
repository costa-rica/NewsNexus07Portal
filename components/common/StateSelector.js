// components/common/StateSelector.js
import { useState } from "react";
import styles from "../../styles/StateSelector.module.css"; // optional

export default function StateSelector({ stateArray, setStateArray }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleSelect = (stateId) => {
    const updated = stateArray.map((st) =>
      st.id === stateId ? { ...st, selected: !st.selected } : st
    );
    setStateArray(updated);
  };

  const selectedStates = stateArray.filter((st) => st.selected);

  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selectorInput} onClick={() => setIsOpen(true)}>
        {selectedStates.length > 0
          ? selectedStates.map((st) => st.name).join(", ")
          : "Select states..."}
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
            {stateArray.map((state) => (
              <div
                key={state.id}
                className={styles.dropdownItem}
                onClick={() => handleToggleSelect(state.id)}
              >
                <input type="checkbox" readOnly checked={state.selected} />
                {state.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
