import { useState, useEffect } from "react";
import { Bar, Doughnut, Line} from "react-chartjs-2";
import axios from 'axios' 

export default function Conents() {

    const  [confirmedData, setConfirmedData] = useState({
        labels: ["1월", "2월", "3월"],
        datasets: [
            {
                label: "국내 누적 확진자",
                backgroundColor: "salmon",
                fill: true,
                data:[10,5,3]
            },
        ]
    });
    
    const options={ 
        title:{ display: true, text: "누적 확진자 추이", fontSize: 16 },
        legend:{display: true, positon: "bottom"},
    };

    useEffect(()=> {

        const fetchEvent = async ()=>{
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
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
