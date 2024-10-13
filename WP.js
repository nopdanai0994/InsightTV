const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function calculateMonthsDifference(startMonth, startYear, endMonth, endYear) {
    const startDate = new Date(startYear, startMonth - 1, 1);
    const endDate = new Date(endYear, endMonth - 1, 1);
    const delta = (endDate - startDate) / (1000 * 60 * 60 * 24 * 30); // Approximate month difference
    return Math.floor(delta);
}

function validateInputs(endMonth, endYear) {
    // Check if endMonth is between 1 and 12
    if (isNaN(endMonth) || endMonth < 1 || endMonth > 12) {
        alert("End month must be a number between 1 and 12.");
        return false;
    }

    // Check if endYear is a four-digit number
    if (isNaN(endYear) || endYear.toString().length !== 4) {
        alert("End year must be a four-digit number.");
        return false;
    }

    return true;
}

function wprecursiveForecast(endMonth, endYear, dataTelevision, coefficients, intercept) {
    const startMonth = 9;
    const startYear = 2024;

    if (endYear < 2024 || (endYear === 2024 && endMonth < 9)) {
        throw new Error("End month and year must be later than or equal to September 2024.");
    }

    const numMonths = calculateMonthsDifference(startMonth, startYear, endMonth, endYear);

    if (numMonths <= 0) {
        throw new Error("The end month and year must be later than September 2024.");
    }

    const predictions = [];
    const historicalViewers = dataTelevision.slice();
    const predictedAvgViewerValues = [];

    let currentMonth = 9;
    let currentYear = 2024;

    for (let i = 0; i < numMonths; i++) {
        if (currentMonth === 12) {
            currentMonth = 1;
            currentYear++;
        } else {
            currentMonth++;
        }

        const yearSquared = currentMonth === 1 ? (currentYear - 1) ** 2 : currentYear ** 2;

        function calculateLag(lag) {
            if (predictedAvgViewerValues.length >= lag) {
                return predictedAvgViewerValues[predictedAvgViewerValues.length - lag];
            } else {
                const lagMonth = (currentMonth - lag + 11) % 12 + 1;
                const lagYear = (currentMonth > lag) ? currentYear : currentYear - 1;

                const lagData = historicalViewers.find(item => item.year === lagYear && item.month === lagMonth);
                return lagData ? lagData.tele_avg_viewer : null;
            }
        }

        const teleAvgViewerLag1 = calculateLag(1);
        const teleAvgViewerLag3 = calculateLag(3);
        const teleAvgViewerLag6 = calculateLag(6);
        const teleAvgViewerLag9 = calculateLag(9);
        const teleAvgViewerLag12 = calculateLag(12);

        function calculateDiff(lag) {
            if (predictedAvgViewerValues.length > lag) {
                return predictedAvgViewerValues[predictedAvgViewerValues.length - 1] - predictedAvgViewerValues[predictedAvgViewerValues.length - (lag + 1)];
            } else {
                const lagMonth = (currentMonth - (lag + 1) + 11) % 12 + 1;
                const lagYear = (currentMonth > (lag + 1)) ? currentYear : currentYear - 1;

                const lastMonthData = historicalViewers.find(item => (currentMonth === 1 ?
                    (item.year === currentYear - 1 && item.month === 12) :
                    (item.year === currentYear && item.month === currentMonth - 1)));

                const lagMonthData = historicalViewers.find(item => item.year === lagYear && item.month === lagMonth);

                if (!lastMonthData || !lagMonthData) return null;

                return lastMonthData.tele_avg_viewer - lagMonthData.tele_avg_viewer;
            }
        }

        const teleAvgViewerDiff1 = calculateDiff(1);
        const teleAvgViewerDiff3 = calculateDiff(3);
        const teleAvgViewerDiff6 = calculateDiff(6);
        const teleAvgViewerDiff9 = calculateDiff(9);
        const teleAvgViewerDiff12 = calculateDiff(12);
        
        const yearTeleViewerInteraction1 = currentYear * teleAvgViewerLag1;
        const yearTeleViewerInteraction3 = currentYear * teleAvgViewerLag3;
        const yearTeleViewerInteraction12 = currentYear * teleAvgViewerLag12;

        const monthTeleViewerInteraction1 = currentMonth * teleAvgViewerLag1;
        const monthTeleViewerInteraction6 = currentMonth * teleAvgViewerLag6;
        const monthTeleViewerInteraction12 = currentMonth * teleAvgViewerLag12;

        const yearteleAvgViewerDiff1 = currentYear * teleAvgViewerDiff1;
        const yearteleAvgViewerDiff3 = currentYear * teleAvgViewerDiff3;

        let predictedTeleAvgViewer = (
            coefficients[0] * currentYear +
            coefficients[1] * currentMonth +
            coefficients[2] * yearSquared +
            coefficients[3] * monthTeleViewerInteraction1 +
            coefficients[4] * monthTeleViewerInteraction6 +
            coefficients[5] * monthTeleViewerInteraction12 +
            coefficients[6] * yearTeleViewerInteraction1 +
            coefficients[7] * yearTeleViewerInteraction3 +
            coefficients[8] * yearTeleViewerInteraction12 +
            coefficients[9] * yearteleAvgViewerDiff1 +
            coefficients[10] * yearteleAvgViewerDiff3 +
            coefficients[11] * teleAvgViewerLag1 +
            coefficients[12] * teleAvgViewerLag3 +
            coefficients[13] * teleAvgViewerLag6 +
            coefficients[14] * teleAvgViewerLag12 +
            intercept
        );

        if (predictedTeleAvgViewer <= 0) {
            predictedTeleAvgViewer = 0;
        }

        predictions.push({
            month: currentMonth,
            year: currentYear,
            predicted_tele_avg_viewer: predictedTeleAvgViewer
        });

        predictedAvgViewerValues.push(predictedTeleAvgViewer);
        historicalViewers.push({
            year: currentYear,
            month: currentMonth,
            tele_avg_viewer: predictedTeleAvgViewer
        });
    }

    return predictions
}

