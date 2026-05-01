class UIUpdater {
    constructor() {
        this.sensorUpdateTimes = {
            temperature: 0,
            pressure: 0,
            co: 0
        };

    }

    recordSensorUpdate(sensorName) {
        this.sensorUpdateTimes[sensorName] = Date.now();
    }

    updateSensorValue(sensorName, value, unit) {
        const labelElement = document.getElementById(`${sensorName}Label`);
        if (labelElement) {
            labelElement.textContent = `${this.getSensorLabelText(sensorName)}: ${value} ${unit}`;
        }

        this.recordSensorUpdate(sensorName);
    }

    getSensorLabelText(sensorName) {
        const labels = {
            temperature: 'Temperature',
            pressure: 'Pressure',
            co: 'CO'
        };
        return labels[sensorName] || sensorName;
    }

    updateSensorStatus(sensorName, status, color) {
        const statusElement = document.getElementById(`${sensorName}Status`);
        if (statusElement) {
            statusElement.textContent = status;
            if (color) {
                statusElement.style.color = color;
                const statusDot = statusElement.closest('.update-info')?.querySelector('.status-dot-small');
                if (statusDot) {
                    statusDot.style.background = color;
                }
            }
        }

        const headerStatusElement = document.getElementById(`${sensorName}HeaderStatus`);
        if (headerStatusElement) {
            headerStatusElement.textContent = status;
            if (color) {
                const statusBadge = headerStatusElement.closest('.status-badge');
                headerStatusElement.style.color = color;
                if (statusBadge) {
                    statusBadge.style.color = color;
                    const statusDot = statusBadge.querySelector('.status-dot');
                    if (statusDot) {
                        statusDot.style.background = color;
                    }
                }
            }
        }
    }

    updatePressureTrend(trend) {
        const trendElement = document.getElementById('pressureTrend');
        if (trendElement) {
            trendElement.textContent = trend;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.uiUpdater = new UIUpdater();
});
