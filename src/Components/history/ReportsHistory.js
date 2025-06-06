
import React, { useState, useEffect } from "react";
// import "./file-format.css";
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
// import Form from "./form";
// import Update from "./update";
import Button from "react-bootstrap/Button";
import Alert_before_delete from "../alerts/alert_before_delete";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { UseaddheaderContext } from "../../hooks/useaddheadercontext";
import useLogout from "../../hooks/uselogout";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import GlobalBackTab from "../GlobalBackTab";
import {Link} from "react-router-dom";


function ReportsHistory(props) {
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
  const [isloading, setisloading] = useState(false);
  const { selected_branch } = UseaddheaderContext();
  const { logout } = useLogout();
  useEffect(() => {
    dispatch_auth({ type: "Set_menuitem", payload: "file" });
    dispatch({ type: "Set_data", payload: [] });
    setisloading(true);
    const fetchWorkouts = async () => {
      const response = await fetch(
        `${route}/api/saved-folders/`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

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
  }, []);

  const headerstyle = (column, colIndex, { sortElement }) => {
    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          minHeight: "2rem",
        }}
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
        {/* <IconButton
          className="me-2 border border-danger rounded"
          onClick={() => {
            setrow_id(row.id);
            seturl_to_delete(`${route}/api/vendor-file-formats/${row.id}/`);
            setdelete_user(true);
          }}
        >
          <DeleteRoundedIcon className="m-1" color="error" fontSize="medium" />
        </IconButton> */}

        <IconButton
          style={{ border: "1px solid #003049", borderRadius: "5px" }}
        
        >
         <Link
  to={`/audit-reports-history/${encodeURIComponent(row.folder_path)}`}
  style={{ border: "1px solid #003049", borderRadius: "5px", padding: "4px" }}
>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-black">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
</svg>
</Link>

        </IconButton>
      </span>
    );
  };

  const columns = [
    {
      dataField: "id",
      text: "#",
      sort: true,
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      headerFormatter: headerstyle,
    },
    {
        dataField: "saved_date",
        text: "Saved Date",
        sort: true,
        headerFormatter: headerstyle,
      },
    {
      dataField: "folder_path",
      text: "Folder",
      sort: true,
      headerFormatter: headerstyle,
    },

 
    // {
    //   dataField: "ndc_column",
    //   text: "NDC ",
    //   sort: true,
    //   headerFormatter: headerstyle,
    // },
    // {
    //   dataField: "date_column",
    //   text: "Date ",
    //   sort: true,
    //   headerFormatter: headerstyle,
    // },
    // {
    //   dataField: "description_column",
    //   text: "Description ",
    //   sort: true,
    //   headerFormatter: headerstyle,
    // },
    // {
    //   dataField: "quantity_column",
    //   text: "Qty ",
    //   sort: true,
    //   headerFormatter: headerstyle,
    // },
    // {
    //   dataField: "amount_column",
    //   text: "Amount ",
    //   sort: true,
    //   headerFormatter: headerstyle,
    // },
    {
      dataField: "action",
      text: "View",
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

  const rowstyle = { height: "10px" }
  ;
  const makepdf = () => {
    const body = Data?.map((item, index) => {
      return [
        index + 1,
        item.name,
        item.row_number,
        item.ndc_column,
        item.description_column,
        item.quantity_column,
      ];
    });
    body.splice(0, 0, [
      "#",
      "Vendor Name",
      "Row No",
      "NDC Column",
      "Description Column",
      "Qty Column",
    ]);

    const documentDefinition = {
      content: [
        { text: "Vendor File Formats", style: "header" },
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
            widths: [30, "*", "*", "*", "*", "*"],
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
    pdfMake.createPdf(documentDefinition).download("users.pdf");
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
      <div className="p-1">
      <GlobalBackTab title="Reports History" />
      </div>


      <div className=" me-3 mt-3 ">

        <div className="card-body mt-8">
          <ToolkitProvider
            keyField="id"
            data={Data}
            columns={columns}
            search
            exportCSV
          >
            {(props) => (
              <div>
                <div className="  d-md-flex justify-content-between">
                  <div className="d-md-flex mb-2 p-1  w-full justify-content-between align-items-center mt-3">
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


                    {/* <div className="md:w-1/2  flex justify-end gap-2 ">
                      <button
                        type="button"
                        className=" flex justify-center items-center g   bg-[#daf0fa] hover:bg-[#15e6cd] text-gray-600 box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; md:text-xl text-sm hover:text-white font-normal py-2 px-2  border-2 border-[#15e6cd] rounded-xl"
                        onClick={() => setshowmodel(!showmodel)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="md:size-6 size-4 font-semibold">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>

                        Add format
                      </button>
                      <button
                                  onClick={() => exportToCSV(Data, "exported_data.csv")}

                        className=" flex gap-1 hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                        </svg>

                        Export
                      </button>
                      <button
                        type="button"
                        className=" flex gap-1   hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-3  border-2 border-white rounded-xl"
                        onClick={print}
                      >
                        <PrintIcon /> Print
                      </button>
                      <button
                        type="button"
                        className=" flex gap-1   hover:bg-[#15e6cd] box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-white hover:text-white font-normal py-2 px-3  border-2 border-white rounded-xl"
                        onClick={download}
                      >
                        <PictureAsPdfIcon /> PDF
                      </button>


                    </div> */}
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
                  bootstrap4
                  condensed
                  classes="custom-table"
                />
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>

      {/* {showmodel && (
        <Form show={showmodel} onHide={() => setshowmodel(false)} />
      )}
      {showmodelupdate && (
        <Update
          show={showmodelupdate}
          onHide={() => setshowmodelupdate(false)}
          data={data}
          fun={custom_toast}
        />
      )} */}

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
}

export default ReportsHistory;

