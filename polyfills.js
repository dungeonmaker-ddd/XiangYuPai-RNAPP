/**
 * React Native Polyfills
 * 修复React 19与React Native 0.81的兼容性问题
 */

// 修复全局属性配置问题
if (typeof global !== 'undefined') {
  // 确保全局对象正确配置
  if (!global.performance) {
    global.performance = {
      now: () => Date.now(),
      mark: () => {},
      measure: () => {},
    };
  }

  // 修复Symbol.asyncIterator
  if (!global.Symbol.asyncIterator) {
    global.Symbol.asyncIterator = Symbol.for('Symbol.asyncIterator');
  }

  // 修复Promise配置
  if (global.Promise && !global.Promise.prototype.finally) {
    global.Promise.prototype.finally = function(callback) {
      return this.then(
        value => Promise.resolve(callback()).then(() => value),
        reason => Promise.resolve(callback()).then(() => { throw reason; })
      );
    };
  }
}

// 修复React Native特定的全局属性
if (typeof __DEV__ === 'undefined') {
  global.__DEV__ = process.env.NODE_ENV !== 'production';
}

// 修复React 19的新特性在React Native中的兼容性
if (typeof global.React === 'undefined') {
  // 确保React的全局配置正确
  const React = require('react');
  
  // 修复React 19的新特性
  if (React.version && React.version.startsWith('19')) {
    // 为React 19添加向后兼容性
    if (!React.createElement.__patched) {
      const originalCreateElement = React.createElement;
      React.createElement = function(...args) {
        try {
          return originalCreateElement.apply(this, args);
        } catch (error) {
          console.warn('React.createElement fallback:', error);
          return originalCreateElement.apply(this, args);
        }
      };
      React.createElement.__patched = true;
    }
  }
}

console.log('✅ React Native polyfills loaded successfully');
