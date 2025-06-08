'use client';

import { useRouter } from "next/navigation";

import { Sales, Dropdown, DropdownItem } from "@/components";
import { useEffect, useState } from "react";
import api from "@/utils/axios.config";
import { useSearchParams } from "next/navigation";

const Sells = () => {

  const params = useSearchParams();
  const userParam = params.get('user');
  const queryParam = params.get('query')

  const [users, setUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);

  const router = useRouter();
  const addFilter = (e, user) => {
    e.preventDefault();
    setUserSelected(user.name);
    router.push(`/sells?query=${queryParam}&user=${user._id}`);
  }

  const fetchsUsers = async () => {
    try {
      const response = await api.get(`/api/user/`);
      const data = response.data;
      setUsers(data.payload);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchsUsers()
  }, [])

  return (
    <div className="sells">
      <Dropdown placeholder={userSelected || 'Selecciona un usuario'} keyId={'drop'}>
        {users.map((value, index) => {
          return (
            <>
              <DropdownItem keyId={index} onClick={(e) => addFilter(e, value)}>{value.name}</DropdownItem>
            </>
          )
        })}
      </Dropdown>

      <Sales />
    </div>
  );
};

export default Sells;
