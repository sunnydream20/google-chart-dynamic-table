// Load Google Charts
google.charts.load("current", { packages: ["orgchart"] });

// AG Grid Configuration
const gridOptions = {
  columnDefs: [
    { headerName: "Name", field: "Name", editable: true },
    { headerName: "Manager", field: "Manager", editable: true },
    { headerName: "Position", field: "Position", editable: true },
    { headerName: "Url", field: "Url", editable: true },
  ],
  rowData: [
    { Name: "Shelby Johnson", Manager: "", Position: "CEO", Url: "" },
    { Name: "Jim Torres", Manager: "Shelby Johnson", Position: "VP", Url: "" },
    { Name: "Alice Brown", Manager: "Shelby Johnson", Position: "Director", Url: "" },
    { Name: "Bob Smith", Manager: "Jim Torres", Position: "Manager", Url: "" },
    { Name: "Carol White", Manager: "Jim Torres", Position: "Manager", Url: "" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  },
  rowSelection: "single",
};

const defaultImageUrl = "https://static.vecteezy.com/ti/gratis-vektor/p1/26619142-standard-avatar-profil-ikon-vektor-av-social-media-anvandare-foto-bild-vector.jpg";

// Initialize AG Grid
document.addEventListener("DOMContentLoaded", () => {
  new agGrid.Grid(document.getElementById("grid-container"), gridOptions);
});

// Load CSV Data
document.getElementById("loadCsvButton").addEventListener("click", () => {
  const file = document.getElementById("csvFileInput").files[0];
  if (file) {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log(results);
        gridOptions.api.applyTransaction({ add: results.data });
      },
      error: (error) => console.error("CSV Parsing Error:", error),
    });
  } else {
    alert("Please select a CSV file.");
  }
});

// Functions for Adding, Deleting, and Clearing Rows
document.getElementById("addRowButton").addEventListener("click", () => {
  gridOptions.api.applyTransaction({
    add: [{ Name: "", Manager: "", Position: "" }],
  });
});

document.getElementById("deleteRowButton").addEventListener("click", () => {
  const selectedRows = gridOptions.api.getSelectedNodes();
  if (selectedRows.length > 0) {
    gridOptions.api.applyTransaction({
      remove: selectedRows.map((node) => node.data),
    });
  }
});

document.getElementById("clearTableButton").addEventListener("click", () => {
  const rowData = [];
  gridOptions.api.forEachNode((node) => rowData.push(node.data));
  gridOptions.api.applyTransaction({ remove: rowData });
});

// Generate Org Chart Button Event
generateButton.addEventListener("click", function () {
  var rowData = [];
  gridOptions.api.forEachNode((node) => rowData.push(node.data));

  if (rowData.length === 0) {
    alert("The table is empty. Please add some data to generate the org chart.");
    return;
  }

  const chartData = rowData.map((row) => [
    {
      v: row.Name,
      f: `<div style="border: 1px solid #10b981; border-radius: 4px; padding: 10px; text-align: center;">
             <div style="background-color: #10b981; color: white; padding: 5px; border-radius: 8px 8px 0 0; display: flex; flex-direction: column; align-items: center; ">
             ${row.Url && row.Url.length > 0 ? 
              `<img src="${row.Url}" style="width: 50px; height: 50px; border-radius: 50%;">` : 
              `<img src="${defaultImageUrl}" style="width: 50px; height: 50px; border-radius: 50%;">`}
             <p style="font-size: 16px;">${row.Name}</p>
             </div>
             <div style="padding: 10px; font-size: 14px; color: #10b981; ">${row.Position}</div>
           </div>`,
    },
    row.Manager || "",
    `Position: ${row.Position}`, // Tooltip content for hover
  ]);

  drawChart(chartData);
});

// Making Org Chart

