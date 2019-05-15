
const setLineData = (len) => {
  const datas = []
  for (let i = 0; i < len; i += 1){
    const data = {}
    data.T = i + "X"
    data.A = Math.floor(Math.random() * 100)
    data.B = Math.floor(Math.random() * 20)
    data.C = Math.floor(Math.random() * 5)
    // data.D = Math.floor(Math.random() * 100)
    // data.E = Math.floor(Math.random() * 100)
    // data.F = Math.floor(Math.random() * 100)
    // data.G = Math.floor(Math.random() * 100)
    // data.H = Math.floor(Math.random() * 100)
    datas.push(data)
  }
  return datas
}

export const lineData = setLineData(11);

const setBarData = (len) => {
  const datas = []
  for (let i = 0; i < len; i += 1){
    const data = {}
    data.data = Math.floor(Math.random() * 100)
    data.name = `事例${i}`
    datas.push(data)
  }
  return datas
}
export const barData = setBarData(10);

const setPieData = (len) => {
  const datas = []
  for (let i = 0; i < len; i += 1){
    const data = {}
    data.data = Math.floor(Math.random() * 100)
    data.name = `事例${i}`
    datas.push(data)
  }
  return datas
}
export const pieData = setPieData(5);


