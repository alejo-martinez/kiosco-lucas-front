import Link from "next/link";

const Pagination = ({ pagination, url, filters }) => {
  const {
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    page = 1,
    totalPages = 1,
  } = pagination;

  const buildURL = (queryPage) => {
    const params = new URLSearchParams();
    params.set("query", queryPage);
    if (filters) {
      if (filters.filterParam && filters.valueFilterParam) {
        params.set("filter", filters.filterParam);
        params.set("valueFilter", filters.valueFilterParam);
      }
      if (filters.user) {
        params.set("user", filters.user);
      }
    }
    return `${url}?${params.toString()}`;
  };

  return (
    <div className="pagination">
      {hasPrevPage && (
        <button>
          <Link className="no-decoration" href={buildURL(prevPage)}>
            <i className="fa-solid fa-chevron-left"></i>
            <span>Anterior</span>
          </Link>
        </button>
      )}

      {prevPage && prevPage !== page && (
        <button>
          <Link className="no-decoration" href={buildURL(prevPage)}>
            {prevPage}
          </Link>
        </button>
      )}

      <button className="pagination__active">{page}</button>

      {nextPage && nextPage !== page && (
        <button>
          <Link className="no-decoration" href={buildURL(nextPage)}>
            {nextPage}
          </Link>
        </button>
      )}

      {hasNextPage && (
        <button>
          <Link className="no-decoration" href={buildURL(nextPage)}>
            <span>Siguiente</span>
            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        </button>
      )}
    </div>
  );
};

export default Pagination;
