function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
      console.log(data);
      // 3. Create a variable that holds the samples array. 
      let samples = data.samples;
      
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      let filteredSamples = samples.filter(obj => obj.id == sample);

      // 3.1. Create a variable that filters the metadata array for the object with the desired sample number.
    
      //  5. Create a variable that holds the first sample in the array.
      let theSample = filteredSamples[0];
      
      console.log(theSample);

      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      let otuIds = theSample.otu_ids.slice(0,10).reverse();
      let otuLabels = theSample.otu_labels.slice(0,10).reverse();
      let sampleValues = theSample.sample_values.slice(0,10).reverse();
     
      /////////// BAR CHART ///////////////

      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
      
      let yticks = otuIds.map(id => 'OTU ' + id);
      // 8. Create the trace for the bar chart. 
      var barData = [{
          x: sampleValues,
          y: yticks,
          type: 'bar',
          orientation: 'h',
          text: otuLabels           
      }];

  // //   9. Create the layout for the bar chart. 
      var barLayout = {
          title: "Top 10 Bacteria Cultures Identified",
          margin: {
            l: 125,
            r: 125,
            b: 150,
            t: 25
          }
      };
    // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", barData, barLayout);

      /////////// BUBBLE CHART ///////////////
      let rawIds = theSample.otu_ids;
      let rawLabels = theSample.otu_labels;
      let rawValues = theSample.sample_values;

      // 1. Create the trace for the bubble chart.
      let markerSize = rawValues.map(value => value / 1.05);
    var bubbleData = [{
      x: rawIds,
      y: rawValues,
      mode: 'markers',
      marker: { 
        size: markerSize,
        color: rawIds,
        colorscale: 'Earth'
       },
      text: rawLabels
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID'},
      margin: {
        l: 90,
        r: 25,
        t: 30,
        b: 100
      },
      hovermode: 'closest'
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 
  });
}
