import React, { useState, useEffect, useRef } from 'react';

const RMSPropDetailed = () => {
  const canvasRef = useRef(null);
  const [learningRate, setLearningRate] = useState(0.1);
  const [beta, setBeta] = useState(0.9);
  const [epsilon, setEpsilon] = useState(1e-8);
  
  const [mode, setMode] = useState('sgd'); // 'sgd', 'adagrad', 'rmsprop'
  const [isRunning, setIsRunning] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [showRates, setShowRates] = useState(false);
  
  // State for position and accumulated values
  const [position, setPosition] = useState({ x: 250, y: 150 });
  const [accumValues, setAccumValues] = useState({
    adagrad: { x: 0, y: 0 },
    rmsprop: { x: 0, y: 0 }
  });
  
  // Trace history for visualization
  const [trace, setTrace] = useState({
    sgd: [{ x: 250, y: 150 }],
    adagrad: [{ x: 250, y: 150 }],
    rmsprop: [{ x: 250, y: 150 }],
    activeModeTrace: [{ x: 250, y: 150 }]
  });
  
  // Adaptive learning rates for visualization
  const [adaptiveLR, setAdaptiveLR] = useState({
    x: learningRate,
    y: learningRate
  });
  
  // Define a loss function - we'll use Rosenbrock function with uneven scaling
  const lossFunction = (x, y) => {
    // Modified Rosenbrock function with different scales on x and y
    const term1 = 0.001 * Math.pow(1 - x/100, 2);
    const term2 = 0.1 * Math.pow(y/100 - Math.pow(x/100, 2), 2);
    return term1 + term2;
  };
  
  // Calculate gradient at a point
  const gradient = (x, y) => {
    const h = 0.1;
    const fx_plus = lossFunction(x + h, y);
    const fx_minus = lossFunction(x - h, y);
    const fy_plus = lossFunction(x, y + h);
    const fy_minus = lossFunction(x, y - h);
    
    const dx = (fx_plus - fx_minus) / (2 * h);
    const dy = (fy_plus - fy_minus) / (2 * h);
    
    return { dx, dy };
  };
  
  // Take a step with the selected optimizer
  const takeStep = () => {
    const { x, y } = position;
    const { dx, dy } = gradient(x, y);
    
    let newX, newY;
    
    if (mode === 'sgd') {
      // Standard SGD update
      newX = x - learningRate * dx;
      newY = y - learningRate * dy;
      
      setAdaptiveLR({
        x: learningRate,
        y: learningRate
      });
      
      setTrace(prev => ({
        ...prev,
        sgd: [...prev.sgd, { x: newX, y: newY }],
        activeModeTrace: [...prev.activeModeTrace, { x: newX, y: newY }]
      }));
    } 
    else if (mode === 'adagrad') {
      // AdaGrad update
      const newAccumX = accumValues.adagrad.x + dx * dx;
      const newAccumY = accumValues.adagrad.y + dy * dy;
      
      const adaptiveLrX = learningRate / (Math.sqrt(newAccumX) + epsilon);
      const adaptiveLrY = learningRate / (Math.sqrt(newAccumY) + epsilon);
      
      newX = x - adaptiveLrX * dx;
      newY = y - adaptiveLrY * dy;
      
      setAccumValues(prev => ({
        ...prev,
        adagrad: { x: newAccumX, y: newAccumY }
      }));
      
      setAdaptiveLR({
        x: adaptiveLrX,
        y: adaptiveLrY
      });
      
      setTrace(prev => ({
        ...prev,
        adagrad: [...prev.adagrad, { x: newX, y: newY }],
        activeModeTrace: [...prev.activeModeTrace, { x: newX, y: newY }]
      }));
    } 
    else if (mode === 'rmsprop') {
      // RMSProp update
      const newAccumX = beta * accumValues.rmsprop.x + (1 - beta) * dx * dx;
      const newAccumY = beta * accumValues.rmsprop.y + (1 - beta) * dy * dy;
      
      const adaptiveLrX = learningRate / (Math.sqrt(newAccumX) + epsilon);
      const adaptiveLrY = learningRate / (Math.sqrt(newAccumY) + epsilon);
      
      newX = x - adaptiveLrX * dx;
      newY = y - adaptiveLrY * dy;
      
      setAccumValues(prev => ({
        ...prev,
        rmsprop: { x: newAccumX, y: newAccumY }
      }));
      
      setAdaptiveLR({
        x: adaptiveLrX,
        y: adaptiveLrY
      });
      
      setTrace(prev => ({
        ...prev,
        rmsprop: [...prev.rmsprop, { x: newX, y: newY }],
        activeModeTrace: [...prev.activeModeTrace, { x: newX, y: newY }]
      }));
    }
    
    setPosition({ x: newX, y: newY });
    setEpoch(epoch + 1);
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setPosition({ x: 250, y: 150 });
    setAccumValues({
      adagrad: { x: 0, y: 0 },
      rmsprop: { x: 0, y: 0 }
    });
    setTrace({
      sgd: [{ x: 250, y: 150 }],
      adagrad: [{ x: 250, y: 150 }],
      rmsprop: [{ x: 250, y: 150 }],
      activeModeTrace: [{ x: 250, y: 150 }]
    });
    setEpoch(0);
    setIsRunning(false);
    setAdaptiveLR({ x: learningRate, y: learningRate });
  };
  
  const changeMode = (newMode) => {
    setMode(newMode);
    resetSimulation();
  };
  
  // Animation loop
  useEffect(() => {
    if (!isRunning) return;
    
    const timer = setTimeout(() => {
      takeStep();
      
      // Stop after a certain number of epochs
      if (epoch > 100) {
        setIsRunning(false);
      }
    }, 30);
    
    return () => clearTimeout(timer);
  }, [isRunning, position, accumValues, epoch]);
  
  // Draw the visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw contour map of the loss function
    for (let x = 0; x < width; x += 5) {
      for (let y = 0; y < height; y += 5) {
        const value = lossFunction(x, y);
        // Normalize value for coloring
        const normalizedValue = Math.min(1, Math.max(0, value / 10));
        
        // Use a colormap: blue for low values, red for high values
        const r = Math.floor(255 * normalizedValue);
        const g = 50;
        const b = Math.floor(255 * (1 - normalizedValue));
        
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fillRect(x, y, 5, 5);
      }
    }
    
    // Draw adaptive learning rate ellipse
    if (showRates && mode !== 'sgd') {
      const ellipseX = 50;  // Scale factor for visualization
      const ellipseY = 50;
      
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(
        position.x, 
        position.y, 
        adaptiveLR.x * ellipseX, 
        adaptiveLR.y * ellipseY, 
        0, 0, Math.PI * 2
      );
      ctx.stroke();
      
      // Draw text showing adaptive learning rates
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(`LR_x: ${adaptiveLR.x.toExponential(2)}`, position.x + 15, position.y - 20);
      ctx.fillText(`LR_y: ${adaptiveLR.y.toExponential(2)}`, position.x + 15, position.y - 5);
    }
    
    // Draw optimization paths
    const drawPath = (pathData, color, lineWidth = 2) => {
      if (pathData.length < 2) return;
      
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(pathData[0].x, pathData[0].y);
      
      for (let i = 1; i < pathData.length; i++) {
        ctx.lineTo(pathData[i].x, pathData[i].y);
      }
      
      ctx.stroke();
    };
    
    // Draw each optimizer's path
    if (mode === 'compare') {
      drawPath(trace.sgd, 'white', 1.5);
      drawPath(trace.adagrad, 'orange', 1.5);
      drawPath(trace.rmsprop, 'cyan', 2);
      
      // Add legend
      ctx.font = '14px Arial';
      ctx.fillStyle = 'white';
      ctx.fillText('SGD', 20, 30);
      ctx.fillStyle = 'orange';
      ctx.fillText('AdaGrad', 20, 50);
      ctx.fillStyle = 'cyan';
      ctx.fillText('RMSProp', 20, 70);
    } else {
      let pathColor;
      switch(mode) {
        case 'sgd': pathColor = 'white'; break;
        case 'adagrad': pathColor = 'orange'; break;
        case 'rmsprop': pathColor = 'cyan'; break;
        default: pathColor = 'white';
      }
      
      drawPath(trace.activeModeTrace, pathColor, 2);
    }
    
    // Draw current position
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(position.x, position.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw minimum position (approximate)
    ctx.fillStyle = 'lime';
    ctx.beginPath();
    ctx.arc(100, 100, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw title and epoch info
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    
    let title;
    switch(mode) {
      case 'sgd': title = '随机梯度下降 (SGD)'; break;
      case 'adagrad': title = 'AdaGrad - 累积梯度平方'; break;
      case 'rmsprop': title = 'RMSProp - 指数移动平均'; break;
      case 'compare': title = '优化器比较'; break;
      default: title = '优化器演示';
    }
    
    ctx.fillText(title, width / 2, 25);
    ctx.fillText(`轮数: ${epoch}`, width / 2, height - 10);
    
  }, [position, trace, adaptiveLR, epoch, mode, showRates]);
  
  return (
    <div className="flex flex-col items-center p-4 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">RMSProp vs AdaGrad vs SGD 优化器对比</h2>
      
      <div className="mb-4">
        <canvas 
          ref={canvasRef} 
          width={500} 
          height={300} 
          className="border border-gray-300 bg-gray-800"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
        <div>
          <label className="block mb-1">学习率 (η): {learningRate.toExponential(2)}</label>
          <input
            type="range"
            min="-4"
            max="0"
            step="0.1"
            value={Math.log10(learningRate)}
            onChange={(e) => setLearningRate(Math.pow(10, parseFloat(e.target.value)))}
            className="w-full"
          />
        </div>
        
        <div>
          <label className="block mb-1">衰减率 (β): {beta.toFixed(2)}</label>
          <input
            type="range"
            min="0.5"
            max="0.99"
            step="0.01"
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            className="w-full"
            disabled={mode !== 'rmsprop'}
          />
        </div>
        
        <div>
          <label className="block mb-1">ε值: {epsilon.toExponential(4)}</label>
          <input
            type="range"
            min="-10"
            max="-4"
            step="0.5"
            value={Math.log10(epsilon)}
            onChange={(e) => setEpsilon(Math.pow(10, parseFloat(e.target.value)))}
            className="w-full"
            disabled={mode === 'sgd'}
          />
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center space-x-2 space-y-2 mb-4">
        <button
          className={`px-3 py-1 rounded text-sm ${mode === 'sgd' ? 'bg-white text-black font-bold' : 'bg-gray-300'}`}
          onClick={() => changeMode('sgd')}
        >
          SGD
        </button>
        
        <button
          className={`px-3 py-1 rounded text-sm ${mode === 'adagrad' ? 'bg-orange-500 text-white font-bold' : 'bg-gray-300'}`}
          onClick={() => changeMode('adagrad')}
        >
          AdaGrad
        </button>
        
        <button
          className={`px-3 py-1 rounded text-sm ${mode === 'rmsprop' ? 'bg-cyan-500 text-white font-bold' : 'bg-gray-300'}`}
          onClick={() => changeMode('rmsprop')}
        >
          RMSProp
        </button>
        
        <button
          className={`px-3 py-1 rounded text-sm ${mode === 'compare' ? 'bg-purple-500 text-white font-bold' : 'bg-gray-300'}`}
          onClick={() => changeMode('compare')}
        >
          对比所有
        </button>
      </div>
      
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${isRunning ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          onClick={() => setIsRunning(!isRunning)}
        >
          {isRunning ? '暂停' : '开始'}
        </button>
        
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={resetSimulation}
        >
          重置
        </button>
        
        <button
          className="px-4 py-2 bg-yellow-500 text-white rounded"
          onClick={() => {
            if (!isRunning) {
              takeStep();
            }
          }}
          disabled={isRunning}
        >
          单步执行
        </button>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="showRates"
            checked={showRates}
            onChange={() => setShowRates(!showRates)}
            className="mr-2"
          />
          <label htmlFor="showRates">显示自适应学习率</label>
        </div>
      </div>
      
      <div className="mt-2 p-4 bg-white rounded border border-gray-300 w-full text-sm">
        <h3 className="font-bold mb-2">RMSProp 原理:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-1">RMSProp vs AdaGrad:</h4>
            <ul className="list-disc pl-5 mb-2">
              <li>AdaGrad累积<strong>所有</strong>历史梯度的平方</li>
              <li>RMSProp使用<strong>指数加权移动平均</strong>只关注近期梯度</li>
              <li>这防止了学习率过早下降到非常小</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-1">RMSProp公式:</h4>
            <p className="mb-1">v_t = β * v_t-1 + (1 - β) * g_t²</p>
            <p className="mb-1">θ_t = θ_t-1 - η * g_t / (√v_t + ε)</p>
            <p>其中β是衰减率(通常为0.9或0.99)</p>
          </div>
        </div>
        
        <div className="mt-3">
          <h4 className="font-semibold mb-1">可视化说明:</h4>
          <ul className="list-disc pl-5">
            <li>损失函数等高线: 红色区域表示高损失，蓝色区域表示低损失</li>
            <li>绿色点表示理想的最小值位置</li>
            <li>黄色椭圆表示自适应学习率(横向和纵向)</li>
            <li>观察RMSProp如何比AdaGrad更好地处理不均匀梯度</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RMSPropDetailed;