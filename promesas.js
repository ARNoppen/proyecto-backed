const sumar = (num1,num2) => {
    return new Promise((resolve, reject) => {
        if(num1 == 3){
            reject(new Error ("NO DEBES COLOCAR 3"))
        }
        if(num2 == 3){
            reject(new Error ("NO DEBES COLOCAR 3"))
        }
        let result = num1 + num2;
        resolve (result);
    });
};

sumar(2,3)
 .then((resolve) => console.log(resolve))
 .catch((error) => console.log(error.message));
