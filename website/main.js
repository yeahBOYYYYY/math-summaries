var colState = Array(5).fill(0); // 0 = unsorted, 1 = ascending, 2 = descending


function sortTable(col) {
	if (colState[col] == 0){
		sortUnsortedTable(col);
		colState[col] = 1;
	}
}

function sortUnsortedTable(col) {
	// Get the table element
	var table = document.getElementById("myTable");

	// Get the rows of the table
	var rows = Array.from(table.rows);

	// Sort the rows based on the column values
	rows.sort(function(a, b) {
		var aValue = a.cells[col].textContent;
		var bValue = b.cells[col].textContent;
		return aValue.localeCompare(bValue);
	});

	// Remove existing rows from the table
	while (table.rows.length > 0) {
		table.deleteRow(0);
	}

	// Add sorted rows back to the table
	rows.forEach(function(row) {
		table.appendChild(row);
	});
}