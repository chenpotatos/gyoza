---
title: Read The Super Tiny Compiler Code
date: 2024-05-30T07:25:58.872Z
tags: [code, 技术]
category: 编译
comments: false
draft: false
---

今天看到这个star个数超多的，尝试读一读这个源码，也试试去了解。

xxxxxxxxxx // 删除本地分支git branch -d localBranchName​// 删除远程分支git push origin --delete remoteBranchNamebash

它的一个主要功能是用来将`Lisp`风格的代码，转换成`C`风格的代码。

```js
// 该程序包含这几个方法函数
tokenizer, // 词法解析函数

parser, // 解析器

traverser,

transformer,

codeGenerator,

compiler,
```

## tokenizer

该函数是一个词法分析器，用于将输入的字符串分解成一系列的（tokens）,方便后续的处理。

将输入的字符串按照以下四个规则分解成以下几种类型。

```js
function tokenizer(input) {
  let current = 0;
  let tokens = [];
  while (current < input.length) {
    let char = input[current];

    // 1.括号：开括号“（”和闭括号“）”
    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '(',
      });
      current++;
      continue;
    }

    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')',
      });
      current++;
      continue;
    }
     2.忽略空白字符串

    let WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    3. 这里用来获取连续的数字字符，连续的数字字符构成数字token
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {

      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'number', value });

      continue;
    }

    4.获取被双引号包裹的文本内容，被标记为string类型值为字符串内容
    if (char === '"') {
      let value = '';
      char = input[++current];
      while (char !== '"') {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: 'string', value });
      continue;
    }

    5.用来获取连续的字符，然后标记为函数名
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'name', value });
      continue;
    }
    throw new TypeError('I dont know what this character is: ' + char);
  }
  return tokens;
}
```

## parser

这里parser的功能就是用来转换成抽象语法树（AST）

```js
let ast = {
  type: 'Program',
  body: [],
}
// 这是初始值
```

在该`parser`中，最重要的是`walk`这个函数，它的作用是遍历`tokenizer`生成的`tokens`。

定义了

- NumberLiteral
- StringLiteral
- CallExpression

这三种类型

使用递归来处理嵌套的调用表达式

```js
if (token.type === 'paren' && token.value === '(') {
  token = tokens[++current]
  let node = {
    type: 'CallExpression',
    name: token.value,
    params: [],
  }
  token = tokens[++current]
  while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
    node.params.push(walk())
    token = tokens[current]
  }
  current++
  return node
}
```

以上代码我不太理解这段

```js
while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
  node.params.push(walk())
  token = tokens[current]
}
```

这部分是一个逻辑表达式，用于判断是否继续循环解析函数参数。让我们分解一下：

1. `(token.type !== 'paren')`: 这部分检查当前 token 的类型是否不是 'paren'。如果不是 'paren'，则意味着我们尚未到达函数参数列表的结束括号 ')'，因此需要继续解析参数。这样做是为了处理可能的函数嵌套以及其他可能的语法结构。
2. `||`：这是逻辑或运算符，意味着只要两者中有一个条件为真，整个表达式就为真。
3. `(token.type === 'paren' && token.value !== ')')`: 这部分检查当前 token 的类型是否是 'paren' 且其值不等于 ')'。这意味着当前 token 是一个左括号 '('，而不是右括号 ')'，因此函数参数列表尚未结束，需要继续解析参数。

来源：chatgpt

```js
function parser(tokens) {
  let current = 0

  function walk() {
    let token = tokens[current]
    if (token.type === 'number') {
      current++

      return {
        type: 'NumberLiteral',
        value: token.value,
      }
    }

    if (token.type === 'string') {
      current++

      return {
        type: 'StringLiteral',
        value: token.value,
      }
    }

    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current]

      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      }
      token = tokens[++current]
      while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
        node.params.push(walk())
        token = tokens[current]
      }
      current++
      return node
    }
    throw new TypeError(token.type)
  }
  let ast = {
    type: 'Program',
    body: [],
  }
  while (current < tokens.length) {
    ast.body.push(walk())
  }
  return ast
}
```

## traverser

`traverser`用来访问AST

内部定义了`traverseArray`和`traverseNode`两个函数。

