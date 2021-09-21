import { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import axios from 'axios' ;

export default function Conents() {

    const [confirmedData, setConfirmedData] = useState({});
    const [quarantinedData, setQuarantinedData] = useState({});
    const [comparedData, setComparedData] = useState({});

    const options2={
        title:{ display: true, text: "월별 격리자 현황", fontSize: 16 },
        legend:{display: true, position: "bottom"}
    };
    const options3={
        title:{ display: true, text: `누적 확진/해제/사망 (${new Date().getMonth()+1}월)`, fontSize: 16 },
        legend:{display: true, position: "bottom"}
    };

    
    useEffect(()=> {

        const fetchEvent = async ()=>{
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
            makeData(res.data);
        }

        const makeData = (items)=> {
            const arr = items.reduce((acc, cur)=>{
                const curruntDate = new Date(cur.Date);
                const year = curruntDate.getFullYear();
                const month = curruntDate.getMonth();
                const date = curruntDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const deaths = cur.Deaths;
                const recovered = cur.Recovered;

                const findItem = acc.find(a=> a.year === year && a.month === month);
                
                if(!findItem){
                    acc.push({
                        year, month, date, confirmed, active, deaths, recovered
                    });
                }

                if(findItem && findItem.data < date){
                    findItem.year = year;
                    findItem.monthr = month;
                    findItem.date = date;
                    findItem.confirmed = confirmed;
                    findItem.active = active;
                    findItem.deaths = deaths;
                    findItem.recovered = recovered;
                }
    
                return acc;
            }, []);

            const labels = arr.map(a=>`${a.month+1}월`)
            setConfirmedData({
                labels,
                datasets: [{
                    label: "국내 누적 확진자",
                    backgroundColor: "salmon",
                    fill: "true",
                    data: arr.map(a=>a.confirmed),
                }]
            });

            setQuarantinedData({
                labels,
                datasets: [{
                    label: "월별 격리자 현황",
                    borderColor: "salmon",
                    fill: "false",
                    data: arr.map(a=>a.active),
                }]
            });

            const lastMonth = arr[arr.length-1];
            setComparedData({
                labels: ["누적 확진자", "격리 해제", "사망자"],
                datasets: [{
                    label: "누적 확진/해제/사망 비율",
                    backgroundColor: ["#ff3d7", "#059bff", "#ffc233"],
                    borderColor: ["#ff3d7", "#059bff", "#ffc233"],
                    fill: "false",
                    data: [lastMonth.confirmed, lastMonth.recovered, lastMonth.deaths],
                }]
            });
        }

        fetchEvent();
    }, []);

    return (
        <section>
            <div className="contents">
                    <Bar data={ confirmedData } 
                        options={{
                            title:{ display: true, text: "누적 확진자 추이", fontSize: 16 },
                            legend:{display: true, position: "bottom"}
                        }}
                     />
                    <Line data={ quarantinedData } options={ options2 } />
                    <Doughnut data={ comparedData } option={ options3 } />
            </div>
        </section>
    );
}
