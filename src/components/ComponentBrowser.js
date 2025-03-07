import React, { useState } from 'react';
import componentCategories from './index';
import './ComponentBrowser.css';

const ComponentBrowser = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [componentListCollapsed, setComponentListCollapsed] = useState(false);
  
  // 处理类别选择
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setSelectedComponent(null);
  };
  
  // 处理组件选择
  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
    // 在移动设备上选择组件后自动折叠组件列表
    if (window.innerWidth <= 1024) {
      setComponentListCollapsed(true);
    }
  };
  
  // 切换侧边栏折叠状态
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  // 切换组件列表折叠状态
  const toggleComponentList = () => {
    setComponentListCollapsed(!componentListCollapsed);
  };
  
  // 渲染组件
  const renderComponent = () => {
    if (!selectedComponent) return null;
    
    const Component = selectedComponent.component;
    return <Component />;
  };
  
  return (
    <div className="component-browser">
      <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <h2 className="sidebar-title">
          {!sidebarCollapsed && <span>组件分类</span>}
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {sidebarCollapsed ? '»' : '«'}
          </button>
        </h2>
        <ul className="category-list">
          {componentCategories.map((category, index) => (
            <li 
              key={index} 
              className={`category-item ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategorySelect(category)}
              title={category.description}
            >
              <div className="category-name">{sidebarCollapsed ? category.name.charAt(0) : category.name}</div>
              {!sidebarCollapsed && <div className="category-description">{category.description}</div>}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="main-content">
        {selectedCategory ? (
          <div className="component-container">
            <div className={`component-list ${componentListCollapsed ? 'collapsed' : ''}`}>
              <h2>
                {!componentListCollapsed && `${selectedCategory.name} 组件`}
                <button className="component-list-toggle" onClick={toggleComponentList}>
                  {componentListCollapsed ? '»' : '«'}
                </button>
              </h2>
              {!componentListCollapsed && (
                <ul>
                  {selectedCategory.components.map((component, index) => (
                    <li 
                      key={index} 
                      className={`component-item ${selectedComponent === component ? 'active' : ''}`}
                      onClick={() => handleComponentSelect(component)}
                      title={component.description}
                    >
                      <div className="component-name">{component.name}</div>
                      <div className="component-description">{component.description}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="component-display">
              {selectedComponent ? (
                <>
                  <div className="component-content">
                    {renderComponent()}
                  </div>
                </>
              ) : (
                <div className="select-prompt">
                  <h3>请从左侧选择一个组件</h3>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="welcome-screen">
            <h1>欢迎使用算法可视化工具</h1>
            <p>请从左侧选择一个组件类别开始</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentBrowser; 