import { Button, Searcher, Checkbox } from "@/components";

const Header = () => {
  const IS_ACTIVE = true;
  const ACTIVE_USER = "Agustín Formoso";

  return (
    <div className="header">
      <div className="header__actions">
        <Button>
          Productos con bajo stock <span>1</span>
        </Button>

        <Button>Cargar productos</Button>
      </div>

      <div className="header__searcher">
        <Searcher />

        <div>
          <Checkbox>Desactivar lector</Checkbox>
          <Checkbox>Buscar por código</Checkbox>
        </div>
      </div>

      <div className="header__active-user">
        <p>
          <span>Usuario activo:</span> {ACTIVE_USER}
        </p>
        <p>Domingo 11 de Mayo</p>

        {IS_ACTIVE ? (
          <Button color="red">Finalizar día</Button>
        ) : (
          <Button>Finalizar día</Button>
        )}
      </div>
    </div>
  );
};

export default Header;
