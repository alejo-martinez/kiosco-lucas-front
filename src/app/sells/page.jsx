import { Sales, Dropdown, DropdownItem } from "@/components";

const Sells = () => {
  return (
    <div className="sells">
      <Dropdown placeholder="Selecciona un usuario">
        <DropdownItem>Lucas</DropdownItem>
        <DropdownItem>Rodrigo</DropdownItem>
        <DropdownItem>Matías</DropdownItem>
      </Dropdown>

      <Sales />
    </div>
  );
};

export default Sells;
