import React, { useState, useEffect, useRef } from "react";
import "./auditdetails.css";
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
import { useReactToPrint } from "react-to-print";

function AuditDetails() {
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
  const url_to_delete = `${route}/api/manage-files/?directory=billing_files,vendor_files_datewise`;

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
    dispatch_auth({ type: "Set_menuitem", payload: "auditdetail" });
    dispatch({ type: "Set_data", payload: [] });
    const fetchvendors = async () => {
      const response = await fetch(
        `${route}/api/vendor-file-formats/?reference=vendor_files_datewise`,
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

  function getExtension(filename) {
    return filename.split("/").shift();
  }

  const handleimageselection_vendor = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileurl_vendor({
        file: file,
        type: getExtension(file["type"]).toLowerCase(),
        name: file["name"],
      });
    }
  };

  const handleimageselection_billing = (e) => {
    const file = e.target.files[0];
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
      const response = await fetch(
        `${route}/api/upload-datewise-vendor-file/`,
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
        `${route}/api/upload-datewise-billing-file/`,
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
    const response = await fetch(`${route}/api/audit-report-detail/`, {
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
      setalldata(json.audit_data);
      setisloading(false);
      custom_toast(json.message);
    }
  };
  const handledeletereport = async () => {
    setdelete_user(true);
  };

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "print_class_purchase",
    pageStyle: "@page { size: A4 ; }",
    onAfterPrint: () => {},
  });

  return (
    <div className="user_main">
      <h1 className="mb-2">Audit Details</h1>
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
          <div
            className="col-md-6 p-3"
            style={{ borderRight: "1px solid gray" }}
          >
            <h5>Vendor Files</h5>

            <form onSubmit={handlesubmitvendor_files} className=" mt-3 p-0">
              <div className="row mb-3 ">
                <div className="col-6 ">
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

            <div className=" border-top col-11 pt-3 ">
              {vendor_filesdata.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="background p-2 col-4 text-center me-2 mb-2 rounded "
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
                <div className="col-6">
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

            <div className="border-top  pt-3 row col-11 ">
              {billing_filesdata.map((item) => {
                return (
                  <div
                    key={item.name}
                    className="background p-2 col-4 text-center me-2  mb-2 rounded "
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
          <Button
            onClick={handleprint}
            variant="success"
            className="mb-3"
            disabled={alldata?.length === 0}
            shadow
          >
            Print PDF
          </Button>
          <div style={{ zoom: ".8" }} ref={componentRef}>
            <h3 className="text-center">Audit Details Report</h3>
            {alldata.map((item) => {
              return (
                <div key={item.ndc} className="d-flex">
                  <div className="col-6">
                    <table className="table table-bordered">
                      <thead className="bg-success fw-bold">
                        <tr>
                          <td>NDC No: {item.ndc}</td>
                          <td colSpan={2}>
                            {item?.billing_data.length > 0
                              ? item?.billing_data[0]?.description
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td>Billing Date</td>
                          <td>Qty Bill</td>
                          <td>Source</td>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.billing_data.length > 0 ? (
                          item?.billing_data?.map((bill, index) => {
                            return (
                              <tr key={index}>
                                <td>{bill.date}</td>
                                <td>{bill.quantity}</td>
                                <td>{bill.source}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="text-center text-danger" colSpan={3}>
                              No Data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="col-6">
                    <table className="table table-bordered">
                      <thead className="bg-success fw-bold">
                        <tr>
                          <td>NDC No: {item.ndc}</td>
                          <td colSpan={2}>
                            {item?.vendor_data.length > 0
                              ? item?.vendor_data[0]?.description
                              : ""}
                          </td>
                        </tr>
                        <tr>
                          <td>Purchase Date</td>
                          <td>Qty Purchase</td>
                          <td>Source</td>
                        </tr>
                      </thead>
                      <tbody>
                        {item?.vendor_data.length > 0 ? (
                          item?.vendor_data?.map((bill, index) => {
                            return (
                              <tr key={index}>
                                <td>{bill.date}</td>
                                <td>{bill.quantity}</td>
                                <td>{bill.source}</td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td className="text-center text-danger" colSpan={3}>
                              No Data
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
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

export default AuditDetails;
