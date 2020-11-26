class Cache {
  constructor() {
    // 初始化属性
    this.nonMark = false;
    this.sessionData = {};
    // this.localData = {};
    // 判断localStorage是否可用，不可用则设置为无痕模式
    // if (!window.localStorage || !window.sessionStorage) {
    if (!window.sessionStorage) {
      this.nonMark = true;
    } else {
      try {
        // window.localStorage.setItem('test', 'testLocalStorage');
        window.sessionStorage.setItem('test', 'testSessionStorage');
      } catch (e) {
        this.nonMark = true;
      }
    }
  }
  /**
   * 设置会话数据，临时数据存储使用
   * @param key
   * @param val
   * @return {void}
   */
  setSessionData(key, val) {
    if (!this.nonMark && window.sessionStorage.setItem) {
      try {
        window.sessionStorage.setItem(key, JSON.stringify(val));
      } catch (e) {
        this.nonMark = true;
        this.sessionData[key] = val;
      }
    } else {
      this.sessionData[key] = val;
    }
  }

  /**
   * @description 获取会话数据，临时数据存储使用
   * @param key
   * @return {void}
   */
  getSessionData(key) {
    if (!this.nonMark && window.sessionStorage.getItem) {
      const val = window.sessionStorage.getItem(key);
      return val === null || val === '' ? val : JSON.parse(val);
    } else {
      return this.sessionData[key];
    }
  }

  // setLocalStorageData(key, val) {
  //   if (!this.nonMark && window.localStorage.setItem) {
  //     try {
  //       window.localStorage.setItem(key, JSON.stringify(val))
  //     } catch (e) {
  //       this.nonMark = true
  //       this.localData[key] = val
  //     }
  //   } else {
  //     this.localData[key] = val
  //   }
  // }

  // getLocalStorageData(key) {
  //   if (!this.nonMark && window.localStorage.getItem) {
  //     const val = window.localStorage.getItem(key)
  //     return (val === null || val === '') ? val : JSON.parse(val)
  //   } else {
  //     return this.localData[key]
  //   }
  // }

  clearSessionData(key) {
    if (window.sessionStorage.removeItem && !this.nonMark) {
      window.sessionStorage.removeItem(key);
    } else {
      this.sessionData[key] = null;
    }
  }

  // clearLocalStorageData(key) {
  //   if (window.localStorage.removeItem && !this.nonMark) {
  //     window.localStorage.removeItem(key)
  //   } else {
  //     this.localData[key] = []
  //   }
  // }
}
export default new Cache();
