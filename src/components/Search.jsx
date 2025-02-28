import React from 'react'

function Search() {
    return (
        <div className='flex justify-center'>
            <div className='flex gap-4'>
                <input type="text" className='border p-1 rounded'/>
                <div className='flex gap-2 items-center'>
                    <label>Desactivar lector</label>
                    <input type="checkbox"/>

                </div>
            </div>
            <div>
                
            </div>
        </div>
    )
}

export default Search
