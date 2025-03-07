import React, { useState, useEffect } from 'react';

const RigidBodyRotation = () => {
  const [rotationType, setRotationType] = useState('matrix');
  const [xAngle, setXAngle] = useState(0);
  const [yAngle, setYAngle] = useState(0);
  const [zAngle, setZAngle] = useState(0);
  const [quaternion, setQuaternion] = useState({ w: 1, x: 0, y: 0, z: 0 });
  const [rotationMatrix, setRotationMatrix] = useState([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ]);

  // 视图设置
  const viewBoxSize = 400;
  const center = viewBoxSize / 2;
  const cubeSize = 80;

  // 更新四元数和旋转矩阵
  useEffect(() => {
    // 转换欧拉角到弧度
    const xRad = (xAngle * Math.PI) / 180;
    const yRad = (yAngle * Math.PI) / 180;
    const zRad = (zAngle * Math.PI) / 180;

    // 计算四元数
    const qx = Math.sin(xRad / 2) * Math.cos(yRad / 2) * Math.cos(zRad / 2) - Math.cos(xRad / 2) * Math.sin(yRad / 2) * Math.sin(zRad / 2);
    const qy = Math.cos(xRad / 2) * Math.sin(yRad / 2) * Math.cos(zRad / 2) + Math.sin(xRad / 2) * Math.cos(yRad / 2) * Math.sin(zRad / 2);
    const qz = Math.cos(xRad / 2) * Math.cos(yRad / 2) * Math.sin(zRad / 2) - Math.sin(xRad / 2) * Math.sin(yRad / 2) * Math.cos(zRad / 2);
    const qw = Math.cos(xRad / 2) * Math.cos(yRad / 2) * Math.cos(zRad / 2) + Math.sin(xRad / 2) * Math.sin(yRad / 2) * Math.sin(zRad / 2);
    
    setQuaternion({ w: qw, x: qx, y: qy, z: qz });

    // 计算旋转矩阵
    const Rx = [
      [1, 0, 0],
      [0, Math.cos(xRad), -Math.sin(xRad)],
      [0, Math.sin(xRad), Math.cos(xRad)]
    ];

    const Ry = [
      [Math.cos(yRad), 0, Math.sin(yRad)],
      [0, 1, 0],
      [-Math.sin(yRad), 0, Math.cos(yRad)]
    ];

    const Rz = [
      [Math.cos(zRad), -Math.sin(zRad), 0],
      [Math.sin(zRad), Math.cos(zRad), 0],
      [0, 0, 1]
    ];

    // 矩阵乘法函数
    const multiplyMatrices = (a, b) => {
      const result = Array(3).fill().map(() => Array(3).fill(0));
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          for (let k = 0; k < 3; k++) {
            result[i][j] += a[i][k] * b[k][j];
          }
        }
      }
      return result;
    };

    // R = Rz * Ry * Rx
    const Rzy = multiplyMatrices(Rz, Ry);
    const R = multiplyMatrices(Rzy, Rx);

    setRotationMatrix(R);
  }, [xAngle, yAngle, zAngle]);

  // 获取3D变换矩阵
  const getTransformMatrix = () => {
    // 此处简化处理，实际应考虑投影等因素
    return `rotateX(${xAngle}deg) rotateY(${yAngle}deg) rotateZ(${zAngle}deg)`;
  };

  // 格式化矩阵显示
  const formatMatrix = (matrix) => {
    return matrix.map(row => 
      row.map(val => val.toFixed(2)).join(' ')
    ).join('\n');
  };

  // 获取顶点坐标
  const getCubeVertices = () => {
    const halfSize = cubeSize / 2;
    const baseVertices = [
      [-halfSize, -halfSize, -halfSize], // 0
      [halfSize, -halfSize, -halfSize],  // 1
      [halfSize, halfSize, -halfSize],   // 2
      [-halfSize, halfSize, -halfSize],  // 3
      [-halfSize, -halfSize, halfSize],  // 4
      [halfSize, -halfSize, halfSize],   // 5
      [halfSize, halfSize, halfSize],    // 6
      [-halfSize, halfSize, halfSize]    // 7
    ];

    return baseVertices;
  };

  // 获取立方体边
  const getCubeEdges = () => {
    return [
      [0, 1], [1, 2], [2, 3], [3, 0], // 底面
      [4, 5], [5, 6], [6, 7], [7, 4], // 顶面
      [0, 4], [1, 5], [2, 6], [3, 7]  // 连接边
    ];
  };

  // 应用旋转
  const applyRotation = (vertex) => {
    const [x, y, z] = vertex;
    const newX = rotationMatrix[0][0] * x + rotationMatrix[0][1] * y + rotationMatrix[0][2] * z;
    const newY = rotationMatrix[1][0] * x + rotationMatrix[1][1] * y + rotationMatrix[1][2] * z;
    const newZ = rotationMatrix[2][0] * x + rotationMatrix[2][1] * y + rotationMatrix[2][2] * z;
    
    // 简单的透视投影
    const scale = 600 / (600 + newZ);
    return [center + newX * scale, center + newY * scale];
  };

  // 渲染立方体
  const renderCube = () => {
    const vertices = getCubeVertices();
    const edges = getCubeEdges();
    const rotatedVertices = vertices.map(vertex => applyRotation(vertex));

    return (
      <g>
        {/* 绘制轴 */}
        <line x1={center} y1={center} x2={center + 100} y2={center} stroke="red" strokeWidth="2" />
        <line x1={center} y1={center} x2={center} y2={center - 100} stroke="green" strokeWidth="2" />
        <line x1={center} y1={center} x2={center - 50} y2={center + 50} stroke="blue" strokeWidth="2" />
        <text x={center + 105} y={center} fill="red">X</text>
        <text x={center} y={center - 105} fill="green">Y</text>
        <text x={center - 55} y={center + 60} fill="blue">Z</text>
        
        {/* 绘制立方体边 */}
        {edges.map((edge, index) => {
          const [v1, v2] = edge;
          return (
            <line
              key={index}
              x1={rotatedVertices[v1][0]}
              y1={rotatedVertices[v1][1]}
              x2={rotatedVertices[v2][0]}
              y2={rotatedVertices[v2][1]}
              stroke="#4a90e2"
              strokeWidth="2"
            />
          );
        })}
        
        {/* 绘制立方体顶点 */}
        {rotatedVertices.map((vertex, index) => (
          <circle
            key={index}
            cx={vertex[0]}
            cy={vertex[1]}
            r="4"
            fill={index === 0 ? "#e74c3c" : "#2ecc71"}
          />
        ))}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-4">三维刚体运动表示</h2>
      
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 mr-2 ${rotationType === 'matrix' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          onClick={() => setRotationType('matrix')}
        >
          旋转矩阵
        </button>
        <button
          className={`px-4 py-2 mr-2 ${rotationType === 'euler' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          onClick={() => setRotationType('euler')}
        >
          欧拉角
        </button>
        <button
          className={`px-4 py-2 ${rotationType === 'quaternion' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded`}
          onClick={() => setRotationType('quaternion')}
        >
          四元数
        </button>
      </div>
      
      <div className="flex mb-4">
        <svg width={viewBoxSize} height={viewBoxSize} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="border border-gray-300 rounded">
          {renderCube()}
        </svg>
        
        <div className="ml-4 p-4 bg-gray-100 rounded w-64">
          <h3 className="font-bold">{rotationType === 'matrix' ? '旋转矩阵' : rotationType === 'euler' ? '欧拉角' : '四元数'}</h3>
          <pre className="mt-2 text-sm font-mono">
            {rotationType === 'matrix' ? (
              formatMatrix(rotationMatrix)
            ) : rotationType === 'euler' ? (
              `X轴: ${xAngle}°\nY轴: ${yAngle}°\nZ轴: ${zAngle}°`
            ) : (
              `w: ${quaternion.w.toFixed(2)}\nx: ${quaternion.x.toFixed(2)}\ny: ${quaternion.y.toFixed(2)}\nz: ${quaternion.z.toFixed(2)}`
            )}
          </pre>
        </div>
      </div>
      
      <div className="w-full max-w-md">
        <div className="mb-4">
          <label className="block mb-2">X轴旋转 ({xAngle}°)</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={xAngle}
            onChange={(e) => setXAngle(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Y轴旋转 ({yAngle}°)</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={yAngle}
            onChange={(e) => setYAngle(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Z轴旋转 ({zAngle}°)</label>
          <input
            type="range"
            min="-180"
            max="180"
            value={zAngle}
            onChange={(e) => setZAngle(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
      
      <div className="w-full max-w-md mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-bold mb-2">刚体运动表示方法比较</h3>
        <ul className="list-disc pl-5 text-sm">
          <li><strong>旋转矩阵</strong>: 9个参数，直观但冗余</li>
          <li><strong>欧拉角</strong>: 3个参数，直观但有万向锁问题</li>
          <li><strong>四元数</strong>: 4个参数，无奇异性问题，计算效率高</li>
          <li><strong>李群李代数</strong>: 流形优化工具，适用于SLAM优化</li>
        </ul>
      </div>
    </div>
  );
};

export default RigidBodyRotation;