
const setLineData = (len) => {
  const datas = []
  for (let i = 0; i < len; i += 1){
    const data = {}
    data.X = Math.floor(Math.random() * 100) + "X"
    data.A = Math.floor(Math.random() * 100)
    data.B = Math.floor(Math.random() * 100)
    data.C = Math.floor(Math.random() * 100)
    datas.push(data)
  }
  return datas
}

export const lineData = setLineData(12);

export const lineConfig = {
  width:1000,
  height: 500,
  padding: { top: 40, left: 45, right: 40, bottom: 40 },
  color: ["#008ffa", "#00c061", "#EE2764", "#ffcb3c", "#223670"]
}