1. `traverseArray` 函数用于遍历一个节点数组，并对数组中的每个节点调用 `traverseNode` 函数。

```js
function traverseArray(array, parent) {
  array.forEach((child) => {
    traverseNode(child, parent)
  })
}
```

1. `traverseNode` 函数是实际的遍历函数。它接受两个参数：`node`（当前要遍历的节点）和 `parent`（该节点的父节点）

```js
// traverseNode 函数是实际的遍历函数。它接受两个参数：node（当前要遍历的节点）和 parent（该节点的父节点）。
function traverseNode(node, parent) {
  // 首先，它检查 visitor 对象中是否存在当前节点类型 node.type 对应的方法集合 methods。
  let methods = visitor[node.type]

  // 如果存在 methods，并且其中包含 enter 方法，那么调用 enter 方法，并传入当前节点 node 和其父节点 parent。
  if (methods && methods.enter) {
    methods.enter(node, parent)
  }

  // 使用 switch 语句根据当前节点的类型进行不同的处理：
  switch (node.type) {
    // 如果节点类型是 'Program'，则遍历其 body 属性中的子节点数组。
    case 'Program':
      traverseArray(node.body, node)
      break
    // 如果节点类型是 'CallExpression'，则遍历其 params 属性中的子节点数组。
    case 'CallExpression':
      traverseArray(node.params, node)
      break
    // 如果节点类型是 'NumberLiteral' 或 'StringLiteral'，则不执行任何操作。
    case 'NumberLiteral':

    // 如果节点类型不在上述列举的类型中，则抛出 TypeError，表示不支持的节点类型。
    case 'StringLiteral':
      break
    default:
      throw new TypeError(node.type)
  }
  // 如果存在 methods，并且其中包含 exit 方法，那么在处理完当前节点后，调用 exit 方法，并传入当前节点 node 和其父节点 parent。
  if (methods && methods.exit) {
    // 最后，调用 traverseNode 函数，传入 AST 的根节点 ast 和 null，表示根节点没有父节点。
    methods.exit(node, parent)
  }
}
```

**traverser总览**

```js
function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach((child) => {
      traverseNode(child, parent)
    })
  }

  function traverseNode(node, parent) {
    let methods = visitor[node.type]

    if (methods && methods.enter) {
      methods.enter(node, parent)
    }
    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node)
        break

      case 'CallExpression':
        traverseArray(node.params, node)
        break

      case 'NumberLiteral':

      case 'StringLiteral':
        break
      default:
        throw new TypeError(node.type)
    }
    if (methods && methods.exit) {
      methods.exit(node, parent)
    }
  }
  traverseNode(ast, null)
}
```

## transformer

这段代码是一个 AST 转换器 `transformer` 函数，它接受一个 AST（抽象语法树）作为输入，并返回一个经过转换后的新 AST。

1. 在 `transformer` 函数内部，首先创建了一个新的 AST 对象 `newAst`，它具有类型 `'Program'`，并且没有任何节点，即 `body` 属性是一个空数组。

```js
let newAst = {
  type: 'Program',
  body: [],
}
```

1. 接着，将原始的 AST 的 `_context` 属性设置为新 AST 的 `body` 属性。这样做是为了在遍历原始 AST 的过程中，能够方便地向新 AST 中添加节点。

```js
ast._context = newAst.body
```

1. 调用 `traverser` 函数遍历原始 AST，同时传入了一个对象作为第二个参数，这个对象包含了对不同类型节点的处理方法。

