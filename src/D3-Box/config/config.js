
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

export const lineData = setLineData(10);

export const lineConfig = {
  width:1000,
  height: 500,
  padding: { top: 40, left: 45, right: 40, bottom: 40 },
  color: ["#008ffa", "#00c061", "#EE2764", "#ffcb3c", "#223670"],
  dotable: false,
  tooltipable: true,
  tooltiplineable: true,
  slider:true,
  legend:true,
  line : {
    width: 2,
    linecap: "round",
    linejoin:"round",
    unit:""
    },
  axis: {
    axisX: {
      path: "#dddddd",
      pathwidth: 2,
      tick: "#dddddd",
      tickwidth: 1,
      text: "#585858"
    },
    axisY: {
      path: "white",
      pathwidth: 2,
      tick: "#dddddd",
      tickwidth: 1,
      text: "#585858"
    }
  }
}
