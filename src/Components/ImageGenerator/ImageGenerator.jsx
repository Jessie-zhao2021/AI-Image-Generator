import React from 'react';
import { useState, useRef } from "react";
import './ImageGenerator.css';
import default_image from '../Assets/default_image.jpg';
import {config} from '../../config';

const ImageGenerator = () => {
    const [image_url, setImage_url] = useState("/");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    let inputRef = useRef(null);

    const HandleImageGenerator = async () => {
        if(inputRef.current.value==="") return 0;
        setLoading(true);
        try{
            const response = await fetch(
                "https://api.openai.com/v1/images/generations",
                {
                    method:"POST",
                    headers:{
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${config.openAiKey}`
                        
                    },
                    body: JSON.stringify({
                        prompt:`${inputRef.current.value}`,
                        n:1,
                        size:"512x512",
                    }),
                }
            );  
            
            if(!response.ok){
                console.log('response:', response)
                console.log('response.statusText:',response.statusText)
                console.log('response.status:', response.status)
                setIsError(true);
                throw new Error("Bad request:::::::::::" + response.statusText)
            }
            let data = await response.json();
            let data_array = data.data;
            setImage_url(data_array[0].url);
            setLoading(false);
            setIsError(false);
            if(!data){
                setIsError(true);
                throw new Error('Data is empty!');
            }
            return data
        }catch(error){
            setIsError(true);
            console.error("Error occurred:", error)

        }
    }
  return (
    <div className='ai-image-generator'>
        <div className='header'>Ai image <span>generator</span></div>
        <div className="img-loading">
            <div className="image"><img src={image_url==="/"?default_image:image_url} alt=''/></div>
            <div className="loading">
                <div className={loading?"loading-bar-full":"loading-bar"}></div>
                <div className={loading?"loading-text":"display-none"}>Loading....</div>
            </div>
        </div>
        <div className="search-box">
            <input type="text" ref={inputRef} className="search-input" placeholder='Describe What You Want To See'/>
            <div className="generate-btn" onClick={()=>{HandleImageGenerator()}}>Generate</div>
        </div>
        <div className= {isError?'error-text':'display-none'}>Something Wrong! Try later please!</div>

    </div>
  )
}

export default ImageGenerator
