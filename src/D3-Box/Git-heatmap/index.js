import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

function Heatmap({ data }) {

  useEffect(() => {
    console.log('heatmapdata', data);
    const width = 900
    const height = 400
    const padding = { top: 45, left: 20, right: 20, bottom: 40 };
    const color= ["#ebedf0","#c6e48b","#239a3b","#196127"]
    const month = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sup',
      'Oct',
      'Nov',
      'Dec',
    ];
    const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const nowTime = new Date();
    const nowMonth = nowTime.getMonth();
    const nowYear = nowTime.getFullYear();
    const everymonth = [];
    const summonth = [];
    for (let i = 0; i < 12; i += 1) {
      const a = new Date(nowYear - 1, nowMonth + 2 + i, 0);
      everymonth.push(a.getDate());
      if (i === 0) {
        summonth.push(a.getDate());
      } else {
        summonth.push(summonth[i - 1] + everymonth[i]);
      }
    }

    d3.select('#heatmapsvg')
      .selectAll('*')
      .remove();

      const tooltip = d3
      .select(`#heatmap-tooltip`)
      .style('position', 'absolute')
      .style('background-color', '#000000')
      .style('box-shadow', 'rgb(174, 174, 174) 0px 0px 10px')
      .style('border-radius', '3px')
      .style('padding', '10px 10px 6px 10px')
      .style('color', 'white')
      .style('font-size', '12px')
      .style('line-height', '20px')
      .style('visibility', 'hidden')
      .style('opacity', 0.8);

    const lastyear = new Date(nowYear - 1, nowMonth + 1, 1);
    const startTime = new Date(nowYear - 1, nowMonth + 1, 1 - lastyear.getDay());
    d3.select('#heatmapsvg')
      .attr('width', width)
      .attr('height', height);
    const rect = d3
      .select('#heatmapsvg')
      .append('g')
      .attr('width', 16 * 54)
      .attr('height', 16 * 7)
      .attr('transform', `translate(${padding.left + 4},${padding.top})`);
    const monthArr = []
    for (let i = 0; i < summonth[10] + nowTime.getDate() + lastyear.getDay(); i += 1) {
      rect
        .append('rect')
        .attr('y', () => {
          return (i % 7) * 16;
        })
        .attr('x', () => {
          return Math.floor(i / 7) * 16;
        })
        .attr('fill', '#ebedf0')
        .attr('width', 12)
        .attr('height', 12)
        .attr('id', () => {
          const setdata = new Date(startTime.getTime() + i * 24 * 60 * 60 * 1000);
          const dataArr = setdata
            .toLocaleString()
            .split(' ')[0]
            .split('/');
          if (i % 7 === 0 && dataArr[2] < 8) {
            monthArr.push((i / 7) * 16);
          }
          const tmp = dataArr.join('-');
          return `rect${tmp}`;
        })
        .on('mouseover', function rectmousein() {
          const id = this.getAttribute('id')
            .split('rect')[1]
            .split('-');
          if (id[1].length === 1) {
            id[1] = `0${id[1]}`;
          }
          if (id[2].length === 1) {
            id[2] = `0${id[2]}`;
          }
          const selectdate = id.join('-');
          let tooltiptext = `${selectdate}: 0 count`;
          for (let n = 0; n < data.length; n += 1) {
            if (selectdate === data[n].date) {
              tooltiptext = `${selectdate} : ${data[n].count} count`;
            }
          }
          const transX = this.getAttribute('x');
          const transY = this.getAttribute('y');
          const tool = document.getElementById(`heatmap-tooltip`);
          tooltip
            .text(tooltiptext)
            .style(
              'top',
              `${Number(transY) + (16 + 16 + 24 + 24) + padding.top - tool.offsetHeight - 10}px`
            );
          if (Number(transX) + tool.offsetWidth / 2 + 20 < width) {
            tooltip.style('left', `${Number(transX)}px`);
          }
          tooltip.style('visibility', 'visible');
        })
        .on('mouseout', function rectmouseout() {
          tooltip.style('visibility', 'hidden');
        });
      }
    const theweek = d3
      .select('#heatmapsvg')
      .append('g')
      .attr('transform', `translate(0,${padding.top})`);

    const weekColorScale = d3
      .scaleOrdinal()
      .domain(week)
      .range(['white', '#767676']);
    for (let i = 0; i < week.length; i += 1) {
      theweek
        .append('text')
        .text(week[i])
        .attr('fill', () => {
          return weekColorScale(week[i]);
        })
        .attr('font-size', 9)
        .attr('y', (i + 1) * 16 - 4);
    }
    const themonth = d3
      .select('#heatmapsvg')
      .append('g')
      .attr('transform', `translate(${padding.left+4},${padding.top-4})`);
    const monthScale = d3
      .scaleOrdinal()
      .domain(month)
      .range(monthArr);
    for (let i = 0; i < month.length; i += 1) {
      themonth
        .append('text')
        .text(() => {
          const tmp = (nowMonth + i + 1) <12 ? nowMonth + 1 + i: nowMonth + i-11
          return month[tmp]
        })
        .attr('fill','#767676')
        .attr('font-size', 10)
        .attr('y',-2)
        .attr('x', () => {
          return monthScale(i)
        });
    }
    const legend = d3.select('#heatmapsvg')
      .append('g')
      .attr('transform', `translate(${width-160},${padding.top+16 * 8+10})`);
    legend.append("text")
      .text("Less")
      .attr('fill','#586069')
      .attr('font-size', 10)
    const legendrect = legend.append("g")
    for (let i = 0; i < color.length; i += 1){
      legendrect.append("rect")
        .attr('fill', color[i])
        .attr('width', 12)
        .attr('height', 12)
        .attr('x', () => {
          return 30+ 16*i
        })
        .attr('y', -10)
    }

    const colorScale = d3.scaleThreshold()
      .domain([0, 50, 100])
      .range(color);
    legend.append("text")
      .text("More")
      .attr('fill','#586069')
      .attr('font-size', 11)
      .attr('x', 100);

    // for (let i = 0; i < data.length; i += 1){
    //   const dataArr = data[i].date.split("-")
    //   let tmp = ''
    //   for (let n = 0; n < dataArr.length; n += 1){
    //     tmp = `${Number(dataArr[0])}-${Number(dataArr[1])}-${Number(dataArr[2])}`
    //   }
    //   d3.select(`#rect${tmp}`)
    //     .attr("fill", () => {
    //       return colorScale(data[i].count)
    //     })
    // }

  }, [data]);

  return (
    <div style={{ height: '100%' }}>
      <svg id="heatmapsvg" />
    </div>
  );
}

export default Heatmap;
