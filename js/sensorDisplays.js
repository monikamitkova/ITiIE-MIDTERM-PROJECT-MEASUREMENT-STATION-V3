class TemperatureSensorGauge {
    constructor(canvasId, minTemp = -20, maxTemp = 50) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.minTemp = minTemp;
        this.maxTemp = maxTemp;
        this.currentTemp = 22;
        this.isDarkMode = true;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
   
        this.draw();
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

    setTemperature(value) {
        this.currentTemp = Math.max(this.minTemp, Math.min(this.maxTemp, value));
        this.draw();
    }

    getTemperature() {
        return this.currentTemp;
    }

    draw() {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), 
        this.canvas.height / (window.devicePixelRatio || 1));

        this.drawGaugeBackground();

        this.drawNeedle();

        this.drawTemperatureValue();
       
        this.drawScale();
    }

    drawGaugeBackground() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#4a9eff';
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
        this.ctx.fillStyle = '#4a9eff';
        this.ctx.fill();
    }

    drawScale() {
        const startAngle = Math.PI + 0.2;
        const endAngle = Math.PI * 2 - 0.2;
        const range = this.maxTemp - this.minTemp;

        for (let i = 0; i <= 10; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / 10);
            const temp = this.minTemp + (range * i / 10);

            const x1 = this.centerX + Math.cos(angle) * this.radius * 0.85;
            const y1 = this.centerY + Math.sin(angle) * this.radius * 0.85;
            const x2 = this.centerX + Math.cos(angle) * this.radius * 0.75;
            const y2 = this.centerY + Math.sin(angle) * this.radius * 0.75;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = '#4a9eff';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (i % 2 === 0) {
                const labelX = this.centerX + Math.cos(angle) * this.radius * 0.65;
                const labelY = this.centerY + Math.sin(angle) * this.radius * 0.65;
                
                this.ctx.font = 'bold 13px Roboto';
                this.ctx.fillStyle = '#4a9eff';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(temp.toFixed(0), labelX, labelY);
            }
        }
    }

    drawNeedle() {
        const startAngle = Math.PI + 0.2;
        const endAngle = Math.PI * 2 - 0.2;
        const range = this.maxTemp - this.minTemp;
        
        const angle = startAngle + (endAngle - startAngle) * 
                     ((this.currentTemp - this.minTemp) / range);

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

    drawTemperatureValue() {
        this.ctx.font = 'bold 40px Roboto';
        this.ctx.fillStyle = '#4a9eff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(this.currentTemp.toFixed(1), this.centerX, this.centerY +50);

        this.ctx.font = 'bold 16px Roboto';
        this.ctx.fillStyle = '#b0b8d4';
        this.ctx.fillText('°C', this.centerX, this.centerY + 25);
    }
}

class COConcentrationGauge {
    constructor(canvasId, minCO = 0, maxCO = 50) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.minCO = minCO;
        this.maxCO = maxCO;
        this.currentCO = 10; 
        this.isDarkMode = true;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.draw();
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

    setCOConcentration(value) {
        this.currentCO = Math.max(this.minCO, Math.min(this.maxCO, value));
        this.draw();
    }

    getCOConcentration() {
        return this.currentCO;
    }

    draw() {
        this.ctx.fillStyle = '#0a0e27';
        this.ctx.fillRect(0, 0, this.canvas.width / (window.devicePixelRatio || 1), 
                         this.canvas.height / (window.devicePixelRatio || 1));

        this.drawGaugeBackground();
        
        this.drawNeedle();
        
        this.drawCOValue();
        
        this.drawScale();
    }

    drawGaugeBackground() {
        this.ctx.beginPath();
        this.ctx.arc(this.centerX, this.centerY, this.radius, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#ff9500';
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
        this.ctx.fillStyle = '#ff9500';
        this.ctx.fill();
    }

    drawScale() {
        const startAngle = Math.PI + 0.2;
        const endAngle = Math.PI * 2 - 0.2;
        const range = this.maxCO - this.minCO;

        for (let i = 0; i <= 10; i++) {
            const angle = startAngle + (endAngle - startAngle) * (i / 10);
            const co = this.minCO + (range * i / 10);

            const x1 = this.centerX + Math.cos(angle) * this.radius * 0.85;
            const y1 = this.centerY + Math.sin(angle) * this.radius * 0.85;
            const x2 = this.centerX + Math.cos(angle) * this.radius * 0.75;
            const y2 = this.centerY + Math.sin(angle) * this.radius * 0.75;

            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.strokeStyle = '#ff9500';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (i % 2 === 0) {
                const labelX = this.centerX + Math.cos(angle) * this.radius * 0.65;
                const labelY = this.centerY + Math.sin(angle) * this.radius * 0.65;
                
                this.ctx.font = 'bold 13px Roboto';
                this.ctx.fillStyle = '#ff9500';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(co.toFixed(0), labelX, labelY);
            }
        }
    }

    drawNeedle() {
        const startAngle = Math.PI + 0.2;
        const endAngle = Math.PI * 2 - 0.2;
        const range = this.maxCO - this.minCO;
        
        const angle = startAngle + (endAngle - startAngle) * 
                     ((this.currentCO - this.minCO) / range);

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

    drawCOValue() {
        this.ctx.font = 'bold 40px Roboto';
        this.ctx.fillStyle = '#ff9500';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(this.currentCO.toFixed(1), this.centerX, this.centerY +50);

        this.ctx.font = 'bold 16px Roboto';
        this.ctx.fillStyle = '#b0b8d4';
        this.ctx.fillText('ppm', this.centerX, this.centerY + 25);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.temperatureGauge = new TemperatureSensorGauge('temperatureCanvas', -20, 50);

    window.coGauge = new COConcentrationGauge('coCanvas', 0, 50);
});
