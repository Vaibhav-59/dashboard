// import React, { useState, useEffect } from "react";
// import axios, { all } from "axios";
// import { VerticalGraph } from "./VerticalGraph";

// // import { holdings } from "../data/data";

// const Holdings = () => {
//   const [allHoldings, setAllHoldings] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:3000/allHoldings").then((res) => {
//       // console.log(res.data);
//       setAllHoldings(res.data);
//     });
//   }, []);

//   // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
//   const labels = allHoldings.map((subArray) => subArray["name"]);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Stock Price",
//         data: allHoldings.map((stock) => stock.price),
//         backgroundColor: "rgba(255, 99, 132, 0.5)",
//       },
//     ],
//   };

//   // export const data = {
//   //   labels,
//   //   datasets: [
//   // {
//   //   label: 'Dataset 1',
//   //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//   //   backgroundColor: 'rgba(255, 99, 132, 0.5)',
//   // },
//   //     {
//   //       label: 'Dataset 2',
//   //       data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
//   //       backgroundColor: 'rgba(53, 162, 235, 0.5)',
//   //     },
//   //   ],
//   // };

//   return (
//     <>
//       <h3 className="title">Holdings ({allHoldings.length})</h3>

//       <div className="order-table">
//         <table>
//           <tr>
//             <th>Instrument</th>
//             <th>Qty.</th>
//             <th>Avg. cost</th>
//             <th>LTP</th>
//             <th>Cur. val</th>
//             <th>P&L</th>
//             <th>Net chg.</th>
//             <th>Day chg.</th>
//           </tr>

//           {allHoldings.map((stock, index) => {
//             const curValue = stock.price * stock.qty;
//             const isProfit = curValue - stock.avg * stock.qty >= 0.0;
//             const profClass = isProfit ? "profit" : "loss";
//             const dayClass = stock.isLoss ? "loss" : "profit";

//             return (
//               <tr key={index}>
//                 <td>{stock.name}</td>
//                 <td>{stock.qty}</td>
//                 <td>{stock.avg.toFixed(2)}</td>
//                 <td>{stock.price.toFixed(2)}</td>
//                 <td>{curValue.toFixed(2)}</td>
//                 <td className={profClass}>
//                   {(curValue - stock.avg * stock.qty).toFixed(2)}
//                 </td>
//                 <td className={profClass}>{stock.net}</td>
//                 <td className={dayClass}>{stock.day}</td>
//               </tr>
//             );
//           })}
//         </table>
//       </div>

//       <div className="row">
//         <div className="col">
//           <h5>
//             29,875.<span>55</span>{" "}
//           </h5>
//           <p>Total investment</p>
//         </div>
//         <div className="col">
//           <h5>
//             31,428.<span>95</span>{" "}
//           </h5>
//           <p>Current value</p>
//         </div>
//         <div className="col">
//           <h5>1,553.40 (+5.20%)</h5>
//           <p>P&L</p>
//         </div>
//       </div>
//       {/* <VerticalGraph data={data} /> */}
//     </>
//   );
// };

// export default Holdings;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null); // Track the hovered row for showing the Sell button

  useEffect(() => {
    fetchHoldings();
  }, []);

  // Fetch holdings data from the backend
  const fetchHoldings = async () => {
    try {
      const res = await axios.get("http://localhost:3000/allHoldings",{
        headers: {
          "Content-Type": "application/json"
        },
        withCredentials: true // ✅ Agar backend cookies ya auth tokens bhej raha hai
      

      });
      setAllHoldings(res.data);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };

  // Handle the delete action for a stock
  // const handleDelete = async (stockId) => {
  //   try {
  //     const response = await axios.delete(`https://tradexabackend.onrender.com/deleteHolding/${stockId}`,{
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       withCredentials: true // ✅ Agar backend cookies ya auth tokens bhej raha hai
      
  //     });
  //     if (response.status === 200) {
  //       setAllHoldings((prev) => prev.filter((stock) => stock._id !== stockId)); // Update UI
  //       console.log("Stock deleted successfully!");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting stock:", error);
  //   }
  // };

  // Calculate total investment, current value, and profit/loss
  const totalInvestment = allHoldings.reduce(
    (acc, stock) => acc + (stock.avg || 0) * (stock.qty || 0),
    0
  );
  const currentValue = allHoldings.reduce(
    (acc, stock) => acc + (stock.price || 0) * (stock.qty || 0),
    0
  );
  const totalProfitLoss = currentValue - totalInvestment;

  // Chart data for VerticalGraph
  const labels = allHoldings.map((stock) => stock.name || "Unknown");
  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price || 0),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
              <th>Actions</th> {/* Add column for actions */}
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = (stock.price || 0) * (stock.qty || 0);
              const isProfit = curValue - (stock.avg || 0) * (stock.qty || 0) >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr
                  key={index}
                  onMouseEnter={() => setHoveredRow(index)} // Show Sell button on hover
                  onMouseLeave={() => setHoveredRow(null)} // Hide Sell button on mouse leave
                >
                  <td>{stock.name || "Unknown"}</td>
                  <td>{stock.qty || 0}</td>
                  <td>{(stock.avg || 0).toFixed(2)}</td>
                  <td>{(stock.price || 0).toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - (stock.avg || 0) * (stock.qty || 0)).toFixed(2)}
                  </td>
                  <td className={profClass}>{stock.net || "0.00"}</td>
                  <td className={dayClass}>{stock.day || "0.00"}</td>
                  <td>
                    {hoveredRow === index && ( // Show Sell button only for the hovered row
                      <button
                        className="sell-button"
                        // onClick={() => handleDelete(stock._id)}
                      >
                        Sell
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            ₹{totalInvestment.toFixed(2)}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            ₹{currentValue.toFixed(2)}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>
            ₹{totalProfitLoss.toFixed(2)} (
            {((totalProfitLoss / totalInvestment) * 100).toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
