import { useState, useEffect } from 'react';
import { Bar, Doughnut, Line } from "react-chartjs-2";
import axios from "axios";

const Contents = () => {

    const [confirmedData, setConfirmedData] = useState({});
    const [quarantinedData, setQuarantinedData] = useState({});
    const [comparedData, setComparedData] = useState({});

    useEffect(()=>{
       const fetchEvents = async () => {
           const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
           //console.log(res);
           makeData(res.data);
       }

       const makeData = (items) => {
           //items.forEach(item => console.log(item));
           const arr = items.reduce((acc, cur)=>{
               const currentDate = new Date(cur.Date);
               const year = currentDate.getFullYear();
               const month = currentDate.getMonth() + 1;
               const date = currentDate.getDate();
               const confirmed = cur.Confirmed;
               const active = cur.Active;
               const deaths = cur.Deaths;
               const recovered = cur.Recovered;

               const findItem = acc.find(a => a.year === year && a.month === month);

               if(!findItem){
                   acc.push({
                       year: year,
                       month: month,
                       date : date,
                       confirmed: confirmed,
                       active: active,
                       deaths: deaths,
                       recovered: recovered
                   });
               }
               if(findItem && findItem.date < date){
                   findItem.active = active;
                   findItem.deaths = deaths;
                   findItem.date = date;
                   findItem.year = year;
                   findItem.month = month;
                   findItem.recovered = recovered;
                   findItem.confirmed = confirmed;
               }
               //console.log(year, month, date);
               return acc;
           }, []);

           const labels = arr.map(a => `${a.month}???`);
           setConfirmedData({
               labels: labels,
               datasets: [
                   {
                       label: "?????? ?????? ?????????",
                       backgroundColor: "salmon",
                       fill: true,
                       data: arr.map(a => a.confirmed)
                   },
               ]
           });
           setQuarantinedData({
               labels: labels,
               datasets: [
                   {
                       label: "?????? ????????? ??????",
                       borderColor: "salmon",
                       fill: false,
                       data: arr.map(a => a.active)
                   },
               ]
           });
           const last = arr[arr.length - 1];
           setComparedData({
               labels: ["?????????", "????????????", "??????"],
               datasets: [
                   {
                       label: "?????? ??????, ??????, ?????? ??????",
                       backgroundColor: ["#ff3d67", "#059bff", "#ffc233"],
                       borderColor: ["#ff3d67", "#059bff", "#ffc233"],
                       fill: false,
                       data: [last.confirmed, last.recovered, last.deaths]
                   },
               ]
           });
           //console.log(arr);
       }
       fetchEvents();
    }, []);

    return (
        <section>
            <h2>?????? ????????? ??????</h2>
            <div className="contents">
                <div>
                    <Bar data={ confirmedData } options={
                        { title: {display: true, text: "?????? ????????? ??????", fontSize: 16 } },
                        { legend: {display: true, position: "bottom"}}
                        } />
                </div>
                <div>
                    <Line data={ quarantinedData } options={
                        { title: {display: true, text: "?????? ????????? ??????", fontSize: 16 } },
                        { legend: {display: true, position: "bottom"}}
                    } />
                </div>
                <div>
                    <Doughnut data={ comparedData } options={
                        { title: {display: true, text: `??????, ??????, ??????, ??????(${new Date().getMonth()+1}???)`, fontSize: 16 } },
                    { legend: {display: true, position: "bottom"}}
                    } />
                </div>
            </div>
        </section>
    );
}

export default Contents;