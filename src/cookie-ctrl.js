const _cookieMap = Symbol('_cookieMap');
const _cookieMapByCookies = Symbol('_cookieMapByCookies');
const _parseCookieToMap = Symbol('_initCookie');
const _parseObjValue = Symbol('_parseObjValue');
const _cookieStrCache = Symbol('_cookieStrCache');
const _saveCookie = Symbol('_saveCookie');

/**
 * @param [_cookieArr] {Array} 保存不是通过 cookies 设置的 cookie 的键值对
 * @param [_cookieArrByCookies] {Array} 保存通过 cookies 设置的 cookie 的键值对
 * @param []
 */

class _Cookie {
  constructor() {
    this[_cookieStrCache] = '';
    this[_cookieMap] = new Map();
    this[_cookieMapByCookies] = new Map();
    this[_parseCookieToMap](); // init "this[_cookieMap]"
  }

  set(cookieItems, property) {
    // 更新 "this[_cookieMap]"
    this[_parseCookieToMap]();
    const publicProperty = Object.assign({}, {
      expires: this.expries,
      maxAge: property && property.expires && !property.maxAge ? null : this.maxAge,
      domain: this.domain,
      path: this.path,
      secure: this.secure
    }, property);

    if (typeof cookieItems === "object" && (!(cookieItems instanceof Array))) {
      for (const [key, value] of Object.entries(cookieItems)) {
        // 如果键值未经过 cookies 已经被设置，cookies 将不会再设置这条 cookie，并给出警告
        if (this[_cookieMap].has(key)) {
          console.warn(`${key} 未经过 cookie-ctrl 已经被设置，该 ${key} 将不会被继续设置`);
        } else {
          // 保存 cookie
          this[_saveCookie]({
            key,
            value,
            ...publicProperty
          })
        }
      }
    } else if (cookieItems instanceof Array) {
      for (const item of cookieItems) {
        if (item instanceof Array) {
          this.set(item[0], Object.assign({}, publicProperty, item[1]));
        } else if (typeof item === 'object') {
          this.set(item, publicProperty);
        } else {
          console.error(new Error('cookies.set 的第一个参数只能是数组或对象'));
        }
      }
    } else {
      console.error(new Error('cookies.set 的第一个参数只能接受对象或数组'))
    }
  }

  get(key) {
    const ret = {};
    ret.key = key;
    if (this[_cookieMap].has(key)) {
      ret.value = this[_cookieMap].get(key);
      ret.isSetByCookies = false;
    } else if (this[_cookieMapByCookies].has(key)) {
      ret.value = this[_cookieMapByCookies].get(key);
      ret.isSetByCookies = true;
    }
    return ret.value ? ret : false;
  }

  del(key) {
    if ('string' === typeof key) {
      if (this[_cookieMap].has(key)) {
        return console.warn(`${key} 并不是通过 cookie-ctrl 设置，无法完成删除操作。`)
      }
      const date = new Date();
      date.setFullYear(1970);
      this.set({[key]: 0}, {expires: date.toUTCString()});
    } else if (key instanceof Array) {
      for (const keyItem of key) {
        this.del(keyItem);
      }
    }
  }

  /**
   * Private functions
   */
  // 将 document.cookie 中不是通过 cookies 设置的 cookie 提取出来存入 this[_cookieMap]
  [_parseCookieToMap]() {
    if (this[_cookieStrCache] === document.cookie) return;

    const cookieArr = document.cookie.split('; ');
    cookieArr.forEach((item) => {
      const itemArr = item.split('=');
      if (!this[_cookieMapByCookies].has(itemArr[0])
        && !this[_cookieMap].has(itemArr[0])) {
        this[_cookieMap].set(...itemArr);
      }
    });

    this[_cookieStrCache] = document.cookie;
  }

  // 接收一条 cookie 配置对象，将其格式化后存入 document.cookie，并存入缓存
  [_saveCookie]({
                  key,
                  value,
                  domain,
                  path,
                  expires,
                  maxAge,
                  secure
                }) {
    // 格式化 key、value 值
    key = encodeURIComponent(key);
    value = encodeURIComponent(String(value));
    if (!key || !value) {
      return console.error(new Error('cookie 的 key 与 value 不能为空！'));
    }

    if (this[_cookieMapByCookies].has(key)) {
      const {domain: oldDomain, path: oldPath, secure: oldSecure} = this[_cookieMapByCookies].get(key);
      const isDomainEqual = domain === oldDomain,
        isPathEqual = path === oldPath,
        isSecureEqual = secure === oldSecure;
      if ((domain || path || secure)
        && (!isDomainEqual || !isPathEqual || !isSecureEqual)) {
        console.warn(`${key}=${value}已经被 cookies 设置，您不可以修改它的 domain、path、secure 属性`);
      }

      document.cookie = `${key}=${value}`
        + (expires ? `; expires=${expires}` : '')
        + (maxAge ? `; max-age=${maxAge}` : '')
        + (oldDomain ? `; domain=${oldDomain}` : '')
        + (oldPath ? `; path=${oldPath}` : '')
        + (oldSecure ? `; secure` : '');

      // 修改缓存
      this[_cookieMapByCookies].set(key, {
        key,
        value,
        expires,
        maxAge,
        path: oldPath,
        domain: oldDomain,
        secure: oldSecure
      });
    } else {
      const s = `${key}=${value}`
        + (expires ? `; expires=${expires}` : '')
        + (maxAge ? `; max-age=${maxAge}` : '')
        + (domain ? `; domain=${domain}` : '')
        + (path ? `; path=${path}` : '')
        + (secure ? `secure` : '');
      document.cookie = s;
      // 存入缓存
      this[_cookieMapByCookies].set(key, {
        value,
        expires,
        maxAge,
        domain,
        path,
        secure
      });
    }
  }

  get origin() {
    return document.cookie;
  }

  set origin(value) {
    console.log('_Cookie.origin is a readonly property.');
    return false;
  }

}

_Cookie.prototype.expires = '';
_Cookie.prototype.maxAge = 365 * 24 * 3600;
_Cookie.prototype.path = '/';
_Cookie.prototype.secure = window.location.protocol === 'https:';

export default _Cookie;