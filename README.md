# 算法可视化演示平台

这是一个用于展示和管理各种技术演示组件的平台。该平台自动扫描和分类不同类型的组件，并提供统一的浏览和导航界面。

## 功能特点

- 自动分类组件：按技术领域（SLAM、LLM、XGBoost等）自动分类
- 组件浏览器：提供直观的组件导航和选择界面
- 响应式设计：适应不同屏幕尺寸的设备
- 可扩展架构：轻松添加新的组件和类别

## 当前包含的组件类别

- **SLAM**：同时定位与地图构建技术演示
  - SLAM前端与后端演示：展示SLAM系统中前端处理和后端优化的过程

- **LLM**：大型语言模型演示
  - LLM基础演示：简单的LLM交互演示

- **XGBoost**：梯度提升决策树算法演示
  - XGBoost预测演示：使用XGBoost进行预测的简单演示

## 安装与运行

1. 安装依赖：
   ```
   npm install
   ```

2. 启动开发服务器：
   ```
   npm start
   ```

3. 在浏览器中访问：
   ```
   http://localhost:3000
   ```

## 添加新组件

要添加新组件，请按照以下步骤操作：

1. 在 `src/components` 目录下创建新的类别目录（如果需要）
2. 在类别目录中创建组件文件
3. 在类别目录中创建或更新 `index.js` 文件，导出组件信息
4. 在 `src/components/index.js` 中导入并注册新的类别

## 技术栈

- React
- CSS3
- HTML5 Canvas（用于某些可视化组件） 