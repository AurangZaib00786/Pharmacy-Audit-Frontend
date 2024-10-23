import React, { useState, useEffect, useRef } from "react";
import "./audit.css";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
import { useAuthContext } from "../../hooks/useauthcontext";
import filterFactory from "react-bootstrap-table2-filter";
import Button from "react-bootstrap/Button";
import Alert_before_delete from "../alerts/alert_before_delete";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import XLSX from "xlsx-js-style";
import useLogout from "../../hooks/uselogout";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Select from "../selectfield/select";

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
  const url_to_delete = `${route}/api/manage-files/?directory=billing_files,vendor_files`;

  const [isloading, setisloading] = useState("");
  const [callagain_vendor, setcallagain_vendor] = useState(false);
  const [callagain_billing, setcallagain_billing] = useState(false);
  const [vendor, setvendor] = useState("");
  const [report_type, setreport_type] = useState({
    value: "combine",
    label: "Combine Report",
  });
  const [allvendors, setallvendors] = useState([]);
  const [billing, setbilling] = useState("");
  const [allbillings, setallbillings] = useState([]);
  const [alldata, setalldata] = useState([]);

  const { logout } = useLogout();
  useEffect(() => {
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

    fetchvendorfiles();
  }, [callagain_vendor]);

  useEffect(() => {
    setisloading(true);

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
    fetchbillingfiles();
  }, [callagain_billing]);

  useEffect(() => {
    dispatch_auth({ type: "Set_menuitem", payload: "audit" });
    dispatch({ type: "Set_data", payload: [] });
    const fetchvendors = async () => {
      const response = await fetch(
        `${route}/api/vendor-file-formats/?reference=vendor`,
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
        setallvendors(
          json.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          })
        );
      }
    };
    const fetchbilling = async () => {
      const response = await fetch(
        `${route}/api/vendor-file-formats/?reference=billing`,
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
        setallbillings(
          json.map((item) => {
            return {
              value: item.id,
              label: item.name,
            };
          })
        );
      }
    };

    fetchvendors();
    fetchbilling();
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

  const handleconfirm = () => {
    custom_toast("Data Deleted Succefully");
    setvendor_filesdata([]);
    setbilling_filesdata([]);
  };

  const [columns, setcolumns] = useState([
    {
      dataField: "id",
      text: "#",
      csvExport: false,
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      headerFormatter: headerstyle,
    },
    {
      dataField: "ndc",
      text: "NDC",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "description",
      text: "Description",
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
      formData.append(`vendor_file_format_id `, vendor.value);
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
        setcallagain_vendor(!callagain_vendor);
        setvendor("");
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
      formData.append(`billing_file_format_id `, billing.value);
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
        setcallagain_billing(!callagain_billing);
      }
    } catch (e) {
      setisloading(false);
    }
  };

  const vendor_sum_formatter = (cell, row, rowIndex) => {
    return cell !== "Not Exist" ? cell?.toFixed(2) : cell;
  };

  const handlegeneratereport = async () => {
    setisloading(true);
    setreport_type({
      value: "combine",
      label: "Combine Report",
    });
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
          dataField: "id",
          text: "#",
          csvExport: false,
          formatter: (cell, row, rowIndex) => rowIndex + 1,
          headerFormatter: headerstyle,
        },
        {
          dataField: "ndc",
          text: "NDC",
          sort: true,
          headerFormatter: headerstyle,
        },
        {
          dataField: "description",
          text: "Description",
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

      new_columns.push({
        dataField: "vendor_sum",
        text: "Vendor Total",
        sort: true,
        headerFormatter: headerstyle,
        formatter: vendor_sum_formatter,
      });
      new_columns.push({
        dataField: "result_unit",
        text: "Result (Unit)",
        sort: true,
        headerFormatter: headerstyle,
        formatter: vendor_sum_formatter,
      });
      new_columns.push({
        dataField: "result_package",
        text: "Result (Pkg)",
        sort: true,
        headerFormatter: headerstyle,
        formatter: vendor_sum_formatter,
      });

      setcolumns(new_columns);

      let optimize = json.data.map((item) => {
        if (item.packagesize_billing > 0) {
          var sum = json.vendor_files.reduce(
            (acc, row) => acc + item[row] * item.packagesize_billing,
            0
          );
          json.vendor_files.map(
            (row) =>
              (item[row] = Number(item[row]) * Number(item.packagesize_billing))
          );
        } else {
          var sum = json.vendor_files.reduce((acc, row) => acc + item[row], 0);
        }

        item["vendor_sum"] = sum;
        item["result_unit"] = sum - item.quantity_billing;
        item["result_package"] =
          item.packagesize_billing > 0
            ? (sum - item.quantity_billing) / item.packagesize_billing
            : "Not Exist";
        return item;
      });
      dispatch({ type: "Set_data", payload: optimize });
      setalldata(optimize);
      setisloading(false);
      custom_toast(json.message);
    }
  };
  const handledeletereport = async () => {
    setdelete_user(true);
  };

  const rowStyle = (row, rowIndex) => {
    const style = {};
    if (row.result_package < 0) {
      style.color = "red";
    } else if (row.result_package == 0) {
      style.color = "green";
    } else if (row.result_package == "Not Exist") {
      style.color = "blue";
    }

    return style;
  };

  const handlereportchange = (e) => {
    setreport_type(e);
    if (e.value === "zero") {
      var optimize = alldata.filter((item) => item.result_package == 0);
    } else if (e.value === "negative") {
      var optimize = alldata.filter((item) => item.result_package < 0);
    } else if (e.value === "positive") {
      var optimize = alldata.filter((item) => item.result_package > 0);
    } else {
      var optimize = alldata;
    }

    dispatch({ type: "Set_data", payload: optimize });
  };

  const handleExportToExcel = () => {
    let header = [];
    let header_datafield = [];
    columns.slice(1).map((item) => {
      header.push(item.text);
      header_datafield.push(item.dataField);
    });

    const ws = XLSX.utils.json_to_sheet(Data, {
      header: header_datafield,
    });

    const redcolor = {
      font: { color: { rgb: "FF0000" } },
    };
    const greencolor = {
      font: { color: { rgb: "008000" } },
    };
    const bluecolor = {
      font: { color: { rgb: "0000FF" } },
    };
    const blackcolor = {
      font: { color: { rgb: "000000" } },
    };

    const rowsToColor = Array.from({ length: Data.length }, (_, i) => i);

    // Apply the style to each cell in the specified rows
    rowsToColor.forEach((row) => {
      const item = Data[row];
      var color = blackcolor;
      if (item.result_package < 0) {
        color = redcolor;
      } else if (item.result_package == 0) {
        color = greencolor;
      } else if (item.result_package == "Not Exist") {
        color = bluecolor;
      }

      const colsInRow = Object.keys(item).length;
      for (let col = 0; col < colsInRow; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row + 1, c: col });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = color;
      }
    });

    // Create workbook and add worksheet
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A1" });

    ws["!cols"] = [
      { wch: 15 },
      { wch: 50 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
      { wch: 10 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 01");

    // Generate Excel file
    XLSX.writeFile(wb, "Audit Report.xlsx");
  };

  return (
    <div className="user_main">
      <h1 className="mb-2">Audit</h1>
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
        <div className="d-md-flex card-body p-0">
          <div className="col-md-6 border-md-end border-secondary p-3">
            <h5>Vendor Files</h5>

            <form onSubmit={handlesubmitvendor_files} className=" mt-3 p-0">
              <div className="d-flex jsutify-content-between align-items-center ">
                <div className="col-md-5 me-3">
                  <Select
                    options={allvendors}
                    value={vendor}
                    funct={(e) => setvendor(e)}
                    placeholder={"Vendor"}
                    required={true}
                  />
                </div>
                <p className="col-md-7">{Fileurl_vendor?.name}</p>
              </div>

              <div className="d-flex justify-content-end">
                <div className="me-3 text-end">
                  <input
                    onChange={handleimageselection_vendor}
                    id="select-file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    ref={inputFile_vendor}
                    style={{ display: "none" }}
                  />
                  <Button
                    style={{ width: "130px" }}
                    className="mb-2"
                    onClick={onButtonClick_vendor}
                    shadow
                  >
                    Choose file
                  </Button>
                </div>
                <div className=" text-end">
                  <Button
                    style={{ width: "110px" }}
                    type="submit"
                    variant="success"
                    className="mb-2"
                    shadow
                  >
                    Upload file
                  </Button>
                </div>
              </div>
            </form>

            <div className="d-flex flex-wrap border-top col-11 pt-3 ">
              {vendor_filesdata.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="background p-2 me-3 col-4 text-center  mb-2 rounded "
                  >
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

            <form onSubmit={handlesubmitbilling_files} className="mt-3 p-0">
              <div className="d-flex jsutify-content-between align-items-center ">
                <div className="col-md-5 me-3">
                  <Select
                    options={allbillings}
                    value={billing}
                    funct={(e) => setbilling(e)}
                    placeholder={"Billing"}
                    required={true}
                  />
                </div>
                <p className="col-md-7">{Fileurl_billing?.name}</p>
              </div>
              <div className="d-flex justify-content-end">
                <div className="me-3 text-end">
                  <input
                    onChange={handleimageselection_billing}
                    id="select-file"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    ref={inputFile_billing}
                    style={{ display: "none" }}
                  />
                  <Button
                    style={{ width: "130px" }}
                    className="mb-2"
                    onClick={onButtonClick_billing}
                    shadow
                  >
                    Choose file
                  </Button>
                </div>
                <div className=" text-end">
                  <Button
                    style={{ width: "110px" }}
                    type="submit"
                    variant="success"
                    className="mb-2"
                    shadow
                  >
                    Upload file
                  </Button>
                </div>
              </div>
            </form>

            <div className="border-top  pt-3 d-flex col-11 flex-wrap">
              {billing_filesdata.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="background p-2 me-3 col-4 text-center  mb-2 rounded "
                  >
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
              exportCSV={{
                onlyExportFiltered: true,
                exportAll: false,
                fileName: "Audit Report.csv",
              }}
              search
            >
              {(props) => (
                <div>
                  <div className="col-6 col-md-2">
                    <Select
                      options={[
                        { value: "combine", label: "Combine Report" },
                        { value: "positive", label: "Positive Report" },
                        { value: "negative", label: "Negtive Report" },
                        { value: "zero", label: "Zero Report" },
                      ]}
                      placeholder={"Report Type"}
                      value={report_type}
                      funct={handlereportchange}
                    />
                  </div>
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div>
                      <ExportCSVButton
                        {...props.csvProps}
                        className="csvbutton  border bg-secondary text-light me-2"
                      >
                        Export CSV
                      </ExportCSVButton>
                      <Button
                        onClick={handleExportToExcel}
                        variant="success"
                        shadow
                      >
                        Export Excel
                      </Button>
                    </div>
                    <SearchBar {...props.searchProps} />
                  </div>

                  <hr />

                  <BootstrapTable
                    {...props.baseProps}
                    rowStyle={rowStyle}
                    bootstrap4
                    condensed
                    filter={filterFactory()}
                    wrapperClasses="table-responsive"
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
