
// getChartTemplate(d) {

//     let inputData = d.map((t, i) => {
//         return t[this.options.dataSelector];
//     });

//     let bgcolors = inputData.map((d) => {
//         // return "rgba(54, 162, 235, 0.2)";
//         return "green";
//     });

//     let bordercolors = inputData.map((d) => {
//         // return "rgba(255,99,132,1)";
//         return "green";
//     });

//     let labels = d.map((d) => {
//         return d.time;
//     });

//     const data = {
//         labels: labels,
//         datasets: [{
//             fill: false,
//             // label: 'Page Views',
//             data: inputData,
//             borderColor: '#3880ff',
//             backgroundColor: '#3880ff',
//             lineTension: 1,
//         }]
//     }

//     const scales = {
//         xAxes: [{
//             type: 'time',
//             time: {
//                 unit: 'day',
//                 bounds: 'ticks'
//             }

//         }],
//         yAxes: [{
//             ticks: {
//                 beginAtZero: true,
//                 suggestedMax: 100,
//             },
//         }]
//     }

//     const options = {
//         type: 'line',
//         data: data,
//         options: {
//             legend: { display: false },
//             tooltips: { enabled: false },
//             fill: false,
//             responsive: true,
//             scales: scales
//         }
//     }

//     return options;
// }

// export getChartTemplate;