```js
traverser(ast, {
  // 对于 'NumberLiteral' 和 'StringLiteral' 类型的节点，分别定义了处理方法。这些处理方法会在遍历到相应节点时被调用，将相应类型的节点转换成新的节点并添加到新的 AST 中。
  NumberLiteral: {
    enter(node, parent) {
      parent._context.push({
        type: 'NumberLiteral',
        value: node.value,
      })
    },
  },
  // 对于 'CallExpression' 类型的节点，定义了另外一个处理方法。在进入 'CallExpression' 节点时，会创建一个新的表达式对象 expression，并设置它的类型为 'CallExpression'，设置 callee 属性为一个标识符对象，表示函数名，然后初始化 arguments 属性为一个空数组，用于存储函数参数。
  StringLiteral: {
    enter(node, parent) {
      parent._context.push({
        type: 'StringLiteral',
        value: node.value,
      })
    },
  },
  // 如果当前节点的父节点不是 'CallExpression'，那么将新创建的 expression 对象包装成一个 'ExpressionStatement' 节点。这是因为在语法树中，函数调用可能出现在语句的上下文中，所以需要进行适当的调整。
  CallExpression: {
    enter(node, parent) {
      let expression = {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: node.name,
        },
        arguments: [],
      }
      node._context = expression.arguments
      if (parent.type !== 'CallExpression') {
        expression = {
          type: 'ExpressionStatement',
          expression: expression,
        }
      }
      // 最后，在处理完当前节点后，将新创建的表达式对象添加到父节点的 _context 中。
      parent._context.push(expression)
    },
  },
})
```

**代码总览**

```js
function transformer(ast) {
  let newAst = {
    type: 'Program',
    body: [],
  }
  ast._context = newAst.body
  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'NumberLiteral',
          value: node.value,
        })
      },
    },
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: 'StringLiteral',
          value: node.value,
        })
      },
    },
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: 'CallExpression',
          callee: {
            type: 'Identifier',
            name: node.name,
          },
          arguments: [],
        }
        node._context = expression.arguments
        if (parent.type !== 'CallExpression') {
          expression = {
            type: 'ExpressionStatement',
            expression: expression,
          }
        }
        parent._context.push(expression)
      },
    },
  })
  return newAst
}
```

## codeGenerator

这段代码是一个用于生成代码的函数 `codeGenerator`，它接受一个 AST 节点作为输入，并返回相应的代码字符串。

```js
function codeGenerator(node) {
  switch (node.type) {
    // 如果节点类型是 'Program'，则遍历 body 数组中的每个子节点，并对每个子节点递归调用 codeGenerator 函数，然后使用 join('\n') 将所有生成的代码字符串连接起来，并以换行符分隔。
    case 'Program':
      return node.body.map(codeGenerator).join('\n')

    // 如果节点类型是 'ExpressionStatement'，则递归调用 codeGenerator 函数生成表达式的代码字符串，并在最后加上一个分号。
    case 'ExpressionStatement':
      return (
        codeGenerator(node.expression) + ';' // << (...because we like to code the *correct* way)
      )

    // 如果节点类型是 'CallExpression'，则生成调用表达式的代码字符串。首先生成调用函数的代码字符串，然后在括号内生成参数的代码字符串，参数之间用逗号分隔。
    case 'CallExpression':
      return codeGenerator(node.callee) + '(' + node.arguments.map(codeGenerator).join(', ') + ')'
    // 如果节点类型是 'Identifier'，则直接返回标识符的名称。
    case 'Identifier':
      return node.name

    // 如果节点类型是 'NumberLiteral'，则直接返回数值字面量的值。
    case 'NumberLiteral':
      return node.value

    // 如果节点类型是 'StringLiteral'，则返回带有双引号的字符串字面量。
    case 'StringLiteral':
      return '"' + node.value + '"'
    // 如果节点类型不是以上任何一种，则抛出 TypeError。
    default:
      throw new TypeError(node.type)
  }
}
```

## compiler

下面代码的作用是将输入的字符串经过词法分析、语法分析、转换和代码生成等步骤之后，返回一个编译后的代码字符串。

```js
function compiler(input) {
  // tokenizer(input): 调用 tokenizer 函数对输入的字符串进行词法分析，将其分解成一个个的标记（tokens）。
  let tokens = tokenizer(input)

  // parser(tokens): 将词法分析得到的标记数组作为输入，调用 parser 函数对这些标记进行语法分析，构建出对应的抽象语法树（AST）。
  let ast = parser(tokens)

  // transformer(ast): 将语法分析得到的抽象语法树作为输入，调用 transformer 函数进行转换，生成一个新的经过处理的 AST。
  let newAst = transformer(ast)

  // codeGenerator(newAst): 将经过转换后的新 AST 作为输入，调用 codeGenerator 函数生成对应的代码字符串。
  let output = codeGenerator(newAst)
  // and simply return the output!
  return output
}
```
