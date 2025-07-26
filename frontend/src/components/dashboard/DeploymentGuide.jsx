import React, { useState } from 'react';

const DeploymentGuide = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('railway');

  const platforms = {
    railway: {
      name: 'Railway',
      logo: '🚂',
      url: 'https://railway.app',
      time: '5 minutes',
      cost: 'Free ($5/month after trial)',
      domain: 'your-app.railway.app',
      pros: ['Easy GitHub integration', 'Automatic deployments', 'Built-in database'],
      cons: ['Limited free tier time'],
      steps: [
        'Go to railway.app and sign up with GitHub',
        'Click "Deploy from GitHub repo"',
        'Select your repository',
        'Add environment variables (copy from your .env)',
        'Railway automatically gives you a domain like: your-app.railway.app'
      ]
    },
    vercel: {
      name: 'Vercel',
      logo: '▲',
      url: 'https://vercel.com',
      time: '3 minutes',
      cost: 'Free (generous limits)',
      domain: 'your-app.vercel.app',
      pros: ['Lightning fast', 'Great for React apps', 'Excellent free tier'],
      cons: ['Better for frontend, need serverless for backend'],
      steps: [
        'Go to vercel.com and sign up with GitHub',
        'Import your repository',
        'Configure as Node.js project',
        'Add environment variables in dashboard',
        'Get instant domain: your-app.vercel.app'
      ]
    },
    heroku: {
      name: 'Heroku',
      logo: '🟣',
      url: 'https://heroku.com',
      time: '10 minutes',
      cost: 'Free tier (limited hours)',
      domain: 'your-app.herokuapp.com',
      pros: ['Industry standard', 'Lots of add-ons', 'Great documentation'],
      cons: ['Apps sleep on free tier', 'Slower deployments'],
      steps: [
        'Sign up at heroku.com',
        'Install Heroku CLI',
        'Run: heroku create your-app-name',
        'Push your code: git push heroku main',
        'Configure environment variables in dashboard'
      ]
    },
    render: {
      name: 'Render',
      logo: '🎨',
      url: 'https://render.com',
      time: '7 minutes',
      cost: 'Free tier (no sleeping)',
      domain: 'your-app.render.com',
      pros: ['No app sleeping', 'Great free tier', 'Auto SSL'],
      cons: ['Slower cold starts', 'Limited regions'],
      steps: [
        'Sign up at render.com with GitHub',
        'Create new Web Service',
        'Connect your repository',
        'Set build command: npm install',
        'Set start command: npm start'
      ]
    },
    netlify: {
      name: 'Netlify',
      logo: '🌐',
      url: 'https://netlify.com',
      time: '5 minutes',
      cost: 'Free (great for static sites)',
      domain: 'your-app.netlify.app',
      pros: ['Best for frontend', 'Excellent CI/CD', 'Great free tier'],
      cons: ['Need functions for backend', 'Learning curve for full-stack'],
      steps: [
        'Go to netlify.com and sign up',
        'Connect your GitHub repository',
        'Configure build settings',
        'Use Netlify Functions for backend',
        'Deploy with custom domain support'
      ]
    },
    digitalocean: {
      name: 'DigitalOcean',
      logo: '🌊',
      url: 'https://digitalocean.com',
      time: '15 minutes',
      cost: '$5/month (more control)',
      domain: 'your-domain.com',
      pros: ['Full server control', 'Great performance', 'Custom domains'],
      cons: ['Requires more setup', 'Not free', 'Need server knowledge'],
      steps: [
        'Create DigitalOcean account',
        'Launch a Droplet (Ubuntu server)',
        'Install Node.js and PM2',
        'Clone your repo and install dependencies',
        'Configure nginx and SSL with Let\'s Encrypt'
      ]
    },
    aws: {
      name: 'AWS (Elastic Beanstalk)',
      logo: '☁️',
      url: 'https://aws.amazon.com',
      time: '20 minutes',
      cost: 'Free tier (12 months)',
      domain: 'your-app.region.elasticbeanstalk.com',
      pros: ['Enterprise grade', 'Scalable', 'Many services'],
      cons: ['Complex interface', 'Steep learning curve'],
      steps: [
        'Create AWS account',
        'Go to Elastic Beanstalk',
        'Create new application',
        'Upload your code as ZIP',
        'Configure environment variables'
      ]
    },
    fly: {
      name: 'Fly.io',
      logo: '🪰',
      url: 'https://fly.io',
      time: '8 minutes',
      cost: 'Free tier available',
      domain: 'your-app.fly.dev',
      pros: ['Global deployment', 'Docker-based', 'Good performance'],
      cons: ['Requires Dockerfile', 'Newer platform'],
      steps: [
        'Install Fly CLI',
        'Run: fly auth signup',
        'Run: fly launch (in your project)',
        'Configure fly.toml file',
        'Deploy with: fly deploy'
      ]
    }
  };

  const currentPlatform = platforms[selectedPlatform];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          🚀 Deploy Your App to Get Shareable Links
        </h3>
        <p className="text-sm text-gray-600">
          Right now your links use localhost which only works on your computer. 
          Deploy to get real shareable links like <code className="bg-gray-100 px-2 py-1 rounded">https://your-app.railway.app/abc123</code>
        </p>
      </div>

      {/* Quick Comparison */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3">💡 Quick Platform Comparison</h4>
        <div className="grid md:grid-cols-2 gap-4 text-xs">
          <div className="bg-green-50 p-3 rounded border border-green-200">
            <div className="font-medium text-green-800 mb-1">🆓 Free & Easy Options</div>
            <div className="text-green-700">
              • No credit card required<br/>
              • Deploy in minutes<br/>
              • Perfect for side projects<br/>
              • Automatic SSL certificates
            </div>
          </div>
          <div className="bg-blue-50 p-3 rounded border border-blue-200">
            <div className="font-medium text-blue-800 mb-1">💼 Professional Options</div>
            <div className="text-blue-700">
              • Better performance & control<br/>
              • Custom domains included<br/>
              • Enterprise features<br/>
              • 24/7 support available
            </div>
          </div>
        </div>
      </div>

      {/* Platform Selection */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Choose Your Preferred Platform:</h4>
        
        {/* Free/Easy Options */}
        <div className="mb-4">
          <h5 className="text-xs font-medium text-green-700 mb-2 uppercase tracking-wide">🆓 Free & Easy (Recommended)</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['railway', 'vercel', 'render', 'netlify'].map((key) => {
              const platform = platforms[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPlatform(key)}
                  className={`p-3 border rounded-lg text-left transition-all ${
                    selectedPlatform === key
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">{platform.logo}</span>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 text-xs">{platform.name}</div>
                      <div className="text-xs text-green-600">{platform.cost}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Professional Options */}
        <div className="mb-4">
          <h5 className="text-xs font-medium text-blue-700 mb-2 uppercase tracking-wide">💼 Professional (More Control)</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['heroku', 'digitalocean', 'aws', 'fly'].map((key) => {
              const platform = platforms[key];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPlatform(key)}
                  className={`p-3 border rounded-lg text-left transition-all ${
                    selectedPlatform === key
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <span className="text-lg">{platform.logo}</span>
                    <div className="text-center">
                      <div className="font-medium text-gray-900 text-xs">{platform.name}</div>
                      <div className="text-xs text-blue-600">{platform.cost}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Platform Details */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-blue-900">
            {currentPlatform.logo} Deploy to {currentPlatform.name}
          </h4>
          <div className="flex items-center space-x-4 text-sm text-blue-700">
            <span>⏱️ {currentPlatform.time}</span>
            <span>💰 {currentPlatform.cost}</span>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="text-sm text-blue-800 mb-2">Your links will look like:</div>
          <code className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
            https://{currentPlatform.domain}/abc123
          </code>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-blue-900">Quick Steps:</div>
          {currentPlatform.steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-2 text-sm text-blue-800">
              <span className="bg-blue-200 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium mt-0.5">
                {index + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-blue-200">
          <a
            href={currentPlatform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Deploy to {currentPlatform.name} →
          </a>
        </div>
      </div>

      {/* Quick Alternative */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-medium text-yellow-800 mb-2">🔥 Quick Alternative: Ngrok</h4>
        <p className="text-sm text-yellow-700 mb-3">
          For immediate testing, create a public tunnel to your localhost:
        </p>
        <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
          <div># Install ngrok</div>
          <div>npm install -g ngrok</div>
          <div className="mt-2"># Create public tunnel</div>
          <div>ngrok http 5001</div>
        </div>
        <p className="text-xs text-yellow-600 mt-2">
          Copy the https URL from ngrok and update your BASE_URL in .env
        </p>
      </div>
    </div>
  );
};

export default DeploymentGuide;
