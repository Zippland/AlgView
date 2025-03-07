import XGBoostDemo from './XGBoostDemo';
export default {
  name: 'XGBoost',
  description: '梯度提升决策树算法演示',
  components: [
    {
      name: 'XGBoost基础演示',
      component: XGBoostDemo,
      description: 'XGBoost算法的基础演示',
      path: '/xgboost/XGBoostDemo'
    }
  ]
}; 