"use client";

import { Button, Cart, Input, Modal, Payment } from "@/components";

const Home = () => {
  return (
    <div className="home">
      <div>
        <Cart />
        <Payment />

        <Modal closable={true} isOpen={false} title="Agregar stock">
          <Input placeholder="Cantidad" type="number" />

          <div>
            <Button color="red">Cancelar</Button>
            <Button color="green">Aceptar</Button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Home;
