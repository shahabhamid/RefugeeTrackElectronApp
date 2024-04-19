import React, { useState, useEffect, Fragment } from "react";
import DataTable from "../components/DataTable";
import Paginator from "../components/paginator";
import SectionHeader from "../components/SectionHeader";
import Dialog from "../components/Dialog";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import AutoComplete from "../components/AutoComplete";
import axios from "axios";

function Services() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState();
  const [session, setSession] = useState("Cafeteria");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [addPerson, setAddPerson] = useState()

  const [tableBodyList, setTableBodyList] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);


  const [state, setState] = useState({
    tableBodyList: tableBodyList,
    dialogInfo: {
      isOpened: false,
      text: "",
      type: "",
    },
  });


  function deleteFromTable(data) {
    // dispatch(deleteUser(data._id));
  }


  const [tableHeaders, setTableHeaders] = useState([
    { id: "id", label: "ID" },
    { id: "Name", label: "Name", component: (data) => <>{data.firstName || ''} {data.lastName || ''}</> },
    { id: "gender", label: "Gender", component: (data) => <>{data.gender || ''} </> },
    { id: "bornIn", label: "Born In", component: (data) => <>{data.bornIn || ''} </> },
    { id: "city", label: "City", component: (data) => <>{data.city || ''} </> },
    { id: "emailAddress", label: "Email", component: (data) => <>{data.emailAddress || ''} </> },
    { id: "cell", label: "Phone", component: (data) => <>{data.cell || ''}</> },
    {
      id: "Image",
      label: "Image",
      component: (data, setData) => (
        <img
          className="w-16 h-16 rounded-full"
          // src={data.Image}
          src={data.image ? `http://localhost:4000/file/${data.image}` : 'user.png'} 
          alt="profile"
        />
      ),
    },
    {
      id: "actions",
      label: "",
      component: (data, setData) => (
        <div className="flex space-x-3 !text-right">
          <button
            className=" no-focus"
            title="Delete"
            onClick={(e) => deleteFromTable(data)}
          >
            <i
              className="fas fa-times text-[color:var(--primary-color)]"
              aria-hidden="true"
            ></i>
          </button>
        </div>
      ),
    },
  ]);


  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:4000/service", {
        params: { page, limit, date: new Date().toDateString(), service: session },
      }) // Pass searchQuery to API call
      .then((res) => {
        setTableBodyList(res.data.list);
        setCount(res.data.count);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [limit, page, addPerson, session]);

  return (

    <div className="mt-10">
      <SectionHeader title={"Services"}
        mainPage={"Services"}
        mainPageLink={"/services"}
        tools={() => {
          return <div className="inline-flex  items-center gap-3">
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              autoComplete="Marital status"
              className="block w-[100%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset"
            >

              <option value={"CAFETERIA"}>{t("MENSA")}</option>
              <option value={"TAKEAWAY_PACKAGE"}>{t("PACCO D'ASPORTO")}</option>
              <option value={"SHOWERS"}>{t("DOCCIE")}</option>
              <option value={"COVERS"}>{t("COPERTE")}</option>
              <option value={"MEDICINES"}>{t("MEDICINE")}</option>
            </select>

            {/* <button type="button" class="rounded-md  bg-indigo-600 px-3 py-2 text-sm font-semibold text-white whitespace-nowrap shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"> Start Session</button> */}
          </div>

        }}

      />
      <Dialog
        onFalse={(e) =>
          setState((prevState) => ({
            ...prevState,
            dialogInfo: { isOpened: false, text: "" },
          }))
        }
        onTrue={(e) => deleteFromTable(e)}
        dialogInfo={state.dialogInfo}
      />
      <AutoComplete activeSession={session} setAddPerson={setAddPerson} />
      <DataTable
        isLoading={loading}
        tableHeadersData={tableHeaders}
        setTableHeadersData={setTableHeaders}
        tableBodyData={tableBodyList || []}
        renderPaginator={() => <>
          <Paginator
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            total={count}
          /></>} />
    </div>
  );
}

export default Services;
