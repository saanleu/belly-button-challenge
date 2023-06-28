//using D3 library to read samples.json from the URL
//get JSON data & console log it in
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
d3.json(url).then(function(data) {
    console.log(data);
});

//display plots and matadata objs. box
function init() {
    let dropdown = d3.select('#selDataset');
    //get JSON data 
    d3.json(url).then((data) => {
        //grab names
        let names = data.names;
        //go through the names in a for loop
        for (let i=0; i<names.length; i++) {
            //append names to dropdown
            dropdown.append('option').text(names[i]).property('value',names[i]);
            console.log(names[i]);
        };

        //saving first name 
        firstName = names[0];

        //initiating plots & metadata objs. box
        barchart(firstName);
        bubblechart(firstName);
        metadataobj(firstName);
    });
};


//creating a horizontal bar chart
function barchart(newSample) {
    //get JSON data and console log it
    d3.json(url).then((data) => {
        console.log(data);

        //grab samples
        let samples = data.samples;
        let filtered = samples.filter((sample) => sample.id == newSample);

        //saving first sample variable
        let firstSample = filtered[0];

        //create a trace for bar chart
        let trace = [{
            x: firstSample.sample_values.slice(0,10).reverse(),
            y: firstSample.otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: firstSample.otu_labels.slice(0,10).reverse(),
            type: 'bar',
            orientation: 'h'
        }];

        //plot data
        Plotly.newPlot('bar', trace);
    });
};


//creating a bubble chart
function bubblechart(newSample) {
    //get JSON data and console log it
    d3.json(url).then((data) => {
        console.log(data);

        //grab samples
        let samples = data.samples;
        let filtered = samples.filter((sample) => sample.id == newSample);

        //saving first sample variable
        let firstFiltered = filtered[0];

        //create a trace for bar chart
        let trace = [{
            x: firstFiltered.otu_ids,
            y: firstFiltered.sample_values,
            text: firstFiltered.otu_labels,
            mode: 'markers',
            marker: {
                color: firstFiltered.otu_ids,
                size: firstFiltered.sample_values,
                colorscale: 'Jet'
            }
        }];

        //set axis titles & plot data
        let layout = {
            xaxis: {title: 'OTU ID'}
        };
        Plotly.newPlot('bubble', trace, layout);
    });
};


//creating the metadata objs. box
function metadataobj(newSample) {
    //get JSON data and console log it
    d3.json(url).then((data) => {
        console.log(data);

        //grab metadata & filter through
        let metadata = data.metadata;
        let filrlts = metadata.filter(sampleObj => sampleObj.id == newSample);

        //saving first filtered result
        let firstResult = filrlts[0];

        // w/ d3 select panel id: '#sample-metadata' 
        let panel = d3.select('#sample-metadata');

        //clear metadata
        panel.html("");

        //for loop to append tags for each key-value in metadata
        for (keys in firstResult) {
            panel.append("h6").text(`${keys.toUpperCase()}: ${firstResult[keys]}`);
        };
    });
};


function optionChanged(newSample) {
    barchart(newSample);
    bubblechart(newSample);
    metadataobj(newSample);
};

//call function init()
init();