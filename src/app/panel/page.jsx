"use client";

import { Stock, Dropdown, DropdownItem } from "@/components";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

const Panel = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramValue = searchParams.get("query");
  const filterParam = searchParams.get("filter");
  const valueFilterParam = searchParams.get("valueFilter");

  const getFilterLabel = (filter, value) => {
    if (!filter || !value) return 'Selecciona un filtro';

    const filters = {
      stock: {
        "1": "Menor stock",
        "-1": "Mayor stock"
      },
      title: {
        "1": "A-Z",
        "-1": "Z-A"
      }
    };

    return filters[filter]?.[value] || 'Filtro desconocido';
  };

  const addFilter = (e, filter, valueFilter) => {
    e.preventDefault();
    router.push(`/panel?query=${paramValue || 1}&filter=${filter}&valueFilter=${valueFilter}`);
  }

  return (
    <div className="panel">
      <Dropdown placeholder={getFilterLabel(filterParam, valueFilterParam)}>
        <DropdownItem onClick={(e) => addFilter(e, 'stock', '1')}>Menor stock</DropdownItem>
        <DropdownItem onClick={(e) => addFilter(e, 'stock', '-1')}>Mayor stock</DropdownItem>
        <DropdownItem onClick={(e) => addFilter(e, 'title', '1')}>A-Z</DropdownItem>
        <DropdownItem onClick={(e) => addFilter(e, 'title', '-1')}>Z-A</DropdownItem>
      </Dropdown>
      <Stock />
    </div>
  );
};

export default Panel;
