$(document).ready(function() {

    let stockChart = null;

    $('#stockForm').on('submit', function(event) {

        event.preventDefault();

        const ticker = $('#ticker').val();
        const startDate = $('#startDate').val();
        const endDate = $('#endDate').val();

        const url = $(this).data('fetch-url');

        const csrf_token = $('input[name=csrfmiddlewaretoken]').val();

        if (ticker && startDate && endDate) {

            // Show the spinner
            $('#loadingSpinner').show();


            // Hide result section and clear data table
            if ($('#resultSection').is(':visible')) {
                $('#resultSection').hide();
                $('tbody').html('');
            }

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

                    const data = response.data;

                    // Hide the spinner
                    $('#loadingSpinner').hide();

                    // Populate the table with fetched data
                    const tableBody = data.map(record => {
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

                    // Generate the Chart.js chart with responsive layout
                    const ctx = $('#stockChart').get(0).getContext('2d');
                    const dates = data.map(record => record.Date);
                    const open = data.map(record => record.Open);
                    const close = data.map(record => record.Close);

                    if (stockChart instanceof Chart) {
                        stockChart.destroy();
                    }

                    stockChart = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: dates,
                            datasets: [{
                                label: 'Open Price',
                                data: open,
                                borderColor: 'red',
                                fill: false,
                                tension: 0.1
                            }, {
                                label: 'Close Price',
                                data: close,
                                borderColor: 'blue',
                                fill: false,
                                tension: 0.1
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                title:{
                                    display: true,
                                    text: `${ticker.toUpperCase()} open & close prices from ${startDate} to ${endDate}`
                                },
                                legend: {
                                    position: 'bottom' // Move legend to bottom
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Date'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Price (USD)'
                                    }
                                }
                            }
                        }
                    });
                },
                error: function(err) {
                    $('#loadingSpinner').hide();
                    alert(err.responseJSON.error);
                }
            });
        } else {
            alert('Please fill in all fields.');
        }
    });

    $('.chart-container').on('resize', () => {
        stockChart.canvas.parentNode.style.height = '100%'
    });

});