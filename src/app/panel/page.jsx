"use client"; // PREGUNTARLE AL POBRE

import { Stock, Dropdown, DropdownItem } from "@/components";

const Panel = () => {
  return (
    <div className="panel">
      <Dropdown placeholder="Selecciona un filtro">
        <DropdownItem>Menor stock</DropdownItem>
        <DropdownItem>Mayor stock</DropdownItem>
        <DropdownItem>A-Z</DropdownItem>
        <DropdownItem>Z-A</DropdownItem>
      </Dropdown>
      <Stock />
    </div>
  );
};

export default Panel;
