import React, { useState, useEffect } from 'react';

const XGBoostDemo = () => {
  // 模拟学生数据
  const initialStudents = [
    { id: 1, name: '小明', studyHours: 2, prevScore: 75, actualScore: 72 },
    { id: 2, name: '小红', studyHours: 4, prevScore: 85, actualScore: 90 },
    { id: 3, name: '小华', studyHours: 3, prevScore: 65, actualScore: 78 },
    { id: 4, name: '小李', studyHours: 5, prevScore: 90, actualScore: 95 },
    { id: 5, name: '小张', studyHours: 1, prevScore: 60, actualScore: 65 },
    { id: 6, name: '小赵', studyHours: 3.5, prevScore: 78, actualScore: 83 }
  ];

  const [students, setStudents] = useState(initialStudents);
  const [step, setStep] = useState(0);
  const [tree1Predictions, setTree1Predictions] = useState([]);
  const [tree2Predictions, setTree2Predictions] = useState([]);
  const [finalPredictions, setFinalPredictions] = useState([]);
  const [errors, setErrors] = useState([]);
  const [residuals, setResiduals] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  // 重置演示
  const resetDemo = () => {
    setStep(0);
    setTree1Predictions([]);
    setTree2Predictions([]);
    setFinalPredictions([]);
    setErrors([]);
    setResiduals([]);
    setShowExplanation(false);
  };

  // 计算第一棵树的预测
  const calculateTree1 = () => {
    const predictions = students.map(student => {
      // 简单决策树规则：基于学习时间
      return student.studyHours > 3 ? 85 : 70;
    });
    setTree1Predictions(predictions);
    return predictions;
  };

  // 计算第一棵树的残差
  const calculateResiduals = (predictions) => {
    const residuals = students.map((student, index) => {
      return student.actualScore - predictions[index];
    });
    setResiduals(residuals);
    return residuals;
  };

  // 计算第二棵树的预测（基于残差）
  const calculateTree2 = (residuals) => {
    const predictions = students.map((student, index) => {
      // 第二棵树规则：基于之前测验成绩修正残差
      return student.prevScore > 80 ? 5 : -3;
    });
    setTree2Predictions(predictions);
    return predictions;
  };

  // 计算最终预测和误差
  const calculateFinal = (tree1Preds, tree2Preds) => {
    const predictions = tree1Preds.map((pred, index) => {
      return pred + tree2Preds[index];
    });
    
    const errors = predictions.map((pred, index) => {
      return Math.abs(pred - students[index].actualScore);
    });
    
    setFinalPredictions(predictions);
    setErrors(errors);
    return { predictions, errors };
  };

  // 进入下一步
  const nextStep = () => {
    if (step === 0) {
      // 计算第一棵树预测
      const preds = calculateTree1();
      setStep(1);
    } else if (step === 1) {
      // 计算残差
      const residuals = calculateResiduals(tree1Predictions);
      setStep(2);
    } else if (step === 2) {
      // 计算第二棵树预测
      const tree2Preds = calculateTree2(residuals);
      setStep(3);
    } else if (step === 3) {
      // 计算最终预测
      calculateFinal(tree1Predictions, tree2Predictions);
      setStep(4);
    }
  };

  // 可以点击导航到特定步骤
  const goToStep = (targetStep) => {
    if (targetStep < step) {
      resetDemo();
      // 重新计算直到目标步骤
      setTimeout(() => {
        let preds = [];
        let resi = [];
        let tree2Preds = [];
        
        if (targetStep >= 1) {
          preds = calculateTree1();
        }
        
        if (targetStep >= 2) {
          resi = calculateResiduals(preds);
        }
        
        if (targetStep >= 3) {
          tree2Preds = calculateTree2(resi);
        }
        
        if (targetStep >= 4) {
          calculateFinal(preds, tree2Preds);
        }
        
        setStep(targetStep);
      }, 100);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">XGBoost工作原理：预测学生成绩</h2>
      
      {/* 步骤导航 */}
      <div className="flex justify-between mb-6 bg-gray-100 p-3 rounded-lg">
        <button 
          onClick={() => goToStep(0)} 
          className={`px-3 py-2 rounded ${step >= 0 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          disabled={step < 0}
        >
          1. 初始数据
        </button>
        <button 
          onClick={() => goToStep(1)} 
          className={`px-3 py-2 rounded ${step >= 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          disabled={step < 1}
        >
          2. 第一棵树
        </button>
        <button 
          onClick={() => goToStep(2)} 
          className={`px-3 py-2 rounded ${step >= 2 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          disabled={step < 2}
        >
          3. 计算残差
        </button>
        <button 
          onClick={() => goToStep(3)} 
          className={`px-3 py-2 rounded ${step >= 3 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          disabled={step < 3}
        >
          4. 第二棵树
        </button>
        <button 
          onClick={() => goToStep(4)} 
          className={`px-3 py-2 rounded ${step >= 4 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          disabled={step < 4}
        >
          5. 最终结果
        </button>
      </div>
      
      {/* 数据表格 */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">学生</th>
              <th className="py-2 px-4 border">学习时间(小时)</th>
              <th className="py-2 px-4 border">之前测验分数</th>
              <th className="py-2 px-4 border">实际考试分数</th>
              {step >= 1 && <th className="py-2 px-4 border bg-blue-100">第一棵树预测</th>}
              {step >= 2 && <th className="py-2 px-4 border bg-yellow-100">残差(误差)</th>}
              {step >= 3 && <th className="py-2 px-4 border bg-green-100">第二棵树修正</th>}
              {step >= 4 && <th className="py-2 px-4 border bg-purple-100">最终预测</th>}
              {step >= 4 && <th className="py-2 px-4 border bg-red-100">绝对误差</th>}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 border font-medium">{student.name}</td>
                <td className="py-2 px-4 border">{student.studyHours}</td>
                <td className="py-2 px-4 border">{student.prevScore}</td>
                <td className="py-2 px-4 border font-bold">{student.actualScore}</td>
                {step >= 1 && (
                  <td className="py-2 px-4 border bg-blue-50 font-medium">
                    {tree1Predictions[index]}
                  </td>
                )}
                {step >= 2 && (
                  <td className="py-2 px-4 border bg-yellow-50 font-medium">
                    {residuals[index]}
                  </td>
                )}
                {step >= 3 && (
                  <td className="py-2 px-4 border bg-green-50 font-medium">
                    {tree2Predictions[index]}
                  </td>
                )}
                {step >= 4 && (
                  <td className="py-2 px-4 border bg-purple-50 font-medium">
                    {finalPredictions[index]}
                  </td>
                )}
                {step >= 4 && (
                  <td className="py-2 px-4 border bg-red-50 font-medium">
                    {errors[index]}
                  </td>
                )}
              </tr>
            ))}
            {step >= 4 && (
              <tr className="bg-gray-200">
                <td colSpan={8} className="py-2 px-4 border text-right font-bold">平均绝对误差:</td>
                <td className="py-2 px-4 border font-bold">
                  {(errors.reduce((sum, err) => sum + err, 0) / errors.length).toFixed(2)}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 当前步骤解释 */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 min-h-32">
        {step === 0 && (
          <div>
            <h3 className="font-bold text-lg mb-2">步骤1: 初始数据</h3>
            <p>我们有6名学生的数据，包括他们的学习时间、之前的测验分数和实际的考试成绩。</p>
            <p className="mt-2">我们将使用XGBoost的原理来预测这些学生的成绩。</p>
          </div>
        )}
        {step === 1 && (
          <div>
            <h3 className="font-bold text-lg mb-2">步骤2: 第一棵决策树</h3>
            <p>我们的第一棵决策树非常简单，只基于学习时间来预测成绩:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>如果学习时间 {'>'} 3小时，预测成绩 = 85分</li>
              <li>如果学习时间 {'≤'} 3小时，预测成绩 = 70分</li>
            </ul>
            <p className="mt-2">这是一个粗略的预测，我们可以看到与实际成绩有差距。</p>
          </div>
        )}
        {step === 2 && (
          <div>
            <h3 className="font-bold text-lg mb-2">步骤3: 计算残差(误差)</h3>
            <p>残差 = 实际成绩 - 第一棵树的预测</p>
            <p className="mt-2">残差告诉我们第一棵树预测得有多准确。正值表示预测偏低，负值表示预测偏高。</p>
            <p className="mt-2">我们的下一棵树将尝试预测这些残差，从而修正第一棵树的错误。</p>
          </div>
        )}
        {step === 3 && (
          <div>
            <h3 className="font-bold text-lg mb-2">步骤4: 第二棵决策树(修正树)</h3>
            <p>第二棵树基于学生之前的测验成绩来预测残差:</p>
            <ul className="list-disc ml-6 mt-2">
              <li>如果之前测验成绩 {'>'} 80分，修正 +5分</li>
              <li>如果之前测验成绩 {'≤'} 80分，修正 -3分</li>
            </ul>
            <p className="mt-2">这棵树专注于修复第一棵树的预测误差。</p>
          </div>
        )}
        {step === 4 && (
          <div>
            <h3 className="font-bold text-lg mb-2">步骤5: 最终预测结果</h3>
            <p>最终预测 = 第一棵树的预测 + 第二棵树的修正</p>
            <p className="mt-2">我们可以看到，结合两棵树的预测比单独使用第一棵树更准确。平均误差已经减少！</p>
            <p className="mt-2">在真正的XGBoost中，我们会有更多棵树(可能几十到几百棵)，每棵树都会进一步修正之前树的错误。</p>
          </div>
        )}
      </div>
      
      {/* 更详细的解释按钮 */}
      <div className="mb-6">
        <button 
          onClick={() => setShowExplanation(!showExplanation)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          {showExplanation ? "隐藏详细解释" : "查看详细解释"}
        </button>
        
        {showExplanation && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-bold text-lg mb-2">XGBoost原理详解</h3>
            <p>XGBoost的工作原理可以概括为以下几个步骤:</p>
            <ol className="list-decimal ml-6 mt-2 space-y-2">
              <li>
                <span className="font-medium">初始预测</span>: 第一棵树给出基础预测。
              </li>
              <li>
                <span className="font-medium">计算残差</span>: 计算当前预测与实际值之间的差距。
              </li>
              <li>
                <span className="font-medium">构建新树</span>: 训练一棵新树来预测这些残差。
              </li>
              <li>
                <span className="font-medium">更新预测</span>: 将新树的预测加到之前的预测上。
              </li>
              <li>
                <span className="font-medium">重复步骤2-4</span>: 继续构建树，直到达到设定的树数量或误差不再明显降低。
              </li>
            </ol>
            <p className="mt-3">XGBoost还有许多高级特性，如:</p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><span className="font-medium">正则化</span>: 防止模型过度复杂，避免过拟合</li>
              <li><span className="font-medium">列抽样</span>: 每棵树只使用部分特征，增加多样性</li>
              <li><span className="font-medium">学习率</span>: 控制每棵新树的贡献大小</li>
              <li><span className="font-medium">并行计算</span>: 可以同时构建树的不同部分，提高速度</li>
              <li><span className="font-medium">缺失值处理</span>: 自动处理数据中的缺失值</li>
            </ul>
          </div>
        )}
      </div>
      
      {/* 控制按钮 */}
      <div className="flex justify-center space-x-4">
        {step < 4 ? (
          <button 
            onClick={nextStep} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            下一步
          </button>
        ) : (
          <button 
            onClick={resetDemo} 
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            重新开始
          </button>
        )}
      </div>
    </div>
  );
};

export default XGBoostDemo;