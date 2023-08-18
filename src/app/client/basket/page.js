'use client';

import { Button } from 'flowbite-react';
import Image from 'next/image';
import React, { useState } from 'react';9
import Logo from "../../../../public/logo1.png";

const BasketPage = () => {

    const [records, setRecords] = useState([]);

  return (
    <div className='w-full p-4'>
        <div className='flex justify-center items-center'>
            <Image src={Logo} alt="wealth spring logo"  />
            <div></div>
        </div>
        <p className='text-center font-semibold mb-4 text-xl'>BankingSmallCase</p>
        <div className='flex justify-center'>
            <div>
                <p>Basket Value &#8377;</p>
                <input disabled type='text' value={'600,000'} className='w-28 border-gray-200 bg-gray-50 rounded-md text-right' />
            </div>
            <div className='ml-4'>
                <p>Basket Type</p>
                <input disabled type='text' value={'BUY'} className='w-28 border-gray-200 bg-gray-50 rounded-md' />
            </div>
            <div className='ml-4'>
                <p>No.of Scripts</p>
                <input disabled type='number' value={4} className='w-28 border-gray-200 bg-gray-50 rounded-md text-right' />
            </div>
        </div>
        <div className='flex justify-center items-center mt-4'>
            <table className='table-fixed border'>
                <thead className='border-b'>
                    <tr>
                        <th className='p-2'>S.No</th>
                        <th>Script</th>
                        <th>Price &#8377;</th>
                        <th className='p-2'>Quantity</th>
                        <th className='p-2'>Total &#8377;</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='border-b'>
                        <td className='text-center'>1</td>
                        <td className='truncate p-2'>YES BANK</td>
                        <td className='text-right'>115.85</td>
                        <td className='text-right pr-2'>452</td>
                        <td className='text-right pr-2'>50,255</td>
                    </tr>
                    <tr className='border-b'>
                        <td className='text-center'>2</td>
                        <td className='truncate p-2'>DCB BANK</td>
                        <td className='text-right'>72.10</td>
                        <td className='text-right pr-2'>250</td>
                        <td className='text-right pr-2'>80,524</td>
                    </tr>
                    <tr className='border-b'>
                        <td className='text-center'>3</td>
                        <td className='truncate p-2'>IOB BANK</td>
                        <td className='text-right'>55.00</td>
                        <td className='text-right pr-2'>120</td>
                        <td className='text-right pr-2'>75,789</td>
                    </tr>
                    <tr className='border-b'>
                        <td className='text-center'>4</td>
                        <td className='truncate p-2'>AXIS BANK</td>
                        <td className='text-right'>1325.20</td>
                        <td className='text-right pr-2'>54</td>
                        <td className='text-right pr-2'>64,245</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div className='flex justify-center space-x-4 mt-4'>
            <button className='bg-cyan-800 hover:bg-cyan-700 border p-2 rounded-md text-white w-20'>Conform</button>
            <Button color='gray'>Decline</Button>
        </div>
    </div>
  )
}

export default BasketPage