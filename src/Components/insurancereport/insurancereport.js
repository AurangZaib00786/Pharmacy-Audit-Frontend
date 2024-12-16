import React, { useState, useEffect, useRef } from "react";
import "./insurancereport.css";
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

function Insurancereport() {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { Data, dispatch } = UseaddDataContext();
  const { user, route, dispatch_auth } = useAuthContext();
  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;

  const [Fileurl_vendor, setFileurl_vendor] = useState("");
  const [Fileurl_billing, setFileurl_billing] = useState("");
  const [vendor_filesdata, setvendor_filesdata] = useState([]);
  const [billing_filesdata, setbilling_filesdata] = useState([]);

  const [delete_user, setdelete_user] = useState(false);
  const url_to_delete = `${route}/api/manage-files/?directory=insurance_billing_files,vendor_files`;

  const [isloading, setisloading] = useState("");
  const [callagain_vendor, setcallagain_vendor] = useState(false);
  const [callagain_billing, setcallagain_billing] = useState(false);
  const [vendor, setvendor] = useState("");
  const [report_type, setreport_type] = useState({
    value: "combine",
    label: "Combine Report",
  });
  const [allvendors, setallvendors] = useState([]);
  const [alldata, setalldata] = useState([]);
  const [billing, setbilling] = useState("");
  const [allbillings, setallbillings] = useState([]);
  const { logout } = useLogout();

  useEffect(() => {
    dispatch({ type: "Set_data", payload: [] });
    dispatch_auth({ type: "Set_menuitem", payload: "insurancereport" });
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
        `${route}/api/manage-files/?directory=insurance_billing_files`,
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

  const handleimageselection_vendor = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileurl_vendor({
        file: file,
        type: getExtension(file["type"]).toLowerCase(),
        name: file["name"],
      });
    }
  };

  const handleimageselection_billing = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileurl_billing({
        file: file,
        type: getExtension(file["type"]).toLowerCase(),
        name: file["name"],
      });
    }
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
      const response = await fetch(
        `${route}/api/upload-insurance-billing-file/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.access}`,
          },
          body: formData,
        }
      );
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
    const response = await fetch(`${route}/api/insurance-audit-report/`, {
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

      let optimize = json.reports.map((report) => {
        let new_data = report.data.map((item) => {
          if (item.packagesize_billing > 0) {
            var sum = json.vendor_files.reduce(
              (acc, row) => acc + item[row] * item.packagesize_billing,
              0
            );
            json.vendor_files.map(
              (row) =>
                (item[row] =
                  Number(item[row]) * Number(item.packagesize_billing))
            );
          } else {
            var sum = json.vendor_files.reduce(
              (acc, row) => acc + item[row],
              0
            );
          }

          item["vendor_sum"] = sum;
          item["result_unit"] = sum - item.quantity_billing;
          item["result_package"] =
            item.packagesize_billing > 0
              ? (sum - item.quantity_billing) / item.packagesize_billing
              : "Not Exist";
          return item;
        });
        report["data"] = new_data;
        report["hide"] = false;
        return report;
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
  // const rowStyle = { height: "10px" };

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
      var optimize = alldata?.filter((item) => item.result_package == 0);
    } else if (e.value === "negative") {
      var optimize = alldata?.filter((item) => item.result_package < 0);
    } else {
      var optimize = alldata;
    }

    dispatch({ type: "Set_data", payload: optimize });
  };

  function handlehideclick(company) {
    let optimize = Data.map((item) => {
      if (item.insurance_company_name === company) {
        item["hide"] = !item.hide;
      }
      return item;
    });
    dispatch({ type: "Set_data", payload: optimize });
  }

  const handleExportToExcel = (data, company) => {
    let header = [];
    columns.slice(1).map((item) => {
      header.push(item.dataField);
    });

    const ws = XLSX.utils.json_to_sheet(data, {
      header: header,
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

    const rowsToColor = Array.from({ length: data.length }, (_, i) => i);

    // Apply the style to each cell in the specified rows
    rowsToColor.forEach((row) => {
      const item = data[row];
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
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 01");

    // Generate Excel file
    XLSX.writeFile(wb, `${company} Insurance Report .xlsx`);
  };

  return (
    <div className="user_main">
      {/* <h1 className="mb-2">Insurance Report </h1> */}
      {isloading && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <div className="card me-3">
      <div className="card-header d-flex align-items-center justify-content-between ">
          <div>
            <h1 className='' style={{ fontSize: '20px' }}>Insurance report</h1>
          </div>
          <div>
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
        </div>
        <div className="d-md-flex card-body p-0">
          <div
            className="col-md-6 p-3"
            style={{ borderRight: "1px solid gray" }}
          >
            <h5>Vendor Files</h5>

            <form onSubmit={handlesubmitvendor_files} className=" mt-3 p-0">
              <div className="row mb-3">
                <div className="col-6">
                  <Select
                    options={allvendors}
                    value={vendor}
                    funct={(e) => setvendor(e)}
                    placeholder={"Vendor"}
                    required={true}
                    disable_margin={true}
                  />
                </div>
                <div className="col-6">
                  <input
                    onChange={handleimageselection_vendor}
                    type="file"
                    className="form-control"
                    accept=".xlsx,.xls,.csv"
                    required={true}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end">
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

            <div className="row border-top  pt-3 ">
              {vendor_filesdata.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="background p-2 col-4 me-2 text-center mb-2 rounded "
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
              <div className="row mb-3">
                <div className="col-md-6">
                  <Select
                    options={allbillings}
                    value={billing}
                    funct={(e) => setbilling(e)}
                    placeholder={"Billing"}
                    required={true}
                    disable_margin={true}
                  />
                </div>
                <div className="col-6">
                  <input
                    onChange={handleimageselection_billing}
                    type="file"
                    className="form-control"
                    accept=".xlsx,.xls,.csv"
                    required={true}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end">
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

            <div className="border-top col-12  pt-3 row">
              {billing_filesdata.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="background p-2  col-4 me-2 text-center  mb-2  rounded "
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
            {Data?.map((item) => {
              return (
                <ToolkitProvider
                  keyField="ndc"
                  data={item.data ? item.data : []}
                  columns={columns}
                  exportCSV={{ onlyExportFiltered: true, exportAll: false }}
                  search
                >
                  {(props) => (
                    <div className="mb-3">
                      <h4 className="mb-2 fw-bold">
                        {item.insurance_company_name} Report
                      </h4>
                      <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                        <div>
                          <ExportCSVButton
                            {...props.csvProps}
                            className="csvbutton  border bg-secondary text-light me-2"
                          >
                            Export CSV
                          </ExportCSVButton>
                          <Button
                            onClick={() =>
                              handleExportToExcel(
                                item.data,
                                item.insurance_company_name
                              )
                            }
                            className="me-2"
                            variant="success"
                            shadow
                          >
                            Export Excel
                          </Button>
                          <Button
                            onClick={() =>
                              handlehideclick(item.insurance_company_name)
                            }
                            variant="secondary"
                            shadow
                          >
                            {item.hide ? "View" : "Hide"}
                          </Button>
                        </div>
                        <SearchBar {...props?.searchProps} />
                      </div>

                      {!item.hide && (
                        <div>
                          <BootstrapTable
                            {...props.baseProps}
                            rowStyle={rowStyle}
                            bootstrap4
                            condensed
                            filter={filterFactory()}
                            wrapperClasses="table-responsive"
                          />
                          <hr />
                        </div>
                      )}
                    </div>
                  )}
                </ToolkitProvider>
              );
            })}
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

export default Insurancereport;
