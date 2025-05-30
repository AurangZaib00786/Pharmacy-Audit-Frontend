

import React, { useState, useEffect, useRef } from "react";
import "./audit.css";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
    Search,
    CSVExport,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import paginationFactory from 'react-bootstrap-table2-paginator';
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { UseaddDataContext } from "../../hooks/useadddatacontext";
import { useAuthContext } from "../../hooks/useauthcontext";
import { UseaddheaderContext } from "../../hooks/useaddheadercontext";
import filterFactory from "react-bootstrap-table2-filter";
import Button from "react-bootstrap/Button";
import Alert_before_delete from "../alerts/alert_before_delete";
import { ToastContainer } from "react-toastify";
import custom_toast from "../alerts/custom_toast";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Spinner from "react-bootstrap/Spinner";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
// import XLSX from "xlsx-js-style";
import useLogout from "../../hooks/uselogout";
import went_wrong_toast from "../alerts/went_wrong_toast";
import Select from "../selectfield/select";
import TextField from "@mui/material/TextField";
import { useReactToPrint } from "react-to-print";
import { FixedSizeList as List } from "react-window";
import { useMemo } from "react";
import PictureAsPdfIcon from "@material-ui/icons/PictureAsPdf";
import PrintIcon from "@material-ui/icons/Print";
import GlobalBackTab from "../GlobalBackTab";
import { FaFileAlt, FaDownload, FaTimes } from "react-icons/fa";
import success_toast from "../alerts/success_toast";
import BinNumberModal from "./BinNumberModal";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Link, useParams } from "react-router-dom";



