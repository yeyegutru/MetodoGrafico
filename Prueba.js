function getRestrictionPoints(restrictions) {
    restrictions.forEach((res,index) => {
        const x = res[0];
        const y = res[1];
        const c = res[3];
    
        let Puntox = c/x;
        let Puntoy=c/y;
    
        console.log("Recta ",index," :  \n{x : ",Puntox,",y : 0 }", " \n{x : 0, y: ",Puntoy,"}")

    })
    
  }

  const restrictions = [
    [2, 3, "", 12],
    [4, 0, "", 8],
    [0, 5, "", 10],
    [1, 1, "", 6]
  ];
  
  const points = getRestrictionPoints(restrictions);
  console.log(points);