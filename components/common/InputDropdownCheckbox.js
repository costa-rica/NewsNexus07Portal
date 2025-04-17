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
  const [searchText, setSearchText] = useState("");
  const handleToggleSelect = (stateId) => {
    const updated = inputObjectArray.map((elem) =>
      elem.id === stateId ? { ...elem, selected: !elem.selected } : elem
    );
    setInputObjectArray(updated);
  };

  const selectedElements = inputObjectArray.filter((elem) => elem.selected);
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };
  const filteredItems = inputObjectArray.filter((elem) =>
    elem[displayName].toLowerCase().includes(searchText.toLowerCase())
  );
  return (
    <div className={styles.selectorContainer}>
      <div className={styles.selectorInput} onClick={() => setIsOpen(true)}>
        {selectedElements.length > 0
          ? selectedElements.map((elem) => elem.name).join(", ")
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
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            className={styles.searchInput}
            placeholder="Search..."
          />
          <div className={styles.dropdownList}>
            {filteredItems.map((elem) => (
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
