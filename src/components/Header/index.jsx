'use client';

import { Button, Searcher, Checkbox } from "@/components";
import { useSession } from "@/context/SessionContext";
import { useProduct } from "@/context/ProductContext";
import { useResume } from "@/context/ResumeContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const rodrigoId = process.env.NEXT_PUBLIC_RODRIGO_ID

  const { resumeId, initDay, endDay, setShowExpenseModal } = useResume();
  const { user } = useSession();
  const { addStockModal, setAddStockModal, lowStockProducts, searchProductByCode, setSearchProductByCode, searchProductByTitle, setSearchProductByTitle } = useProduct();

  const [actualDate, setActualDate] = useState(null)


  const init = (e) => {
    e.preventDefault();
    initDay();
  }

  const end = async (e) => {
    try {
      e.preventDefault();

      const response = await endDay();
      if (response.status === 'status') {
        toast.success('Jornada finalizada!', {
          autoClose: 2000,
          closeButton: true,
          hideProgressBar: true,
          className: 'toast-success'
        })
      }
      router.push(`/resumes/diary/${response.resumeId}`)
    } catch (error) {
      toast.error(error.message, {
        autoClose: 2000,
        pauseOnFocusLoss: false,
        pauseOnHover: false,
        hideProgressBar: true,
        closeButton: false,
        className: 'toast-error'
      })
    }
  }

  const formatDateForUser = () => {
    const date = new Date();
    const options = { weekday: "long", day: "numeric", month: "long" };
    setActualDate(date.toLocaleDateString("es-ES", options))
  };


  const navigateToLowProducts = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('query', 1);
    params.set('filter', 'stock');
    params.set('valueFilter', 1);

    router.push(`/panel?${params.toString()}`)
  }

  const openExpenseModal = () => {
    setShowExpenseModal(true)
  }

  const handleCheckboxChange = (e) => {
    setSearchProductByCode(e.target.checked);
  };

  const handleCheckboxChangeTitle = (e) => {
    setSearchProductByTitle(e.target.checked);
  }


  useEffect(() => {
    formatDateForUser();
  })

  const openStockModal = (e) => {
    e.preventDefault();
    setAddStockModal(true);
  }


  return (
    <div className="header">
      <div className="header__actions">
        {(user?._id === rodrigoId || user?.role === 'admin' || user?.role === 'god') && (
          <>
            {(pathname === '/') && (
              <>
                <Button onClick={navigateToLowProducts}>
                  Productos con bajo stock <span>{lowStockProducts.length > 9 ? '+9' : lowStockProducts.length}</span>
                </Button>

                <Button onClick={openStockModal}>Cargar productos</Button>
              </>
            )}

            {(user?.role !== 'admin' || user?.role === 'god') && (
              <Button onClick={openExpenseModal}>Agregar consumo</Button>
            )}
          </>
        )}
      </div>


      {(pathname === '/panel' || pathname === '/') &&
        <div className="header__searcher">
          <Searcher />

          <div>
            {/* <Checkbox>Desactivar lector</Checkbox> */}
            <Checkbox checked={searchProductByCode} onChange={handleCheckboxChange}>Buscar por código</Checkbox>
            {pathname === '/panel' &&
              <Checkbox checked={searchProductByTitle} onChange={handleCheckboxChangeTitle}>Buscar por nombre</Checkbox>
            }
          </div>
        </div>
      }

      <div className="header__active-user">
        <p>
          <span>Usuario activo:</span> {user?.name}
        </p>
        <p>{actualDate && actualDate}</p>

        {resumeId ? (
          <Button color="red" onClick={end}>Finalizar jornada</Button>
        ) : (
          <Button color="green" onClick={init}>Iniciar jornada</Button>
        )}
      </div>
    </div>
  );
};

export default Header;
