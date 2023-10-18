"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBasketAmount } from "@/store/basketSlice";
import { useRouter } from "next/navigation";
import { HiCheckCircle } from "react-icons/hi";
import { Alert } from "flowbite-react";
import {
  getBasketList,
  getBasketValue,
  getCustomers,
} from "@/app/api/basket/route";
import { getCustomerStatus } from "@/app/api/basket/route";
import CustomerMappingTable from "@/components/admin/table/customerMappingTable";
import { segregate } from "@/utils/formatter/priceSegregator";

const CustomerMapping = () => {
  // broker inputs
  const brokers = [{ name: "AXIS" }, { name: "IIFL" }];

  // redux
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const adminId = useSelector((state) => state.user.username);

  // local state
  const [basketName, setBasketName] = useState("");
  const [customers, setCustomers] = useState([]);
  const [weblink, setWeblink] = useState(false);
  const [message, setMessage] = useState(false);
  const [status, setStatus] = useState([]);
  const [records, setRecords] = useState([]);
  // const [investmentVal, setInvestmentVal] = useState("");
  const [scripts, setScripts] = useState(0);
  const [basketVal, setBasketVal] = useState("");
  const [transType, setTransType] = useState("");
  const [broker, setBroker] = useState(brokers[0].name);
  const [enableInputs, setEnableInputs] = useState(basketName == "");

  // modal state variables
  const [openModal, setOpenModal] = useState();
  const props = { openModal, setOpenModal };

  // nextjs router
  const router = useRouter();

  // useEffect to fetch the view table baskets
  useEffect(() => {
    const fetchBaskets = async () => {
      const response = await getBasketList();
      setRecords(response);
    };
    const fetchData = async () => {
      const customersData = await getCustomers();
      setCustomers(customersData);
    };

    fetchBaskets();
    fetchData();
  }, []);

  if (weblink) {
    dispatch(setBasketAmount(""));
    setBasketName("");
    setTimeout(() => {
      setWeblink(false);
      // router.push("/admin/baskets/create");
    }, 3000);
  }

  if (message) {
    dispatch(setBasketAmount(""));
    setBasketName("");
    setTimeout(() => {
      setMessage(false);
      // router.push("/admin/baskets/create");
    }, 3000);
  }

  // handle basket selection
  const handleSelection = async (value) => {
    setBasketName(value);
    const response = await getBasketValue(value, adminId);
    console.log(response);
    // setInvestmentVal(response[0]?.basketInvestAmt);
    setTransType(response[0]?.transactionType);
    setBasketVal(response[0]?.basketActualValue);
    setScripts(response[0]?.noOfScripts);
    setEnableInputs(false);

    const status = await getCustomerStatus(value);
    console.log(status)
    if (status) {
      setStatus(status);
    }
  };

  return (
    <div className="container mx-auto mt-4" style={{ width: "95%" }}>
      <h5 className="font-bold mb-2">Map Customer</h5>
      <div className="flex justify-between">
        {/* Basket Names listbox */}
        <div className="">
          <p className="text-black text-sm dark:text-white mr-2">
            Select Basket
          </p>
          <select
            className="border border-gray-200 rounded-md w-44 text-sm"
            defaultValue={""}
            onChange={(e) => {
              handleSelection(e.target.value);
            }}
          >
            <option disabled value="">
              - Select -
            </option>
            {records?.map((record) => (
              <option key={record.basketName} value={record.basketName}>
                {record.basketName}
              </option>
            ))}
          </select>
        </div>

        {/* Disabled Basket Category */}
        <div className="flex flex-col items-left mb-6">
          <label className="text-black text-sm dark:text-white">
            Basket Category
          </label>
          <input
            type="text"
            value={""}
            disabled
            className="border border-gray-200 bg-gray-50 text-right rounded-lg w-44 text-sm"
          />
        </div>

        {/* Disabled Scripts number */}
        <div className="flex flex-col items-left mb-6">
          <label className="text-black text-sm dark:text-white">
            # Scripts
          </label>
          <input
            type="text"
            value={scripts}
            disabled
            className="border border-gray-200 bg-gray-50 text-right rounded-lg w-44 text-sm"
          />
        </div>


        {/* Basket Type listbox */}
        <div className="">
          <p className="text-black text-sm dark:text-white mr-2">
            Transaction Type
          </p>
          <input
            disabled
            type="text"
            value={transType}
            className="border border-gray-200 rounded-lg w-44 bg-gray-50 text-sm"
          />
        </div>

        {/* Disabled basket value */}
        <div className="flex flex-col items-left mb-6">
          <p className="text-black text-sm dark:text-white mr-2">
            Basket value &#8377;
          </p>
          <input
            disabled
            type="text"
            value={segregate(basketVal)}
            className="border border-gray-200 rounded-lg w-44 text-right bg-gray-50 text-sm"
          />
        </div>
      </div>

      {/* Customer Details table */}
      <div className="flex flex-col mt-2">
        <div className={"overflow-y-scroll border"} style={{ height: "300px" }}>
          <table className="table-fixed w-full overflow-y-scroll overflow-x-scroll">
            <thead className="border-b sticky top-0 bg-gray-50">
              <tr>
                <th className="font-medium text-sm text-left p-2 break-words w-16">
                  S.No
                </th>
                <th className="font-medium text-sm text-left p-2 break-words">
                  Customer ID
                </th>
                <th className="font-medium text-sm text-left break-words">
                  Name
                </th>
                {/* <th className="font-medium text-left text-sm w-44 break-words">
                  Email
                </th> */}
                <th className="font-medium text-center text-sm break-words">
                  Broker
                </th>
                <th className="font-medium text-center text-sm break-words">
                  Investment &#8377;
                </th>
                <th className="font-medium text-center text-sm break-words">
                  # Basket Units
                </th>
                <th className="font-medium text-center text-sm break-words">
                  Basket Total &#8377;
                </th>
                <th className="font-medium text-left text-sm break-words">
                  Map Status
                </th>
                <th className="font-medium text-left text-sm break-words">
                  WebLink Status
                </th>
                <th className="font-medium text-center text-sm break-words">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="" style={{ width: "100%" }}>
              {customers?.map((data, index) => {
                return (
                  <CustomerMappingTable
                    data={data}
                    index={index}
                    status={status}
                    setStatus={setStatus}
                    enableInputs={enableInputs}
                    basketName={basketName}
                    basketVal={basketVal}
                    scripts={scripts}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
        {weblink ? (
          <Alert
            className="absolute bottom-0 left-2 bg-green-200 text-green-500"
            icon={HiCheckCircle}
            rounded
          >
            <span className="w-4 h-4 text-green-500">
              Weblink sent successfully!
            </span>
          </Alert>
        ) : (
          <></>
        )}
        {message ? (
          <Alert
            className="absolute bottom-0 left-2 bg-green-200 text-green-500"
            icon={HiCheckCircle}
            rounded
          >
            <span className="w-4 h-4 text-green-500">
              Basket mapped successfully!
            </span>
          </Alert>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CustomerMapping;
