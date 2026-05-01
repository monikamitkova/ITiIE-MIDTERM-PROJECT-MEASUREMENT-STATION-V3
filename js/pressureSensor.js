

class PressureSensorGauge {
    constructor(canvasId, minPressure = 0, maxPressure = 200) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.minPressure = minPressure;
        this.maxPressure = maxPressure;
        this.currentPressure = 55; 
        this.targetPressure = 55;
        this.previousPressure = 55;
        this.animationId = null;
        this.isDarkMode = true;
        this.pressureHistory = [55];
        this.pressureScenarios = [55, 80, 105, 145];
        this.pressureScenarioIndex = 0;
        this.trendDirection = 'Steady';
        this.lastTrendUpdate = 0; 
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate();

        this.startPressureSimulation();
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        
        this.canvas.width = Math.min(350 * dpr, this.canvas.offsetWidth * dpr);
        this.canvas.height = Math.min(350 * dpr, this.canvas.offsetHeight * dpr);
        
        this.ctx.scale(dpr, dpr);
        this.centerX = (this.canvas.width / dpr) / 2;
        this.centerY = (this.canvas.height / dpr) / 2;
        this.radius = Math.min(this.centerX, this.centerY) * 0.85;
    }

    startPressureSimulation() {
        setInterval(() => {
            this.pressureScenarioIndex = (this.pressureScenarioIndex + 1) % this.pressureScenarios.length;
            const scenarioPressure = this.pressureScenarios[this.pressureScenarioIndex];
            const randomNoise = (Math.random() - 0.5) * 4;
            
            this.targetPressure = Math.max(
                this.minPressure,
                Math.min(this.maxPressure, scenarioPressure + randomNoise)
            );
        }, 3000);
    }

    setPressure(value) {
        this.targetPressure = Math.max(
            this.minPressure,
            Math.min(this.maxPressure, value)
        );
    }

    getPressure() {
        return this.currentPressure;
    }

    getPressureStatus() {
        if (this.currentPressure < 70) {
            return { text: 'Low', color: '#e74c3c' };
        } else if (this.currentPressure < 90) {
            return { text: 'Moderate', color: '#f39c12' };
        } else if (this.currentPressure < 130) {
            return { text: 'Stable', color: '#28a745' };
        } else {
            return { text: 'High', color: '#e74c3c' };
        }
    }

    updateTrend() {
        this.pressureHistory.push(this.currentPressure);
        if (this.pressureHistory.length > 20) {
            this.pressureHistory.shift();
        }

        if (this.pressureHistory.length >= 5) {
            const recent = this.pressureHistory.slice(-5);
            const avg1 = recent.slice(0, 3).reduce((a, b) => a + b) / 3;
            const avg2 = recent.slice(2, 5).reduce((a, b) => a + b) / 3;
            const diff = avg2 - avg1;

            if (diff > 0.5) {
                this.trendDirection = 'Rising';
            } else if (diff < -0.5) {
                this.trendDirection = 'Falling';
            } else {
                this.trendDirection = 'Steady';
            }
        }
    }

    animate() {
        const diff = this.targetPressure - this.currentPressure;
        this.previousPressure = this.currentPressure;
        this.currentPressure += diff * 0.04; 
        
        this.draw();
        
        if (Math.random() > 0.8) {
            this.updateTrend();
        }
        
        if (window.uiUpdater) {
            const status = this.getPressureStatus();
            window.uiUpdater.updateSensorValue('pressure', this.currentPressure.toFixed(2), 'kPa');
            window.uiUpdater.updateSensorStatus('pressure', status.text, status.color);
            window.uiUpdater.updatePressureTrend(this.trendDirection);
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    draw() {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), 
                         this.canvas.height / (window.devicePixelRatio || 1));

        this.drawGaugeBackground();
        
        this.drawNeedle();
        
        this.drawPressureValue();
        
        this.drawScale();
    }

    drawGaugeBackground() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#28a745';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        const gradient = this.ctx.createRadialGradient(
            this.centerX, this.centerY - this.radius * 0.3, 0,
            this.centerX, this.centerY, this.radius
        );
        gradient.addColorStop(0, '#1a2244');
        gradient.addColorStop(1, '#0f1428');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * 0.1, 0, Math.PI * 2);
        this.ctx.fillStyle = '#28a745';
        this.ctx.fill();
    }

    drawScale() {
        const startAngle = Math.PI + 0.2;
        const endAngle = Math.PI * 2 - 0.2;
        const range = this.maxPressure - this.minPressure;

        for (let i = 0; i <= 10; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / 10);
            const pressure = this.minPressure + (range * i / 10);

            const x1 = this.centerX + Math.cos(angle) * this.radius * 0.85;
            const y1 = this.centerY + Math.sin(angle) * this.radius * 0.85;
            const x2 = this.centerX + Math.cos(angle) * this.radius * 0.75;
            const y2 = this.centerY + Math.sin(angle) * this.radius * 0.75;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = '#28a745';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (i % 2 === 0) {
                const labelX = this.centerX + Math.cos(angle) * this.radius * 0.65;
                const labelY = this.centerY + Math.sin(angle) * this.radius * 0.65;
                
                this.ctx.font = 'bold 13px Roboto';
                this.ctx.fillStyle = '#28a745';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(pressure.toFixed(0), labelX, labelY);
            }
        }

        this.ctx.font = 'bold 11px Roboto';
        this.ctx.fillStyle = '#b0b8d4';
        this.ctx.textAlign = 'center';
        const psiX = this.centerX + Math.cos(Math.PI + 0.2) * this.radius * 0.5;
        const psiY = this.centerY + Math.sin(Math.PI + 0.2) * this.radius * 0.5 + 20;
        this.ctx.fillText('PSI', psiX, psiY);

        const boostX = this.centerX + Math.cos(Math.PI * 2 - 0.2) * this.radius * 0.5;
        const boostY = this.centerY + Math.sin(Math.PI * 2 - 0.2) * this.radius * 0.5 + 20;
        this.ctx.fillText('BOOST', boostX, boostY);
    }

    drawNeedle() {
        const startAngle = Math.PI + 0.2;
        const endAngle = Math.PI * 2 - 0.2;
        const range = this.maxPressure - this.minPressure;
        
        const angle = startAngle + (endAngle - startAngle) * 
                     ((this.currentPressure - this.minPressure) / range);

        const needleLength = this.radius * 0.7;
        const needleX = this.centerX + Math.cos(angle) * needleLength;
        const needleY = this.centerY + Math.sin(angle) * needleLength;

        this.ctx.beginPath();
        this.ctx.moveTo(this.centerX, this.centerY);
        this.ctx.lineTo(needleX, needleY);
        this.ctx.strokeStyle = '#e74c3c';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius * 0.08, 0, Math.PI * 2);
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fill();
    }

    drawPressureValue() {
        const status = this.getPressureStatus();

        this.ctx.font = 'bold 40px Roboto';
        this.ctx.fillStyle = status.color;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(this.currentPressure.toFixed(2), this.centerX, this.centerY +50);

        this.ctx.font = 'bold 16px Roboto';
        this.ctx.fillStyle = '#b0b8d4';
        this.ctx.fillText('kPa', this.centerX, this.centerY + 25);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.pressureGauge = new PressureSensorGauge('pressureCanvas', 0, 200);
});