function AuditReportsHistory() {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { Data, dispatch } = UseaddDataContext();
  const { user, route, dispatch_auth } = useAuthContext();
  const { current_user } = UseaddheaderContext();

  const path = useParams();

  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [Fileurl_vendor, setFileurl_vendor] = useState("");
  const [Fileurl_billing, setFileurl_billing] = useState("");
  const [File_balance, setFile_balance] = useState("");
  const [vendor_filesdata, setvendor_filesdata] = useState([]);
  const [billing_filesdata, setbilling_filesdata] = useState([]);
  const [balance_filesdata, setbalance_filesdata] = useState([]);
  const [delete_user, setdelete_user] = useState(false);
  const url_to_delete = `${route}/api/manage-files/?directory=billing_files,billing_files_datewise,consolidated_reports,opening_balance_files,insurance_billing_files,vendor_files,vendor_files_datewise&user_id=${current_user?.id}`;
  const single_file_to_delete = `${route}/api/manage-files/`;
  const [isloading, setisloading] = useState("");
  const [callagain_vendor, setcallagain_vendor] = useState(false);
  const [callagain_billing, setcallagain_billing] = useState(false);
  const [callagain_opening, setcallagain_opening] = useState(false);
  const [vendor, setvendor] = useState("");
  const [delete_file, setdelete_file] = useState(false);
  const [callagain, setcallagain] = useState(false);
  const [report_type, setreport_type] = useState({
    value: "combine",
    label: "Combine Report",
  });




  const [InsuranceDetailsData, SetInsuranceDetailsData] = useState([])
  const [vendorKeysPresent, setVendorKeysPresent] = useState([]);

  const [binnumbers, setbinnumbers] = useState(false);

  const handlebinnumberopen = () => {
    setbinnumbers(true);
  }

  const [insurance_report_type, setinsurance_report_type] = useState({
    value: "combine",
    label: "Combine Report",
  });
  const [search, setsearch] = useState("");

  const [audit_report_type, setaudit_report_type] = useState(["audit"]);

  const reportOptions = [
    current_user?.permissions?.includes("can_view_audit_report") && {
      value: "audit", label: "Audit Report",
    },
    current_user?.permissions?.includes("can_view_insurance_report") && {
      value: "insurance", label: "Insurance Report",
    },
    current_user?.permissions?.includes("can_view_insurance_detailed_report") && {
      value: "insurance_details", label: "Insurance Detailed Report",
    },
  ];


  console.log("current user", current_user)
  const [loadingReport, setLoadingReports] = useState(false);

  const handleCheckboxChange = (value) => {
    setLoadingReports(true); // start loading

    setTimeout(() => {
      setaudit_report_type((prev) => (prev.includes(value) ? [] : [value]));

      // Any other processing logic if needed...

      setLoadingReports(false); // stop loading after change
    }, 100); // Adjust delay if needed (e.g., 200-300ms for heavy processing)
  };



  const [searchNDC, setSearchNDC] = useState("");

  const [allvendors, setallvendors] = useState([]);
  const [billing, setbilling] = useState("");
  const [allbillings, setallbillings] = useState([]);
  const [alldata, setalldata] = useState([]);
  const [auditdata, setauditdata] = useState([]);
  const [insurancedata, setinsurancedata] = useState([]);
  const { logout } = useLogout();

  // console.log(alldata)
  useEffect(() => {
    const fetchvendorfiles = async () => {
      const response = await fetch(
        `${route}/api/manage-files/?directory=vendor_files&user_id=${current_user.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      if (response.status === 500) {
        toast.error("Internal server error! Please try again later.", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
        });
        setisloading(false)
        return; // stop execution
      }

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
  }, [callagain_vendor, current_user, callagain]);
  useEffect(() => {
    const fetchvendorfiles = async () => {
      const response = await fetch(
        `${route}/api/manage-files/?directory=opening_balance_files&user_id=${current_user.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      if (response.status === 500) {
        toast.error("Internal server error! Please try again later.", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
        });
        setisloading(false)
        return; // stop execution
      }

      const json = await response.json();
      if (json.code === "token_not_valid") {
        logout();
      }
      if (!response.ok) {

        went_wrong_toast(json.error);

      }

      if (response.ok) {
        setbalance_filesdata(json);
        setisloading(false);
      }
    };

    fetchvendorfiles();
  }, [callagain_opening, current_user, callagain]);

  useEffect(() => {
    const fetchbillingfiles = async () => {
      const response = await fetch(
        `${route}/api/manage-files/?directory=billing_files&user_id=${current_user.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );
      if (response.status === 500) {
        toast.error("Internal server error! Please try again later.", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
        });
        setisloading(false)
        return; // stop execution
      }

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
  }, [callagain_billing, current_user, callagain]);

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
      if (response.status === 500) {
        toast.error("Internal server error! Please try again later.", {
          position: toast.POSITION.TOP_RIGHT,
          pauseOnHover: false,
        });
        setisloading(false)
        return; // stop execution
      }

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
        if (response.status === 500) {
          went_wrong_toast("Internal Server Error. Please try again later.");
        } else {
          went_wrong_toast(json.error);
        }
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

  const [detailsColumns, setDetailsColumns] = useState([
    {
      dataField: "id",
      text: "#",
      csvExport: false,
      formatter: (cell, row, rowIndex) => rowIndex + 1,
      headerFormatter: headerstyle,
    },
    {
      dataField: "insurance_company",
      text: "Name",
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
      dataField: "packagesize",
      text: "Package Size",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "total_quantity",
      text: "Billing Qty",
      sort: true,
      headerFormatter: headerstyle,
    },
  ]);

  function getExtension(filename) {
    return filename.split("/").shift();
  }

  const [filename, setfilename] = useState("");

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

  const handleselection_balance = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile_balance({
        file: file,
        type: getExtension(file["type"]).toLowerCase(),
        name: file["name"],
      });
    }

  };

  // console.log("file balance", File_balance)
  // console.log("file blling balance", Fileurl_billing)

  const handleDeleteVendor = async (directory, fileName) => {
    const url = `${route}/api/manage-files/?&directory=${directory}&user_id=${current_user.id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Deleted Successfully")
        setcallagain(!callagain)

        // Optionally refresh the file list here or update the state
      } else {
        console.error("Failed to delete file", response);
      }
    } catch (error) {

      console.error("Error deleting file:", error);
    }
  };

  const handleDeleteBilling = async (directory, fileName) => {
    const url = `${route}/api/manage-files/?directory=${directory}&user_id=${current_user.id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Deleted Successfully")
        setcallagain(!callagain)

        // Optionally refresh the file list here or update the state
      } else {
        console.error("Failed to delete file", response);
      }
    } catch (error) {

      console.error("Error deleting file:", error);
    }
  };
  const handleDelete = async (directory, fileName) => {
    const url = `${route}/api/manage-files/?filename=${fileName}&directory=${directory}&user_id=${current_user.id}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Deleted Successfully")
        setcallagain(!callagain)

        // Optionally refresh the file list here or update the state
      } else {
        console.error("Failed to delete file", response);
      }
    } catch (error) {

      console.error("Error deleting file:", error);
    }
  };
  const [isprint, setisprint] = useState(false);

  const componentRef = useRef();
  const handleprint = useReactToPrint({
    content: () => componentRef.current,
    bodyClass: "print_class_purchase",
    pageStyle: "@page { size: A4 ; }",
    onBeforePrint: () => {
      setisprint(true);
    },
    onAfterPrint: () => {
      setisprint(false);
    },
  });


  const Searchndc = useMemo(() => {
    if (search) {
      return alldata.filter((item) => item.ndc == Number(search));
    } else {
      return alldata;
    }
  }, [search, alldata]);

  const PageSize = 20;
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setCurrentPage(0);
  }, [search]);

  const startIndex = currentPage * PageSize;
  const endIndex = startIndex + PageSize;

  const currentPageData = useMemo(() => {
    return Searchndc.slice(startIndex, endIndex);
  }, [Searchndc, startIndex, endIndex]);

  const goToNextPage = () => {
    if (currentPage < Math.ceil(Searchndc.length / PageSize) - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };
  // console.log(currentPageData)

  const openimage = (item) => {
    const cleanedPath = item.link.replace(/\\/g, "/");
    const fileUrl = `${route}${cleanedPath}?user_id=${current_user?.id}`;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.setAttribute("download", item.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlesubmitvendor_files = async (e) => {
    e.preventDefault();
    try {
      setisloading(true);
      const formData = new FormData();
      formData.append(`file`, Fileurl_vendor.file);
      formData.append(`vendor_file_format_id `, vendor.value);
      formData.append(`user_id `, current_user.id);
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
        setFileurl_vendor(null)
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
      formData.append(`user_id `, current_user.id);
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
        setFileurl_billing(null);
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
  const handlesubmitbalance_files = async (e) => {
    e.preventDefault();
    try {
      setisloading(true);
      const formData = new FormData();
      formData.append(`file`, File_balance.file);
      // formData.append(`billing_file_format_id `, billing.value);
      formData.append(`user_id `, current_user.id);
      const response = await fetch(`${route}/api/upload-opening-balance-file/`, {
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
        setFile_balance(null);
      }

      if (response.ok) {
        setFile_balance(null);
        custom_toast(json.message);
        setcallagain_opening(!callagain_opening);
      }
    } catch (e) {
      setisloading(false);
    }
  };

  const vendor_sum_formatter = (cell, row, rowIndex) => {
    return cell !== "Not Exist" ? cell?.toFixed(2) : cell;
  };

  const handlegeneratereport = async (selectedValue) => {
    setisloading(true);
    if (audit_report_type.includes("audit")) {
        setreport_type({
          value: "combine",
          label: "Combine Report",
        });
  
        const response = await fetch(`${route}/api/audit-report/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            user_id: current_user.id,
            saved_path: path.path,
        }),
            });
  
        if (response.status === 500) {
          toast.error("Internal server error! Please try again later.", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
          });
          setisloading(false);
          return;
        }
  
        const json = await response.json();
  
        if (json.code === "token_not_valid") {
          logout();
        }
  
        if (!response.ok) {
          went_wrong_toast(json.error);
          return;
        }
  
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
        ];
  
        // if (selectedValue === "by_quantity" || selectedValue === "combine") {
        //   new_columns.push(
        //     {
        //       dataField: "opening_balance",
        //       text: "Opening Balance (Unit)",
        //       sort: true,
        //       headerFormatter: headerstyle,
        //       formatter: vendor_sum_formatter,
        //     }
        //   );
        // }
      
        if ( selectedValue === "by_amount" ) {
          new_columns.push({
            dataField: "quantity_billing",
            text: "Billing Qty",
            sort: true,
            headerFormatter: headerstyle,
            formatter: vendor_sum_formatter,
          });
        }
      
        if (selectedValue === "by_amount" ) {
          new_columns.push({
            dataField: "amount_billing",
            text: "Billing Amount",
            sort: true,
            headerFormatter: headerstyle,
            formatter: vendor_sum_formatter,
          });
        }
  
        if (selectedValue === "by_quantity" || selectedValue === "combine") {
          new_columns.push(
            {
              dataField: "packagesize_billing",
              text: "Package Size",
              sort: true,
              headerFormatter: headerstyle,
            },
            {
              
                dataField: "opening_balance",
                text: "Opening Balance (Unit)",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              
  
            },
            {
              dataField: "quantity_billing",
              text: "Billing Qty",
              sort: true,
              headerFormatter: headerstyle,
              formatter: vendor_sum_formatter,
            }
          );
        }
  
        if (selectedValue === "by_quantity" || selectedValue === "combine") {
          json.vendor_files.forEach((item) => {
            new_columns.push({
              dataField: item,
              text: item,
              sort: true,
              headerFormatter: headerstyle,
              formatter: vendor_sum_formatter,
            });
          });
        }
  
        if (selectedValue === "by_quantity" || selectedValue === "combine") {
          new_columns.push({
            dataField: "vendor_sum",
            text: "Vendor Total",
            sort: true,
            headerFormatter: headerstyle,
            formatter: vendor_sum_formatter,
          });
        }
        if (selectedValue === "by_amount" ) {
          new_columns.push(
            {
              dataField: "unit_cost",
              text: "Unit Cost",
              sort: true,
              headerFormatter: headerstyle,
              formatter: vendor_sum_formatter,
            },
           
          );
        }
  
        if (
          selectedValue === "by_quantity" ||
          selectedValue === "by_amount" ||
          selectedValue === "combine"
        ) {
          new_columns.push({
            dataField: "result_unit",
            text: "Result (Unit)",
            sort: true,
            headerFormatter: headerstyle,
            formatter: vendor_sum_formatter,
          });
        }
  
        if (selectedValue === "by_quantity" || selectedValue === "combine") {
          new_columns.push({
            dataField: "result_package",
            text: "Result (Pkg)",
            sort: true,
            headerFormatter: headerstyle,
            formatter: vendor_sum_formatter,
          });
        }
  
        if (selectedValue === "by_quantity" || selectedValue === "combine") {
          new_columns.push({
            dataField: "closing_balance",
            text: "Closing Balance (Unit)",
            sort: true,
            headerFormatter: headerstyle,
            formatter: vendor_sum_formatter,
          });
        }
  
        if ( selectedValue === "combine") {
          new_columns.push(
            {
              dataField: "amount_billing",
              text: "Billing Amount",
              sort: true,
              headerFormatter: headerstyle,
              formatter: vendor_sum_formatter,
            },
            {
              dataField: "unit_cost",
              text: "Unit Cost",
              sort: true,
              headerFormatter: headerstyle,
              formatter: vendor_sum_formatter,
            },
           
          );
        }
  
  
        if (selectedValue === "by_amount" || selectedValue === "combine") {
          new_columns.push(
            // {
            //   dataField: "unit_cost",
            //   text: "Unit Cost",
            //   sort: true,
            //   headerFormatter: headerstyle,
            //   formatter: vendor_sum_formatter,
            // },
            {
              dataField: "amount_paid",
              text: "Difference Amount",
              sort: true,
              headerFormatter: headerstyle,
              formatter: vendor_sum_formatter,
            }
          );
        }
  
        setcolumns(new_columns);
  
        let optimize = json.data.map((item) => {
          let sum;
  
          if (item.packagesize_billing > 0) {
            sum = json.vendor_files.reduce(
              (acc, row) => acc + item[row] * item.packagesize_billing,
              0
            );
            json.vendor_files.forEach(
              (row) =>
                (item[row] = Number(item[row]) * Number(item.packagesize_billing))
            );
          } else {
            sum = json.vendor_files.reduce((acc, row) => acc + item[row], 0);
          }
  
          item["vendor_sum"] = sum;
          item["result_unit"] = sum - item.quantity_billing;
          item["result_package"] =
            item.packagesize_billing > 0
              ? (sum - item.quantity_billing) / item.packagesize_billing
              : "Not Exist";
  
          item["closing_balance"] =
            Number(item.result_unit) + Number(item.opening_balance) || 0;
          item["unit_cost"] =
            Number(item.quantity_billing) !== 0
              ? Number(item.amount_billing) / Number(item.quantity_billing)
              : 0;
          item["amount_paid"] =
            Number(item.unit_cost) * Number(item.result_unit);
  
          return item;
        });
  
        dispatch({ type: "Set_data", payload: optimize });
        setauditdata(optimize);
        setisloading(false);
        custom_toast(json.message);
      }

    if (audit_report_type.includes("audit_detail")) {
        setisloading(true);

        const response = await fetch(`${route}/api/audit-report-detail/?user_id=${current_user.id}`, {
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
    }
    if (audit_report_type.includes("insurance_details")) {
        setisloading(true);
  
        const response = await fetch(
          `${route}/api/insurance-audit-report-detail/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            user_id: current_user.id,
            saved_path: path.path,
        }),
            });
        if (response.status === 500) {
          toast.error("Internal server error! Please try again later.", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
          });
          setisloading(false)
          return;
        }
  
        const json = await response.json();
  
        if (json.code === "token_not_valid") {
          logout();
          return;
        }
  
        if (!response.ok) {
          went_wrong_toast(json.error);
          setisloading(false)
        }
  
  
        if (response.ok) {
          // 1. Clean vendor file names (remove .xlsx)
          const cleanedVendorFiles = json.vendor_files.map((file) =>
            file.replace(".xlsx", "")
          );
  
          // 2. Identify which vendor fields actually appear in the data
          let vendor_keys_present = new Set();
  
          json.consolidated_data.forEach((entry) => {
            entry.data.forEach((item) => {
              cleanedVendorFiles.forEach((vendor) => {
                if (item.hasOwnProperty(vendor)) {
                  vendor_keys_present.add(vendor);
                }
              });
            });
          });
  
          // 3. Build columns
          let new_details_columns = [
            {
              dataField: "id",
              text: "#",
              csvExport: false,
              formatter: (cell, row, rowIndex) => rowIndex + 1,
              headerFormatter: headerstyle,
            },
            {
              dataField: "insurance_company",
              text: "Name",
              sort: true,
              headerFormatter: headerstyle,
            },
            {
              dataField: "description",
              text: "Description",
              sort: true,
              headerFormatter: headerstyle,
            },
          
          ];
         
          if (selectedValue === "by_amount" ) {
            new_details_columns.push(
             
              {
                dataField: "total_quantity",
                text: "Billing Qty",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              }
            );
          }
  
          if (selectedValue === "by_amount" ) {
            new_details_columns.push(
              {
                dataField: "billing_amount",
                text: "Billing Amount ",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              }
            );
          }
  
          if (selectedValue === "by_quantity" || selectedValue === "combine") {
            new_details_columns.push(
              {
                dataField: "packagesize",
                text: "Package Size",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              },
            
  
              {
                dataField: "total_quantity",
                text: "Billing Qty",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              }
            );
          }
          if (selectedValue === "by_quantity" || selectedValue === "combine") {
  
            [...vendor_keys_present].forEach((vendor) => {
              new_details_columns.push({
                dataField: vendor,
                text: vendor,
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              });
            });
          }
  
       
          if (selectedValue === "by_quantity" || selectedValue === "combine") {
            new_details_columns.push(
              {
                dataField: "vendor_sum",
                text: "Vendor Total",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
  
            )
  
          }
          if (selectedValue === "by_amount" ) {
            new_details_columns.push(
              {
                dataField: "unit_cost",
                text: "Unit Cost",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
             
            );
          }
    
  
          if (selectedValue === "by_quantity" || selectedValue === "by_amount" || selectedValue === "combine") {
            new_details_columns.push(
              {
                dataField: "result_unit",
                text: "Result (Unit)",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
  
            )
          }
  
  
          if (selectedValue === "by_quantity" || selectedValue === "combine") {
            new_details_columns.push(
              {
                dataField: "result_package",
                text: "Result (Pkg)",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
  
            )
          }
  
        
          if ( selectedValue === "combine") {
            new_details_columns.push(
              {
                dataField: "billing_amount",
                text: "Billing Amount ",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              },
              {
                dataField: "unit_cost",
                text: "Unit Cost",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
             
            );
          }
  
          if (selectedValue === "by_amount" || selectedValue === "combine") {
            new_details_columns.push(
  
             
              {
                dataField: "amount_paid",
                text: "Difference Amount",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              }
            );
          }
  
          setDetailsColumns(new_details_columns);
  
          // 4. Process and calculate values
          const optimize = json.consolidated_data.map((report) => {
            const new_data = report.data.map((item) => {
              // Make sure all vendor keys exist
              [...vendor_keys_present].forEach((vendor) => {
                if (!item[vendor]) item[vendor] = 0;
              });
  
              let sum = 0;
  
              if (item.packagesize > 0) {
                sum = [...vendor_keys_present].reduce(
                  (acc, key) => acc + Number(item[key]) * Number(item.packagesize),
                  0
                );
  
                [...vendor_keys_present].forEach((key) => {
                  item[key] = Number(item[key]) * Number(item.packagesize);
                });
              } else {
                sum = [...vendor_keys_present].reduce(
                  (acc, key) => acc + Number(item[key]),
                  0
                );
              }
  
              item["vendor_sum"] = sum;
              item["result_unit"] = sum - Number(item.total_quantity);
              item["result_package"] =
                item.packagesize > 0
                  ? (sum - Number(item.total_quantity)) / Number(item.packagesize)
                  : "Not Exist";
              item["closing_balance"] =
                Number(item.result_unit) + Number(item.opening_balance) || 0;
              item["unit_cost"] =
                Number(item.total_quantity) !== 0
                  ? Number(item.billing_amount) / Number(item.total_quantity) || 0
                  : 0;
              item["amount_paid"] =
                Number(item.unit_cost) * Number(item.result_unit) || 0;
              return item;
            });
            setVendorKeysPresent([...vendor_keys_present]);
  
            report.data = new_data;
            return report;
          });
  
          SetInsuranceDetailsData(optimize);
          setisloading(false);
          custom_toast(json.message);
        }
      }
      if (audit_report_type.includes("insurance")) {
        setisloading(true);
        setinsurance_report_type({
          value: "combine",
          label: "Combine Report",
        });
        const response = await fetch(`${route}/api/insurance-audit-report/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access}`,
          },
          body: JSON.stringify({
            user_id: current_user.id,
            saved_path: path.path,
        }),        });
        if (response.status === 500) {
          toast.error("Internal server error! Please try again later.", {
            position: toast.POSITION.TOP_RIGHT,
            pauseOnHover: false,
          });
          setisloading(false)
          return; // stop execution
        }
  
        const json = await response.json();
        if (json.code === "token_not_valid") {
          logout();
        }
        if (!response.ok) {
  
          went_wrong_toast(json.error);
          setisloading(false)
  
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
  
            // {
            //   dataField: "amount_billing",
            //   text: "Amount Billing",
            //   sort: true,
            //   headerFormatter: headerstyle,
            // },
            // {
            //   dataField: "opening_balance",
            //   text: "Opening Balance (Unit)",
            //   sort: true,
            //   headerFormatter: headerstyle,
            // },
            // {
            //   dataField: "packagesize_billing",
            //   text: "Package Size",
            //   sort: true,
            //   headerFormatter: headerstyle,
            // },
            // {
            //   dataField: "quantity_billing",
            //   text: "Billing Qty",
            //   sort: true,
            //   headerFormatter: headerstyle,
            // },
          ];
          // if (selectedValue === "by_quantity" || selectedValue === "combine") {
          //   new_columns.push(
          //     {
          //       dataField: "opening_balance",
          //       text: "Opening Balance (Unit)",
          //       sort: true,
          //       headerFormatter: headerstyle,
          //       formatter: vendor_sum_formatter,
          //     },
  
          //   )
          // }
          if (selectedValue === "by_amount" ) {
            new_columns.push(
              {
                dataField: "quantity_billing",
                text: "Billing Qty",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              }
            );
          }
          if (selectedValue === "by_amount" ) {
            new_columns.push(
              {
                dataField: "amount_billing",
                text: "Billing Amount ",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              }
            );
          }
  
          if (selectedValue === "by_quantity" || selectedValue === "combine") {
            new_columns.push(
              {
                dataField: "packagesize_billing",
                text: "Package Size",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              },
              {
                dataField: "quantity_billing",
                text: "Billing Qty",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              }
            );
          }
  
          if (selectedValue === "by_quantity" || selectedValue === "combine") {
            json.vendor_files.forEach((item) => {
              new_columns.push({
                dataField: item,
                text: item,
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              });
            });
  
          }
  
          // json.vendor_files.map((item) => {
          //   new_columns.push({
          //     dataField: item,
          //     text: item,
          //     sort: true,
          //     headerFormatter: headerstyle,
          //   });
          // });
  
          // if (selectedValue === "by_quantity" || selectedValue === "combine") {
          //   json.vendor_files.forEach((item) => {
          //     new_columns.push({
          //       dataField: item,
          //       text: item,
          //       sort: true,
          //       headerFormatter: headerstyle,
          //       formatter: vendor_sum_formatter,
  
          //     });
          //   });
  
          // }
  
  
          // Final summary columns
          if (selectedValue === "by_quantity" || selectedValue === "combine") {
            new_columns.push(
              {
                dataField: "vendor_sum",
                text: "Vendor Total",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
  
            )
  
          }
          if (selectedValue === "by_amount" ) {
            new_columns.push(
              {
                dataField: "unit_cost",
                text: "Unit Cost",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
             
            );
          }
          if (selectedValue === "by_quantity" || selectedValue === "by_amount" || selectedValue === "combine") {
            new_columns.push(
              {
                dataField: "result_unit",
                text: "Result (Unit)",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
  
            )
          }
  
          if (selectedValue === "by_quantity" || selectedValue === "combine") {
            new_columns.push(
              {
                dataField: "result_package",
                text: "Result (Pkg)",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
  
            )
          }
  
          // if (selectedValue === "by_quantity" || selectedValue === "combine") {
          //   new_columns.push(
          //     {
          //       dataField: "closing_balance",
          //       text: "Closing Balance (Unit)",
          //       sort: true,
          //       headerFormatter: headerstyle,
          //       formatter: vendor_sum_formatter,
          //     },
  
          //   )
          // }
  
          if (selectedValue === "combine") {
            new_columns.push(
  
              {
                dataField: "amount_billing",
                text: "Billing Amount ",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
  
              },
              {
                dataField: "unit_cost",
                text: "Unit Cost",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              },
              
           
            );
          }
  
  
          // Continue conditionally if needed
          if (selectedValue === "by_amount" || selectedValue === "combine") {
            new_columns.push(
  
              // {
              //   dataField: "unit_cost",
              //   text: "Unit Cost",
              //   sort: true,
              //   headerFormatter: headerstyle,
              //   formatter: vendor_sum_formatter,
              // },
              {
                dataField: "amount_paid",
                text: "Difference Amount",
                sort: true,
                headerFormatter: headerstyle,
                formatter: vendor_sum_formatter,
              }
            );
          }
  
          // new_columns.push({
          //   dataField: "vendor_sum",
          //   text: "Vendor Total",
          //   sort: true,
          //   headerFormatter: headerstyle,
          //   formatter: vendor_sum_formatter,
          // });
          // new_columns.push({
          //   dataField: "result_unit",
          //   text: "Result (Unit)",
          //   sort: true,
          //   headerFormatter: headerstyle,
          //   formatter: vendor_sum_formatter,
          // });
          // new_columns.push({
          //   dataField: "result_package",
          //   text: "Result (Pkg)",
          //   sort: true,
          //   headerFormatter: headerstyle,
          //   formatter: vendor_sum_formatter,
          // });
          // new_columns.push({
          //   dataField: "closing_balance",
          //   text: "Closing Balance (Unit)",
          //   sort: true,
          //   headerFormatter: headerstyle,
          //   formatter: vendor_sum_formatter,
          // });
          // new_columns.push({
          //   dataField: "unit_cost",
          //   text: "Unit Cost",
          //   sort: true,
          //   headerFormatter: headerstyle,
          //   formatter: vendor_sum_formatter,
          // });
          // new_columns.push({
          //   dataField: "amount_paid",
          //   text: "Amount Paid",
          //   sort: true,
          //   headerFormatter: headerstyle,
          //   formatter: vendor_sum_formatter,
          // });
  
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
              item["closing_balance"] =
                Number(item.result_unit) + Number(item.opening_balance) || 0;
              item["unit_cost"] =
                Number(item.quantity_billing) !== 0
                  ? Number(item.amount_billing) / Number(item.quantity_billing)
                  : 0;
              item["amount_paid"] =
                Number(item.unit_cost) * Number(item.result_unit);
              return item;
            });
            report["data"] = new_data;
            report["hide"] = false;
            return report;
          });
          dispatch({ type: "Set_data", payload: optimize });
          setinsurancedata(optimize);
          setisloading(false);
          custom_toast(json.message);
        }
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
  const options = [
    { value: "combine", label: "Combine Report" },
    { value: "positive", label: "Positive Report" },
    { value: "negative", label: "Negative Report" },
    { value: "zero", label: "Zero Report" },
  ];
  const optionsAmount = [

    { value: "by_quantity", label: "By Quantity" },
    { value: "by_amount", label: "By Amount" },
    { value: "combine", label: "Combine" },
  ];

  const [selectedOptions, setSelectedOptions] = useState({ value: "by_quantity", label: "By Quantity" });

  const handleReportOptionChange = (e) => {
    const selectedValue = e.target.value;
    const selected = optionsAmount.find((opt) => opt.value === selectedValue);
    setSelectedOptions(selected);
    handlegeneratereport(selectedValue);
  };


  const handleButtonClick = () => {
    handlegeneratereport(selectedOptions.value);
  };




  console.log("selected option", selectedOptions);


  const handlereportchange = (e) => {
    // Find the selected option based on its value
    const selectedOption = options.find((option) => option.value === e.target.value);

    if (selectedOption) {
      // Update the state with both value and label
      setreport_type(selectedOption);

      // Apply the conditions based on the value
      let optimize;
      if (selectedOption.value === "zero") {
        optimize = auditdata.filter((item) => item.result_package == 0);
      } else if (selectedOption.value === "negative") {
        optimize = auditdata.filter((item) => item.result_package < 0);
      } else if (selectedOption.value === "positive") {
        optimize = auditdata.filter((item) => item.result_package > 0);
      } else {
        optimize = auditdata;
      }

      // Dispatch the filtered data
      dispatch({ type: "Set_data", payload: optimize });
    }
  };

  const [filteredData, setFilteredData] = useState([]); // New state for filtered data

  useEffect(() => {
    setFilteredData(insurancedata); // Set initial filtered data when insurancedata is updated
  }, [insurancedata]);


  const ITEMS_PER_PAGE = 20;
  const [currentDetailPage, SetcurrentDetailPage] = useState(1);

  // === 1. Filter by NDC (search input) ===
  const filteredByNDC = InsuranceDetailsData.filter((ndcItem) =>
    ndcItem.ndc.toString().includes(searchNDC)
  );

  // === 2. Filter rows within each NDC based on report_type ===
  const fullyFilteredData = filteredByNDC
    .map((ndcItem) => {
      const filteredRows = ndcItem.data.filter((item) => {
        const pkg = Number(item.result_package);
        if (report_type.value === "positive") return pkg > 0;
        if (report_type.value === "negative") return pkg < 0;
        if (report_type.value === "zero") return pkg === 0;
        return true; // "combine"
      });

      return { ...ndcItem, data: filteredRows };
    })
    .filter((ndcItem) => ndcItem.data.length > 0); // remove empty NDCs

  // === 3. Pagination on final filtered data ===
  const totalItems = fullyFilteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedData = fullyFilteredData.slice(
    (currentDetailPage - 1) * ITEMS_PER_PAGE,
    currentDetailPage * ITEMS_PER_PAGE
  );

  const startIndexDetail = (currentDetailPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndexDetail = Math.min(currentDetailPage * ITEMS_PER_PAGE, totalItems);

  const goToDetailPreviousPage = () => SetcurrentDetailPage((prev) => Math.max(prev - 1, 1));
  const goToDetailNextPage = () => SetcurrentDetailPage((prev) => Math.min(prev + 1, totalPages));


  const flattenInsuranceData = (dataToExport = InsuranceDetailsData) => {
    const flattened = [];

    dataToExport.forEach((ndcBlock) => {
      const ndc = ndcBlock.ndc;
      const description = ndcBlock.data?.[0]?.description || "";

      ndcBlock.data.forEach((entry) => {
        const flatEntry = {
          ndc,
          description,
          insurance_company: entry.insurance_company,
          packagesize: entry.packagesize,
          total_quantity: entry.total_quantity,
        };

        // Add dynamic fields like "TRICARE" if they exist
        Object.keys(entry).forEach((key) => {
          if (!["insurance_company", "packagesize", "total_quantity", "description"].includes(key)) {
            flatEntry[key] = entry[key];
          }
        });

        flattened.push(flatEntry);
      });
    });

    return flattened;
  };


  const handleExportDetailsToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Insurance Details");
  
    fullyFilteredData.forEach((item) => {
      worksheet.addRow([`NDC: ${item.ndc}`]);
  
      // Build the header row
      let headers = ["#", "Name", "Description"];
  
      if (selectedOptions.value === "by_amount") {
        headers.push("Billing Qty");
      }
  
      if (selectedOptions.value === "by_amount") {
        headers.push("Billing Amount");
      }
  
      if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
        headers.push("Package Size", "Billing Qty");
      }
  
      if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
        headers.push(...vendorKeysPresent);
      }
  
      if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
        headers.push("Vendor Total");
      }
  
      if (selectedOptions.value === "by_amount") {
        headers.push("Unit Cost");
      }
  
      if (
        selectedOptions.value === "by_quantity" ||
        selectedOptions.value === "by_amount" ||
        selectedOptions.value === "combine"
      ) {
        headers.push("Result (Unit)");
      }
  
      if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
        headers.push("Result (Pkg)");
      }
  
      if (selectedOptions.value === "combine") {
        headers.push("Billing Amount", "Unit Cost");
      }
  
      if (selectedOptions.value === "by_amount" || selectedOptions.value === "combine") {
        headers.push("Difference Amount");
      }
  
      worksheet.addRow(headers);
  
      // Add data rows
      item.data.forEach((entry, rowIndex) => {
        const row = [
          rowIndex + 1, // "#"
          entry.insurance_company,
          entry.description,
        ];
  
        if (selectedOptions.value === "by_amount") {
          row.push(entry.total_quantity ?? "");
        }
  
        if (selectedOptions.value === "by_amount") {
          row.push(entry.billing_amount ?? "");
        }
  
        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
          row.push(entry.packagesize ?? "", entry.total_quantity ?? "");
        }
  
        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
          vendorKeysPresent.forEach((vendor) => {
            row.push(entry[vendor] ?? "");
          });
        }
  
        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
          row.push(entry.vendor_sum ?? "");
        }
  
        if (selectedOptions.value === "by_amount") {
          row.push(entry.unit_cost ?? "");
        }
  
        if (
          selectedOptions.value === "by_quantity" ||
          selectedOptions.value === "by_amount" ||
          selectedOptions.value === "combine"
        ) {
          row.push(entry.result_unit ?? "");
        }
  
        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
          row.push(entry.result_package ?? "");
        }
  
        if (selectedOptions.value === "combine") {
          row.push(entry.billing_amount ?? "", entry.unit_cost ?? "");
        }
  
        if (selectedOptions.value === "by_amount" || selectedOptions.value === "combine") {
          row.push(entry.amount_paid ?? "");
        }
  
        const excelRow = worksheet.addRow(row);
  
        // Apply conditional coloring based on `result_package`
        let fillColor = null;
        if (entry.result_package < 0) fillColor = "FFCCCC"; // Red-ish
        else if (entry.result_package == 0) fillColor = "CCFFCC"; // Green-ish
        else if (entry.result_package === "Not Exist") fillColor = "CCE5FF"; // Blue-ish
  
        if (fillColor) {
          excelRow.eachCell((cell) => {
            cell.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: fillColor },
            };
          });
        }
      });
    });
  
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "InsuranceDetails.xlsx";
    anchor.click();
    window.URL.revokeObjectURL(url);
  };
  
  



  const handleDetailsExportCSV = () => {
    let csvContent = "";

    fullyFilteredData.forEach((item) => {
        csvContent += `NDC: ${item.ndc}\n`;

        // Build headers dynamically (same as new_details_columns logic)
        const headers = ["#", "Name", "Description"];

        if (selectedOptions.value === "by_amount") {
            headers.push("Billing Qty", "Billing Amount");
        }

        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
            headers.push("Package Size", "Billing Qty");
        }

        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
            vendorKeysPresent.forEach((vendor) => {
                headers.push(vendor);
            });
        }

        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
            headers.push("Vendor Total");
        }

        if (selectedOptions.value === "by_amount") {
            headers.push("Unit Cost");
        }

        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "by_amount" || selectedOptions.value === "combine") {
            headers.push("Result (Unit)");
        }

        if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
            headers.push("Result (Pkg)");
        }

        if (selectedOptions.value === "combine") {
            headers.push("Billing Amount", "Unit Cost");
        }

        if (selectedOptions.value === "by_amount" || selectedOptions.value === "combine") {
            headers.push("Difference Amount");
        }

        // Add Row Color Hint (optional, keeps your existing idea)
        headers.push("Row Color Hint");

        csvContent += headers.join(",") + "\n";

        item.data.forEach((entry, index) => {
            let colorHint = "";
            if (entry.result_package < 0) colorHint = "Negative";
            else if (entry.result_package == 0) colorHint = "Zero";
            else if (entry.result_package === "Not Exist") colorHint = "Not Exist";

            const row = [
                index + 1, // Row number
                `"${entry.insurance_company}"`,
                `"${entry.description}"`,
            ];

            if (selectedOptions.value === "by_amount") {
                row.push(
                    entry.total_quantity ?? "",
                    entry.billing_amount ?? ""
                );
            }

            if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
                row.push(
                    entry.packagesize ?? "",
                    entry.total_quantity ?? ""
                );
            }

            if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
                vendorKeysPresent.forEach((vendor) => {
                    row.push(entry[vendor] ?? "");
                });
            }

            if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
                row.push(entry.vendor_sum ?? "");
            }

            if (selectedOptions.value === "by_amount") {
                row.push(entry.unit_cost ?? "");
            }

            if (selectedOptions.value === "by_quantity" || selectedOptions.value === "by_amount" || selectedOptions.value === "combine") {
                row.push(entry.result_unit ?? "");
            }

            if (selectedOptions.value === "by_quantity" || selectedOptions.value === "combine") {
                row.push(entry.result_package ?? "");
            }

            if (selectedOptions.value === "combine") {
                row.push(
                    entry.billing_amount ?? "",
                    entry.unit_cost ?? ""
                );
            }

            if (selectedOptions.value === "by_amount" || selectedOptions.value === "combine") {
                row.push(entry.amount_paid ?? "");
            }

            // Always push color hint at the end
            row.push(colorHint);

            csvContent += row.join(",") + "\n";
        });

        csvContent += "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "insurance_details_grouped.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};



  // const handleinsurancereportchange = (e) => {
  //   setinsurance_report_type(e);

  // let filteredReports = insurancedata.map((report) => {
  //   let filteredData = [];
  //   if (e.value === "zero") {
  //     filteredData = report.data.filter((item) => item.result_package === 0);
  //   } else if (e.value === "negative") {
  //     filteredData = report.data.filter((item) => item.result_package < 0);
  //   } else if (e.value === "positive") {
  //     filteredData = report.data.filter((item) => item.result_package > 0);
  //   } else {
  //     filteredData = report.data; // Default case: all data
  //   }
  //   return { ...report, data: filteredData }; // Update filtered data for the report
  // });

  // setFilteredData(filteredReports); // Update the state with filtered data
  // };
  const handleInsurancereporttchange = (e) => {
    // Find the selected option based on its value
    const selectedOption = options.find((option) => option.value === e.target.value);

    if (selectedOption) {
      // Update the state with both value and label
      setreport_type(selectedOption);

      // Apply the conditions based on the value
      let filteredReports = insurancedata.map((report) => {
        let filteredData = [];
        if (selectedOption.value === "zero") {
          filteredData = report.data.filter((item) => item.result_package == 0);
        } else if (selectedOption.value === "negative") {
          filteredData = report.data.filter((item) => item.result_package < 0);
        } else if (selectedOption.value === "positive") {
          filteredData = report.data.filter((item) => item.result_package > 0);
        } else {
          filteredData = report.data; // Default case: all data
        }
        return { ...report, data: filteredData }; // Update filtered data for the report
      });

      setFilteredData(filteredReports);
    }
  };

  const handleInsurancedetailereporttchange = (e) => {
    // Find the selected option based on its value
    const selectedOption = options.find((option) => option.value === e.target.value);

    if (selectedOption) {
      // Update the state with both value and label
      setreport_type(selectedOption);

      // Apply the conditions based on the value
      let filteredReports = insurancedata.map((report) => {
        let filteredData = [];
        if (selectedOption.value === "zero") {
          filteredData = report.data.filter((item) => item.result_package == 0);
        } else if (selectedOption.value === "negative") {
          filteredData = report.data.filter((item) => item.result_package < 0);
        } else if (selectedOption.value === "positive") {
          filteredData = report.data.filter((item) => item.result_package > 0);
        } else {
          filteredData = report.data; // Default case: all data
        }
        return { ...report, data: filteredData }; // Update filtered data for the report
      });

      setFilteredData(filteredReports);
    }
  };

  const handleExportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 01');

    // Dynamically choose columns based on selectedValue
    let exportColumns = columns.slice(1); // skip index column

    // Ensure json.vendor_files is available
    const vendorFiles = Data?.vendor_files || [];

    if (selectedOptions === "by_amount") {
      exportColumns = exportColumns.filter(col =>
        [
          "description",
          "ndc",
          "amount_billing",
          "unit_cost",
          "amount_paid",
          "result_unit",
        ].includes(col.dataField)
      );
    } else if (selectedOptions === "by_quantity") {
      exportColumns = exportColumns.filter(col =>
        [
          "description",
          "ndc",
          "opening_balance",
          "packagesize_billing",
          "quantity_billing",
          ...vendorFiles, // Now using vendorFiles
          "vendor_sum",
          "result_unit",
          "result_package",
          "closing_balance",
        ].includes(col.dataField)
      );
    } else if (selectedOptions === "combine") {
      // keep all columns (already handled)
    }

    // Add header row
    const header = exportColumns.map(item => item.text);
    worksheet.addRow(header);

    // Add data rows
    Data.forEach(item => {
      const rowData = exportColumns.map(col => item[col.dataField]);
      const row = worksheet.addRow(rowData);

      // Apply styles based on result_package
      let fontColor = { argb: '000000' };

      if (item.result_package < 0) {
        fontColor = { argb: 'FF0000' };
      } else if (item.result_package == 0) {
        fontColor = { argb: '008000' };
      } else if (item.result_package === 'Not Exist') {
        fontColor = { argb: '0000FF' };
      }

      row.eachCell((cell) => {
        cell.font = { color: fontColor };
      });
    });

    // Set column widths (adjust as needed)
    worksheet.columns = exportColumns.map(() => ({ width: 15 }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Audit Report.xlsx';
    link.click();
  };

  const handleExportToCSV = () => {
    let csvContent = "";

    // Dynamically choose columns based on selectedOptions
    let exportColumns = columns.slice(1); // skip index column

    // Ensure vendor_files is available
    const vendorFiles = Data?.vendor_files || [];

    if (selectedOptions === "by_amount") {
      exportColumns = exportColumns.filter(col =>
        [
          "description",
          "ndc",
          "amount_billing",
          "unit_cost",
          "amount_paid",
          "result_unit",
        ].includes(col.dataField)
      );
    } else if (selectedOptions === "by_quantity") {
      exportColumns = exportColumns.filter(col =>
        [
          "description",
          "ndc",
          "opening_balance",
          "packagesize_billing",
          "quantity_billing",
          ...vendorFiles, // vendor files dynamic
          "vendor_sum",
          "result_unit",
          "result_package",
          "closing_balance",
        ].includes(col.dataField)
      );
    } else if (selectedOptions === "combine") {
      // keep all columns (already handled)
    }

    // Add header row
    const header = exportColumns.map(item => item.text);
    csvContent += header.join(",") + "\n";

    // Add data rows
    Data.forEach(item => {
      const rowData = exportColumns.map(col => {
        const value = item[col.dataField];
        // Wrap with quotes if contains a comma (for CSV safety)
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`;
        }
        return value ?? "";
      });
      csvContent += rowData.join(",") + "\n";
    });

    // Trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Audit_Report.csv';
    link.click();
  };




  const handleExportToExcelInsurance = async (insuranceData, insuranceCompanyName) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Audit Report');

    // Prepare header and data fields dynamically based on the selected value
    let header = [];
    let headerDataField = [];

    // Define the columns that will be used in the export based on selectedValue
    let exportColumns = columns.slice(1); // Exclude the index column

    // Filter columns based on selected value
    if (selectedOptions === "by_amount") {
      exportColumns = exportColumns.filter(col =>
        [
          "description",
          "ndc",
          "amount_billing",
          "unit_cost",
          "amount_paid",
          "result_unit",
        ].includes(col.dataField)
      );
    } else if (selectedOptions === "by_quantity") {
      exportColumns = exportColumns.filter(col =>
        [
          "description",
          "ndc",
          "opening_balance",
          "packagesize_billing",
          "quantity_billing",
          ...insuranceData[0]?.vendor_files || [], // vendor_files may be available in the data
          "vendor_sum",
          "result_unit",
          "result_package",
          "closing_balance",
        ].includes(col.dataField)
      );
    } else if (selectedOptions === "combine") {
      // Keep all columns for 'combine'
    }

    // Prepare header based on filtered columns
    exportColumns.forEach((item) => {
      header.push(item.text);
      headerDataField.push(item.dataField);
    });

    // Add header row
    worksheet.addRow(header);

    // Add data rows based on filtered columns
    insuranceData.forEach((row) => {
      const rowData = headerDataField.map((field) => row[field]);
      const newRow = worksheet.addRow(rowData);

      // Determine fill color based on result_package
      let fillColor = null;
      if (row.result_package < 0) {
        fillColor = 'FA5053';       // Bold Red
      } else if (row.result_package === 0) {
        fillColor = 'CCFF01';       // Bold Green
      } else if (row.result_package === 'Not Exist') {
        fillColor = '6395EE';       // Bold Blue
      }

      // Apply fill color to the entire row (including empty cells up to header length)
      if (fillColor) {
        for (let colIndex = 1; colIndex <= header.length; colIndex++) {
          const cell = newRow.getCell(colIndex);
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: fillColor },
          };
        }
      }
    });

    // Set column widths dynamically based on the header length
    const columnWidths = exportColumns.map(() => ({ width: 15 }));
    worksheet.columns = columnWidths.slice(0, header.length);

    // Create buffer and save the file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const fileName = `${insuranceCompanyName}_Audit_Report.xlsx`;
    saveAs(blob, fileName);
  };

  const handleExportToCSVInsurance = (insuranceData, insuranceCompanyName) => {
    let csvContent = "";

    // Prepare header and data fields dynamically based on the selected value
    let header = [];
    let headerDataField = [];

    // Define the columns that will be used in the export based on selectedOptions
    let exportColumns = columns.slice(1); // Exclude the index column

    if (selectedOptions.value === "by_amount") {
      exportColumns = exportColumns.filter(col =>
        [
          "description",
          "ndc",
          "amount_billing",
          "unit_cost",
          "amount_paid",
          "result_unit",
        ].includes(col.dataField)
      );
    } else if (selectedOptions.value === "by_quantity") {
      exportColumns = exportColumns.filter(col =>
        [
          "description",
          "ndc",
          "opening_balance",
          "packagesize_billing",
          "quantity_billing",
          ...(insuranceData[0]?.vendor_files || []),  // If vendor_files exists
          "vendor_sum",
          "result_unit",
          "result_package",
          "closing_balance",
        ].includes(col.dataField)
      );
    } else if (selectedOptions.value === "combine") {
      // Keep all columns for 'combine'
      // No filtering needed
    }

    // Prepare header based on filtered columns
    exportColumns.forEach((item) => {
      header.push(item.text);
      headerDataField.push(item.dataField);
    });

    // Add header row
    csvContent += header.join(",") + "\n";

    // Add data rows based on filtered columns
    insuranceData.forEach((row) => {
      const rowData = headerDataField.map((field) => {
        const cellValue = row[field];
        // Handle commas by wrapping in quotes if needed
        return typeof cellValue === "string" && cellValue.includes(",")
          ? `"${cellValue}"`
          : cellValue ?? "";
      });
      csvContent += rowData.join(",") + "\n";
    });

    // Create Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${insuranceCompanyName}_Audit_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };




  const handleExportCSV = () => {
    if (!alldata || alldata.length === 0) {
      alert("No data available to export.");
      return;
    }

    const csvRows = [];

    csvRows.push("NDC No, Billing Date, Description, Quantity, Package Size, Source");

    alldata.forEach((item) => {
      if (item.billing_data.length > 0) {
        item.billing_data.forEach((bill) => {
          csvRows.push(
            `"${item.ndc || ""}","${bill.date || ""}","${bill.description || ""}","${bill.quantity || ""}","${bill.packagesize || ""}","${bill.source || ""}"`
          );
        });
      } else {
        csvRows.push(`"${item.ndc || ""}","","","","",""`);
      }
    });

    csvRows.push("\nNDC No, Purchase Date, Description, Quantity, Source");

    alldata.forEach((item) => {
      if (item.vendor_data.length > 0) {
        item.vendor_data.forEach((vendor) => {
          csvRows.push(
            `"${item.ndc || ""}","${vendor.date || ""}","${vendor.description || ""}","${vendor.quantity || ""}","${vendor.source || ""}"`
          );
        });
      } else {
        csvRows.push(`"${item.ndc || ""}","","","",""`);
      }
    });

    const csvString = csvRows.join("\n");

    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "exported_data.csv";
    a.click();
    URL.revokeObjectURL(url);
  };


  const makeitem = ({ index, style, data }) => {
    const item = data[index];

    return (
      <div style={{ ...style, minHeight: "auto", overflow: "hidden" }} key={item.ndc} className="d-flex flex-wrap">
        <div className="col-6" style={{ minHeight: "100%", overflowY: "auto" }}>
          <table className="table table-bordered">
            <thead className="bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] fw-bold">
              <tr>
                <td>NDC No: {item.ndc}</td>
                <td colSpan={2}>
                  {item?.billing_data.length > 0 ? item.billing_data[0]?.description : ""}
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
                item.billing_data.map((bill, idx) => (
                  <tr key={idx} style={{ minHeight: "40px" }}>
                    <td>{bill.date}</td>
                    <td>{bill.quantity}</td>
                    <td>{bill.source}</td>
                  </tr>
                ))
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

        {/* Vendor Data Table */}
        <div className="col-6" style={{ minHeight: "100%", overflowY: "auto" }}>
          <table className="table table-bordered">
            <thead className="bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] fw-bold">
              <tr>
                <td>NDC No: {item.ndc}</td>
                <td colSpan={5}>
                  {item?.vendor_data.length > 0 ? item.vendor_data[0]?.description : ""}
                </td>
              </tr>
              <tr>
                <td>Purchase Date</td>
                <td>Qty Purchase</td>
                <td>Package Size</td>
                <td>Total</td>
                <td>Source</td>
              </tr>
            </thead>
            <tbody>
              {item?.vendor_data.length > 0 ? (
                item.vendor_data.map((vendor, idx) => {
                  const packageSize = item?.billing_data[0]?.packagesize || 0; // Take the first `packagesize` value
                  const vendorQuantity = vendor.quantity || 0;
                  const total = packageSize * vendorQuantity;

                  return (
                    <tr key={idx} style={{ minHeight: "40px" }}>
                      <td>{vendor.date}</td>
                      <td>{vendor.quantity}</td>
                      <td>{packageSize || "0"}</td>
                      <td>{total || "null"}</td>
                      <td>{vendor.source}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="text-center text-danger" colSpan={6}>
                    No Data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const handleDetailesreportchange = (event) => {
    setreport_type({
      value: event.target.value,
      label: options.find((option) => option.value === event.target.value).label,
    });
  };


  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Report type");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const selectItem = (item) => {
    setSelectedItem(item);
    setIsOpen(false);
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


  const handleHideClickInsurance = (company) => {
    const updatedData = filteredData.map((item) => {
      if (item.insurance_company_name === company) {
        return { ...item, hide: !item.hide }; // Toggle the 'hide' property
      }
      return item;
    });
    setFilteredData(updatedData); // Update local state
  };


  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedData, setSelectedData] = useState(null);

  useEffect(() => {
    if (filteredData.length > 0) {
      const firstCompany = filteredData[0].insurance_company_name;
      setSelectedCompany(firstCompany);
      setSelectedData(filteredData.find(item => item.insurance_company_name === firstCompany));
    }
  }, [filteredData]);

  const handleCompanyChange = (event) => {
    const value = event.target.value;
    setSelectedCompany(value);
    setisloading(true);
  };


  useEffect(() => {
    if (selectedCompany) {
      const timeout = setTimeout(() => {
        const found = filteredData.find(item => item.insurance_company_name === selectedCompany);
        setSelectedData(found);
        setisloading(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [selectedCompany, filteredData]);

  const [saveloading, setissaveloading] = useState(false);


  const handleReportSave = async () => {
    setissaveloading(true);
    const response = await fetch(`${route}/api/save-progress/?user_id=${current_user.id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${user.access}`,
      },
    });

    if (response.status === 500) {
      toast.error("Internal server error! Please try again later.", {
        position: toast.POSITION.TOP_RIGHT,
        pauseOnHover: false,
      });
      setisloading(false);
      return;
    }

    const json = await response.json();

    if (json.code === "token_not_valid") {
      logout();
      return;
    }

    if (!response.ok) {
      went_wrong_toast(json.error || "Something went wrong.");
      setisloading(false);
      return;
    }

    // ✅ Optional: handle success case
    if (response.ok) {
      custom_toast(json.message || "Progress saved successfully!");
      setissaveloading(false);

    }

  };

  return (

    <div className="user_main">
      {/* {!isloading && (
        <div className="absolute h-full inset-0 bg-black/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="relative w-20 h-20">
            <div role="status">
              <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-[#29e5ce]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
              </svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div>)} */}
      <GlobalBackTab title="Reports History" />
      {isloading && (
        <div className=" mt-4 flex items-center justify-center z-50">

          <div role="status ">
            <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-[#29e5ce]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className=" me-3">
      
        <div className=" gap-2 flex   card-body p-0">
          {/* Vendor upload Container */}
          <div className="col-md-6 ">
          <h2 className="mt-2 text-white text-xl">Vendor Files</h2>

            {/* <div className=" col-11 pt-3 ">
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

            </div> */}
            <div className="pt-md-10 pt-2 pl-3 row col-md-12">
              {vendor_filesdata.map((item) => (
                <div
                  key={item.name}
                  className="d-flex align-items-center justify-content-between bg-light pt-2 pb-2 rounded-lg mb-2"
                  style={{
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* File Icon */}
                  <div
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-12 text-gray-700 font-normal"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    <div>
                      <div className="text-normal">{item.name}</div>
                      <div className="text-xs mt-2 text-gray-400">
                        {item.type || "XLSX"} | {item.size || "1.2 MB"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex align-items-end gap-2 ">
                    <svg
                      onClick={() => openimage(item)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="cursor-pointer size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>

                  
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Billing upload Container */}
          <div className="col-md-6 mt-8 md:mt-0 ">
          <h2 className="mt-2 text-white text-xl">Billing Files</h2>

            <div className="md:pt-10 pt-2 pl-3 row col-md-12 ">
              {billing_filesdata.map((item) => (
                <div
                  key={item.name}
                  className="d-flex align-items-center justify-content-between bg-light pt-2 pb-2 rounded-lg mb-2"
                  style={{
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {/* File Icon */}
                  <div
                    className="d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12 text-gray-700 font-normal">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <div>
                      <div className="text-normal">{item.name}</div>
                      <div className=" text-xs mt-2 text-gray-400">
                        {item.type || "XLSX"} |  {item.size || "1.2 MB"}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="d-flex align-items-end gap-2 ">
                    <svg onClick={() => openimage(item)}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>

                   
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Balance upload Container */}

        </div>
        {audit_report_type.includes("audit") && (
            <div className="col-md-6 mt-8 md:mt-4 ">
                <h2 className="mt-2 text-white text-xl">Balance Files</h2>
      
            <div className="md:pt-10 pt-2 pl-3 row col-md-12 ">
              {balance_filesdata.map((item) => (
                <div
                  key={item.name}
                  className="d-flex align-items-center justify-content-between bg-light pt-2 pb-2 rounded-lg mb-2"
                  style={{
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    className="flex justify-center items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-12  text-gray-700 font-normal">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    <div>
                      <div className="text-normal">{item.name}</div>
                      <div className=" text-xs mt-2 text-gray-400">
                        {item.type || "XLSX"} |  {item.size || "1.2 MB"}
                      </div>
                    </div>
                  </div>
  
                  <div className="d-flex align-items-end gap-2 ">
                    <svg onClick={() => openimage(item)}
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cursor-pointer size-5">
                      <title>Download file</title> {/* This shows a tooltip on hover */}
  
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
  
                    {/* <svg
                      onClick={() => handleDelete("opening_balance_files", item.name)} // Passing both values
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer text-red-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg> */}
  
                  </div>
                </div>
              ))}
            </div>
          </div>

        )}
      
      </div>

      {/* <div className="w-full h-auto mt-3  flex justify-end">
        <button
          className=" flex gap-2  bg-[#daf0fa] hover:bg-[#15e6cd] text-gray-600 text-xl hover:text-white font-normal py-2 px-2  border-2 border-[#15e6cd] rounded-xl"
          onClick={handleButtonClick} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Generate
        </button>
      </div> */}

      <ul className="w-full md:text-sm font-medium text-gray-900 flex justify-start md:gap-16 g items-center rounded-lg">
        {reportOptions
          .filter(Boolean) // 👈 This removes any `false` or `null` entries
          .map((option) => (
            <li key={option.value}>
              <div className="flex items-center">
                <input
                  id={`${option.value}-checkbox`}
                  type="checkbox"
                  value={option.value}
                  checked={audit_report_type.includes(option.value)}
                  onChange={() => handleCheckboxChange(option.value)}
                  className="custom-checkbox"
                />
                <label
                  htmlFor={`${option.value}-checkbox`}
                  className="w-full py-3 px-2 md:ms-2 text-xs md:text-xl font-medium text-gray-800"
                >
                  {option.label}
                </label>
              </div>
            </li>
          ))}
      </ul>






      {/* {audit_report_type.includes("insurance_details") && (
        <div className="relative w-full max-w-xs">
          <select
            className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
                   border border-green-300 rounded-lg shadow-md text-black 
                   cursor-pointer appearance-none"
            value={report_type.value} // Bind value to the current state
            onChange={handleDetailesreportchange} // Handle changes
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      )} */}
      {/* {audit_report_type.includes("audit_detail") && (
      <div className="relative w-full max-w-xs">
      <select
        className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
                   border border-green-300 rounded-lg shadow-md text-black 
                   cursor-pointer appearance-none"
        value={report_type.value} // Bind value to the current state
        onChange={handlereportchange} // Handle changes
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
      )} */}
      <div className="flex gap-4">
        {audit_report_type.includes("audit") && (
          <div className="relative w-full max-w-xs">
            <select
              className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
                   border border-green-300 rounded-lg shadow-md text-black 
                   cursor-pointer appearance-none"
              value={report_type.value} // Bind value to the current state
              onChange={handlereportchange} // Handle changes
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        )}


        {audit_report_type.includes("insurance") && (
          <div className="relative w-full max-w-xs">
            <select
              className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
                   border border-green-300 rounded-lg shadow-md text-black 
                   cursor-pointer appearance-none"
              value={report_type.value} // Bind value to the current state
              onChange={handleInsurancereporttchange} // Handle changes
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>
          </div>
        )}
        {audit_report_type.includes("insurance_details") && (  
          <>
          <div className="relative flex w-full max-w-xs">
                      <select
                        className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
                   border border-green-300 rounded-lg shadow-md text-black 
                   cursor-pointer appearance-none"
                        value={report_type.value} // Bind value to the current state
                        onChange={handlereportchange} // Handle changes
                      >
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative w-full max-w-xs">
                      <select
                        className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
      border border-green-300 rounded-lg shadow-md text-black 
      cursor-pointer appearance-none"
                        value={selectedOptions.value}
                        onChange={handleReportOptionChange}
                      >
                        {optionsAmount.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div></>)}

        {(
          audit_report_type.includes("insurance") ||
          audit_report_type.includes("audit")
        ) && (
            <div className="relative w-full max-w-xs">
              <select
                className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
      border border-green-300 rounded-lg shadow-md text-black 
      cursor-pointer appearance-none"
                value={selectedOptions.value}
                onChange={handleReportOptionChange}
              >
                {optionsAmount.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          )}

<div className="w-full h-auto   flex justify-start   ">
        <button
          className=" flex gap-2 items-center  bg-[#daf0fa] hover:bg-[#15e6cd] text-gray-600 text-xl hover:text-white font-normal py-2 px-2 border-2 border-[#15e6cd] rounded-xl"
          onClick={handleButtonClick} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Generate
        </button>
      </div>


      </div>




      {audit_report_type.includes("audit_detail") && (
        alldata.length > 0 ?

          <>
            <div className="  d-flex justify-content-between">
              <div className="d-flex  w-full justify-content-between align-items-center mt-3">
                <div className="input-container-inner  w-1/3 h-full flex justify-start items-center">
                  <form className="w-full">
                    <div className="relative w-full">
                      <input
                        value={search}
                        onChange={(e) => {
                          setsearch(e.target.value);
                        }}
                        type="number"
                        id="voice-search"
                        className="text-black text-sm rounded-lg focus:outline-none w-full p-3 border-2 border-green-200 bg-transparent placeholder-gray-600 placeholder-text-xl "
                        placeholder="Search by NDC"
                      />
                      <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>

                <div className="w-1/2  flex justify-end gap-2 ">

                  <button
                    onClick={handleprint}

                    disabled={alldata?.length === 0}
                    className=" flex gap-1 mr-4 bg-[#587291] hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>

                    Print Pdf
                  </button>
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className=" flex gap-1 items-center mr-4   hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-3  border-2 border-white rounded-xl"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg> Export csv
                  </button>
                  {/* <button
                 type="button"
                 className=" flex gap-1 items-center  hover:bg-[#15e6cd] box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-white hover:text-white font-normal py-2 px-3  border-2 border-white rounded-xl"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                 </svg>
                 Filter
               </button> */}


                </div>
                {/* <SearchBar {...props.searchProps} /> */}
              </div>

            </div>

            <div className="card me-3 mt-3">
              <div className="card-body">
                {/* <div className="d-flex justify-content-between">
              <Button
                onClick={handleprint}
                variant="success"
                className="mb-3"
                disabled={alldata?.length === 0}
                shadow
              >
                Print PDF
              </Button>

              <div className="col-6 col-md-3 mb-3">
                <TextField
                  className="form-control"
                  label="Search by NDC"
                  value={search}
                  onChange={(e) => {
                    setsearch(e.target.value);
                  }}
                  type="number"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />

              </div>
            </div> */}
                <div style={{ zoom: ".8" }} ref={componentRef}>

                  <List
                    height={6500}
                    itemCount={isprint ? alldata?.length : currentPageData.length}
                    itemSize={300}
                    width="100%"
                    itemData={isprint ? Searchndc : currentPageData}
                  >
                    {makeitem}
                  </List>;

                  {/* Pagination Controls */}
                  <div className="pagination d-flex justify-content-center align-items-center my-3">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 0}
                      className=" p-2 text-white rounded-lg bg-[#15e6cd] me-3"
                    >
                      <i className="bi bi-arrow-left"></i> Previous
                    </button>

                    <span className="mx-3">
                      Page {currentPage + 1} of {Math.ceil(Searchndc.length / PageSize)}
                    </span>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === Math.ceil(Searchndc.length / PageSize) - 1}
                      className="p-2 text-white rounded-lg bg-[#15e6cd] ms-3"
                    >
                      Next <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </>

          : ""
      )}
      {isloading && (
        <div className=" mt-4 flex items-center justify-center z-50">

          <div role="status ">
            <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-[#29e5ce]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {loadingReport ? (
        <div className=" mt-4 flex items-center justify-center z-50">

          <div role="status ">
            <svg aria-hidden="true" class="inline w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-[#29e5ce]" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      ) :

        <>
          {audit_report_type.includes("insurance") && filteredData.length > 0 && (
            <>
              <div className="d-flex justify-content-end mr-12 align-items-center mt-3">
                <div className="relative w-full max-w-xs">

                  <select
                    value={selectedCompany}
                    onChange={handleCompanyChange}
                    className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
            border border-green-300 rounded-lg shadow-md text-black 
            cursor-pointer appearance-none"          >
                    {filteredData.map((item) => (
                      <option key={item.insurance_company_name} value={item.insurance_company_name}>
                        {item.insurance_company_name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {selectedData && (
                <div className="card me-3 border-0" style={{ backgroundColor: "transparent", boxShadow: "none" }}>
                  <div className="card-body">
                    <div style={{ zoom: ".8" }}>
                      <ToolkitProvider
                        keyField="ndc"
                        data={selectedData.data || []}
                        columns={columns}
                        exportCSV={{ onlyExportFiltered: true, exportAll: false }}
                        search
                      >
                        {(props) => (
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mt-3 mb-3">
                              <div className="input-container-inner w-1/3 h-full flex justify-start items-center">
                                <SearchBar
                                  {...props?.searchProps}
                                  placeholder="Search" // Placeholder for the search input
                                  className="text-black text-sm rounded-lg focus:outline-none w-full p-3 border-2 border-green-500 bg-transparent placeholder-gray-600 placeholder-text-xl"
                                />

                              </div>

                              {/* <div className="input-container-inner  w-1/3 h-full flex justify-start items-center">
                                <form className="w-full">
                                  <div className="relative w-full">
                                    <input
                                      value={search}
                                      onChange={(e) => {
                                        setsearch(e.target.value);
                                      }}
                                      type="number"
                                      id="voice-search"
                                      className="text-black text-sm rounded-lg focus:outline-none w-full p-3 border-2 border-green-200 bg-transparent placeholder-gray-600 placeholder-text-xl "
                                      placeholder="Search "
                                    />
                                    <button type="button" className="absolute inset-y-0 end-0 flex items-center pe-3">
                                      <svg
                                        className="w-4 h-4 text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          stroke="currentColor"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                </form>
                              </div> */}

                              <div className="flex justify-end gap-2 ">
                                <button
                                  onClick={handlebinnumberopen}


                                  className=" flex gap-1 mr-4 flex justify-center items-center bg-[#daf0fa] hover:bg-[#15e6cd] text-gray-800 box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                                >


                                  Bin Numbers
                                </button>
                                {current_user?.permissions?.includes("can_export_insurance_report") && (
                                   <div className="flex ">
                                   <button
   
                                     onClick={() =>
                                       handleExportToExcelInsurance(selectedData.data, selectedData.insurance_company_name)
                                     }
                                     className=" flex gap-1 mr-4 flex justify-center items-center bg-[#587291] hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                                   >
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                     </svg>
   
                                     Export Excel
                                   </button>
                                   <button
   
                                     onClick={() =>
                                       handleExportToCSVInsurance(selectedData.data, selectedData.insurance_company_name)
                                     }
                                     className=" flex gap-1 mr-4 flex justify-center items-center  hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                                   >
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                     </svg>
   
                                     Export CSV
                                   </button>
                                   </div>

                                )}
                               
                                {/* <button
                                  {...props.csvProps}

                                  type="button"
                                  className=" flex gap-1 items-center mr-4   hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-3  border-2 border-white rounded-xl"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                  </svg>    <ExportCSVButton
                                    {...props.csvProps}
                                    className="text-white "
                                  >
                                    <span className="text-xl">Export CSV</span>
                                  </ExportCSVButton>
                                </button> */}



                                {/* <Button
                                  onClick={() =>
                                    handleExportToExcelInsurance(item.data, item.insurance_company_name)
                                  }
                                  className="me-2"
                                  variant="success"
                                  shadow
                                >
                                  Export Excel
                                </Button> */}


                                {/* <Button
                                  onClick={() => handleHideClickInsurance(item.insurance_company_name)}
                                  variant="secondary"
                                  shadow
                                >
                                  {item.hide ? "View" : "Hide"}
                                </Button> */}

                              </div>
                            </div>
                            <div style={{ overflowX: 'auto' }}>

                              <BootstrapTable {...props.baseProps} rowStyle={rowStyle}
                                bootstrap4 filter={filterFactory()} classes="custom-table"
                                pagination={paginationFactory({
                                  sizePerPage: 50,          // 50 entries per page
                                  showTotal: true,          // shows "Showing x to y of z entries"
                                  hideSizePerPage: true,    // hide dropdown to change size
                                  firstPageText: 'First',
                                  prePageText: 'Previous',
                                  nextPageText: 'Next',
                                  lastPageText: 'Last',
                                  alwaysShowAllBtns: true,  // show Next/Prev even if there’s only one page
                                })}

                                defaultSorted={[{
                                  dataField: 'description',  
                                  order: 'asc'               
                                }]}
                                 />
                            </div>
                            <hr />
                          </div>
                        )}
                      </ToolkitProvider>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          {audit_report_type.includes("insurance_details") && (
            <div className="me-3 mt-3">
              {InsuranceDetailsData.length > 0 && (
                <>


                  {/* === FILTER === */}
                  {/* <div className="flex gap-4">
                    <div className="relative w-full max-w-xs mb-4">
                      <select
                        className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
                   border border-green-300 rounded-lg shadow-md text-black 
                   cursor-pointer appearance-none"
                        value={report_type.value} // Bind value to the current state
                        onChange={handlereportchange} // Handle changes
                      >
                        {options.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div>
                    <div className="relative w-full max-w-xs">
                      <select
                        className="w-full px-4 py-3 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] 
      border border-green-300 rounded-lg shadow-md text-black 
      cursor-pointer appearance-none"
                        value={selectedOptions.value}
                        onChange={handleReportOptionChange}
                      >
                        {optionsAmount.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>

                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                      </div>
                    </div></div> */}
                  <div className="d-flex justify-between items-center mb-4">
                    <div className="w-1/3">
                      <input
                        type="number"
                        placeholder="Search NDC"
                        value={searchNDC}
                        onChange={(e) => {
                          setSearchNDC(e.target.value);
                          SetcurrentDetailPage(1); // reset to page 1 on search
                        }}
                        className="w-full text-black text-sm rounded-lg focus:outline-none p-3 border-2 border-green-200 bg-transparent placeholder-gray-100 placeholder-text-xl"
                      />
                    </div>
                    {current_user?.permissions?.includes("can_export_insurance_detailed_report") && (
                         <div className="w-1/2 flex justify-end gap-2">
                         <button
                           onClick={handleExportDetailsToExcel}
                           className="flex gap-1 bg-[#587291] items-center hover:bg-[#15e6cd] text-white text-xl hover:text-white font-normal py-2 px-3 border-2 border-white rounded-xl shadow-md"
                         >
                           {/* Excel Icon */}
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                           </svg>
                           Export Excel
                         </button>
                         <button
                           onClick={handleDetailsExportCSV}
                           className="flex gap-1 items-center hover:bg-[#15e6cd] text-white text-xl hover:text-white font-normal py-2 px-3 border-2 border-white rounded-xl shadow-md"
                         >
                           {/* CSV Icon */}
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                           </svg>
                           Export CSV
                         </button>
                       </div>
                    )}
                 
                  </div>

                  {/* === TABLE === */}
                  {paginatedData.length > 0 ? (
                    <>
                      {paginatedData.map((ndcData, index) => (
                        <div key={index} className="card-body mb-6 border border-gray-300 rounded-xl p-4 shadow-sm bg-white">
                          <h2 className="text-lg font-semibold mb-2">NDC: {ndcData.ndc}</h2>
                          <div style={{ overflowX: 'auto' }}>

                            <BootstrapTable
                              keyField="insurance_company"
                              data={ndcData.data}
                              columns={detailsColumns}
                              rowStyle={rowStyle}
                              bootstrap4
                              condensed
                              filter={filterFactory()}
                              classes="custom-table"
                              defaultSorted={[{
                                dataField: 'description',  
                                order: 'asc'              
                              }]}
                            />
                          </div>
                        </div>
                      ))}

                      {/* === Pagination === */}
                      <div className="flex justify-between items-center mt-6 px-4 text-white">
                        <span>
                          Showing {startIndexDetail}–{endIndexDetail} of {totalItems}
                        </span>
                        <div className="space-x-3">
                          <button
                            onClick={goToDetailPreviousPage}
                            disabled={currentDetailPage === 1}
                            className="px-4 py-2 border rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={goToDetailNextPage}
                            disabled={currentDetailPage === totalPages}
                            className="px-4 py-2 border rounded bg-[#15e6cd] hover:bg-[#15e6cd] disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-white text-2xl text-center">No matching NDC found.</p>
                  )}

                </>
              )}
            </div>
          )}
          {audit_report_type.includes("audit") && (
            <div className=" me-3 mt-3">

              {auditdata.length > 0 ?
                <>

                  <div className="card-body mt-3">
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
                            <div className="  d-flex justify-content-between">
                              <div className="d-flex  w-full justify-content-between align-items-center mt-3">
                                <div className="input-container-inner md:w-1/2  h-full md:flex items-center">
                                  <div className="input-container-inner w-full  mb-2 h-full flex items-center">
                                    <div className="w-full"> 
                                      <SearchBar
                                        {...props?.searchProps}
                                        placeholder="Search"
                                        className="w-full text-black text-sm rounded-lg focus:outline-none p-3 border-2 border-green-200 bg-transparent placeholder-gray-100 placeholder-text-xl"
                                        style={{ width: "100%", maxWidth: "none" }} 
                                      />

                                    </div>
                                  </div>
                                </div>
                                {current_user?.permissions?.includes("can_export_audit_report") && (


                                <div className="w-1/2  flex justify-end gap-2 ">

                                  <button
                                    onClick={handleExportToExcel}

                                    className=" flex gap-1 bg-[#587291] items-center hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>

                                    Export excel
                                  </button>
                                  <button
                                    onClick={handleExportToCSV}

                                    className=" flex gap-1 items-center hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-white font-normal py-2 px-2  border-2 border-white rounded-xl"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                    </svg>

                                    Export CSV
                                  </button>
                                  {/* <ExportCSVButton {...props.csvProps}>
                                    <button
                                      type="button"
                                      className="flex gap-1 items-center hover:bg-[#15e6cd] text-white text-xl hover:text-white font-normal py-2 px-3 border-2 border-white rounded-xl shadow-md"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                      </svg>
                                      Export CSV
                                    </button>
                                  </ExportCSVButton> */}

                                  {/* <button
                 type="button"
                 className=" flex gap-1 items-center  hover:bg-[#15e6cd] box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-white hover:text-white font-normal py-2 px-3  border-2 border-white rounded-xl"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
                 </svg>
                 Filter
               </button> */}


                                </div>
                                )}
                                {/* <SearchBar {...props.searchProps} /> */}
                              </div>

                            </div>

                            {/* <div className="d-flex justify-content-between align-items-center mt-3">
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
                    </div> */}


                            <div style={{ overflowX: 'auto' }}>
                              <BootstrapTable
                                {...props.baseProps}
                                rowStyle={rowStyle}
                                bootstrap4
                                condensed
                                filter={filterFactory()}
                                classes="custom-table table"
                                pagination={paginationFactory({
                                  sizePerPage: 50,          // 50 entries per page
                                  showTotal: true,          // shows "Showing x to y of z entries"
                                  hideSizePerPage: true,    // hide dropdown to change size
                                  firstPageText: 'First',
                                  prePageText: 'Previous',
                                  nextPageText: 'Next',
                                  lastPageText: 'Last',
                                  alwaysShowAllBtns: true,  // show Next/Prev even if there’s only one page
                                })}
                                defaultSorted={[{
                                  dataField: 'description',  
                                  order: 'asc'               
                                }]}
                              />
                            </div>


                          </div>
                        )}
                      </ToolkitProvider>
                    </div>
                  </div></>
                : ''}

            </div>
          )}

        </>}










      {delete_user && (
        <Alert_before_delete
          show={delete_user}
          onHide={() => setdelete_user(false)}
          url={url_to_delete}
          dis_fun={handleconfirm}
          row_id={null}
        />
      )}
      {binnumbers && (
        <BinNumberModal
          show={binnumbers}
          onHide={() => setbinnumbers(false)}
          data={selectedData?.bin_numbers}
          company={selectedData.insurance_company_name}
        />
      )}
      {delete_file && (
        <Alert_before_delete
          show={delete_file}
          onHide={() => setdelete_file(false)}
          url={single_file_to_delete}
          dis_fun={handleconfirm}
          row_id={null}
        />
      )}
      <ToastContainer autoClose={3000} hideProgressBar={true} theme="dark" />
    </div>
  );
}


export default AuditReportsHistory;

