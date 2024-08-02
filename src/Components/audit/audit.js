import React, { useState, useEffect, useRef } from "react";
import "./audit.css";
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
import custom_toast from "../alerts/custom_toast";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import useLogout from "../../hooks/uselogout";
import went_wrong_toast from "../alerts/went_wrong_toast";
function Audit() {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { Data, dispatch } = UseaddDataContext();
  const { user, route, dispatch_auth } = useAuthContext();
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const inputFile_vendor = useRef(null);
  const inputFile_billing = useRef(null);

  const [Fileurl_vendor, setFileurl_vendor] = useState("");
  const [Fileurl_billing, setFileurl_billing] = useState("");
  const [vendor_filesdata, setvendor_filesdata] = useState([]);
  const [billing_filesdata, setbilling_filesdata] = useState([]);

  const [delete_user, setdelete_user] = useState(false);
  const url_to_delete = `${route}/api/manage-files/`;

  const [callagain, setcallagain] = useState("");
  const [isloading, setisloading] = useState(false);

  const { logout } = useLogout();
  useEffect(() => {
    dispatch_auth({ type: "Set_menuitem", payload: "audit" });

    setisloading(true);
    const fetchvendorfiles = async () => {
      const response = await fetch(
        `${route}/api/manage-files/?directory=vendor_files`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      const json = await response.json();
      if (json.code === "token_not_valid") {
        logout();
      }
      if (!response.ok) {
        went_wrong_toast(json.error);
      }
      if (response.ok) {
        setvendor_filesdata(json);
        setisloading(false);
      }
    };
    const fetchbillingfiles = async () => {
      const response = await fetch(
        `${route}/api/manage-files/?directory=billing_files`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      const json = await response.json();
      if (json.code === "token_not_valid") {
        logout();
      }
      if (!response.ok) {
        went_wrong_toast(json.error);
      }
      if (response.ok) {
        setbilling_filesdata(json);
        setisloading(false);
      }
    };

    fetchvendorfiles();
    fetchbillingfiles();
  }, []);

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
    custom_toast(row.success);
  };

  const [columns, setcolumns] = useState([
    {
      dataField: "ndc",
      text: "NDC",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "packagesize_billing",
      text: "Package Size",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "quantity_billing",
      text: "Billing Qty",
      sort: true,
      headerFormatter: headerstyle,
    },
  ]);

  const rowstyle = { height: "10px" };
  const makepdf = () => {
    const body = Data?.map((item, index) => {
      return [
        index + 1,
        item.ndc,
        item.packagesize_billing,
        item.quantity_billing,
      ];
    });
    body.splice(0, 0, ["#", "NDC", "Package Size", "Billing Qty"]);

    const documentDefinition = {
      content: [
        { text: "Audit", style: "header" },
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
            widths: [30, "*", "*", "*"],
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
    pdfMake.createPdf(documentDefinition).download("Audit.pdf");
  };

  const print = () => {
    const documentDefinition = makepdf();
    pdfMake.createPdf(documentDefinition).print();
  };

  function getExtension(filename) {
    return filename.split("/").shift();
  }

  const onButtonClick_vendor = () => {
    // `current` points to the mounted file input element
    inputFile_vendor.current.click();
  };

  const handleimageselection_vendor = (event) => {
    const file = event.target.files[0];
    setFileurl_vendor({
      file: file,
      type: getExtension(file["type"]).toLowerCase(),
      name: file["name"],
    });
    event.target.value = "";
  };

  const onButtonClick_billing = () => {
    // `current` points to the mounted file input element
    inputFile_billing.current.click();
  };

  const handleimageselection_billing = (event) => {
    const file = event.target.files[0];
    setFileurl_billing({
      file: file,
      type: getExtension(file["type"]).toLowerCase(),
      name: file["name"],
    });
    event.target.value = "";
  };

  const openimage = (item) => {
    if (item.file instanceof File) {
      const fileUrl = URL.createObjectURL(item.file);
      window.open(fileUrl, "_blank");
    } else {
      window.open(`${route}/${item.link}`, "blank");
    }
  };

  const handlesubmitvendor_files = async (e) => {
    e.preventDefault();
    try {
      setisloading(true);
      const formData = new FormData();
      formData.append(`file`, Fileurl_vendor.file);
      formData.append(`vendor_file_format_id `, 1);
      const response = await fetch(`${route}/api/upload-pharmacy-file/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast(json.error);
      }

      if (response.ok) {
        setFileurl_vendor(null);
        custom_toast(json.message);
      }
    } catch (e) {
      setisloading(false);
      went_wrong_toast(e);
    }
  };

  const handlesubmitbilling_files = async (e) => {
    e.preventDefault();
    try {
      setisloading(true);
      const formData = new FormData();
      formData.append(`file`, Fileurl_billing.file);
      const response = await fetch(`${route}/api/upload-billing-file/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.access}`,
        },
        body: formData,
      });
      const json = await response.json();

      if (!response.ok) {
        setisloading(false);
        went_wrong_toast(json.error);
      }

      if (response.ok) {
        setFileurl_billing(null);
        custom_toast(json.message);
      }
    } catch (e) {
      setisloading(false);
    }
  };

  const handlegeneratereport = async () => {
    setisloading(true);

    const response = await fetch(`${route}/api/audit-report/`, {
      headers: { Authorization: `Bearer ${user.access}` },
    });

    const json = await response.json();
    if (json.code === "token_not_valid") {
      logout();
    }
    if (!response.ok) {
      went_wrong_toast(json.error);
    }
    if (response.ok) {
      let new_columns = [
        {
          dataField: "ndc",
          text: "NDC",
          sort: true,
          headerFormatter: headerstyle,
        },
        {
          dataField: "packagesize_billing",
          text: "Package Size",
          sort: true,
          headerFormatter: headerstyle,
        },
        {
          dataField: "quantity_billing",
          text: "Billing Qty",
          sort: true,
          headerFormatter: headerstyle,
        },
      ];

      json.vendor_files.map((item) => {
        new_columns.push({
          dataField: item,
          text: item,
          sort: true,
          headerFormatter: headerstyle,
        });
      });
      setcolumns(new_columns);
      dispatch({ type: "Set_data", payload: json.data });
      setisloading(false);
      custom_toast(json.message);
    }
  };
  const handledeletereport = async () => {
    setdelete_user(true);
  };

  return (
    <div className="user_main">
      <h1>Audit</h1>
      {isloading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <div className="card me-3">
        <div className="card-header d-flex justify-content-end ">
          <Button
            className="me-3"
            onClick={handledeletereport}
            variant="secondary"
            shadow
          >
            Clear Record
          </Button>
          <Button onClick={handlegeneratereport} variant="success" shadow>
            Generate Report
          </Button>
        </div>
        <div className="d-flex card-body p-0">
          <div className="col-md-6 border-end border-secondary p-3">
            <h5>Vendor Files</h5>

            <form
              onSubmit={handlesubmitvendor_files}
              className="d-flex align-items-center p-0"
            >
              <p className="col-md-8 ">{Fileurl_vendor?.name}</p>
              <div className="col-md-2 text-end">
                <input
                  onChange={handleimageselection_vendor}
                  id="select-file"
                  type="file"
                  accept=".xlsx"
                  ref={inputFile_vendor}
                  style={{ display: "none" }}
                />
                <Button className="mb-2" onClick={onButtonClick_vendor} shadow>
                  Choose file
                </Button>
              </div>
              <div className="col-md-2 text-end">
                <Button type="submit" variant="success" className="mb-2" shadow>
                  Upload file
                </Button>
              </div>
            </form>

            <div className="d-flex flex-wrap border-top  pt-3 ">
              {vendor_filesdata.map((item) => {
                return (
                  <div key={item.name} className="background p-2 me-3 rounded ">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => openimage(item)}
                    >
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="col-md-6 p-3">
            <h5>Billing Files</h5>

            <form
              onSubmit={handlesubmitbilling_files}
              className="d-flex align-items-center"
            >
              <p className="col-md-8">{Fileurl_billing?.name}</p>
              <div className="col-md-2 text-end">
                <input
                  onChange={handleimageselection_billing}
                  id="select-file"
                  type="file"
                  accept=".xlsx"
                  ref={inputFile_billing}
                  style={{ display: "none" }}
                />
                <Button className="mb-2" onClick={onButtonClick_billing} shadow>
                  Choose file
                </Button>
              </div>
              <div className="col-md-2 text-end">
                <Button type="submit" variant="success" className="mb-2" shadow>
                  Upload file
                </Button>
              </div>
            </form>

            <div className="border-top  pt-3 d-flex flex-wrap">
              {billing_filesdata.map((item) => {
                return (
                  <div key={item.name} className="background p-2 me-3 rounded ">
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => openimage(item)}
                    >
                      {item.name}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="card me-3 mt-3">
        <div className="card-body">
          <div style={{ zoom: ".8" }}>
            <ToolkitProvider
              keyField="ndc"
              data={Data}
              columns={columns}
              search
              exportCSV
            >
              {(props) => (
                <div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <ExportCSVButton
                        {...props.csvProps}
                        className="csvbutton  border bg-secondary text-light me-2"
                      >
                        Export CSV
                      </ExportCSVButton>
                      <Button
                        type="button"
                        className="p-1 ps-3 pe-3 me-2"
                        variant="outline-primary"
                        onClick={download}
                      >
                        <PictureAsPdfIcon /> PDF
                      </Button>
                      <Button
                        type="button"
                        className="p-1 ps-3 pe-3"
                        variant="outline-success"
                        onClick={print}
                      >
                        <PrintIcon /> Print
                      </Button>
                    </div>
                    <SearchBar {...props.searchProps} />
                  </div>

                  <hr />

                  <BootstrapTable
                    {...props.baseProps}
                    rowStyle={rowstyle}
                    striped
                    bootstrap4
                    condensed
                    wrapperClasses="table-resposive"
                  />
                </div>
              )}
            </ToolkitProvider>
          </div>
        </div>
      </div>

      {delete_user && (
        <Alert_before_delete
          show={delete_user}
          onHide={() => setdelete_user(false)}
          url={url_to_delete}
          dis_fun={handleconfirm}
          row_id={null}
        />
      )}
      <ToastContainer autoClose={3000} hideProgressBar={true} theme="dark" />
    </div>
  );
}

export default Audit;
