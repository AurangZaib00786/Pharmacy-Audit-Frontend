import React, { useState, useEffect } from "react";
import { IconButton } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import DeleteRoundedIcon from "@material-ui/icons/DeleteRounded";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
import { useAuthContext } from "../../hooks/useauthcontext";

import Button from "react-bootstrap/Button";
import Alert_before_delete from "../alerts/alert_before_delete";
import { ToastContainer } from "react-toastify";
import PrintIcon from "@material-ui/icons/Print";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import custom_toast from "../alerts/custom_toast";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import GlobalBackTab from "../GlobalBackTab";

import { UseaddheaderContext } from "../../hooks/useaddheadercontext";
import useLogout from "../../hooks/uselogout";
function Contacts() {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { Data, dispatch } = UseaddDataContext();
  const { user, route, dispatch_auth } = useAuthContext();
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [showmodel, setshowmodel] = useState(false);
  const [data, setdata] = useState("");
  const [showmodelupdate, setshowmodelupdate] = useState(false);
  const [delete_user, setdelete_user] = useState(false);
  const [url_to_delete, seturl_to_delete] = useState("");
  const [row_id, setrow_id] = useState("");
  const [callagain, setcallagain] = useState(false);
  const [isloading, setisloading] = useState(false);
  const { selected_branch } = UseaddheaderContext();
  const { logout } = useLogout();
  useEffect(() => {
    dispatch_auth({ type: "Set_menuitem", payload: "user" });
    dispatch({ type: "Set_data", payload: [] });
    setisloading(true);
    const fetchWorkouts = async () => {
      const response = await fetch(`${route}/api/contact/`, {
        headers: { Authorization: `Bearer ${user.access}` },
      });

      const json = await response.json();
      if (json.code === "token_not_valid") {
        logout();
      }
      if (response.ok) {
        dispatch({ type: "Set_data", payload: json });
        setisloading(false);
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [callagain]);

  const headerstyle = (column, colIndex, { sortElement }) => {
    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ minHeight: "2.5rem" }}
      >
        {column.text}
        {sortElement}
      </div>
    );
  };

  const handleconfirm = (row) => {
    dispatch({ type: "Delete_data", payload: { id: row } });
    custom_toast("Delete");
  };

  const linkFollow = (cell, row, rowIndex, formatExtraData) => {
    return (
      <span className="action d-flex">
          <IconButton
            className="me-2 border border-danger rounded"
            onClick={() => {
              setrow_id(row.id);
              seturl_to_delete(`${route}/api/contact/${row.id}/`);
              setdelete_user(true);
            }}
          >
            <DeleteRoundedIcon
              className="m-1"
              color="error"
              fontSize="medium"
            />
          </IconButton>

        {/* <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
          onClick={() => {
            setdata(row);
            setshowmodelupdate(true);
          }}
        >
          <EditOutlinedIcon
            className="m-1"
            style={{ color: "#003049" }}
            fontSize="medium"
          />
        </IconButton> */}
      </span>
    );
  };


  
  const columns = [
    {
      dataField: "id",
      text: "#",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "name",
      text: "Name",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "email",
      text: "Email",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "phone",
      text: "phone Number",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
        dataField: "message",
        text: "Message",
        sort: true,
        headerFormatter: headerstyle,
      },
  
    {
      dataField: "action",
      text: "Action",
      formatter: linkFollow,
      headerFormatter: headerstyle,
    },
  ];
  
  

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total ms-2 text-white">
      Showing {from} to {to} of {size} Results
    </span>
  );

  const options = {
    paginationSize: 4,
    pageStartIndex: 1,
    firstPageText: "First",
    showTotal: true,
    paginationTotalRenderer: customTotal,
    disablePageTitle: true,
    sizePerPageList: [
      {
        text: "10",
        value: 10,
      },
      {
        text: "20",
        value: 20,
      },
      {
        text: "All",
        value: Data?.length,
      },
    ], // A numeric array is also available. the purpose of above example is custom the text
  };

  const rowstyle = { height: "10px" };
  const makepdf = () => {
    const body = Data?.map((item, index) => {
      return [
        index + 1,
        item.name,
        item.email,
        item.phone,
        item.message,
      ];
    });
    body.splice(0, 0, ["#", "name", "email", "phone", "Message"]);

    const documentDefinition = {
      content: [
        { text: "Contacts", style: "header" },
        // { text: `Project Name: ${selected_branch?.name}`, style: "body" },
        {
          canvas: [
            { type: "line", x1: 0, y1: 10, x2: 510, y2: 10, lineWidth: 1 },
          ],
        },

        {
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [30, "*", "*", "*", "*"],
            body: body,
          },
          style: "tableStyle",
        },
      ],
      styles: {
        tableStyle: {
          width: "100%", // Set the width of the table to 100%
          marginTop: 20,
        },

        header: {
          fontSize: 22,
          bold: true,
          alignment: "center",
        },
        body: {
          fontSize: 12,
          bold: true,
          alignment: "center",
          marginBottom: 10,
        },
      },
    };
    return documentDefinition;
  };

  const download = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).download("Contacts.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  
  const exportToCSV = (data, filename) => {
    // Extract only required columns
    const exportableColumns = columns.map(col => col.dataField);
  
    // Create CSV header row
    const csvHeader = exportableColumns.join(",") + "\n";
  
    // Generate CSV body
    const csvBody = data
      .map(row => exportableColumns.map(field => `"${row[field] || ""}"`).join(","))
      .join("\n");
  
    // Combine header and body
    const csvContent = csvHeader + csvBody;
  
    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  return (
    <div className="">
       <GlobalBackTab title="Contacts" />
      <div className=" me-3">
   
        <div className="card-body pt-0">
          <ToolkitProvider
            keyField="id"
            data={Data}
            columns={columns}
            search
            exportCSV
          >
            {(props) => (
              <div>
                <div className="  d-md-flex p-1 justify-content-between">
                  <div className="d-md-flex  w-full justify-content-between align-items-center mt-3">
                    <div className="input-container-inner md:w-1/2  h-full flex items-center">
                      <div className="input-container-inner w-full  mb-2 h-full flex items-center">
                        <div className="w-full"> {/* Wrap input in a full-width container */}
                          <SearchBar
                            {...props?.searchProps}
                            placeholder="Search"
                            className="w-full text-black text-sm rounded-lg focus:outline-none p-2 border-2 border-green-200 bg-transparent placeholder-gray-100 placeholder-text-xl"
                            style={{ width: "100%", maxWidth: "none" }} // Force full width
                          />

                        </div>
                      </div>
                    </div>

                    <div className="md:w-1/2  flex md:justify-end gap-2 ">
                   
                      <button
            onClick={() => exportToCSV(Data, "exported_data.csv")}

                        className=" flex gap-1 hover:bg-[#15e6cd] text-white text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>

                        Export
                      </button>
                      <button
                        type="button"
                        className=" flex gap-1   hover:bg-[#15e6cd] text- text-white hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                        onClick={download}
                      >
                        <PictureAsPdfIcon /> PDF
                      </button>
                      <button
                        type="button"
                        className=" flex gap-1   hover:bg-[#15e6cd] text-white text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                        onClick={print}
                      >
                        <PrintIcon /> Print
                      </button>

                    </div>
                    {/* <SearchBar {...props.searchProps} /> */}
                  </div>

                </div>

                {isloading && (
                  <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </div>
                )}
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory(options)}
                  rowStyle={rowstyle}
                  striped
                  bootstrap4
                  condensed
                  classes="custom-table"
                />
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>


      {delete_user && (
        <Alert_before_delete
          show={delete_user}
          onHide={() => setdelete_user(false)}
          url={url_to_delete}
          dis_fun={handleconfirm}
          row_id={row_id}
        />
      )}
      <ToastContainer autoClose={1000} hideProgressBar={true} theme="dark" />
    </div>
  );
  // return <></>;
}

export default Contacts;

