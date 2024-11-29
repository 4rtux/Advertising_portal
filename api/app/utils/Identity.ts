
class Identity {
    generateID = (length:number,type="alpha numeral"):string => {
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

    getNewID(format: any): string {

      let nextID = '';  
      const {staticVal, prevID,isRandom, ...settings} = format;
      for (const [key, value] of Object.entries(settings)) {
        if (key === 'static') {
            if(staticVal === '_alpha_'){
                // Generate alphabet with length of {value}
                nextID += this.generateID(parseInt(value+''),"alpha");         
            }
            else if(staticVal === '_number_'){
                // Generate number with length of {value}
                nextID += this.generateID(parseInt(value+''),"digit");
            }
            else{
                nextID += staticVal;
                // nextID += prevIDVal;
            }
        }
        if (key === 'year') {
          nextID += value === 2 ? new Date().getFullYear().toString().slice(-2) : new Date().getFullYear().toString();
        }
        if (key === 'number') {
            // If it should be random, generate a random number with length of {value}
            if(isRandom){
                nextID += this.generateID(parseInt(value+''),"digit");
                continue;
            }
          const newNumber = '1'.padStart(parseInt(value+''), '0');
          nextID += newNumber;
        }
        if (key === 'alphabet') {
            // If it should be random, generate a random alphabet with length of {value}
            if(isRandom){
                nextID += this.generateID(parseInt(value+''),"alpha");
                continue;
            }
          const newAlpha = 'A'.padStart(parseInt(value+''), 'A');
          nextID += newAlpha;
        }
      }
  
      return nextID;
    }
  
    getNextID(format:any): string {
      let nextID = ''; 
      const {staticVal, prevID,isRandom, ...settings} = format;
    //   console.log({settings})
      const weight = Object.values(settings);
      let i = 0;
      let isMaxNumber = false;
      let isNewYear = false;
  
      for (const [key, value] of Object.entries(settings)) {
        const range = this.getRange(weight, i);
        const prevIDVal = prevID.substring(range[0], range[0] + range[1]);
  
        if (key === 'static') {
            if(staticVal === '_alpha_'){
                // Generate alphabet with length of {value}
                nextID += this.generateID(parseInt(value+''),"alpha");         
            }
            else if(staticVal === '_number_'){
                // Generate number with length of {value}
                nextID += this.generateID(parseInt(value+''),"digit");
            }
            else{
                nextID += staticVal;
                // nextID += prevIDVal;
            }
        }
        if (key === 'year') {
          if (prevIDVal === new Date().getFullYear().toString().slice(-2) || prevIDVal === new Date().getFullYear().toString()) {
            nextID += prevIDVal;
          }
          else {
            nextID += value === 2 ? new Date().getFullYear().toString().slice(-2) : new Date().getFullYear().toString();
            isNewYear = true;
          }
        }
        if (key === 'number') {
          const maxNumber = Math.pow(10, parseInt(value+''.toString(), 10)) - 1;
          let nextNumber = '';
  
          if (maxNumber === parseInt(prevIDVal, 10)) {
            isMaxNumber = true;
            nextNumber = '1'.padStart(parseInt(value+''), '0');
          } else if (isNewYear) {
            // If it is new year, reset the number to 1
            nextNumber = '1'.padStart(parseInt(value+''), '0');
          } else {
            nextNumber = (parseInt(prevIDVal, 10) + 1).toString().padStart(parseInt(value+''), '0');
          }  
          nextID += nextNumber;
        }
        if (key === 'alphabet') {
          if (isMaxNumber) {
            // It only increment the alphabets if the number is the max number
            const nextAlpha = this.getNextAlphabetInSequence(prevIDVal);
            if (nextAlpha) {
              nextID += nextAlpha;
            } else {
                //   return { status: false, value: '', message: 'The maximum number of IDs has been reached' };
                throw new Error('The maximum number of IDs has been reached')
            }
          } else {
            if (isNewYear) {
                // If it is new year, reset the alphabet to A
                nextID += 'A'.padStart(parseInt(value+''), 'A');
            }else {
              nextID += prevIDVal;
            }
          }
        }
  
        i++;
      }
  
    //   return { status: true, value: nextID };
      return nextID;
    }

    get(format:any): string {
        if (format.isNew || format.isRandom) {
            return this.getNewID(format);
            // return { status: true, value: this.getNewID(format), message: 'New ID' };
        }
        else{
            return this.getNextID(format);        
        }
    }
  
    getRange(weight: any[], index: number): [number, number] {
      let start = 0;
      let numberOfCharacters = 0;
  
      for (let i = 0; i < weight.length; i++) {
        if (i === index) {
          numberOfCharacters = parseInt(weight[i].toString(), 10);
          break;
        }
        start += parseInt(weight[i].toString(), 10);
      }
  
      return [start, numberOfCharacters];
    }
  
    getNextAlphabetInSequence(str: string): string | false {
      const stringLength = str.length;
      let nextString = '';
      let isZ = false;
      const exclude = ['O', 'I', 'L', 'S'];
  
      if (str === 'Z'.padStart(stringLength, 'Z')) {
        return false;
      }
  
      for (let i = stringLength - 1; i >= 0; i--) {
        const char = str[i];
  
        if (i !== stringLength - 1) {
          if (isZ) {
            if (char === 'Z') {
              nextString = 'A' + nextString;
              isZ = true;
            } else {
              nextString = this.genNextChar(exclude, char) + nextString;
              isZ = false;
            }
          } else {
            nextString = char + nextString;
            isZ = false;
          }
        } else {
          if (char === 'Z') {
            nextString = 'A' + nextString;
            isZ = true;
          } else {
            nextString = this.genNextChar(exclude, char) + nextString;
          }
        }
      }
  
      return nextString;
    }
  
    genNextChar(exclude: string[], char: string): string {
      const nextChar = String.fromCharCode(char.charCodeAt(0) + 1);
  
      if (exclude.includes(nextChar)) {
        return this.genNextChar(exclude, nextChar);
      } else {
        return nextChar;
      }
    }
  }
  
 
// const format = {static:3,year:2,number:2,alphabet:3,isNew:false,staticVal:'RSS',prevID:'RSS2498AAA'};
/**
 * if staticVal is _alpha_ then the static value will be an alphabet. 
 * If staticVal is _number_ then the static value will be a number.
 * If staticVal is another value then the static value will be the value.
 * 
 * Numbers are incremented first before alphabets. So alphabets remain static until there is a max number. 
 * On a new year everything resets to the initial value.
 * If isRandom is on, it means it will generate new ID and the number and alphabet will be random. 
 * {static:2,number:2,alphabet:1,isNew:true,isRandom:true,staticVal:'_alpha_',prevID:''}; //EK98Z
 */

export default Identity;