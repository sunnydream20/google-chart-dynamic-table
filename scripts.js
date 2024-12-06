// Load Google Charts
google.charts.load("current", { packages: ["orgchart"] });

var currentRowData = [{ Name: "Shelby Johnson", Manager: "", Position: "CEO" },
  { Name: "Jim Torres", Manager: "Shelby Johnson", Position: "VP" },
  { Name: "Alice Brown", Manager: "Shelby Johnson", Position: "Director" },
  { Name: "Bob Smith", Manager: "Jim Torres", Position: "Manager" },
  { Name: "Carol White", Manager: "Jim Torres", Position: "Manager" }];

// AG Grid Configuration
const gridOptions = {
  columnDefs: [
    { headerName: "Name", field: "Name", editable: true },
    { headerName: "Manager", field: "Manager", editable: true },
    { headerName: "Position", field: "Position", editable: true },
  ],
  rowData: [
    { Name: "Shelby Johnson", Manager: "", Position: "CEO" },
    { Name: "Jim Torres", Manager: "Shelby Johnson", Position: "VP" },
    { Name: "Alice Brown", Manager: "Shelby Johnson", Position: "Director" },
    { Name: "Bob Smith", Manager: "Jim Torres", Position: "Manager" },
    { Name: "Carol White", Manager: "Jim Torres", Position: "Manager" },
  ],
  defaultColDef: {
    flex: 1,
    minWidth: 100,
    resizable: true,
    sortable: true,
    filter: true,
  },
  onCellValueChanged: function(event) {
    document.getElementById('sampleData').style.display = 'none';
    getAllCurrentRowData();
  },
  rowSelection: {type: "single"},
};

const refreshGrid = () => {
  gridOptions.rowData = currentRowData;
}

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
  const newRow = { Name: "", Manager: "", Position: "", Phone: "", Email: "" };
  gridOptions.api.applyTransaction({
    add: [{ Name: "", Manager: "", Position: "", Phone: "", Email: "" }],
  });
  refreshGrid();
});

document.getElementById("deleteRowButton").addEventListener("click", () => {
  const selectedRows = gridOptions.api.getSelectedNodes();
  selectedRows.forEach(node => {
    const idx = currentRowData.findIndex(item => item === node.data);
    if (idx !== -1) {
      currentRowData.splice(idx, 1);
    }
  })
  if (selectedRows.length > 0) {
    gridOptions.api.applyTransaction({
      remove: selectedRows.map((node) => node.data),
    });
  }
  refreshGrid();
});

document.getElementById("clearTableButton").addEventListener("click", () => {
  const rowData = [];
  gridOptions.api.forEachNode((node) => rowData.push(node.data));
  gridOptions.api.applyTransaction({ remove: rowData });
});

// Functions for Adding, Deleting Columns
// Function to toggle Email column
document.getElementById("toggleEmailColumn").addEventListener("change", (event) => {
  if (event.target.checked) {
    
    // If checked, add Email column
    const emailColumn = { headerName: "Email", field: "Email", editable: true };
    gridOptions.columnDefs.push(emailColumn);
  } else {
    // If unchecked, remove Email column
    
    // refreshGrid();
    gridOptions.columnDefs = gridOptions.columnDefs.filter(col => col.field !== "Email");
  }
  refreshGrid();

  // refreshGrid();
  // Update the grid with the new column definitions
  document.getElementById("grid-container").innerHTML = "";
  new agGrid.Grid(document.getElementById("grid-container"), gridOptions);
});