function wp() {
    const endMonth = parseInt(document.getElementById("endMonth").value);
    const endYear = parseInt(document.getElementById("endYear").value);

    if (!validateInputs(endMonth, endYear)) {
        return;
    }

    // Sample historical data
    const dataTelevision = [
        {year: 2022, month: 8, tele_avg_viewer: 461017},
        {year: 2022, month: 9, tele_avg_viewer: 430857},
        {year: 2022, month: 10, tele_avg_viewer: 507973},
        {year: 2022, month: 11, tele_avg_viewer: 379213},
        {year: 2022, month: 12, tele_avg_viewer: 381302},
        {year: 2023, month: 1, tele_avg_viewer: 350074},
        {year: 2023, month: 2, tele_avg_viewer: 356887},
        {year: 2023, month: 3, tele_avg_viewer: 341352},
        {year: 2023, month: 4, tele_avg_viewer: 307627},
        {year: 2023, month: 5, tele_avg_viewer: 281403},
        {year: 2023, month: 6, tele_avg_viewer: 292662},
        {year: 2023, month: 7, tele_avg_viewer: 298912},
        {year: 2023, month: 8, tele_avg_viewer: 312038},
        {year: 2023, month: 9, tele_avg_viewer: 425274},
        {year: 2023, month: 10, tele_avg_viewer: 286326},
        {year: 2023, month: 11, tele_avg_viewer: 292900},
        {year: 2023, month: 12, tele_avg_viewer: 297602},
        {year: 2024, month: 1, tele_avg_viewer: 262799},
        {year: 2024, month: 2, tele_avg_viewer: 254370},
        {year: 2024, month: 3, tele_avg_viewer: 255440},
        {year: 2024, month: 4, tele_avg_viewer: 221320},
        {year: 2024, month: 5, tele_avg_viewer: 228144},
        {year: 2024, month: 6, tele_avg_viewer: 229901},
        {year: 2024, month: 7, tele_avg_viewer: 240418},
        {year: 2024, month: 8, tele_avg_viewer: 240180},
        {year: 2024, month: 9, tele_avg_viewer: 249650}
    ];

    const coefficients = [
        -103440.64707354309,  // year
        -862.1889431364078,  // month
        -31.12653588809851,  // year_squared
        -0.03344862011268229,  // month_tele_viewer_interaction_1
        0.00436963792335459,  // month_tele_viewer_interaction_6
        -0.01490333264185575,  // month_tele_viewer_interaction_12
        -0.00018539406470471448,  // year_tele_viewer_interaction_1
        -0.00016960202202347796,  // year_tele_viewer_interaction_3
        0.0002085947453995902,  // year_tele_viewer_interaction_12
        0.0001532049571242779,  // year_tele_viewer_diff_1
        0.00042229970917340723,  // year_tele_viewer_diff_3
        -1.075958738535956,  // tele_avg_viewer_lag1
        0.25826408985793864,  // tele_avg_viewer_lag3
        0.0829431154755372,  // tele_avg_viewer_lag6
        -0.11790931742006555  // tele_avg_viewer_lag12
    ];

    const intercept = 337460186.1877339;

    try {
        const predictions = wprecursiveForecast(endMonth, endYear, dataTelevision, coefficients, intercept);
        
        // Prepare data for the chart
        const labels = predictions.map(prediction => `${prediction.month}/${prediction.year}`);
        const dataValues = predictions.map(prediction => prediction.predicted_tele_avg_viewer.toFixed(2));
        if (chart !== null) {
            chart.destroy(); // Destroy the existing chart instance
        }
        resetCanvas();
        const ctx = document.getElementById('televisionChart').getContext('2d');
        document.getElementById('televisionChart').style.backgroundColor = ''; 
        const endMonthName = monthNames[endMonth - 1];
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Predicted Average Viewers',
                    data: dataValues,
                    borderColor: 'rgba(255, 0, 0, 1)',
                    backgroundColor: 'rgba(181, 0, 0, 1)',
                    fill: false,
                    tension: 0.1,
                    pointRadius: 5,
                    borderWidth: 5, // Increase this value for thicker lines
                }]
            },
            options: {
                responsive: false, // Disable responsiveness to keep chart size fixed
                maintainAspectRatio: false, // Allows you to maintain the canvas dimensions
                plugins: {
                    legend: {
                        labels: {
                            color: 'rgba(255, 255, 255, 1)' // Change legend text color
                        }
                    },
                    title: {
                        display: true,
                        text: `Workpoint TV Predicted Viewers from October 2024 to ${endMonthName} ${endYear}`,
                        color: 'rgba(255, 255, 255, 1)', // Change title color
                        font: {
                            size: 22 // Title font size
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Average Viewers',
                            color: 'rgba(255, 255, 255, 255)', // Y-axis title color
                            font: {
                                size: 20 // Y-axis title font size
                            }
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 1)', // Y-axis ticks color
                        },
                        grid: {
                            color: 'rgba(200, 200, 200, 1)', // Change Y-axis grid line color
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date (Month/Year)',
                            color: 'rgba(255, 255, 255, 1)', // X-axis title color
                            font: {
                                size: 20 // X-axis title font size
                            }
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 1)', // X-axis ticks color
                        },
                        grid: {
                            color: 'rgba(200, 200, 200, 1)', // Change Y-axis grid line color
                        }
                    }
                }
            }
        });
        document.getElementById('chartTitle').innerText = `Average Viewer คือ จำนวนคนโดยเฉลี่ยที่ดูรายการหรือช่องใดช่องหนึ่งในช่วงเวลา 1 นาที\n\n `;
        } catch (error) {
        alert(error.message);
        }
        }