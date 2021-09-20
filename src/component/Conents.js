import { useState, useEffect } from "react";
import { Bar, Doughnut, Line} from "react-chartjs-2";
import axios from 'axios' 

export default function Conents() {

    const  [confirmedData, setConfirmedData] = useState();
    
    const options={ 
        title:{ display: true, text: "누적 확진자 추이", fontSize: 16 },
        legend:{display: true, positon: "bottom"},
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
                    })
                }

                if(findItem && findItem.data < items.data){
                    findItem.year = year;
                    findItem.monthr = month;
                    findItem.date = date;
                    findItem.date = date;
                    findItem.confirmed = confirmed;
                    findItem.active = active;
                    findItem.deaths = deaths;
                    findItem.recovered = recovered
                }

    
                return acc;
            }, []);

            const labels = arr.map(a=>`${a.month+1}월`)
            setConfirmedData({
                labels,
                datasets: [
                    {
                        labl: "국내 누적 확진자",
                        backgroundColor: "salmon",
                        fill: "true",
                        data: arr.map(a=>a.Confirmed)
                    },
                ]
            });

        }

        fetchEvent();

    });

    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className="contents">
                <div>
                    <Bar data={ confirmedData } options={options} />
                </div>
            </div>
        </section>
    );
}
