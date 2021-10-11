console.log(data);

// Create a custom function to return Roman gods with more than 1 million search results


// Call the custom function with filter()


// Trace for the Roman Data


// Data trace array


// Apply title to the layout


// Render the plot to the div tag with id "plot"

$(document).ready(function() {
    // let romanFilter = data.filter(item => item.romanSearchResults > 15000000);

    let month = data.map(item => item.month);
    let count = data.map(item => item.count);

    let trace1 = {
        "x": month,
        "y": count,
        "type": "bar",
        "marker": {
            "color": "red"
        }
    };

    let traces = [trace1];

    let layout = {
        "title": {
          text: "2020 Homicides",
          font: {
            color: "white"
          }
        },
        "xaxis": {
            "title": {
              text: "Month",
              font: {
                color: "white"
              }
            },
            tickfont: {
              color: "white"
            },
            tickcolor: 'white'
        },
        "yaxis": {
            "title": {
              text: "Number of Homicides",
              font: {
                color: "white"
              }
            },
            tickfont: {
              color: "white"
            },
            tickcolor: 'white'
        },
        plot_bgcolor: "black",
        paper_bgcolor:"black",
        updatemenus: [{
            type: 'buttons',
            buttons: [{
              label: 'no filter',
              method: 'restyle',
              args: ['transforms[0]', [{
                type: 'filter',
                enabled: false,
              }]]
            }, {  
              label: '> 5',
              method: 'restyle',
              args: ['transforms[0]', [{
                type: 'filter',
                enabled: true,
                target: 'y',
                operation: '>',
                value: '5'
              }]]
            }, {  
                label: '> 10',
                method: 'restyle',
                args: ['transforms[0]', [{
                  type: 'filter',
                  enabled: true,
                  target: 'y',
                  operation: '>',
                  value: '10'
                }]]
              }]
          }]
        
    };

    Plotly.newPlot("plot", traces, layout)
});