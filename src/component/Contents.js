import { useState, useEffect } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import axios from 'axios' ;

/*chartjs에 대한 공부 내용
chartjs-2는 chart.js에 속해 있다. 

즉,chartjs-2는 wrapper로써 chart.js를 wrapping하고 있기 때문에 chart.js에 기반한 기능이다.
따라서 chartjs-2를 통해 chart.js의 기능을 쓸 수 있게 되는 듯 하다

 chart의 type(종류)로는 line, bar, horizontalBar, radar, doughnut, polarArea, bubble, pie,scatter, area가 있다. 
여기서 주목할 점은 위의 import 부분에서는 chart의 종류들이 대분자로 시작하고 있다는 것이다.
대문자로 쓴 이유는 'react-chartjs-2'라는 모듈에 bar, line, doughnut에 대한 정보가 담겨 있고,
그 정보들을 컴포넌트로써 가져오고 있다는 것을 의미한다.*/

/*axios에 대한 공부 내용

데이터를 비동기 통신으로 받아올 수 있도록 코드로 처리하는 방법 중에 하나다.
비슷한 기능으로는 fetch가 있으며 axios와 fetch모두 API다.
fetch와 비교했을 때 axios는 따로 설치를 해야하는 불편함이 있지만, 기능이 좀 더 많고 코드가 더 간소화 될 수 있다는 장점이 있다.
react에서 많이 쓰인다. 

axios는 async와 await과 함께 쓰이는 경우가 많다.
async는 함수나 코드를 비동기화된 것들은 Promise를 반환한다.
await은 Promise를 반환하는 Promise기반 함수 앞에 쓰이며, async함수 내에서만 쓰일 수 있다.
콜백함수 역할을 해주는 것으로 보인다.
async와 await을 쓰면 받아온 데이터를 "then()"으로 출력할 필요가 없어진다.*/


export default function Conents() {

    const [confirmedData, setConfirmedData] = useState({});
    const [quarantinedData, setQuarantinedData] = useState({});
    const [comparedData, setComparedData] = useState({});

    const options1={
        title:{ display: true, text: "누적 확진자 추이", fontSize: 16 },
        legend:{display: true, position: "bottom"}
    };
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
            // makeData라는 이름의 함수를 미리 호출했다. 호출한 함수는 아래의 코드들이다
            //res.data로 api의 data를 받아오고 있다
        }


        const makeData = (items)=> {//makeData라는 이름으로 함수를 정의했다.
            //res.data를 itmems라는 이름으로 변경하여 가져오고 있다 
            const arr = items.reduce((acc, cur)=>{
                //acc는 누적값, cur은 현재처리 되는 값으로 cur이 처리가 완료되면 acc로 넘어간다
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

                if(findItem && findItem.date < date) {
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

            
            const labels = arr.map(a=>(`${a.month+1}월`));
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
                <Bar data={ confirmedData }  options={ options1 } />
                <Line data={ quarantinedData } options={ options2 } />
                <Doughnut data={ comparedData } option={ options3 } />
            </div>
        </section>
    );    
}
