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

function monorecursiveForecast(endMonth, endYear, dataTelevision, coefficients, intercept) {
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

        const yearTeleViewerInteraction3 = currentYear * teleAvgViewerLag3;
        const yearTeleViewerInteraction6 = currentYear * teleAvgViewerLag6;

        let predictedTeleAvgViewer = (
            coefficients[0] * currentYear +
            coefficients[1] * currentMonth +
            coefficients[2] * yearTeleViewerInteraction3 +
            coefficients[3] * yearTeleViewerInteraction6 +
            coefficients[4] * yearSquared +
            coefficients[5] * (teleAvgViewerLag6 ** 2) +
            coefficients[6] * teleAvgViewerDiff1 +
            coefficients[7] * teleAvgViewerDiff6 +
            coefficients[8] * teleAvgViewerLag1 +
            coefficients[9] * teleAvgViewerLag3 +
            coefficients[10] * teleAvgViewerLag6 +
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

function mono() {
    const endMonth = parseInt(document.getElementById("endMonth").value);
    const endYear = parseInt(document.getElementById("endYear").value);

    if (!validateInputs(endMonth, endYear)) {
        return;
    }

    // Sample historical data
    const dataTelevision = [
        { year: 2022, month: 8, tele_avg_viewer: 415354 },
        { year: 2022, month: 9, tele_avg_viewer: 388181 },
        { year: 2022, month: 10, tele_avg_viewer: 411208 },
        { year: 2022, month: 11, tele_avg_viewer: 389090 },
        { year: 2022, month: 12, tele_avg_viewer: 373358 },
        { year: 2023, month: 1, tele_avg_viewer: 372425 },
        { year: 2023, month: 2, tele_avg_viewer: 345796 },
        { year: 2023, month: 3, tele_avg_viewer: 366241 },
        { year: 2023, month: 4, tele_avg_viewer: 357634 },
        { year: 2023, month: 5, tele_avg_viewer: 343666 },
        { year: 2023, month: 6, tele_avg_viewer: 365999 },
        { year: 2023, month: 7, tele_avg_viewer: 379143 },
        { year: 2023, month: 8, tele_avg_viewer: 397894 },
        { year: 2023, month: 9, tele_avg_viewer: 388057 },
        { year: 2023, month: 10, tele_avg_viewer: 386485 },
        { year: 2023, month: 11, tele_avg_viewer: 359001 },
        { year: 2023, month: 12, tele_avg_viewer: 369809 },
        { year: 2024, month: 1, tele_avg_viewer: 335384 },
        { year: 2024, month: 2, tele_avg_viewer: 324164 },
        { year: 2024, month: 3, tele_avg_viewer: 324244 },
        { year: 2024, month: 4, tele_avg_viewer: 308415 },
        { year: 2024, month: 5, tele_avg_viewer: 292983 },
        { year: 2024, month: 6, tele_avg_viewer: 276815 },
        { year: 2024, month: 7, tele_avg_viewer: 279195 },
        { year: 2024, month: 8, tele_avg_viewer: 280740 },
        { year: 2024, month: 9, tele_avg_viewer: 270865 }
    ];

    const coefficients = [
        -176662.11378887878,  // year
        -12275.303639230498,  // month
        -0.0002249121841322651,  // year_tele_viewer_interaction_3
        0.00011002407572957271,  // year_tele_viewer_interaction_6
        -2.894919015383843,  // year_squared
        -2.658732741826373e-08,  // tele_avg_viewer_squared6
        0.25362493813942233,  // tele_avg_viewer_diff1
        0.13490738583371012,  // tele_avg_viewer_diff6
        -0.5932639950388267,  // tele_avg_viewer_lag1
        0.2786939570707007,  // tele_avg_viewer_lag3
        0.1875935559922793   // tele_avg_viewer_lag6
    ];

    const intercept = 369892129.9832216;

    try {
const predictions = monorecursiveForecast(endMonth, endYear, dataTelevision, coefficients, intercept);

// Prepare data for the chart
const labels = predictions.map(prediction => `${prediction.month}/${prediction.year}`);
const dataValues = predictions.map(prediction => prediction.predicted_tele_avg_viewer.toFixed(2));
if (chart !== null) {
    chart.destroy(); // Destroy the existing chart instance
}
resetCanvas();
const endMonthName = monthNames[endMonth - 1];
const ctx = document.getElementById('televisionChart').getContext('2d');
document.getElementById('televisionChart').style.backgroundColor = ''; 
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
                text: `MONO29 Predicted Viewers from October 2024 to ${endMonthName} ${endYear} `,
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