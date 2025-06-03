const Pagination = () => {
  return (
    <div className="pagination">
      <button>
        <i className="fa-solid fa-chevron-left"></i>
        <span>Anterior</span>
      </button>

      <button>1</button>
      <button className="pagination__active">2</button>
      <button>3</button>

      <button>
        <span>Siguiente</span>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default Pagination;
