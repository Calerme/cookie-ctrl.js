# 安装

**直接通过 script 引入：**

```html
<script></script>
```

这时会创建一个全局函数`cookies`。

**通过 npm 安装：**

```sh
npm i -S cookie-ctrl
```

引入：

```js
const cookies = require('cookie-ctrl');
```

或者使用 ES2015 Module 语法引入：

```js
import cookies from 'cookie-ctrl';
```

# 设置一条 cookie

```js
// 第二个参数可以省略。
// 未设置的属性将使用缺省值，具体见下面的[设置缺省值]。
cookies.set({token: 123}, {
  maxAge: 3600
});
```

# 设置多条 cookies

```js
// 同样第二个参数可以省略
cookies.set([{token1: 123}, {token2: 123}], {
  path: '/subpath'
});
// 还可以对各个 cookie 对设置不同的属性，将cookie 与自定义的属性打包为一个数组即可，缺省的属性将由第二个参数填充，如果第二个参数为空，则使用默认属性
cookies.set([
  [{token1: 123}, {
    maxAge: 3600
  }],
  {token2: 321}
], {
  path: '/subpath'
});
```

# 读取 cookie

# 读取多条 cookies

# 删除一条 cookie

# 删除多条 cookies

# 设置缺省 cookie 属性

如果设置一条 cookie 没有传入相对的属性，那么 `cookie-ctrl` 会使用默认的属性值：

* expires: '' 
* max-age: 365 * 24 * 3600
* domain: ''
* path: '/'

可以通过修改 `cookies` 上对应的属性修改缺省值：

```js
// expires 的值必须是 Date 实例或为可被 Date.parse() 解析的字符串
cookies.expires = new Date.toUTCString();

// 所有现代浏览器中设置了 max-age，就会忽略 expires
cookies.maxAge = 24 * 3600;

// 设置 domain，默认为当前域名
cookies.domain = '.example.com';

// 设置 path，默认为根路径
cookies.path = '/subpath';

// 设置 secure，如果当前网页为 https 协议，则默认值为 true
cookies.secure = false;
```

## 注意

`cookie-ctrl`删除和修改的 cookie 只能限定于通过`cookie-ctrl`设置的 cookie。因为修改一条 cookie 必须要达到 key、domain、path、secure 属性完全匹配才可以，而 JavaScript 没办法读取到这些属性，所以`cookie-ctrl`无法保证通过服务器端和用户自己通过 document.cookie 设置的 cookie 进行操作。


# 不可设置情况

* 未通过 cookies 设置的 cookie 将不能通过 cookies 设置，并给出警告
* 通过 cookies 设置的 cookie 再次修改时，只能修改 expires maxAge，如果修改其它属性，将不会成功并给出警告。