import { useState } from "react";
import "./weather.css";
import axios from "axios"

export default function Weather(){

    const [search,setSearch] = useState("");
    const [cityData,setCityData] = useState({});
    const [preSearch,setPreSearch] = useState([]);
    const [valid,setValid] = useState(false);
    const [previs,setPrevis] = useState(false);


    function searchHandle(e){
        setSearch(e.target.value);
        if(search.trim() !== "" && cityData.name === undefined && preSearch.length === 0){
            setValid(true)
        }else{
            setValid(false);
        }

        if(e.target.value.trim() !== ""){
            axios(`https://api.openweathermap.org/data/2.5/weather?q=${e.target.value}&appid=8a0b2383feef79933d64db3a0bf03e2a&units=metric`,{
                method:"get"
            }).then(res=>{
                // console.log(res);
                setCityData(res.data);
                setValid(false);
                setPrevis(false);
                setPreSearch(pre=>{
                    let temp = [...pre];
                    if(temp.length < 3){
                        temp.unshift(res.data.name);
                    }else{
                        temp.unshift(res.data.name);
                        temp.pop();
                    }
                    return temp;
                })
            }).catch(err=>{
                setCityData({});
               
                setValid(true)


                // console.log(err);
            })

        }else{
            setCityData({});
            if(cityData.name === undefined && preSearch.length !== 0){
                setPrevis(true);
            }else{
                setPrevis(false);
            }
            setValid(false);
        }



    }

    return<div className="canvas">
        <div className="header">
            <h1>Weather App</h1>
            <input type={"text"} value={search} placeholder="Enter City Name" onChange={searchHandle} />
        </div>
        {cityData.name && <div className="main-conatiner">
            <p className="city-name">Weather Details of City :{cityData.name}</p>
            <p>Current Temperature :{cityData.main.temp}</p>
            <p>Temperature Range :{cityData.main.temp_min}  &#8451; to {cityData.main.temp_max}  &#8451;</p>
            <p>Humidity :{cityData.main.humidity}</p>
            <p>Pressure :{cityData.main.pressure}</p>
            <p>Wind Speed :{cityData.wind.speed}</p>
            <p style={{color:"red",fontSize:"1em"}}>*sea level and ground level are under paid api so added pressure and wind speed </p>
            </div>}
        {
            valid &&  <div style={{margin:"30px auto",color:"white",backgroundColor:"red",fontSize:"2em"}}>
                Enter Valid city Name
            </div>
        }
        {
            previs && <div className="last-entries">
                <h2>Last 3 city entries</h2>
                <ul className="pre-city">
                   {preSearch.map((elm,i)=>{
                    return<li key={i}>{elm}</li>
                   })} 
                </ul>
            </div>
        }
    </div>
}