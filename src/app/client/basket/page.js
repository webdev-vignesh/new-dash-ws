'use client';

import React, { useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import Image from 'next/image';
import Logo from "../../../../public/logo1.png";
import { HiCheck } from 'react-icons/hi';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { segregate } from '@/utils/priceSegregator';
import { useRouter } from 'next/navigation';

const BasketPage = () => {

    const basketData = useSelector((state) => state.client.basketData);

    const router = useRouter();

    let basketValue = 0;
    const data = basketData?.rows?.map((record, index) => {
        let i = ((record?.limitPrice != 0 ? record?.limitPrice : record?.priceValue) * (record?.quantityValue));
        basketValue = basketValue + i;
    });

    const [show, setShow] = useState(false); // show the basket page or completed page
    const [status, setStatus] = useState(true); // show the spinner or order placed page
    const [showBasket, setShowBasket] = useState(false); // show or not show the basket in orders placed page

    // OAuth login redirect after click on submit button
    const handleConfirm = (e) => {
        e.preventDefault();
        // setShow(true);
        const f = document.createElement('form');
        f.action = 'https://ttweb.indiainfoline.com/trade/Login.aspx';
        f.method = 'POST';

        const i1 = document.createElement('input');
        i1.type = 'hidden';
        i1.name = 'VP';
        i1.value = 'https://new-dash-ws.vercel.app/';
        f.appendChild(i1);

        const i2 = document.createElement('input');
        i2.type = 'hidden';
        i2.name = 'UserKey';
        i2.value = process.env.NEXT_PUBLIC_USER_KEY;
        f.appendChild(i2);

        document.body.appendChild(f);
        f.submit();
    }

  return (
    <div className='w-full p-4'>
        {show 
            ? 
            status 
                ? <div className='absolute top-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center space-y-4 w-full'>
                    <div className='flex items-center justify-center space-x-2'>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <p className='text-sm'>Your order has been placed</p> 
                    </div>
                    <div className='flex justify-between space-x-8'>
                        <div className='flex flex-col space-y-2'>
                            <div className='text-xs'>Basket</div>
                            <div className='text-sm'>{'BankingSmallCase'}</div>
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <div className='text-xs'>Status</div>
                            <div className='text-sm'>Placed</div>
                        </div>
                        <div className='flex flex-col space-y-2'>
                            <div className='text-xs'>6 of 6 placed</div>
                            <div className='text-sm border border-green-200 h-1/2 rounded-md bg-green-200'></div>
                        </div>
                    </div>
                    <div>
                        <p className='text-sm'><button onClick={() => { setShowBasket(true)}} className='underline'>Click</button> here to view executed basket</p>
                    </div>
                    {showBasket ? <div className='flex justify-center items-center mt-4 text-xs'>
                    <table className='table-fixed border'>
                        <thead className='border-b'>
                            <tr>
                                <th className='p-2'>S.No</th>
                                <th>Script</th>
                                <th>Price&nbsp;&#8377;</th>
                                <th className='p-2'>Quantity</th>
                                <th className='p-2'>Total&nbsp;&#8377;</th>
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
                        {/*
                            {
                                basketData?.rows.map((record, index) => {
                                    return <tr className='border-b' key={index}>
                                            <td className='text-center'>{index+1}</td>
                                            <td className='truncate p-2'>{record?.instrumentName}</td>
                                            <td className='text-right'>{record?.limitPrice != 0 ? record?.limitPrice : record?.priceValue}</td>
                                            <td className='text-right pr-4'>{segregate(record?.quantityValue)}</td>
                                            <td className='text-right pr-2'>{segregate((record?.limitPrice != 0 ? record?.limitPrice : record?.priceValue) * (record?.quantityValue))}</td>
                                    </tr>
                                })
                            }
                        */}
                    </table> </div> : <></>}
                  </div>
                : <div className='flex flex-col justify-center items-center h-screen'>
                    <Spinner
                        aria-label="Extra large spinner example"
                        size="xl"
                    />
                    <p>Your request is being processed.</p>
                    <p> Don't leave or close this page.</p>
                  </div>
            : 
            (<div>
                <div className='flex justify-center items-center'>
                    <Image src={Logo} alt="wealth spring logo"  />
                    <div></div>
                </div>
                <div className='flex justify-center space-x-2 mr-32 mt-10'>
                    <p className='text-center font-semibold mb-4 text-xl'>Basket name: </p>
                    <p className='text-center font-semibold mb-4 text-xl'>{'BankingSmallCase'}</p>
                </div>
                <div className='flex justify-center'>
                    <div>
                        <p>Basket Value &#8377;</p>
                        <input disabled type='text' value={'323,432.45'} className='w-28 border-gray-200 bg-gray-50 rounded-md text-right' />
                    </div>
                    <div className='ml-4'>
                        <p>Basket Type</p>
                        <input disabled type='text' value={'BUY'} className='w-28 border-gray-200 bg-gray-50 rounded-md' />
                    </div>
                    <div className='ml-4'>
                        <p>No.of Scripts</p>
                        <input disabled type='number' value={'3'} className='w-28 border-gray-200 bg-gray-50 rounded-md text-right' />
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
                            {/* {
                                basketData?.rows.map((record, index) => {
                                    return <tr className='border-b' key={index}>
                                            <td className='text-center'>{index+1}</td>
                                            <td className='truncate p-2'>{record?.instrumentName}</td>
                                            <td className='text-right'>{record?.limitPrice != 0 ? record?.limitPrice : record?.priceValue}</td>
                                            <td className='text-right pr-4'>{segregate(record?.quantityValue)}</td>
                                            <td className='text-right pr-2'>{segregate((record?.limitPrice != 0 ? record?.limitPrice : record?.priceValue) * (record?.quantityValue))}</td>
                                    </tr>
                                })
                            } */}
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
                    <button className='bg-cyan-800 hover:bg-cyan-700 border p-2 rounded-md text-white w-20' onClick={handleConfirm}>Confirm</button>
                    <Button color='gray'>Decline</Button>
                </div>
            </div>)
        }
        
    </div>
  )
}

export default BasketPage