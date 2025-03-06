import React, {useEffect, useState} from 'react';
import api from '@/app/utils/axios.config';

function PanelProducts() {

    const [products, setProducts] = useState();

    const fetchData = async()=>{
        try {
            const response = await api.get()            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        
    },[]);

  return (
    <div>PanelProducts</div>
  )
}

export default PanelProducts;