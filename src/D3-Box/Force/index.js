import React, { Component } from 'react';
import * as d3 from 'd3';

class Force extends Component {

  componentDidMount() {
    const {data,layout} = this.props
    const width = layout.width
    const height = layout.height
    const padding = { top: 40,left:40, right:40,bottom:40}
    const svg = d3.select("#force")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    const force = svg.append("g")
    .attr("transform",`translate(${padding.top},${padding.left})`);
    let simulation = d3
    .forceSimulation() // 构建力导向图
    .force(
      'link',
      d3.forceLink()
        .id(function(d, i) {
          return i
        })
        .distance(function(d) {
          return d.value * 50
        })
    )
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2))

    // 初始化力导向图
    simulation.nodes(data.nodes).on('tick', ticked)
    simulation.force('link').links(data.edges)
      let z = d3.scaleOrdinal(d3.schemeCategory10)


      let link = force
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.edges)
      .enter()
      .append('line')
        .style('stroke',"#ddd")
    let linkText = force
      .append('g')
      .attr('class', 'link-text')
      .selectAll('text')
      .data(data.edges)
      .enter()
      .append('text')
      .text(function(d) {
        return d.relation
      })
    .style('fill-opacity',0)


      let node = force
      .append('g') // 画圆圈和文字
      .attr('class', 'nodes')
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g')
      .on('mouseover', function(d, i) {
        //显示连接线上的文字
        linkText.style('fill-opacity', function(edge) {
          if (edge.source === d || edge.target === d) {
            return 1
          } else {
            return 0
          }
        })
        //连接线加粗
        link
          .style('stroke-width', function(edge) {
            if (edge.source === d || edge.target === d) {
              return '2px'
            }
          })
          .style('stroke', function(edge) {
            if (edge.source === d || edge.target === d) {
              return '#000'
            } else {
              return '#ddd'
            }
          })
      })
      .on('mouseout', function(d, i) {
        //隐去连接线上的文字
        linkText.style('fill-opacity', function(edge) {
          // if (edge.source === d || edge.target === d) {
          // }
          return 0
        })
        //连接线减粗
        link
          .style('stroke-width', function(edge) {
            if (edge.source === d || edge.target === d) {
              return '1px'
            }
          })
          .style('stroke', function(edge) {
            // if (edge.source === d || edge.target === d) {
            // }
            return '#ddd'
          })
      })
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )
      node
      .append('circle')
      .attr('r', 5)
      .attr('fill', function(d, i) {
        return z(i)
      })
      node
      .append('text')
      .attr('fill', function(d, i) {
        return z(i)
      })
      .attr('y', -20)
      .attr('dy', '.71em')
      .text(function(d) {
        return d.name
      })

      function ticked() {
        // 力导向图变化函数，让力学图不断更新
        link
          .attr('x1', function(d) {
            return d.source.x
          })
          .attr('y1', function(d) {
            return d.source.y
          })
          .attr('x2', function(d) {
            return d.target.x
          })
          .attr('y2', function(d) {
            return d.target.y
          })
        linkText
          .attr('x', function(d) {
            return (d.source.x + d.target.x) / 2
          })
          .attr('y', function(d) {
            return (d.source.y + d.target.y) / 2
          })
        node.attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')'
        })
      }
      function dragstarted(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0.3).restart()
        }
        d.fx = d.x
        d.fy = d.y
      }

      function dragged(d) {
        d.fx = d3.event.x
        d.fy = d3.event.y
      }

      function dragended(d) {
        if (!d3.event.active) {
          simulation.alphaTarget(0)
        }
        d.fx = null
        d.fy = null
      }
  }
  render() {
    return (
      <div id="force"  style={{ display: "inline-block", position: "relative" }} >
      </div>
    );
  }
}
export default Force;
