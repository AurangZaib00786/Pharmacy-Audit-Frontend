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
import XLSX from "xlsx-js-style";
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


function Audit() {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  const { Data, dispatch } = UseaddDataContext();
  const { user, route, dispatch_auth } = useAuthContext();
  const { current_user } = UseaddheaderContext();

  const { SearchBar } = Search;
  const { ExportCSVButton } = CSVExport;
  const [Fileurl_vendor, setFileurl_vendor] = useState("");
  const [Fileurl_billing, setFileurl_billing] = useState("");
  const [vendor_filesdata, setvendor_filesdata] = useState([]);
  const [billing_filesdata, setbilling_filesdata] = useState([]);
  const [delete_user, setdelete_user] = useState(false);
  const url_to_delete = `${route}/api/manage-files/?directory=billing_files,billing_files_datewise,consolidated_reports,insurance_billing_files,vendor_files,vendor_files_datewise&user_id=${current_user?.id}`;
  const single_file_to_delete = `${route}/api/manage-files/`;
  const [isloading, setisloading] = useState("");
  const [callagain_vendor, setcallagain_vendor] = useState(false);
  const [callagain_billing, setcallagain_billing] = useState(false);
  const [vendor, setvendor] = useState("");
  const [delete_file, setdelete_file] = useState(false);
  const [callagain, setcallagain] = useState(false);
  const [report_type, setreport_type] = useState({
    value: "combine",
    label: "Combine Report",
  });
  const [binnumbers, setbinnumbers] = useState(false);

  const handlebinnumberopen = () => {
    setbinnumbers(true);
    console.log("binnumber")
  }
  console.log(current_user, "userrrr")

  const [insurance_report_type, setinsurance_report_type] = useState({
    value: "combine",
    label: "Combine Report",
  });
  const [search, setsearch] = useState("");

  const [audit_report_type, setaudit_report_type] = useState(["audit"]);

  const reportOptions = [
    { value: "audit", label: "Audit Report" },
    { value: "audit_detail", label: "Detailed Audit Report" },
    { value: "insurance", label: "Insurance Report" },
  ];

  const handleCheckboxChange = (value) => {
    setaudit_report_type((prev) => (prev.includes(value) ? [] : [value]));
  };




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

    const fetchbillingfiles = async () => {
      const response = await fetch(
        `${route}/api/manage-files/?directory=billing_files&user_id=${current_user.id}`,
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

    if (audit_report_type.includes("audit")) {
      setreport_type({
        value: "combine",
        label: "Combine Report",
      });
      const response = await fetch(`${route}/api/audit-report/?user_id=${current_user.id}`, {
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
        setauditdata(optimize);
        setisloading(false);
        custom_toast(json.message);
      }

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

    if (audit_report_type.includes("insurance")) {
      setisloading(true);
      setinsurance_report_type({
        value: "combine",
        label: "Combine Report",
      });
      const response = await fetch(`${route}/api/insurance-audit-report/?user_id=${current_user.id}`, {
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
  const handleExportToExcelInsurance = (insuranceData, insuranceCompanyName) => {
    // Extract header and data fields
    let header = [];
    let header_datafield = [];
    columns.slice(1).map((item) => {
      header.push(item.text);
      header_datafield.push(item.dataField);
    });

    // Convert JSON to worksheet
    const ws = XLSX.utils.json_to_sheet(insuranceData, {
      header: header_datafield,
    });

    // Define color styles
    const redcolor = { font: { color: { rgb: "FF0000" } } };
    const greencolor = { font: { color: { rgb: "008000" } } };
    const bluecolor = { font: { color: { rgb: "0000FF" } } };
    const blackcolor = { font: { color: { rgb: "000000" } } };

    // Apply row coloring based on conditions
    insuranceData.forEach((row, rowIndex) => {
      let color = blackcolor;
      if (row.result_package < 0) {
        color = redcolor;
      } else if (row.result_package === 0) {
        color = greencolor;
      } else if (row.result_package === "Not Exist") {
        color = bluecolor;
      }

      const colsInRow = Object.keys(row).length;
      for (let col = 0; col < colsInRow; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: col });
        if (!ws[cellAddress]) ws[cellAddress] = {};
        ws[cellAddress].s = color;
      }
    });

    // Add header to worksheet
    XLSX.utils.sheet_add_aoa(ws, [header], { origin: "A1" });

    // Set column widths
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

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet 01");

    // Generate Excel file dynamically named
    const fileName = `${insuranceCompanyName}_Audit_Report.xlsx`;
    XLSX.writeFile(wb, fileName);
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

  useEffect(() => {
    if (filteredData.length > 0) {
      setSelectedCompany(filteredData[0].insurance_company_name);
    }
  }, [filteredData]); // Runs whenever filteredData changes
  
  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };
  
  const selectedData = filteredData.find(
    (item) => item.insurance_company_name === selectedCompany
  );
  

 

  // console.log("all data", selectedData);
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
      <GlobalBackTab title="Reports" />
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
        <div className="card-header d-flex align-items-center justify-content-end mt-3 ">

          <div>
            <button
              className=" flex gap-1 mb-2 items-center   hover:bg-[#15e6cd] text-white box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; text-xl hover:text-red-600 font-normal py-2 px-3  border-2 border-white rounded-xl"
              onClick={handledeletereport}
              shadow
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>

              Clear Record
            </button>
            {/* <Button onClick={handlegeneratereport} variant="success" shadow>
            Generate Report
          </Button> */}
          </div>
        </div>
        <div className="d-md-flex gap-2  card-body p-0">
          {/* Vendor Container */}
          <div className="col-md-6">
            <form onSubmit={handlesubmitvendor_files}>

              <div className="flex items-center justify-between gap-2 p-0.5 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] shadow-lg border-2 border-green-300 rounded-lg">
                <div className="md:w-1/2 border-r border-gray-400">
                  <Select
                    options={allvendors}
                    value={vendor}
                    funct={(e) => setvendor(e)}
                    placeholder={"Select Vendor *"}
                    required={true}
                    disable_margin={true}
                  />
                </div>
                <div className="w-1/3 flex items-center  gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 font-bold text-gray-900"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v3a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-3m-4.5-2.25L12 7.5m0 0L7.5 14.25M12 7.5v12"
                    />
                  </svg>
                  <label
                    htmlFor="vendor-upload"
                    className="cursor-pointer md:text-xl text-gray-700"
                  >
                    Upload File
                  </label>
                  <input
                    id="vendor-upload"
                    type="file"
                    className="hidden"
                    onChange={handleimageselection_vendor}
                    accept=".xlsx,.xls,.csv"
                    multiple
                    required
                  />
                </div>
                <div className="w-1/3 text-right">
                  <button
                    style={{ width: "80px" }}
                    type="submit"
                    className="text-white py-2 rounded-lg bg-[#587291] hover:bg-[#4a5d7a] transition duration-300"
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className=" pl-2 pt-2">
                {Fileurl_vendor?.name && (
                  <span className="text-white text-sm md:text-base truncate max-w-[150px]">
                    {Fileurl_vendor.name}
                  </span>
                )}
              </div>
            </form>
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

                    <svg
                      onClick={() => handleDelete("vendor_files", item.name)} // Passing both values
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5 text-red-500 cursor-pointer"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Billing Container */}
          <div className="col-md-6 mt-8 md:mt-0 ">
            <form onSubmit={handlesubmitbilling_files}>

              <div className="flex items-center justify-between gap-2 p-0.5 bg-gradient-to-t from-[#c5e9f9] to-[#f2fafe] shadow-lg border-2 border-green-300 rounded-lg">
                <div className="w-1/2 border-r border-gray-400">
                  <Select
                    options={allbillings}
                    value={billing}
                    funct={(e) => setbilling(e)}
                    placeholder={"Select Billing *"}
                    required={true}
                    disable_margin={true}
                  />
                </div>
                <div className="w-1/3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-900"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v3a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-3m-4.5-2.25L12 7.5m0 0L7.5 14.25M12 7.5v12"
                    />
                  </svg>
                  <label
                    htmlFor="billing-upload"
                    className="cursor-pointer md:text-xl text-gray-700"
                  >
                    Upload File
                  </label>

                  <input
                    id="billing-upload"
                    type="file"
                    className="hidden"
                    onChange={handleimageselection_billing}
                    accept=".xlsx,.xls,.csv"
                    required
                    multiple
                  />

                </div>

                <div className="w-1/3 text-right">
                  <button
                    style={{ width: "80px" }}
                    type="submit"
                    className="text-white py-2 rounded-lg bg-[#587291] hover:bg-[#4a5d7a] transition duration-300"
                  >
                    Upload

                  </button>


                </div>

              </div>
              <div className=" pl-2 pt-2">
                {Fileurl_billing?.name && (
                  <span className="text-white text-sm md:text-base truncate max-w-[150px]">
                    {Fileurl_billing.name}
                  </span>
                )}
              </div>

            </form>
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

                    <svg
                      onClick={() => handleDelete("billing_files", item.name)} // Passing both values
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 cursor-pointer text-red-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-auto mt-3  flex justify-end">
        <button
          className=" flex gap-2  bg-[#daf0fa] hover:bg-[#15e6cd] text-gray-600 text-xl hover:text-white font-normal py-2 px-2  border-2 border-[#15e6cd] rounded-xl"
          onClick={handlegeneratereport} >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
          Generate
        </button>
      </div>

      <ul className="w-full md:text-sm font-medium text-gray-900 flex justify-start md:gap-16 g items-center rounded-lg">
        {reportOptions.map((option) => (
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
                                <div className="w-full"> {/* Wrap input in a full-width container */}
                                  <SearchBar
                                    {...props?.searchProps}
                                    placeholder="Search"
                                    className="w-full text-black text-sm rounded-lg focus:outline-none p-3 border-2 border-green-200 bg-transparent placeholder-gray-100 placeholder-text-xl"
                                    style={{ width: "100%", maxWidth: "none" }} // Force full width
                                  />

                                </div>
                              </div>
                            </div>

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
                              <ExportCSVButton {...props.csvProps}>
                                <button
                                  type="button"
                                  className="flex gap-1 items-center hover:bg-[#15e6cd] text-white text-xl hover:text-white font-normal py-2 px-3 border-2 border-white rounded-xl shadow-md"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                                  </svg>
                                  Export CSV
                                </button>
                              </ExportCSVButton>

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


                        <BootstrapTable
                          {...props.baseProps}
                          rowStyle={rowStyle}
                          bootstrap4
                          condensed
                          filter={filterFactory()}
                          classes="custom-table"
                        />

                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </div></>
            : ''}

        </div>
      )}


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
                            </button>



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

                        <BootstrapTable {...props.baseProps} rowStyle={{ backgroundColor: "#f9f9f9" }} bootstrap4 filter={filterFactory()} classes="custom-table" />
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

export default Audit;
