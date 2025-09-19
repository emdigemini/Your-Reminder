const day = new Date();

const dayJS = (callback) => {
  setInterval(()=>{
    const YYYY = day.getFullYear();
    const D = day.getDate();
    const month = day.getMonth();

    const HR = day.getHours();
    const MN = day.getMinutes();
    const SC = day.getSeconds();



    const months = ['January', 'February', 'March', 
                    'April', 'May', 'June', 
                    'July', 'August', 'September',
                    'October', 'November', 'December'
                  ]

    const MMM = months[month];

  }, 1000)
}