const makingOrg = (color) => {
  var rowData = [];
  gridOptions.api.forEachNode((node) => rowData.push(node.data));

  if (rowData.length === 0) {
    alert("The table is empty. Please add some data to generate the org chart.");
    return;
  }

  const chartData = rowData.map((row) => [
    {
      v: row.Name,
      f: `<div style="border: 1px solid ${color}; border-radius: 4px; padding: 10px; text-align: center;">
             <div style="background-color: ${color}; color: white; padding: 5px; border-radius: 8px 8px 0 0; display: flex; flex-direction: column; align-items: center; ">
             ${row.Url && row.Url.length > 0 ? 
              `<img src="${row.Url}" style="width: 50px; height: 50px; border-radius: 50%;">` : 
              `<img src="${defaultImageUrl}" style="width: 50px; height: 50px; border-radius: 50%;">`}
             <p style="font-size: 16px;">${row.Name}</p>
             </div>
             <div style="padding: 10px; font-size: 14px; color: ${color}; ">${row.Position}</div>
           </div>`,
    },
    row.Manager || "",
    `Position: ${row.Position}`, // Tooltip content for hover
  ]);

  drawChart(chartData);
}


// generate org chart button as Red
generateButtonRed.addEventListener("click", (color="#10b981") => {
  makingOrg("red");
})

// generate org chart button as Blue
generateButtonBlue.addEventListener("click", () => {
  makingOrg('#3b82f6');
})

// generate org chart button as Green
generateButtonGreen.addEventListener("click", () => {
  makingOrg('#10b981');
})

// Function to draw the Org Chart
function drawChart(chartData) {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "Name");
  data.addColumn("string", "Manager");
  data.addColumn("string", "ToolTip");
  data.addRows(chartData);

  var chartDiv = document.getElementById("svg-tree");
  var chart = new google.visualization.OrgChart(chartDiv);
  chart.draw(data, {
    allowHtml: true, // Allow custom HTML content
    size: "large",
    allowCollapse: true, // Enable node collapsing
  });

   // Use setTimeout to allow rendering to complete before adjusting the height
   setTimeout(() => {
        adjustContainerHeight(chartDiv);
    }, 100);
}

// draw svg-tree container for dynamic height
function adjustContainerHeight(chartDiv) {
  // Get the bounding rect of the SVG element
  const svgElement = chartDiv.querySelector("svg");
  
  if (svgElement) {
      const boundingBox = svgElement.getBoundingClientRect();
      chartDiv.style.height = boundingBox.height + "px"; // Set the height of the container
  } else {
      console.warn("No SVG element found in the chartDiv.");
  }
}

// Title Management
document.getElementById("addTitleButton").addEventListener("click", () => {
  const title = document.getElementById("titleInput").value.trim();
  let titleContainer = document.getElementById("chart-title");

  if (titleContainer) {
    titleContainer.remove();
  }

  if (title) {
    titleContainer = document.createElement("div");
    titleContainer.id = "chart-title";
    titleContainer.style.fontWeight = "bold";
    titleContainer.style.fontSize = "1.5em";
    titleContainer.style.marginBottom = "10px";
    titleContainer.style.textAlign = "center";
    titleContainer.textContent = title;

    document
      .getElementById("svg-tree")
      .insertAdjacentElement("beforebegin", titleContainer);
  }
});

document.getElementById("clearTitleButton").addEventListener("click", () => {
  document.getElementById("titleInput").value = "";
  const titleContainer = document.getElementById("chart-title");
  if (titleContainer) {
    titleContainer.remove();
  }
});

// export to PDF file
document.getElementById("exportButton").addEventListener("click", () => {
   // Select the element to convert to PDF
   const element = document.getElementById('parent-whole');

   // Options for the PDF
   const options = {
       margin:       1,
       filename:     'document.pdf',
       image:        { type: 'jpeg', quality: 0.98 },
       html2canvas:  { scale: 2 },
       jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
   };

   // Generate the PDF
   html2pdf().from(element).set(options).save();
})

// export to png file
document.getElementById('exportPngButton').addEventListener('click', function () {
  const node = document.getElementById('parent-whole');
  
  domtoimage.toPng(node)
      .then(function (dataUrl) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'exported-image.png';
          link.click();
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
});

// export to svg file
document.getElementById('exportSvgButton').addEventListener('click', function () {
  const node = document.getElementById('parent-whole');

  domtoimage.toSvg(node)
      .then(function (dataUrl) {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = 'exported-image.svg';
          link.click();
      })
      .catch(function (error) {
          console.error('oops, something went wrong!', error);
      });
});