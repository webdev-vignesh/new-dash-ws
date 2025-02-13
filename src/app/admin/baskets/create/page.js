"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBasketState } from "@/store/eventSlice";
import { setBasketName } from "@/store/basketSlice";
import { usePathname } from "next/navigation";
import { HiInformationCircle, HiCheckCircle } from "react-icons/hi";
import { Alert, Button, Tooltip } from "flowbite-react";
import { basketNameCheck, getInstrumentDetails } from "@/app/api/basket/route";
import { getRecords } from "@/app/api/tempBasket/route";
import AddRecord from "@/components/admin/crud/addRecord";
import BasketRecords from "@/components/admin/table/basketRecords";
import SubmitBasket from "@/components/admin/crud/submitBasket";
import { segregate } from "@/utils/formatter/priceSegregator";
import BasketCategory from "@/components/admin/basketCategory";
import { segreagatorWoComma } from "@/utils/formatter/segregatorWoComma";
import CryptoJS from "crypto-js";

const CreateBasket = () => {
  // basket status messages
  const msg1 = "Enter Basket Name, Investment Amount and Basket Category";
  const msg2 = "Add scripts to the basket";
  const msg3 = "Basket name exists!";
  const msg4 = "Basket Saved Successfully!";
  const msg5 = "Basket Value is lesser than Investment Amount";
  const msg6 = "Basket Value is higher than Investment Amount";
  const msg7 = "Unable to save basket! Try agian";

  // getting the url path
  const pathname = usePathname();

  // redux
  const dispatch = useDispatch();
  const adminId = useSelector((state) => state.user.username);
  const basketName = useSelector((state) => state.basket.basketName);
  const basketState = useSelector((state) => state.event.basketState);

  // local state variables
  const [nameCheck, setNameCheck] = useState(true);
  const [records, setRecords] = useState([]);
  const [handleFetch, setHandleFetch] = useState(false);
  const [message, setMessage] = useState("");
  const [transType, setTransType] = useState("BUY");
  const [total, setTotal] = useState(0);
  const [saved, setSaved] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [basketAmount, setBasketAmount] = useState("");
  const [comparison, setComparison] = useState(true); // comparison to check whether basketVal is greater than investmentVal
  const [basketCategory, setBasketCategory] = useState("");
  const [selected, setSelected] = useState("");

  // basket value variable
  const basketVal = segreagatorWoComma(total);

  // useEffect for getting records after basket save clicked
  useEffect(() => {
    if (saveMsg == true) {
      setRecords([]);
      setBasketAmount("");
      dispatch(setBasketName(""));
      setBasketCategory("");
      setMessage(msg4);
      setSelected("")
    } else {
      setMessage(msg7);
    }
  }, [saved]);

  // useEffect to set the message at center of table
  useEffect(() => {
    if (basketName !== "" && basketAmount !== "" && basketCategory !== "") {
      setMessage(msg2);
    } else if (!saved) {
      setMessage(msg1);
    }
  }, [basketAmount, basketName]);

  // useEffect to check the basketname
  useEffect(() => {
    const check = async () => {
      const response = await basketNameCheck(basketName);
      setNameCheck(response);
      if (!response) {
        setMessage(msg3);
      }
    };
    check();
  }, [basketName]);

  // useEffect to clear the basket name and amount
  useEffect(() => {
    dispatch(setBasketName(""));
    setBasketAmount("");
    // props.setOpenModal("form-elements");
  }, []);

  const isInitialRender = useRef(true);
  // useffect for add record, update record, delete record
  useEffect(() => {
    // Check if it's not the initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    const fetchData = async () => {
      const response = await getRecords(adminId, basketName);
      setRecords(response || []);
    };
    fetchData();
  }, [handleFetch]);

  // useEffect to check url and then prevent user from navigating to other pages
  useEffect(() => {
    // checking url and records to prevent user from navigating
    if (pathname == "/admin/baskets/create" && records?.length !== 0) {
      dispatch(setBasketState(true));
    } else {
      dispatch(setBasketState(false));
    }

    // setting the total basket value
    let total = 0;
    let price;

    records?.forEach((record) => {
      price = record.priceValue;
      total += price * record.quantityValue;
    });
    setTotal(total);

    // condition to set msg5
    if (records?.length !== 0) {
      setMessage(msg5);
    }

    // condition to compare investment and basket value
    if (total > basketAmount) {
      setComparison(false);
      setMessage(msg6);
    } else {
      setComparison(true);
    }
  }, [records]);

  return (
    <div className="container mx-auto mt-4" style={{ width: "95%" }}>
      <h3 className="mb-2 font-bold">Create new Basket</h3>

      {/* Investment details row */}
      <div className="flex justify-between">
        {/* Basket Name input */}
        {nameCheck ? ( // checking whether the entered name already exists in the database or not
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-left">
              <label className="text-black text-sm dark:text-white mr-2">
                Basket Name
              </label>
              <input
                type="text"
                value={basketName}
                onChange={(e) => {
                  dispatch(setBasketName(e.target.value));
                }}
                className="border border-gray-200 rounded-lg w-24 md:w-44 text-sm"
              />
            </div>
            <div className="ml-8 mt-2">
              <p className="text-xs text-red-500">
                &nbsp;
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start">
            <div className="flex flex-col items-left">
              <label className="text-black text-sm dark:text-white mr-2">
                Basket Name
              </label>
              <input
                type="text"
                value={basketName}
                onChange={(e) => {
                  dispatch(setBasketName(e.target.value));
                }}
                className="border border-gray-200 focus:border-red-500 focus:ring-0 rounded-lg w-24 md:w-44 text-sm"
              />
            </div>
            <div className="mt-2">
              <p className="text-xs text-red-600">
                <div>{msg3}</div>
              </p>
            </div>
          </div>
        )}

        {/* Investment value input to be entered by admin */}
        <div className="flex flex-col items-left mb-6">
          <label className="text-black text-sm dark:text-white">
            Max Investment Value &#8377;
          </label>
          <input
            type="text"
            disabled={!nameCheck}
            value={segregate(basketAmount)}
            onChange={(e) => {
              // Remove commas from the input value before updating state
              const newValue = e.target.value.replace(/,/g, "");
              setBasketAmount(newValue);
            }}
            className="border border-gray-200 rounded-lg w-24 md:w-44 text-right text-sm"
          />
        </div>

        {/* Basket Category listbox */}
        <div className="">
          <p className="text-black text-sm dark:text-white mr-2">
            Basket Category
          </p>
          <div className="relative w-44 z-10 border rounded-md">
            <BasketCategory
              setBasketCategory={setBasketCategory}
              nameCheck={nameCheck}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <div className="relative bottom-10 z-20">Add</div> */}
          </div>
          {/* <select
            name="transactionType"
            id="transactionType"
            value={""}
            className="border border-gray-200 rounded-md  w-24 md:w-44 text-sm"
            onChange={(e) => setTransType(e.target.value)}
          >
            <option value="BUY">Pharma</option>
            <option value="SELL">Energy</option>
          </select> */}
        </div>

        {/* Transaction Type listbox */}
        <div className="">
          <p className="text-black text-sm dark:text-white mr-2">
            Transaction Type
          </p>
          <select
            name="transactionType"
            id="transactionType"
            value={transType}
            disabled={!nameCheck}
            className="border border-gray-200 rounded-md focus:outline-0 w-24 md:w-44 text-sm focus:border-gray-200 focus:ring-0"
            onChange={(e) => setTransType(e.target.value)}
          >
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>
        </div>

        {/* Basket value input */}
        <div className="flex flex-col items-left mb-6">
          <p className="text-black text-sm dark:text-white mr-2">
            Basket Value &#8377;
          </p>
          <input
            disabled
            type="text"
            value={(basketVal)}
            className="border border-gray-200 rounded-lg  w-24 md:w-44 bg-gray-50 text-right text-sm"
          />
        </div>
      </div>

      {/* Table showing Create Basket Records */}
      <div className="flex mt-2">
        <div className={"overflow-y-scroll border h-[calc(100vh-350px)]"}>
          <table className="table-fixed w-full">
            <thead className="sticky top-0 bg-gray-50">
              <tr>
                <th className="text-left font-medium text-sm p-2">S.No</th>
                <th
                  className="font-medium text-sm text-left"
                  style={{ width: "25%" }}
                >
                  Scripts
                </th>
                <th className="font-medium text-sm">Exchange</th>
                <th className="font-medium text-sm">Order Type</th>
                <th className="text-right font-medium text-sm">
                  Weights&nbsp;%
                </th>
                <th className="text-right font-medium text-sm">
                  Price &#8377;
                </th>
                <th className="text-right font-medium text-sm">
                  Limit Price &#8377;
                </th>
                <th className="text-right font-medium text-sm">Quantity</th>
                <th className="font-medium text-sm">Actions</th>
              </tr>
            </thead>
            {
              <tbody>
                {/* Component for showing table records */}
                {records && records?.length > 0 ? (
                  // show table with records
                  records?.map((record, index) => (
                    <BasketRecords
                      key={record.recId}
                      record={record}
                      index={index}
                      handleFetch={handleFetch}
                      setHandleFetch={setHandleFetch}
                      basketName={basketName}
                      investmentVal={basketAmount}
                      basketVal={total}
                    />
                  ))
                ) : (
                  // show empty table
                  <tr
                    colSpan="8"
                    className=" h-[calc(100vh-650px)] text-center"
                  ></tr>
                )}
              </tbody>
            }
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        {/* Message area showing the status of basket operations */}
        {message !== msg4 ? (
          <div>
            <Alert className="w-96" color="warning" icon={HiInformationCircle} rounded>
              <span className="w-4 h-4">{message}</span>
            </Alert>
          </div>
        ) : (
          <div>
            <Alert
              className="bg-green-200 text-green-500 w-96"
              icon={HiCheckCircle}
              rounded
            >
              <span className="w-4 h-4 text-green-500">{message}</span>
            </Alert>
          </div>
        )}

        {/* Conditional rendering based on comparison and records.length */}
        {comparison &&
        basketAmount !== "" &&
        basketName !== "" &&
        basketCategory !== "" ? (
          // showing active buttons
          <div className="flex justify-center">
            <div>
              <AddRecord
                handleFetch={handleFetch}
                setHandleFetch={setHandleFetch}
                transType={transType}
                investmentVal={basketAmount}
                basketName={basketName}
                basketCategory={basketCategory}
                records={records}
              />
            </div>
            <div>
              <SubmitBasket
                saved={saved}
                setSaved={setSaved}
                transType={transType}
                investmentAmount={basketAmount}
                actualValue={basketVal}
                basketCategory={basketCategory}
                saveMsg={saveMsg}
                setSaveMsg={setSaveMsg}
              />
            </div>
          </div>
        ) : (
          // Showing disabled buttons with tooltip message
          <div className="flex justify-center">
            <Tooltip
              className="overflow-hidden"
              content={`${message === "Basket Value is higher than Investment Amount" ? "Basket Value is higher than Investment Amount" : "Enter Basket name and Investment amount!"}`}
            >
              <Button disabled className="">
                Add Record
              </Button>
            </Tooltip>
            <Tooltip
              className="overflow-hidden"
              content={`${message === "Basket Value is higher than Investment Amount" ? "Basket Value is higher than Investment Amount" : "Enter Basket name and Investment amount!"}`}
            >
              <Button disabled className="ml-8">
                Save
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateBasket;
