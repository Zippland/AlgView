import React, { useState } from 'react';

const TransformerDemo = () => {
  const [activeLayer, setActiveLayer] = useState('attention');
  const [showExplanation, setShowExplanation] = useState(true);
  const [tokens, setTokens] = useState(['我', '喜欢', '人工', '智能']);
  const [selectedToken, setSelectedToken] = useState(2); // "人工"默认选中
  
  // 模拟注意力分数
  const attentionScores = {
    0: [0.7, 0.1, 0.1, 0.1], // "我" 主要关注自己
    1: [0.3, 0.5, 0.1, 0.1], // "喜欢" 关注"我"和自己
    2: [0.1, 0.3, 0.5, 0.1], // "人工" 关注"喜欢"和自己
    3: [0.1, 0.1, 0.6, 0.2]  // "智能" 主要关注"人工"
  };
  
  const explanations = {
    attention: "自注意力机制让模型能够关注输入序列中的不同部分。每个词（token）都会与序列中的所有词产生联系，计算出权重分数。这使得模型能够理解单词间的关系和上下文。",
    multihead: "多头注意力将输入并行地投影到多个子空间，每个'头'可以关注不同的特征。这就像多个人从不同角度看同一个问题，然后综合所有观点。",
    ffn: "前馈神经网络对每个位置的表示进行非线性变换，增强模型的表达能力。这相当于对每个词的理解进行深化处理。",
    norm: "层归一化帮助稳定训练过程，使深层网络能够更快收敛。它对每一层的输出进行标准化处理。",
    residual: "残差连接将输入直接加到输出上，缓解深层网络的梯度消失问题。这就像建立了信息的'高速公路'，使信号能够更容易地传递。"
  };
  
  const getAttentionColor = (score) => {
    // 根据注意力分数返回不同深度的蓝色背景
    const intensity = Math.floor(score * 255);
    return `rgba(0, 0, 255, ${score})`;
  };
  
  return (
    <div className="p-4 max-w-3xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Transformer架构交互演示</h2>
      
      <div className="flex flex-wrap gap-2 mb-4 justify-center">
        <button
          onClick={() => setActiveLayer('attention')}
          className={`px-3 py-1 rounded ${activeLayer === 'attention' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          自注意力机制
        </button>
        <button
          onClick={() => setActiveLayer('multihead')}
          className={`px-3 py-1 rounded ${activeLayer === 'multihead' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          多头注意力
        </button>
        <button
          onClick={() => setActiveLayer('ffn')}
          className={`px-3 py-1 rounded ${activeLayer === 'ffn' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          前馈神经网络
        </button>
        <button
          onClick={() => setActiveLayer('norm')}
          className={`px-3 py-1 rounded ${activeLayer === 'norm' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          层归一化
        </button>
        <button
          onClick={() => setActiveLayer('residual')}
          className={`px-3 py-1 rounded ${activeLayer === 'residual' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          残差连接
        </button>
      </div>
      
      {activeLayer === 'attention' && (
        <div className="mb-6">
          <div className="mb-3">
            <p className="mb-2 font-medium">示例句子中的tokens:</p>
            <div className="flex gap-2 mb-3">
              {tokens.map((token, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded cursor-pointer ${selectedToken === idx ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                  onClick={() => setSelectedToken(idx)}
                >
                  {token}
                </div>
              ))}
            </div>
            
            <p className="mb-2 font-medium">
              选中的token "{tokens[selectedToken]}" 对其他tokens的注意力分布:
            </p>
            <div className="flex gap-2">
              {tokens.map((token, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded text-center relative"
                  style={{
                    backgroundColor: getAttentionColor(attentionScores[selectedToken][idx]),
                    color: attentionScores[selectedToken][idx] > 0.5 ? 'white' : 'black',
                    flex: '1'
                  }}
                >
                  <div>{token}</div>
                  <div className="text-xs">{Math.round(attentionScores[selectedToken][idx] * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeLayer === 'multihead' && (
        <div className="mb-6">
          <div className="mb-3">
            <p className="mb-2 font-medium">多头注意力演示 (4个头):</p>
            <div className="grid grid-cols-2 gap-3">
              {[0, 1, 2, 3].map((headIdx) => (
                <div key={headIdx} className="border rounded p-2">
                  <p className="text-sm font-medium mb-2">注意力头 {headIdx + 1}</p>
                  <div className="flex gap-1">
                    {tokens.map((token, idx) => (
                      <div
                        key={idx}
                        className="px-2 py-1 rounded text-center text-sm"
                        style={{
                          backgroundColor: getAttentionColor(Math.random() * 0.7 + 0.3), // 随机生成不同的注意力模式
                          color: 'white',
                          flex: '1'
                        }}
                      >
                        {token}
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-gray-500 text-center">
                    {
                      headIdx === 0 ? "关注句法结构" :
                      headIdx === 1 ? "关注语义关联" :
                      headIdx === 2 ? "关注实体关系" :
                      "关注长距离依赖"
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {activeLayer === 'ffn' && (
        <div className="mb-6">
          <div className="border rounded-lg p-3">
            <p className="text-sm font-medium mb-2">前馈神经网络处理过程:</p>
            <div className="flex justify-center mb-3">
              <div className="w-24 py-2 bg-blue-100 rounded text-center">输入向量</div>
              <div className="flex items-center mx-2">→</div>
              <div className="w-32 py-2 bg-blue-300 rounded text-center">隐藏层 (扩展)</div>
              <div className="flex items-center mx-2">→</div>
              <div className="w-24 py-2 bg-blue-500 text-white rounded text-center">输出向量</div>
            </div>
            <div className="text-sm">
              <p>1. 输入向量维度: 512</p>
              <p>2. 隐藏层维度: 2048 (4倍扩展)</p>
              <p>3. 激活函数: GELU/ReLU</p>
              <p>4. 输出维度: 512 (恢复原始维度)</p>
            </div>
          </div>
        </div>
      )}
      
      {activeLayer === 'norm' && (
        <div className="mb-6">
          <div className="border rounded-lg p-3">
            <p className="text-sm font-medium mb-2">层归一化过程:</p>
            <div className="mb-3 bg-gray-100 p-2 rounded">
              <p className="text-sm font-mono">LayerNorm(x) = γ * (x - μ) / σ + β</p>
              <p className="text-xs mt-1">
                其中 μ 是均值, σ 是标准差, γ 和 β 是可学习的参数
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <div className="text-center">
                <div className="mb-1">原始值</div>
                <div className="px-3 py-1 bg-red-100 rounded">5.2</div>
                <div className="px-3 py-1 bg-red-200 rounded mt-1">-2.1</div>
                <div className="px-3 py-1 bg-red-300 rounded mt-1">8.7</div>
                <div className="px-3 py-1 bg-red-400 rounded mt-1">-3.6</div>
              </div>
              <div className="flex items-center font-bold">→</div>
              <div className="text-center">
                <div className="mb-1">归一化后</div>
                <div className="px-3 py-1 bg-green-100 rounded">0.58</div>
                <div className="px-3 py-1 bg-green-200 rounded mt-1">-0.34</div>
                <div className="px-3 py-1 bg-green-300 rounded mt-1">1.2</div>
                <div className="px-3 py-1 bg-green-400 rounded mt-1">-0.62</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeLayer === 'residual' && (
        <div className="mb-6">
          <div className="border rounded-lg p-3">
            <p className="text-sm font-medium mb-2">残差连接示意图:</p>
            <div className="flex justify-center items-center">
              <div className="text-center px-4 py-2 bg-blue-100 rounded">
                输入 x
              </div>
              <div className="flex items-center mx-3">
                <div className="h-0.5 w-8 bg-gray-400"></div>
                <div className="text-gray-400">→</div>
              </div>
              <div className="text-center px-4 py-2 bg-blue-300 rounded">
                子层 F(x)
              </div>
              <div className="flex items-center mx-3">
                <div className="h-0.5 w-8 bg-gray-400"></div>
                <div className="text-gray-400">→</div>
              </div>
              <div className="text-center px-4 py-2 bg-blue-500 text-white rounded">
                输出 x + F(x)
              </div>
            </div>
            <div className="mt-4 text-sm">
              <p>残差连接将输入 x 直接加到子层输出 F(x) 上，得到 x + F(x)</p>
              <p className="mt-1">这使深层网络训练更稳定，避免梯度消失问题</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-3">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-sm text-white hover:underline"
        >
          {showExplanation ? '隐藏' : '显示'}解释
        </button>
      </div>
      
      {showExplanation && (
        <div className="p-3 bg-yellow-50 rounded">
          <p className="font-medium">解释：</p>
          <p className="mt-1 text-sm">{explanations[activeLayer]}</p>
          
          {activeLayer === 'attention' && (
            <div className="mt-2 text-sm bg-white p-2 rounded border">
              <p className="font-mono">Attention(Q, K, V) = softmax(QK^T / √d_k)V</p>
              <p className="mt-1">
                其中 Q(查询)、K(键)、V(值) 是输入的线性变换，
                d_k 是键的维度，用于缩放点积避免梯度消失。
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <p className="font-medium">Transformer架构总结：</p>
        <ul className="list-disc pl-5 mt-1">
          <li>自注意力机制：捕捉序列中的长距离依赖关系</li>
          <li>多头注意力：从不同角度关注信息</li>
          <li>前馈神经网络：对每个位置进行非线性变换</li>
          <li>层归一化：稳定训练过程</li>
          <li>残差连接：缓解梯度消失问题</li>
        </ul>
      </div>
    </div>
  );
};

export default TransformerDemo;