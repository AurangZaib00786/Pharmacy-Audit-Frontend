import React, { useState, useEffect } from "react";
import Widget from "./widget";
import "./dashboard.css";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ApartmentIcon from "@material-ui/icons/Apartment";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import BusinessCenterIcon from "@material-ui/icons/BusinessCenter";
import LocalAtmIcon from "@material-ui/icons/LocalAtm";
import HistoryIcon from "@material-ui/icons/History";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import { UseaddheaderContext } from "../../hooks/useaddheadercontext";
import { useAuthContext } from "../../hooks/useauthcontext";
import CanvasJSReact from "@canvasjs/react-charts";
import useLogout from "../../hooks/uselogout";

function Dashboard() {
  const { user, route, dispatch_auth } = useAuthContext();
  const [date, setdate] = useState(new Date().toISOString().substring(0, 10));
  const { selected_branch } = UseaddheaderContext();
  const { logout } = useLogout();
  const [data1, setdata1] = useState({
    incoming_amount: "",
    outgoing_amount: "",
    journal_voucher_in_amount: "",
    journal_voucher_out_amount: "",
  });
  const [data2, setdata2] = useState({
    customer_count: "",
    active_plots_count: "",
    sold_plots_count: "",
    resale_plots_count: "",
    booking_count: "",
    non_expired_tokens_count: "",
  });

  const [data_3, setdata_3] = useState([]);
  const [month_data, setmonth_data] = useState({
    incoming_funds: [],
    outgoing_funds: [],
  });
  const [year_data, setyear_data] = useState({
    incoming_funds: [],
    outgoing_funds: [],
  });

  var CanvasJS = CanvasJSReact.CanvasJS;
  var CanvasJSChart = CanvasJSReact.CanvasJSChart;

  useEffect(() => {
    dispatch_auth({ type: "Set_menuitem", payload: "dashboard" });
  }, []);

  const options = {
    animationEnabled: true,

    title: {
      text: "Daily Incomings/Outgoings",
    },

    axisY: {
      title: "Amounts",
      gridThickness: 0,
      valueFormatString: "#,###,.##K",
    },
    toolTip: {
      enabled: false,
    },
    data: [
      {
        type: "spline",
        name: "Payments",
        showInLegend: true,
        dataPoints: month_data.incoming_funds,
      },
      {
        type: "spline",
        name: "Expenses",
        showInLegend: true,
        dataPoints: month_data.outgoing_funds,
      },
    ],
  };

  const options_2 = {
    animationEnabled: true,
    dataPointMaxWidth: 30,

    legend: {
      horizontalAlign: "center", // left, center ,right
      verticalAlign: "top", // top, center, bottom
    },

    title: {
      text: "Monthly Incomings/Outgoings",
    },

    axisY: {
      title: "Amounts",
      gridThickness: 0,
      valueFormatString: "#,###,.##K",
    },
    toolTip: {
      enabled: false,
    },
    data: [
      {
        type: "column",
        name: "Payments",
        indexLabel: "{y}",
        indexLabelFontWeight: "bold",
        indexLabelOrientation: "vertical",
        showInLegend: true,
        dataPoints: year_data.incoming_funds,
      },
      {
        type: "column",
        name: "Expenses",
        indexLabel: "{y}",
        indexLabelFontWeight: "bold",
        showInLegend: true,
        indexLabelOrientation: "vertical",
        dataPoints: year_data.outgoing_funds,
      },
    ],
  };

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(
        `${route}/api/dashboard-amounts/?project_id=${selected_branch.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      const json = await response.json();
      if (json.code === "token_not_valid") {
        logout();
      }
      if (response.ok) {
        setdata1(json);
      }
    };

    const fetchremainders = async () => {
      const response = await fetch(
        `${route}/api/payments-reminder/?project=${selected_branch.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      const json = await response.json();

      if (response.ok) {
        const optimize = json.filter((item) => {
          return item.reminder_date === date;
        });
        setdata_3(optimize);
      }
    };

    const fetchcounts = async () => {
      const response = await fetch(
        `${route}/api/dashboard-counts/?project_id=${selected_branch.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      const json = await response.json();

      if (response.ok) {
        setdata2(json);
      }
    };

    const fetchmonthlyreports = async () => {
      const response = await fetch(
        `${route}/api/monthly-incoming-fund/?project_id=${selected_branch.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      const json = await response.json();

      if (response.ok) {
        const optimize_1 = json.incoming_funds.map((item) => {
          return { y: item.total_amount, label: item.day };
        });
        const optimize_2 = json.outgoing_funds.map((item) => {
          return { y: item.total_amount, label: item.day };
        });
        setmonth_data({
          incoming_funds: optimize_1,
          outgoing_funds: optimize_2,
        });
      }
    };

    const fetchyearlyreports = async () => {
      const response = await fetch(
        `${route}/api/annual-incoming-fund/?project_id=${selected_branch.id}`,
        {
          headers: { Authorization: `Bearer ${user.access}` },
        }
      );

      const json = await response.json();

      if (response.ok) {
        const optimize_1 = json.incoming_funds.map((item) => {
          return { y: item.total_amount, label: item.month };
        });
        const optimize_2 = json.outgoing_funds.map((item) => {
          return { y: item.total_amount, label: item.day };
        });
        setyear_data({
          incoming_funds: optimize_1,
          outgoing_funds: optimize_2,
        });
      }
    };

    if (selected_branch) {
      fetchWorkouts();
      fetchcounts();
      fetchremainders();
      fetchmonthlyreports();
      fetchyearlyreports();
    }
  }, [selected_branch]);

  const headerstyle = (column, colIndex, { sortElement }) => {
    return (
      <div
        className="d-flex justify-content-between align-items-center"
        style={{ minHeight: "2.5rem" }}
      >
        {column.text}
      </div>
    );
  };

  const columns = [
    {
      dataField: "customer_info.name",
      text: "Customer",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "customer_info.contact",
      text: "Contact",
      sort: true,
      headerFormatter: headerstyle,
    },
    {
      dataField: "reminder_date",
      text: "Remainder Date",
      sort: true,
      headerFormatter: headerstyle,
    },
  ];

  return (
    <div className="p-3">
      <h1 className="ms-3">Dashboard</h1>

      <div className="row  ">
        <div className="col-sm-3  mb-1">
          <Widget
            name="Customers"
            icon_widget={<SupervisorAccountIcon fontSize="inherit" />}
            link="/customer"
            color="royalblue"
            text_1={data2.customer_count}
          />
        </div>
        <div className="col-sm-3 mb-1">
          <Widget
            name="Plots"
            icon_widget={<ApartmentIcon fontSize="inherit" />}
            link="/plot"
            color="#28a745"
            text_1={`Active: ${data2.active_plots_count}`}
            text_2={`Sold: ${data2.sold_plots_count}`}
          />
        </div>
        <div className="col-sm-3 mb-1">
          <Widget
            name="Tokens"
            icon_widget={<MoveToInboxIcon fontSize="inherit" />}
            link="/token"
            color="#ffc107"
            text_1={data2.non_expired_tokens_count}
          />
        </div>

        <div className="col-sm-3">
          <Widget
            name="Bookings"
            icon_widget={<BookmarkIcon fontSize="inherit" />}
            link="/booking"
            color="#17a2b8"
            text_1={data2.booking_count}
          />
        </div>
      </div>

      <div className=" row">
        <div className="col-sm-3 mb-1">
          <Widget
            name="Payments"
            icon_widget={<BusinessCenterIcon fontSize="inherit" />}
            link="/payemnt"
            color="#dc3545"
            text_1={data1.incoming_amount}
          />
        </div>

        <div className="col-sm-3 mb-1">
          <Widget
            name="Misc."
            icon_widget={<AccountBalanceIcon fontSize="inherit" />}
            link="/voucher"
            color="#17a2b8"
            text_1={`In: ${data1.journal_voucher_in_amount}`}
            text_2={`Out: ${data1.journal_voucher_out_amount}`}
          />
        </div>

        <div className="col-sm-3 mb-1">
          <Widget
            name="Expenses"
            icon_widget={<LocalAtmIcon fontSize="inherit" />}
            link="/expense"
            color="royalblue"
            text_1={data1.outgoing_amount}
          />
        </div>

        <div className="col-sm-3 mb-1">
          <Widget
            name="Resale"
            icon_widget={<HistoryIcon fontSize="inherit" />}
            link="/resale"
            color="#28a745"
            text_1={data2.resale_plots_count}
          />
        </div>
      </div>

      <div className=" row    mt-3">
        <div className="col-sm-6  pe-3">
          <div className="card">
            <div className=" card-body">
              <CanvasJSChart className="col-sm-11" options={options} />
            </div>
          </div>
        </div>

        <div className="col-sm-6  ps-3">
          <div className="card ">
            <div
              className="card-body p-0"
              style={{ height: "27rem", overflow: "auto" }}
            >
              <h4 className="p-3 ps-3">Remainders</h4>
              <ToolkitProvider
                keyField="id"
                data={data_3}
                columns={columns}
                search
                exportCSV
              >
                {(props) => (
                  <div>
                    <BootstrapTable
                      {...props.baseProps}
                      bordered={false}
                      bootstrap4
                      condensed
                      wrapperClasses="table-responsive"
                    />
                  </div>
                )}
              </ToolkitProvider>
            </div>
          </div>
        </div>
      </div>

      <div className=" mt-3">
        <div className="card col-sm-12">
          <div className=" card-body ">
            <CanvasJSChart className="col-sm-11" options={options_2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
