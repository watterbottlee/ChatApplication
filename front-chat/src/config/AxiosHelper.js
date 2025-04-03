import axios from "axios";

export const baseURL="http://ec2-43-205-74-39.ap-south-1.compute.amazonaws.com:8080";
export const httpClient = axios.create({
    baseURL:baseURL,
    // timeout:1000,
    // headers:{
    //     "content-Type":"application/json"
    // }
}) 