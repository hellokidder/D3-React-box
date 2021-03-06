# D3_React_Box

## LineChart

### 属性：

- data(必填)
- axis
- layout
- line

### data（必填）

数据结构：数组嵌套对象，默认对象中第一个属性为X轴变量

```javascript
const data = [{T: "0X", A: 38, B: 2, C: 0},
{T: "1X", A: 59, B: 10, C: 4},
{T: "2X", A: 79, B: 14, C: 0},
{T: "3X", A: 15, B: 6, C: 3},
{T: "4X", A: 13, B: 19, C: 3},
{T: "5X", A: 83, B: 13, C: 3},
{T: "6X", A: 96, B: 6, C: 1},
{T: "7X", A: 74, B: 1, C: 1},
{T: "8X", A: 54, B: 16, C: 4},
{T: "9X", A: 75, B: 12, C: 3}]
```

### axis

数据结构：指定LineChart的x轴和y轴对应数据，没有配置默认数据第一个属性为X轴参数

```JavaScript
    const axis = {
      x: "T",
      y:["A", "B", "C"],
    }
```

### layout

数据结构：指定LineChart的配置，没有配置默认参数为下方代码

```JavaScript
    const layout = {
      width:1000,
      height: 500,
      tooltip: true,
      tooltipline: true,
      slider:false,
      legend:false,
      curve:false,//将折线转化成条柔和的曲线
    }
```

### line

数据结构： line属性可以对各个线条进行配置，没有配置的线条采用默认样式

```JavaScript
const line = [
      {
        name: "A",
        color: "#008ffa", // 线条颜色
        width: 2, // 线条宽度
        linecap: "square", // 线条端点 butt round square
        linejoin: "miter", // 折线转角 miter round bevel
        unit:"元" // tooltip 显示数据单位
      }, {
        name: "C",
        color: "#008ffa",
        width: 2,
        linecap: "square",
        linejoin: "round",
        unit:"元"
      }
    ]
```

## BarChart

### 属性

- data(必填)
- layout

### data(必填)

数据结构：数组嵌套对象，name为X轴变量

```javascript
const data =[{data: 24, name: "0X"},
{data: 47, name: "1X"},
{data: 17, name: "2X"},
{data: 14, name: "3X"},
{data: 29, name: "4X"},
{data: 33, name: "5X"},
{data: 29, name: "6X"},
{data: 21, name: "7X"},
{data: 64, name: "8X"},
{data: 56, name: "9X"}]
```

### layout

数据结构：指定Bar的配置，没有配置默认参数为下方代码

```JavaScript
    const layout = {
      width:1000,
      height: 500,
      tooltip: true,
      barwidth: 60 ,// 默认bandwidth()三分之一
    }
```

## PieChart

### 属性

- data(必填)
- layout

### data(必填)

数据结构：数组嵌套对象

```javascript
const data =[{data: 91, name: "事例0"}，
{data: 82, name: "事例3"}，
{data: 79, name: "事例2"}，
{data: 62, name: "事例1"}，
{data: 59, name: "事例4"}]
```

### layout

数据结构：指定pie的配置，没有配置默认参数为下方代码

```JavaScript
    const layout = {
      width:600,
      height: 400,
      legend:false,
    }
```