// Function to toggle Phone column
document.getElementById("togglePhoneColumn").addEventListener("change", (event) => {
  if (event.target.checked) {
    // If checked, add Email column
    const phoneColumn = { headerName: "Phone", field: "Phone", editable: true };
    gridOptions.columnDefs.push(phoneColumn);
  } else {
    // If unchecked, remove Email column
    gridOptions.columnDefs = gridOptions.columnDefs.filter(col => col.field !== "Phone");
  }
  refreshGrid();

  // Update the grid with the new column definitions
  document.getElementById("grid-container").innerHTML = "";
  new agGrid.Grid(document.getElementById("grid-container"), gridOptions);
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
      f: `<div style="min-width: 120px; padding: 5px; text-align: center;">
             <div style="background-color: #6b7280; color: white; padding: 5px; border-radius: 8px 8px 0 0; display: flex; flex-direction: column; align-items: center; ">
             <p style="font-size: 16px;">${row.Name}</p>
             </div>
             <div style="font-size: 12px; color: #6b7280; ">${row.Position}</div>
             ${row.Email && row.Email.length > 0 ? 
              `<div style="font-size: 12px; color: #6b7280; ">${row.Email}</div>` : 
              ``}
            ${row.Phone && row.Phone.length > 0 ? 
              `<div style="font-size: 12px; color: #6b7280; ">${row.Phone}</div>` : 
              ``}
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
      f: `<div style="min-width: 120px; padding: 5px; text-align: center;">
             <div style="background-color: ${color}; color: white; padding: 5px; border-radius: 8px 8px 0 0; display: flex; flex-direction: column; align-items: center; ">
           
             <p style="font-size: 16px;">${row.Name}</p>
             </div>
             <div style="font-size: 12px; color: ${color}; ">${row.Position}</div>
             ${row.Email && row.Email.length > 0 ? 
              `<div style="font-size: 12px; color: ${color}; ">${row.Email}</div>` : 
              ``}
            ${row.Phone && row.Phone.length > 0 ? 
              `<div style="font-size: 12px; color: ${color}; ">${row.Phone}</div>` : 
              ``}
           </div>`,
    },
    row.Manager || "",
    `Position: ${row.Position}`, // Tooltip content for hover
  ]);

  drawChart(chartData);
}

// generate org chart button as Blue
generateButtonBrown.addEventListener("click", () => {
  makingOrg('#3b82f6');
})

// generate org chart button as Red
generateButtonRed.addEventListener("click", () => {
  makingOrg('#ef4444');
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


  // zoom

  let scale = 1;
  charttable = document.getElementsByClassName("google-visualization-orgchart-table")[0];
  charttable.addEventListener('wheel', function(event) {
      event.preventDefault();
      if (event.deltaY < 0) {
          scale *= 1.1; // Zoom in
      } else {
          scale /= 1.1; // Zoom out
      }
      charttable.style.transform = `scale(${scale})`; // Apply scale
  });
// drag and drop

   // Drag-and-drop functionality
   charttable.addEventListener('mousedown', initiateDrag);
   charttable.addEventListener('touchstart', initiateDrag);

   function initiateDrag(event) {
       const target = event.target.closest('table'); // Get the closest row (node)
       if (target) {
           currentNode = target;
           const rect = target.getBoundingClientRect();
           if (event.type === 'mousedown') {
               offsetX = event.clientX - rect.left;
               offsetY = event.clientY - rect.top;
           } else {
               offsetX = event.touches[0].clientX - rect.left;
               offsetY = event.touches[0].clientY - rect.top;
           }
           target.style.cursor = 'grabbing'; // Change cursor to grabbing
           event.preventDefault();
           document.addEventListener('mousemove', onMouseMove);
           document.addEventListener('mouseup', onMouseUp);
           document.addEventListener('touchmove', onTouchMove);
           document.addEventListener('touchend', onMouseUp);
       }
   }

   function onMouseMove(event) {
       if (currentNode) {
           currentNode.style.position = 'absolute';
           currentNode.style.left = event.clientX - offsetX + 'px';
           currentNode.style.top = event.clientY - offsetY + 'px';
       }
   }

   function onTouchMove(event) {
       if (currentNode) {
           currentNode.style.position = 'absolute';
           currentNode.style.left = event.touches[0].clientX - offsetX + 'px';
           currentNode.style.top = event.touches[0].clientY - offsetY + 'px';
       }
   }

   function onMouseUp() {
       if (currentNode) {
           currentNode.style.cursor = 'grab'; // Reset cursor
           currentNode = null; // Clear current node
           document.removeEventListener('mousemove', onMouseMove);
           document.removeEventListener('mouseup', onMouseUp);
           document.removeEventListener('touchmove', onTouchMove);
           document.removeEventListener('touchend', onMouseUp);
       }
   }

function onTouchMove(event) {
  if (currentNode) {
      currentNode.style.position = 'absolute';
      currentNode.style.left = event.touches[0].clientX - offsetX + 'px';
      currentNode.style.top = event.touches[0].clientY - offsetY + 'px';
  }
}
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

// Clear title part
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

// get whole data of table.
function getAllCurrentRowData() {
  currentRowData = [];
  gridOptions.api.forEachNode(node => {
      currentRowData.push(node.data);
  });
}

// Hello.

function onFileChange(event, nodeId) {
  const file = event.target.files[0]; // Get the uploaded file
  if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
          const newImageUrl = e.target.result; // Get the file as a data URL
          // Find the corresponding row data by node ID and update the Url field
          const rowNode = gridOptions.api.getRowNode(nodeId);
          if (rowNode) {
              rowNode.setDataValue('Url', newImageUrl); // Update the Url in row data
          }
      };
      reader.readAsDataURL(file); // Read the file and convert it to a data URL
  }
}


let mobileAlarm = document.getElementById("mobileShow");