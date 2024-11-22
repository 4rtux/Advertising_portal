import fs from "fs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import momentTZ from "moment-timezone";
import moment  from "moment";
import nodemailer  from "nodemailer";
import { Readable } from 'stream';
import csv from 'csv-parser';
import Identity from "./Identity";





// const fs = require("fs");
// const jwt = require("jsonwebtoken");
// const moment = require("moment");
// const momentTZ = require('moment-timezone');
// const { Player, Arena } = require("../database/sqlite/models");
// const { Op } = require("sequelize");
// const dotenv = require('dotenv');

dotenv.config();
export const JWT_SECRET = process.env.JWT_SECRET;
// let folder = './app/public/uploads/'
const timezone = 'Europe/Oslo'; // Replace with your desired timezone
const now = moment().tz(timezone);
// export const TIMESTAMP = Math.floor(moment().tz(timezone).valueOf()/1000)
export const TIMESTAMP = momentTZ.tz(timezone).unix()
export const maxAge = 30 * 24 * 60 *60;
export const SMTP_SETTINGS_1 = {password:process.env.SMTP_PASSWORD_1,email:process.env.SMTP_EMAIL_1}


// exports.maxAge = maxAge
// export maxAge = maxAge

/**
 * Creates a JWT token based on the specified type and value.
 * @param {string} type - The type of the token (e.g., 'user', 'admin').
 * @param {any} value - The value associated with the token type.
 * @param {boolean} remember - Optional. Indicates whether the token should have a longer expiration (default is true).
 * @returns {string} The generated JWT token.
 */
export const createToken = (type:string,value:object|string,remember=true):string =>{
    return jwt.sign({[type]:value},process.env.JWT_SECRET,{
        expiresIn:remember?maxAge * 30:maxAge / 30
    })
}
/**
 * Generates a random string of the specified length and character type.
 * @param {number} length - The length of the generated string.
 * @param {string} type - The type of characters in the string ('alpha numeral', 'alpha', 'digit', or 'mix').
 * @returns {string} The generated random string.
 */
const genid = (length:number,type="alpha numeral"):string => {
    let result = '';
    let characters = '';
    if(type == "mix"){
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.!@#$%^&*'
    }
    else if(type == "alpha"){
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    }
    else if(type == "digit"){
        characters = '0123456789'
    }
    else{
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    }
    // var characters       = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.genID = genid

/**
 * Generates a unique game identifier in the format "GM" followed by a combination of digits and alphabetic characters.
 * @returns {string} The generated unique game identifier.
 */
export const genGMID = () => {
    const alpha = genid(2,"alpha")
    const digit = genid(4,"digit")
    return `GM${digit}${alpha}`
}


/**
 * Generates a random integer within the specified range.
 * @param {number} min - The minimum value of the range.
 * @param {number} max - The maximum value of the range.
 * @returns {number} The generated random integer.
 */
export const randomInt = (min, max) =>  {
    return min + Math.floor((max - min) * Math.random());
}


export const createUserAgent = (req:any):any => {
    let userAgent = req.useragent;
    const browser = userAgent.browser+ " "+userAgent.version;
    const deviceType = userAgent.isMobile ? 'Mobile' : userAgent.isTablet ? 'Tablet' : 'Desktop';
    const deviceModel = userAgent.platform+` (${userAgent.os})`;
    userAgent = {device_type:deviceType,device_model:deviceModel,browser:browser,location:"Nigeria",extra:JSON.stringify({ip:"",useragent:req.get('User-Agent'),lat:"",long:""})}
    return userAgent
}

// Recursively update an object
export const updateObject = (source, update) => {
    for (const key in update) {
      if (update.hasOwnProperty(key)) {
        if (typeof update[key] === 'object' && update[key] !== null && !Array.isArray(update[key])) {
          // Recursive call for nested objects
          source[key] = updateObject(source[key] || {}, update[key]);
        } else {
          // Update the value
          source[key] = update[key];
        }
      }
    }
    return source;
}

export const uploadFile =(filename:string,folder:string,fileContent:any,prevFile=null):any => {
    try{
        const fileExtension = fileContent.name.split(".")[1]
        filename = filename+"."+fileExtension.toLowerCase()
        fs.writeFileSync("./uploads/"+folder+filename, fileContent.data);
        let prevFileSize = 0
        // Delete the previous file
        if(prevFile){
          prevFileSize = fs.statSync("./uploads/"+folder+prevFile).size
          fs.unlinkSync("./uploads/"+folder+prevFile);
        }
        return {status:true,prevFileSize,filename}
    }
    catch(err:any){
      throw new Error(err)
    }
}

export const getTimestamps = (dateString:string) => {
  // Parse the input date string in the Europe/Oslo timezone
  const osloDate = moment.tz(dateString, timezone);

  // Set the time to the start of the day (00:00:00)
  const startOfDay = osloDate.startOf('day').valueOf()/1000;

  // Set the time to the end of the day (23:59:59.999)
  const endOfDay = osloDate.endOf('day').valueOf()/1000;

  return { startOfDay, endOfDay };
}

/**
 * Formats a UNIX timestamp into a human-readable date and time string.
 * @param {number} timestamp - The UNIX timestamp to be formatted.
 * @returns {string} The formatted date and time string.
 */
export const formatUnix = (timestamp: number):string =>{
    timestamp = Number(timestamp)*1000
    const osloTime = momentTZ.tz(timestamp, timezone);
    // Format the timestamp
    // let formattedTime = moment.unix(timestamp).tz(timezone).format('MMM D, YYYY h:mm A');
    const formattedTime = osloTime.format('ddd, D MMM, YYYY h:mm A');
    // const formattedTime = osloTime.format('MMM D, YYYY h:mm A');
    return formattedTime
}

/**
 * Calculates the time elapsed based on the time difference in milliseconds.
 * @param {number} difference - The time difference in milliseconds.
 * @returns {string} A formatted string indicating the time elapsed.
 */
export const timeElasped = (difference) => {
    difference = Number(difference)*1000
    if (difference < 0) {
        return "Expired";
    }
    else{
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference  % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference  % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference  % (1000 * 60)) / 1000);
        let timeVar = "";
        if (days>0) {
            timeVar += `${days}d `;
        }
        if (hours>0) {
            timeVar += `${hours}h `;
        }
        if (minutes>0) {
            timeVar += `${minutes}m `;
        }
        if (seconds>0) {
            timeVar += `${seconds}s `;
        }
        if(timeVar == ""){
            timeVar = "Now";
        }
        return timeVar;
    }
}

