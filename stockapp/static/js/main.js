$(document).ready(function() {
	
    $('#stockForm').on('submit', function(event) {

        event.preventDefault();

        let ticker = $('#ticker').val();
        let startDate = $('#startDate').val();
        let endDate = $('#endDate').val();

        let url = $(this).data('fetch-url')

        let csrf_token = $('input[name=csrfmiddlewaretoken]').val()

        if (ticker && startDate && endDate) {

            // Show the spinner
            $('#loadingSpinner').show();

            // Perform AJAX request to the server to fetch stock data
            $.ajax({
                url: url,
                type: "POST",
                headers: {
                    "X-CSRFToken": csrf_token
                },
                data: {
                    ticker: ticker,
                    startDate: startDate,
                    endDate: endDate
                },
                success: function(response) {

                    data = response.data

                    // Hide the spinner
                    $('#loadingSpinner').hide();

                    // Populate the table with fetched data
                    tableBody = data.map(record => {
                        return `
							<tr>
									<td>${record.Date}</td>
									<td>${record.Open}</td>
									<td>${record.Close}</td>
									<td>${record.Volume}</td>
							</tr>
						`
                    }).join("")

                    $('tbody').html(tableBody);

                    // Display the result section
                    $('#resultSection').fadeIn();

                    // Generate the Plotly chart with responsive layout

                    dates = data.map(record => record.Date)
                    open = data.map(record => record.Open)
                    close = data.map(record => record.Close)

                    let traceOpen = {
                        x: dates,
                        y: open,
                        mode: 'scatter',
                        name: 'Open Price',
                        line: {
                            color: 'red'
                        }
                    };

                    let traceClose = {
                        x: dates,
                        y: close,
                        mode: 'scatter',
                        name: 'Close Price',
                        line: {
                            color: 'blue'
                        }
                    };

                    let layout = {
                        title: `${ticker.toUpperCase()} Stock Price from ${startDate} to ${endDate}`,
                        xaxis: {
                            title: 'Date'
                        },
                        yaxis: {
                            title: 'Price (USD)'
                        },
                        // legend: {
                        //     orientation: 'h',  // Set the legend orientation to horizontal
                        //     y: -0.2,  // Move the legend below the chart
                        //     x: 0.5,  // Center the legend horizontally
                        //     xanchor: 'center',  // Align the legend's horizontal center
                        //     yanchor: 'top'  // Align the top of the legend to the bottom of the chart
                        // }
                    };

                    let config = {
                        responsive: true
                    }; // Extra config for responsiveness
                    Plotly.newPlot('stockChart', [traceOpen, traceClose], layout, config);
                },
                error: function(err) {
                    $('#loadingSpinner').hide();
                    alert(JSON.stringify(err));
                }
            });
        } else {
            alert('Please fill in all fields.');
        }
    });
});