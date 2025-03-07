import RigidBodyRotation from './RigidBodyRotation';

export default {
  name: 'SLAM',
  description: '同时定位与地图构建技术演示',
  components: [
    {
      name: '三维刚体运动表示',
      component: RigidBodyRotation,
      description: 'SLAM中表示物体旋转的三种主要方法：旋转矩阵、欧拉角和四元数',
      path: '/slam/RigidBodyRotation'
    }
    ]
}; 