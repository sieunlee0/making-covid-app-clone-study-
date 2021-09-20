import { useState, useEffect } from "react";
import { Bar, Doughnut, Line} from "react-chartjs-2";
import axios from 'axios' 
import { getByDisplayValue } from "@testing-library/react";

export default function Conents() {

    useEffect(()=> {

        const fetchEvent = async ()=>{
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
        }
        fetchEvent();

    })

    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className="contents">
                <div>
                    <Bar data={ confirmedData } options={ 
                        {title:{ display: true, text: "누적 확진자 추이", fontSize: 16 }},
                        {legend:{display: true, positon: "bottom"}}
                    }
                </div>
            </div>
        </section>
    );
}
