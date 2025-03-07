import TransformerDemo from './TransformerDemo';
import RMSPropDetailed from './RMSPropDetailed';

export default {
  name: 'LLM',
  description: '大型语言模型演示',
  components: [
    {
        name: 'transformer基础演示',
        component: TransformerDemo,
        description: '简单的LLM交互演示',
        path: './llm/transformers'
      },
    {
      name: 'RMSProp详细说明',
      component: RMSPropDetailed,
      description: 'RMSProp算法的详细说明',
      path: './llm/rmsprop'
    }            
  ]
}; 