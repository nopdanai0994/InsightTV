
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

function ch7recursiveForecast(endMonth, endYear, dataTelevision, coefficients, intercept) {
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

        let predictedTeleAvgViewer = (
            coefficients[0] * currentYear +
            coefficients[1] * currentMonth +
            coefficients[2] * yearTeleViewerInteraction3 +
            coefficients[3] * yearSquared +
            coefficients[4] * (teleAvgViewerLag6 ** 2) +
            coefficients[5] * teleAvgViewerDiff1 +
            coefficients[6] * teleAvgViewerDiff3 +
            coefficients[7] * teleAvgViewerDiff6 +
            coefficients[8] * teleAvgViewerDiff9 +
            coefficients[9] * teleAvgViewerDiff12 +
            coefficients[10] * teleAvgViewerLag1 +
            coefficients[11] * teleAvgViewerLag3 +
            coefficients[12] * teleAvgViewerLag6 +
            coefficients[13] * teleAvgViewerLag9 +
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

    return predictions;
}
function ch7() {
    const endMonth = parseInt(document.getElementById("endMonth").value);
    const endYear = parseInt(document.getElementById("endYear").value);

    if (!validateInputs(endMonth, endYear)) {
        return;
    }

    // Sample historical data
    const dataTelevision = [
        { year: 2022, month: 8, tele_avg_viewer: 936928 },
        { year: 2022, month: 9, tele_avg_viewer: 875634 },
        { year: 2022, month: 10, tele_avg_viewer: 898788 },
        { year: 2022, month: 11, tele_avg_viewer: 832564 },
        { year: 2022, month: 12, tele_avg_viewer: 729506 },
        { year: 2023, month: 1, tele_avg_viewer: 718196 },
        { year: 2023, month: 2, tele_avg_viewer: 766381 },
        { year: 2023, month: 3, tele_avg_viewer: 734074 },
        { year: 2023, month: 4, tele_avg_viewer: 643390 },
        { year: 2023, month: 5, tele_avg_viewer: 690915 },
        { year: 2023, month: 6, tele_avg_viewer: 767238 },
        { year: 2023, month: 7, tele_avg_viewer: 693829 },
        { year: 2023, month: 8, tele_avg_viewer: 669893 },
        { year: 2023, month: 9, tele_avg_viewer: 647460 },
        { year: 2023, month: 10, tele_avg_viewer: 570713 },
        { year: 2023, month: 11, tele_avg_viewer: 571764 },
        { year: 2023, month: 12, tele_avg_viewer: 599922 },
        { year: 2024, month: 1, tele_avg_viewer: 555886 },
        { year: 2024, month: 2, tele_avg_viewer: 544229 },
        { year: 2024, month: 3, tele_avg_viewer: 499633 },
        { year: 2024, month: 4, tele_avg_viewer: 479188 },
        { year: 2024, month: 5, tele_avg_viewer: 478290 },
        { year: 2024, month: 6, tele_avg_viewer: 522271 },
        { year: 2024, month: 7, tele_avg_viewer: 492894 },
        { year: 2024, month: 8, tele_avg_viewer: 475737 },
        { year: 2024, month: 9, tele_avg_viewer: 496408 }
    ];

    const coefficients = [
        -93083.23461862991,  
        -1443.8766240191144, 
        9.595940608351048e-06, 
        -5.491007014336134,   
        1.068726329313827e-07, 
        -0.2319658028412267,  
        0.3152771987167505,  
        -0.3061062308512859, 
        0.08133178115317576, 
        0.1199863678713433,   
        -0.1812831516154592, 
        0.06280042528775996,  
        0.08602940717607438, 
        -0.19308358823285077, 
        0.013860573600432934 
    ];

    const intercept = 211491668.39237016;

    try {
        const predictions = ch7recursiveForecast(endMonth, endYear, dataTelevision, coefficients, intercept);

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
                text: `CH7 Predicted Viewers from October 2024 to ${endMonthName} ${endYear}`, // Correctly using template literals
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