/**
 * Validates form data and returns an array of validation errors.
 * @param {Object} data - The form data to be validated.
 * @returns {Array} An array of validation error messages.
 */
export const validateFormData = (data) =>{
    const errors: string[] = [];
  
    // Validation for first name
    if (!data.fname.trim()) {
      errors.push("First name is required");
    }
  
    // Validation for last name
    if (!data.lname.trim()) {
      errors.push("Last name is required");
    }
  
    // Validation for email
    if (!data.email.trim()) {
      errors.push("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.push("Invalid email format");
    }
  
    // Validation for username
    if (!data.username.trim()) {
      errors.push("Username is required");
    }
  
    // Validation for password
    if (!data.password.trim()) {
      errors.push("Password is required");
    } else if (data.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }
  
    // Validation for confirm password
    if (!data.cpassword.trim()) {
      errors.push("Confirm password is required");
    } else if (data.cpassword !== data.password) {
      errors.push("Passwords do not match");
    }
  
    return errors;
}


/**
 * Function to check if a data is an object or not and parse it if it is not an object
 * @param {*} data string or object
 * @returns an object
 */
export const makeJSON = (data)=>{
    if(typeof data != "object"){
        return JSON.parse(data)
    }
    return data
}

export const createSlug = (input)  => {
    // Replace special characters with a space
    const cleaned = input.replace(/[^\w\s]/gi, ' ');

    // Remove extra spaces and trim the string
    const slug = cleaned.trim().replace(/\s+/g, '-');

    return slug;
}

export const encodeLink = (code,dateTimeString,id) => {
    const unixTimestamp = moment(dateTimeString, 'YYYY-MM-DD HH:mm:ss').unix();
    const urlID = `${createSlug(code)}-${id}${unixTimestamp}`
    const courseLink = `https://uis.signedin.today/course/${urlID}`;
    const encodedLink = encodeURI(courseLink);
    return encodedLink;
}

export const decodeLink = (urlID) => {
    // Separate the course code from the rest of the string
    const segments = urlID.split('-');
    const IDUnix = segments[segments.length - 1];
    // Get the last 10 characters of the string
    const unixTimestamp = Number(IDUnix.slice(-10));
    // Get the rest of the string
    const courseID = Number(IDUnix.slice(0, -10));
    const createdAt = moment.unix(unixTimestamp).format('YYYY-MM-DD HH:mm:ss');
    // Return the course code, id and date
    return {id:courseID, createdAt};
}

export const genDayToken = () => {  
    const id = new Identity()
    const dayTokenIDFormat = {static:2,number:5,alphabet:3,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''};
    const dayTokenID = id.getNewID(dayTokenIDFormat) + moment().tz(timezone).format("YYMMDDHHSS")
    const timestamp = momentTZ.tz(timezone).unix()
    return {id:dayTokenID,timestamp,isNew:true}
}

export const verifyDayToken = (dayToken) => {
    // console.log({TIMESTAMP}) 
    // if(instanceID.slice(-6) != moment().tz(timezone).format("YYMMDD")){
    if(!dayToken || (momentTZ.unix(dayToken.timestamp).tz(timezone).format("YYMMDD") != momentTZ.tz(timezone).format("YYMMDD"))){
        return genDayToken()
    }
    return {id:dayToken.id,isNew:false} 
}

export const readCSV = (csvString:string): Promise<any[]> => {
    const dataArray:any[] = [];
    const readableStream = Readable.from(csvString);
    
    return new Promise((resolve, reject) => {
        readableStream.pipe(csv())
          .on('data', (row) => {
            // Process each row and push it to the dataArray
            dataArray.push(row);
          })
          .on('end', () => {
            // Resolve the promise with the dataArray when parsing is complete
            resolve(dataArray);
          })
          .on('error', (error) => {
            // Reject the promise with the error if there's an issue during parsing
            reject(error);
          });
      });
}


export const daysDifference = (date:string) => {
    const currentDate = moment().tz(timezone);
    // Target date
    const targetDate = moment(date, 'YYYY-MM-DD');
    
    // Calculate the difference in days
    const daysDifference1 = targetDate.diff(currentDate, 'days');
    return daysDifference1
}
export const getNextDate = (day:string) => {
    const today = moment().tz(timezone);
    const weekDays =["sun","mon","tue","wed","thu","fri","sat"]
    const daysUntil = (weekDays.indexOf(day) - today.day() + 7) % 7;
    const date = today.clone().add(daysUntil, 'days').format('YYYY-MM-DD');
    // return date + " " + daysDifference(date)
    return date
}




export const sendMail = ({settings,subject,html,to,callback}) => {
    // console.log(settings)m
    const {email,password,} = settings
    const from = `SignedIn <${email}>`
    const smtp = nodemailer.createTransport({
        host: "premium78.web-hosting.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user:email,
            pass:password
        }
    })
    const mailOptions = {
        from,
        to,
        subject,
        html
    };

    smtp.sendMail(mailOptions, callback)
}