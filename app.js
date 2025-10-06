class VideoGenerator {
    constructor() {
        this.generateBtn = document.getElementById('generateBtn');
        this.loadingElement = document.getElementById('loading');
        this.resultElement = document.getElementById('result');
        this.errorElement = document.getElementById('error');
        this.statusUpdates = document.getElementById('statusUpdates');
        this.videoElement = document.getElementById('generatedVideo');
        this.downloadLink = document.getElementById('downloadLink');
        
        this.workflowStatus = null;
        this.checkInterval = null;
        
        this.init();
    }

    init() {
        this.generateBtn.addEventListener('click', () => this.generateVideo());
        
        // Check for existing workflow results on page load
        this.checkExistingWorkflow();
    }

    async generateVideo() {
        const prompt = document.getElementById('textPrompt').value.trim();
        const duration = document.getElementById('duration').value;
        const resolution = document.getElementById('resolution').value;
        const style = document.getElementById('style').value;
        const githubToken = document.getElementById('githubToken').value.trim();

        if (!prompt) {
            this.showError('Please enter a text prompt');
            return;
        }

        this.showLoading();
        this.hideResult();
        this.hideError();

        try {
            // For demo purposes, we'll simulate the workflow
            // In a real implementation, you would call GitHub API to trigger the workflow
            await this.simulateWorkflowGeneration(prompt, duration, resolution, style);
            
        } catch (error) {
            console.error('Error:', error);
            this.showError('Failed to generate video: ' + error.message);
        }
    }

    async simulateWorkflowGeneration(prompt, duration, resolution, style) {
        // Simulate workflow steps
        this.addStatusUpdate('🚀 Starting GitHub Actions workflow...');
        
        await this.delay(2000);
        this.addStatusUpdate('📦 Setting up environment...');
        
        await this.delay(2000);
        this.addStatusUpdate('🐍 Installing Python dependencies...');
        
        await this.delay(2000);
        this.addStatusUpdate('🎬 Generating video frames...');
        
        await this.delay(3000);
        this.addStatusUpdate('⚡ Optimizing video quality...');
        
        await this.delay(2000);
        this.addStatusUpdate('✅ Video generation completed!');
        
        await this.delay(1000);
        
        // Show result with simulated video
        this.showResult(prompt, duration, resolution, style);
    }

    async triggerRealWorkflow(prompt, duration, resolution, style, token) {
        // This would be the real implementation using GitHub API
        const workflowData = {
            ref: 'main',
            inputs: {
                text_prompt: prompt,
                duration: duration,
                resolution: resolution,
                style: style
            }
        };

        const response = await fetch('https://api.github.com/repos/your-username/your-repo/actions/workflows/text-to-video.yml/dispatches', {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(workflowData)
        });

        if (!response.ok) {
            throw new Error(`Workflow trigger failed: ${response.statusText}`);
        }

        this.addStatusUpdate('✅ Workflow triggered successfully!');
        this.startStatusPolling();
    }

    startStatusPolling() {
        this.checkInterval = setInterval(() => {
            this.checkWorkflowStatus();
        }, 5000);
    }

    async checkWorkflowStatus() {
        // This would check the actual workflow status
        // For demo, we'll simulate it
        this.addStatusUpdate('⏳ Checking workflow status...');
        
        // Simulate completion after some time
        setTimeout(() => {
            this.addStatusUpdate('✅ Workflow completed!');
            this.showResult(
                document.getElementById('textPrompt').value,
                document.getElementById('duration').value,
                document.getElementById('resolution').value,
                document.getElementById('style').value
            );
            clearInterval(this.checkInterval);
        }, 10000);
    }

    showResult(prompt, duration, resolution, style) {
        this.hideLoading();
        
        // For demo, use a sample video URL
        // In real implementation, this would be the actual generated video URL
        const sampleVideoUrl = this.getSampleVideoUrl();
        
        this.videoElement.src = sampleVideoUrl;
        this.downloadLink.href = sampleVideoUrl;
        
        document.getElementById('videoPrompt').textContent = prompt;
        document.getElementById('videoDuration').textContent = duration;
        document.getElementById('videoResolution').textContent = resolution;
        document.getElementById('videoStyle').textContent = this.formatStyleName(style);
        
        this.resultElement.style.display = 'block';
        this.resultElement.scrollIntoView({ behavior: 'smooth' });
    }

    getSampleVideoUrl() {
        // Return a sample video URL for demonstration
        // In production, this would be the actual generated video URL from GitHub artifacts
        return 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }

    addStatusUpdate(message) {
        const statusItem = document.createElement('div');
        statusItem.className = 'status-item';
        statusItem.textContent = message;
        this.statusUpdates.appendChild(statusItem);
        this.statusUpdates.scrollTop = this.statusUpdates.scrollHeight;
    }

    showLoading() {
        this.generateBtn.disabled = true;
        this.loadingElement.style.display = 'block';
        this.statusUpdates.innerHTML = '<div class="status-item">🚀 Starting video generation process...</div>';
    }

    hideLoading() {
        this.generateBtn.disabled = false;
        this.loadingElement.style.display = 'none';
    }

    showError(message) {
        this.errorElement.querySelector('p').textContent = message;
        this.errorElement.style.display = 'block';
        this.hideLoading();
    }

    hideError() {
        this.errorElement.style.display = 'none';
    }

    hideResult() {
        this.resultElement.style.display = 'none';
    }

    formatStyleName(style) {
        const styleNames = {
            'animated_text': 'Animated Text',
            'slideshow': 'Slideshow',
            'ken_burns': 'Ken Burns Effect'
        };
        return styleNames[style] || style;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    checkExistingWorkflow() {
        // Check if there's a recent workflow result to display
        const savedVideo = localStorage.getItem('lastGeneratedVideo');
        if (savedVideo) {
            try {
                const videoData = JSON.parse(savedVideo);
                if (Date.now() - videoData.timestamp < 24 * 60 * 60 * 1000) { // 24 hours
                    this.showResult(
                        videoData.prompt,
                        videoData.duration,
                        videoData.resolution,
                        videoData.style
                    );
                }
            } catch (e) {
                // Ignore errors
            }
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VideoGenerator();
});

// Service Worker for caching (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
