import React, { useState } from 'react';
import { Send, Settings, BarChart3, DollarSign, Zap, Clock, AlertTriangle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('demo');
  const [optimizationMode, setOptimizationMode] = useState('smart_balance');
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [routingInfo, setRoutingInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestsToday, setRequestsToday] = useState(1247);
  const [failoverDemo, setFailoverDemo] = useState(false);

  const models = {
    gpt35: { cost: 0.002, speed: 150, quality: 85, name: 'GPT-3.5 Turbo', status: 'online' },
    gpt4: { cost: 0.03, speed: 300, quality: 95, name: 'GPT-4', status: failoverDemo ? 'offline' : 'online' },
    claude: { cost: 0.015, speed: 250, quality: 92, name: 'Claude Sonnet', status: 'online' },
    gemini: { cost: 0.001, speed: 100, quality: 88, name: 'Gemini Pro', status: 'online' }
  };

  const routeQuery = (inputQuery, mode) => {
    const queryLower = inputQuery.toLowerCase();
    
    let queryType = 'general';
    if (queryLower.includes('code') || queryLower.includes('debug')) {
      queryType = 'code';
    } else if (queryLower.includes('analyze') || queryLower.includes('analysis')) {
      queryType = 'analysis';
    } else if (queryLower.includes('creative') || queryLower.includes('write') || queryLower.includes('story')) {
      queryType = 'creative';
    } else if (queryLower.includes('what is') || queryLower.includes('define')) {
      queryType = 'simple';
    }

    let selectedModel = 'gpt35';
    let reason = '';
    let failedOver = false;

    switch (mode) {
      case 'cost_first':
        selectedModel = queryType === 'simple' ? 'gemini' : 'gpt35';
        reason = queryType === 'simple' ? 'Simple query → cheapest model (Gemini Pro)' : 'Complex query → cost-effective model (GPT-3.5)';
        break;
      
      case 'performance_first':
        if (queryType === 'code') {
          selectedModel = 'gemini';
          reason = 'Code query → best code model (Gemini Pro)';
        } else if (queryType === 'analysis') {
          selectedModel = 'claude';
          reason = 'Analysis task → best reasoning model (Claude)';
        } else if (queryType === 'creative') {
          if (models.gpt4.status === 'online') {
            selectedModel = 'gpt4';
            reason = 'Creative task → best creative model (GPT-4)';
          } else {
            selectedModel = 'claude';
            reason = 'Creative task → GPT-4 offline, failed over to Claude';
            failedOver = true;
          }
        } else {
          if (models.gpt4.status === 'online') {
            selectedModel = 'gpt4';
            reason = 'Default → highest quality model (GPT-4)';
          } else {
            selectedModel = 'claude';
            reason = 'Default → GPT-4 offline, failed over to Claude';
            failedOver = true;
          }
        }
        break;
      
      case 'smart_balance':
        if (queryType === 'simple') {
          selectedModel = 'gemini';
          reason = 'Simple query → optimized for cost (Gemini Pro)';
        } else if (queryType === 'code') {
          selectedModel = 'gemini';
          reason = 'Code query → specialized model (Gemini Pro)';
        } else if (queryType === 'analysis') {
          selectedModel = 'claude';
          reason = 'Analysis → balanced quality/cost (Claude)';
        } else {
          selectedModel = 'gpt35';
          reason = 'General query → balanced option (GPT-3.5)';
        }
        break;
    }

    return { model: selectedModel, reason, queryType, failedOver };
  };

  const generateResponse = (inputQuery, model) => {
    const responses = {
      gpt4: 'This is a comprehensive response from GPT-4 with detailed analysis and high-quality insights perfect for complex reasoning tasks...',
      claude: 'Here is a thoughtful response from Claude with clear reasoning and structured analysis, excellent for analytical work...',
      gpt35: 'This is a helpful response from GPT-3.5 that balances quality with cost-effectiveness for general queries...',
      gemini: 'Here is an efficient response from Gemini Pro optimized for performance and value, especially good for code and simple tasks...'
    };
    return responses[model] + ' (Simulated response demonstrating intelligent routing)';
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    const routing = routeQuery(query, optimizationMode);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResponse = generateResponse(query, routing.model);
    
    setResponse(mockResponse);
    setRoutingInfo({
      ...routing,
      modelInfo: models[routing.model],
      estimatedCost: models[routing.model].cost,
      responseTime: models[routing.model].speed
    });
    
    setIsLoading(false);
    setRequestsToday(prev => prev + 1);
  };

  const calculateCostComparison = () => {
    const monthlyRequests = 50000;
    const costWithoutRouter = monthlyRequests * 0.03;
    const costWithRouter = {
      cost_first: monthlyRequests * 0.003,
      performance_first: monthlyRequests * 0.025,
      smart_balance: monthlyRequests * 0.012
    };
    
    return {
      without: costWithoutRouter,
      with: costWithRouter,
      savings: {
        cost_first: costWithoutRouter - costWithRouter.cost_first,
        performance_first: costWithoutRouter - costWithRouter.performance_first,
        smart_balance: costWithoutRouter - costWithRouter.smart_balance
      }
    };
  };

  const costComparison = calculateCostComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">LLM Router Pro</h1>
          <p className="text-blue-200">Intelligent routing for multi-LLM applications</p>
          <div className="mt-4 bg-orange-600/20 border border-orange-600/30 rounded-lg p-3 max-w-md mx-auto">
            <p className="text-orange-200 text-sm">
              🔥 Perpetual License: $200 (30 days only) - No support included
            </p>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Monthly Savings</p>
                <p className="text-white text-2xl font-bold">$2,847</p>
              </div>
              <DollarSign className="text-green-400" size={32} />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Requests Today</p>
                <p className="text-white text-2xl font-bold">{requestsToday}</p>
              </div>
              <BarChart3 className="text-blue-400" size={32} />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Avg Response Time</p>
                <p className="text-white text-2xl font-bold">234ms</p>
              </div>
              <Clock className="text-purple-400" size={32} />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Uptime</p>
                <p className="text-white text-2xl font-bold">99.9%</p>
              </div>
              <Zap className="text-orange-400" size={32} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'demo'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/15'
            }`}
          >
            <Zap size={16} />
            Live Demo
          </button>
          <button
            onClick={() => setActiveTab('cost')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'cost'
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-blue-200 hover:bg-white/15'
            }`}
          >
            <DollarSign size={16} />
            Cost Analysis
          </button>
        </div>

        {/* Live Demo Tab */}
        {activeTab === 'demo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h2 className="text-white font-semibold mb-4">Configuration</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-3">Optimization Mode</h3>
                    <div className="space-y-2">
                      {[
                        { key: 'cost_first', name: 'Cost First', icon: DollarSign, desc: 'Minimize costs while maintaining quality' },
                        { key: 'performance_first', name: 'Performance First', icon: Zap, desc: 'Best quality, cost is secondary' },
                        { key: 'smart_balance', name: 'Smart Balance', icon: BarChart3, desc: 'Optimize based on query complexity' }
                      ].map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <div
                            key={mode.key}
                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                              optimizationMode === mode.key
                                ? 'bg-blue-600 text-white'
                                : 'bg-white/5 text-blue-200 hover:bg-white/10'
                            }`}
                            onClick={() => setOptimizationMode(mode.key)}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Icon size={16} />
                              <span className="font-medium">{mode.name}</span>
                            </div>
                            <p className="text-xs opacity-80">{mode.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">Failover Demo</h3>
                      <button
                        onClick={() => setFailoverDemo(!failoverDemo)}
                        className={`px-3 py-1 rounded text-sm transition-all ${
                          failoverDemo 
                            ? 'bg-red-600 text-white' 
                            : 'bg-white/10 text-blue-200 hover:bg-white/15'
                        }`}
                      >
                        {failoverDemo ? 'GPT-4 Offline' : 'All Online'}
                      </button>
                    </div>
                    <p className="text-xs text-blue-200 opacity-80">
                      Toggle to simulate GPT-4 outage
                    </p>
                  </div>

                  <div className="border-t border-white/20 pt-4">
                    <h3 className="text-white font-medium mb-3">Model Status</h3>
                    <div className="space-y-2">
                      {Object.entries(models).map(([key, model]) => (
                        <div key={key} className="flex items-center justify-between text-sm">
                          <span className="text-blue-200">{model.name}</span>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              model.status === 'online' ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                            <span className={model.status === 'online' ? 'text-green-400' : 'text-red-400'}>
                              {model.status}
                            </span>
                            {model.status === 'offline' && <AlertTriangle size={14} className="text-red-400" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur rounded-lg p-6">
                <h2 className="text-white font-semibold mb-4">Test the Router</h2>
                
                <div className="mb-6">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Try: 'Write a creative story', 'Analyze sales data', 'Debug my code', or 'What is React?'"
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:border-blue-400"
                      onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Send size={16} />
                      )}
                      Send
                    </button>
                  </div>
                </div>

                {response && (
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-white font-medium mb-2">Response</h3>
                      <p className="text-blue-100">{response}</p>
                    </div>

                    {routingInfo && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                          Routing Decision
                          {routingInfo.failedOver && (
                            <span className="bg-orange-600 text-white px-2 py-1 rounded text-xs">
                              FAILOVER
                            </span>
                          )}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-blue-200 text-sm">Selected Model</p>
                            <p className="text-white font-medium">{routingInfo.modelInfo.name}</p>
                            <p className="text-blue-300 text-xs mt-1">{routingInfo.reason}</p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-blue-200 text-sm">Cost</span>
                              <span className="text-white">${routingInfo.estimatedCost.toFixed(4)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-200 text-sm">Response Time</span>
                              <span className="text-white">{routingInfo.responseTime}ms</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-blue-200 text-sm">Quality Score</span>
                              <span className="text-white">{routingInfo.modelInfo.quality}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <h3 className="text-white font-medium mb-3">Try These Examples</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {[
                      'Debug my Python function',
                      'Write a creative marketing email', 
                      'Analyze quarterly sales data',
                      'What is machine learning?'
                    ].map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(example)}
                        className="text-left p-2 bg-white/5 hover:bg-white/10 rounded text-blue-200 text-sm transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cost Analysis Tab */}
        {activeTab === 'cost' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h2 className="text-white font-semibold mb-4">Monthly Cost Comparison</h2>
              <div className="space-y-4">
                <div className="p-4 bg-red-600/10 rounded-lg border border-red-600/20">
                  <h3 className="text-red-300 font-medium">Without LLM Router</h3>
                  <p className="text-white text-2xl font-bold">${costComparison.without.toFixed(0)}</p>
                  <p className="text-red-200 text-sm">Using GPT-4 for everything</p>
                </div>
                
                {Object.entries(costComparison.with).map(([mode, cost]) => (
                  <div key={mode} className="p-4 bg-green-600/10 rounded-lg border border-green-600/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-green-300 font-medium capitalize">
                          {mode.replace('_', ' ')} Mode
                        </h3>
                        <p className="text-white text-2xl font-bold">${cost.toFixed(0)}</p>
                        <p className="text-green-200 text-sm">
                          Save ${costComparison.savings[mode].toFixed(0)}/month
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-xl">
                          {((costComparison.savings[mode] / costComparison.without) * 100).toFixed(0)}%
                        </p>
                        <p className="text-xs text-green-300">savings</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur rounded-lg p-6">
              <h2 className="text-white font-semibold mb-4">Perpetual License Value</h2>
              <div className="space-y-4">
                <div className="p-4 bg-blue-600/20 rounded-lg">
                  <h3 className="text-blue-200 font-medium">Lifetime Savings vs SaaS</h3>
                  <p className="text-white text-3xl font-bold">$2,800+</p>
                  <p className="text-blue-200 text-sm">$200 once vs $50/month forever</p>
                </div>
                
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Break-even Analysis</h3>
                  <div className="space-y-1 text-sm text-blue-200">
                    <p>• Month 4: You break even vs monthly subscription</p>
                    <p>• Year 1: Save $400 compared to SaaS</p>
                    <p>• Year 2: Save $1,000 total</p>
                    <p>• Year 3+: Pure profit from cost optimization</p>
                  </div>
                </div>

                <div className="p-4 bg-orange-600/20 rounded-lg border border-orange-600/30">
                  <h3 className="text-orange-200 font-medium">⏰ Limited Time Offer</h3>
                  <p className="text-white text-lg font-bold">30 Days Only</p>
                  <p className="text-orange-200 text-sm">
                    Pay once, own forever. No support included - comprehensive docs provided.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-lg p-6 text-center">
          <h2 className="text-white font-bold text-xl mb-2">Ready to Cut Your AI Costs by 60%?</h2>
          <p className="text-blue-200 mb-4">
            Join 500+ developers who've already optimized their LLM spending
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Get Perpetual License - $200
            </button>
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              View Documentation
            </button>
          </div>
          <p className="text-xs text-blue-300 mt-3">
            No support included • Comprehensive documentation provided • 7-day refund if it doesn't work as advertised
          </p>
        </div>
      </div>
    </div>
  );
}
