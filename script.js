//  This file contains the Javascript functions necessary for creating the 4 graphs:

//-----------------------------------------------

// Index:
  // 1.Histogram
  // 2. Line graph
  // 3. Doughnut chart 1
  // 4. Doughnut chart 2
  
 //-----------------------------------------------

// 1.Histogram

 function histogram(){
    let histo =  document.getElementById('histogram').getContext('2d');

    //  Global options
    Chart.defaults.global.defaultFontFamily= 'Montserrat';
    Chart.defaults.global.defaultFontSize= 10;
    Chart.defaults.global.defaultFontColor= '#68696b';

    // Rounded bars: draws a shape on top
    Chart.elements.Rectangle.prototype.draw = function ReDraw() {
        const { ctx } = this._chart;
        const vm = this._view;
        let left; let right; let top; let bottom; let signX; let signY; let borderSkipped
        let { borderWidth } = vm;
      
        // If radius is less than 0 or is large enough to cause drawing errors a max
        // radius is imposed. If cornerRadius is not defined set it to 0.
        let { cornerRadius } = this._chart.config.options;
      
        if (cornerRadius < 0) { cornerRadius = 0 }
        if (typeof cornerRadius === 'undefined') { cornerRadius = 0 }
      
        if (!vm.horizontal) {
          left = vm.x - vm.width / 2;
          right = vm.x + vm.width / 2;
          top = vm.y;
          bottom = vm.base;
          signX = 1;
          signY = bottom > top ? 1 : -1;
          borderSkipped = vm.borderSkipped || 'bottom';
        }
      
        // Canvas doesn't allow us to stroke inside the width so we can
        // adjust the sizes to fit if we're setting a stroke on the line
        if (borderWidth) {
          // borderWidth shold be less than bar width and bar height.
          const barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
          borderWidth = borderWidth > barSize ? barSize : borderWidth;
          const halfStroke = borderWidth / 2;
          // Adjust borderWidth when bar top position is near vm.base(zero).
          const borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
          const borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
          const borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
          const borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);
          // not become a vertical line?
          if (borderLeft !== borderRight) {
            top = borderTop;
            bottom = borderBottom;
          }
          // not become a horizontal line?
          if (borderTop !== borderBottom) {
            left = borderLeft;
            right = borderRight;
          }
        }
      
        ctx.beginPath();
        ctx.fillStyle = vm.backgroundColor;
        ctx.strokeStyle = vm.borderColor;
        ctx.lineWidth = borderWidth;
      
        // Corner points, from bottom-left to bottom-right clockwise
        // | 1 2 |
        // | 0 3 |
        const corners = [
          [left, bottom],
          [left, top],
          [right, top],
          [right, bottom],
        ]
      
        // Find first (starting) corner with fallback to 'bottom'
        const borders = ['bottom', 'left', 'top', 'right'];
        let startCorner = borders.indexOf(borderSkipped, 0)
        if (startCorner === -1) {
          startCorner = 0;
        }
      
        function cornerAt(index) {
          return corners[(startCorner + index) % 4];
        }
      
        // Draw rectangle from 'startCorner'
        let corner = cornerAt(0);
        ctx.moveTo(corner[0], corner[1]);
      
        for (let i = 1; i < 4; i++) {
          corner = cornerAt(i);
          let nextCornerId = i + 1;
          if (nextCornerId === 4) {
            nextCornerId = 0;
          }
      
          const width = corners[2][0] - corners[1][0];
          const height = corners[0][1] - corners[1][1];
          const x = corners[1][0];
          const y = corners[1][1];
      
          let radius = cornerRadius;
      
          // Fix radius being too large
          if (radius > Math.abs(height) / 1.5) {
            radius = Math.floor(Math.abs(height) / 1.5);
          }
          if (radius > Math.abs(width) / 1.5) {
            radius = Math.floor(Math.abs(width) / 1.5);
          }
      
          if (height < 0) {
            // Negative values in a standard bar chart
            const x_tl = x; const x_tr = x + width;
            const y_tl = y + height; const y_tr = y + height;
      
            const x_bl = x; const x_br = x + width;
            const y_bl = y; const y_br = y;
      
            // Draw
            ctx.moveTo(x_bl + radius, y_bl);
            ctx.lineTo(x_br - radius, y_br);
            ctx.quadraticCurveTo(x_br, y_br, x_br, y_br - radius);
            ctx.lineTo(x_tr, y_tr + radius);
            ctx.quadraticCurveTo(x_tr, y_tr, x_tr - radius, y_tr);
            ctx.lineTo(x_tl + radius, y_tl);
            ctx.quadraticCurveTo(x_tl, y_tl, x_tl, y_tl + radius);
            ctx.lineTo(x_bl, y_bl - radius);
            ctx.quadraticCurveTo(x_bl, y_bl, x_bl + radius, y_bl);
          } else {
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
          }
        }
      
        ctx.fill();
        if (borderWidth) {
          ctx.stroke();
        }
      }
       
    // Create colorgradient for bars
    var colorGrad =  histo.createLinearGradient(0,0,0, 130);
    colorGrad.addColorStop(0.7, 'rgba(111, 106, 199, 0.8)');
    colorGrad.addColorStop(0.8, 'rgba(103,87,167,0.6)');
    colorGrad.addColorStop(0.9, 'rgba(114, 61, 123, 0.6');
    colorGrad.addColorStop(1, 'rgba(42, 31, 60, 0.5)');
    
    let barChart = new Chart(histo, {
          type: 'bar', //bar, pie, line, etc
          data: {
                 labels: ['Jan','','','Feb','','','Mar','','','','Apr','','','','May','','','','Jun','','','','Jul','','','','Aug','','','','Sep','','Oct','','Nov','','Dec'],
                 datasets:[{
                            data: [52,35,52,47,27,47,74,55,35,55,35,52,47,27,47,74,55,35,55,35,52,47,27,47,74,55,35,55,35,52,47,27,47,74,55,35,85],
                            backgroundColor: colorGrad,
                            barPercentage: 0.6,
                            }]
                },
          options: {
                    legend:{display: false},
                    maintainAspectRatio: false,
                    cornerRadius: 8,
                    scaleShowVerticalLines: false,
                    scales:{
                      xAxes: [{
                        display: true,
                        ticks: {
                            minRotation: 0,
                            maxRotation: 0,
                            padding: 10,
                        },
                        gridLines: {
                          display: true ,
                          drawBorder: true,
                          drawOnChartArea: false,
                          beginAtZero: true,
                          color: "#68696b",
                          lineWidth: 1.5,
                          drawTicks: false
                        }
                    }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                stepSize: 20,
                                min: 0,
                                max: 100,
                                padding: 10
                            },
                            gridLines: {
                              display: true ,
                              color: "#68696b",
                              drawBorder: false,
                              drawTicks: false
                            }
                        }]
                    },
                    }  
      });
 }

//----------------------------------------------------

// 2.Line graph

function linear(){
  
  // Array of data to be plotted
  let linear =  document.getElementById('linear-graph').getContext('2d');

  //  Global options
  Chart.defaults.global.defaultFontFamily= 'Montserrat';
  Chart.defaults.global.defaultFontSize= 10;
  Chart.defaults.global.defaultFontColor= '#68696b';
 
  // Create colorgradient
  var colorGradgreen =  linear.createLinearGradient(0,0,0,150);
  colorGradgreen.addColorStop(0, 'rgba(69, 160, 26, 1)');
  colorGradgreen.addColorStop(1, 'rgba(69, 160, 26, 0)');

  var colorGradred =  linear.createLinearGradient(0,0,0,200);
  colorGradred.addColorStop(0.5, 'rgba(240, 2, 2, 1)');
  colorGradred.addColorStop(1, 'rgba(240, 2, 2, 0)'); 

  Chart.plugins.register({
    beforeDraw: function(c) {
       var legends = c.legend.legendItems;
       legends.forEach(function(e) {
          e.fillStyle = 'white';
       });
    }
 });

  
  let linearChart = new Chart(linear, {
        type: 'line', //bar, pie, line, etc
        data: {
               labels: ['Jan1','Jan8','Jan15','Feb1','Feb8','Feb15', 'Mar1','Mar8','Mar15','Apr1','Apr8','Apr15'],
               datasets:[{
                          data: [72,55,92,77,47,47,74,55,86,55,65,82,47,57,67,94,95,35,55,65,52,57,47,74],
                          lineTension: 0,
                          label: 'correct answers',
                          borderColor: '#4ec116',
                          borderWidth: 0,
                          backgroundColor: colorGradgreen,
                          pointBackgroundColor: 'white',
                          pointBorderColor: 'rgb(0, 135, 203)',
                          },
                          {
                            data: [22, 15, 34, 28, 10, 30, 49, 39, 23, 41, 16, 36, 29, 15, 31, 56, 40, 23, 34, 18, 30, 7, 27, 54],
                            lineTension: 0,
                            label: 'wrong answers',
                            borderColor: 'rgb(240, 2, 2)',
                            borderWidth: 1,
                            backgroundColor: colorGradred,
                            pointBackgroundColor: 'white',
                            pointBorderColor: 'rgb(163, 45, 33)'
                            }                    
                        ]
              },
        options: {
                  legend:{
                    display: false, 
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 4,
                    }
                  },
                  maintainAspectRatio: false,
                  scaleShowVerticalLines: true,
                    scales:{
                      xAxes: [{
                        display: true,
                        ticks: {
                            minRotation: 0,
                            maxRotation: 0,
                            padding: 10,
                        },
                        gridLines: {
                          display: true ,
                          drawBorder: true,
                          drawOnChartArea: false,
                          beginAtZero: true,
                          color: "rgba(104, 105,107, 1)",
                          lineWidth: 1.5,
                          drawTicks: false
                        }
                    }],
                        yAxes: [{
                            display: true,
                            ticks: {
                                stepSize: 20,
                                min: 0,
                                max: 100,
                                padding: 10
                            },
                            gridLines: {
                              display: true ,
                              color: "rgba(104, 105,107, 1)",
                              drawBorder: true,
                              drawOnChartArea: false,
                              drawTicks: false
                            }
                        }]
                    },
                    }  
    });
}

//-----------------------------------------------------
// 3.Doughnut chart 1

var draw = Chart.controllers.doughnut.prototype.draw;
Chart.controllers.doughnut = Chart.controllers.doughnut.extend({
draw: function() {
    draw.apply(this, arguments);
    let ctx = this.chart.chart.ctx;
    let _fill = ctx.fill;
    ctx.fill = function() {
        ctx.save();
        ctx.shadowColor = 'blue';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        _fill.apply(this, arguments)
        ctx.restore();
    }
}
});

function doughnut(){
  
  // Array of data to be plotted
  let doughnut =  document.querySelector('.doughnut-graph').getContext('2d');

  //  Global options
  Chart.defaults.global.defaultFontFamily= 'Montserrat';
  Chart.defaults.global.defaultFontSize= 10;
  Chart.defaults.global.defaultFontColor= '#68696b';
  Chart.defaults.RoundedDoughnut    = Chart.helpers.clone(Chart.defaults.doughnut);
Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
    draw: function(ease) {
        var ctx           = this.chart.ctx;
        var easingDecimal = ease || 1;
        var arcs          = this.getMeta().data;
        Chart.helpers.each(arcs, function(arc, i) {
            arc.transition(easingDecimal).draw();

            var pArc   = arcs[i === 0 ? arcs.length - 1 : i - 1];
            var pColor = pArc._view.backgroundColor;

            var vm         = arc._view;
            var radius     = (vm.outerRadius + vm.innerRadius) / 2;
            var thickness  = (vm.outerRadius - vm.innerRadius) / 2;
            var startAngle = Math.PI - vm.startAngle - Math.PI / 2;
            var angle      = Math.PI - vm.endAngle - Math.PI / 2;

            ctx.save();
            ctx.translate(vm.x, vm.y);

            ctx.fillStyle = i === 0 ? vm.backgroundColor : pColor;
            ctx.beginPath();
            ctx.arc(radius * Math.sin(startAngle), radius * Math.cos(startAngle), thickness, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = vm.backgroundColor;
            ctx.beginPath();
            ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
            ctx.fill();

            ctx.restore();
        });
    }
});

 
  // Add box-shadow around chart
  var draw = Chart.controllers.doughnut.prototype.draw;
  Chart.controllers.doughnut = Chart.controllers.doughnut.extend({
  draw: function() {
      draw.apply(this, arguments);
      let ctx = this.chart.chart.ctx;
      let _fill = ctx.fill;
      ctx.fill = function() {
          ctx.save();
          ctx.shadowColor = '#4791ff';
          ctx.shadowBlur = 25;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          _fill.apply(this, arguments)
          ctx.restore();
      }
  }
  });

  // Plugin for adding text in the middle
  Chart.pluginService.register({
    beforeDraw: function(chart) {
      if (chart.config.options.elements.center) {
        // Get ctx from string
        var ctx = chart.chart.ctx;
  
        // Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Montserrat';
        var txt = centerConfig.text;
        var color = centerConfig.color || '#424d78';
        var maxFontSize = centerConfig.maxFontSize || 75;
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
        // Start with a base font of 30px
        ctx.font = "30px " + fontStyle;
  
        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  
        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);
  
        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
        var minFontSize = centerConfig.minFontSize;
        var lineHeight = centerConfig.lineHeight || 25;
        var wrapText = false;
  
        if (minFontSize === undefined) {
          minFontSize = 20;
        }
  
        if (minFontSize && fontSizeToUse < minFontSize) {
          fontSizeToUse = minFontSize;
          wrapText = true;
        }
  
        // Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;
  
        if (!wrapText) {
          ctx.fillText(txt, centerX, centerY);
          return;
        }
  
        var words = txt.split(' ');
        var line = '';
        var lines = [];
  
        // Break words up into multiple lines if necessary
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > elementWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
  
        // Move the center up depending on line height and number of lines
        centerY -= (lines.length / 2) * lineHeight;
  
        for (var n = 0; n < lines.length; n++) {
          ctx.fillText(lines[n], centerX, centerY);
          centerY += lineHeight;
        }
        //Draw text in center
        ctx.fillText(line, centerX, centerY);
      }
    }
  });

  let doughnutChart = new Chart(doughnut, {
        type: 'RoundedDoughnut', //bar, pie, line, etc
        data: {
               datasets:[{
                          data: [60,40],
                          backgroundColor: ['#4791ff','#02bc77'],
                          borderWidth: 0,
                          borderAlign: 'inner',
                          }], 
               labels: ['Credit points gained','Actual rank', 'Next rank']                    
              },
        options: {
                    cutoutPercentage: 75,
                    responsive: false,
                    rotation: (-0.5 * Math.PI) + (145/180 * Math.PI),
                    legend: {
                      display: false,
                      position: 'bottom'
                 },
                 elements: {
                  center: {
                    text: '100',
                    color: 'white',
                    backgroundColor: '#424d78',
                    fontStyle: 'Arial', // Default is Arial
                    sidePadding: 20, // Default is 20 (as a percentage)
                    maxFontSize: 50,// Default is 20 (in px), set to false and text will not wrap.
                    lineHeight: 25 // Default is 25 (in px), used for when text wraps
                  },
                  plugins: {
			datalabels: {
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				borderColor: '#ffffff',
				color: function (context) {
					return context.dataset.backgroundColor;
				},
				font: function (context) {
					var w = context.chart.width;
					return {
						size: w < 512 ? 18 : 20
					}
				},
				align: 'start',
				anchor: 'start',
				offset: 10,
				borderRadius: 4,
				borderWidth: 1,
				formatter: function (value, context) {
					var i = context.dataIndex;
					var len = context.dataset.data.length - 1;
					if (i == len) {
						return null;
					}
					return value + ' mph';
				}
			}
		},
                }
                }});
    }

//-----------------------------------------------------
// 4.Doughnut chart 2

function doughnut2(){
  
  // Array of data to be plotted
  let doughnut2 =  document.querySelector('.doughnut-graph2').getContext('2d');

  //  Global options
  Chart.defaults.global.defaultFontFamily= 'Montserrat';
  Chart.defaults.global.defaultFontSize= 10;
  Chart.defaults.global.defaultFontColor= '#68696b';

  // Rounded corners
  Chart.defaults.RoundedDoughnut    = Chart.helpers.clone(Chart.defaults.doughnut);
  Chart.controllers.RoundedDoughnut = Chart.controllers.doughnut.extend({
    draw: function(ease) {
        var ctx           = this.chart.ctx;
        var easingDecimal = ease || 1;
        var arcs          = this.getMeta().data;
        Chart.helpers.each(arcs, function(arc, i) {
            arc.transition(easingDecimal).draw();

            var pArc   = arcs[i === 0 ? arcs.length - 1 : i - 1];
            var pColor = pArc._view.backgroundColor;

            var vm         = arc._view;
            var radius     = (vm.outerRadius + vm.innerRadius) / 2;
            var thickness  = (vm.outerRadius - vm.innerRadius) / 2;
            var startAngle = Math.PI - vm.startAngle - Math.PI / 2;
            var angle      = Math.PI - vm.endAngle - Math.PI / 2;

            ctx.save();
            ctx.translate(vm.x, vm.y);

            ctx.fillStyle = i === 0 ? vm.backgroundColor : pColor;
            ctx.beginPath();
            ctx.arc(radius * Math.sin(startAngle), radius * Math.cos(startAngle), thickness, 0, 2 * Math.PI);
            ctx.fill();

            ctx.fillStyle = vm.backgroundColor;
            ctx.beginPath();
            ctx.arc(radius * Math.sin(angle), radius * Math.cos(angle), thickness, 0, 2 * Math.PI);
            ctx.fill();

            ctx.restore();
        });
    }
});

 
  // Add box-shadow around chart
  var draw = Chart.controllers.doughnut.prototype.draw;
  Chart.controllers.doughnut = Chart.controllers.doughnut.extend({
  draw: function() {
      draw.apply(this, arguments);
      let ctx = this.chart.chart.ctx;
      let _fill = ctx.fill;
      ctx.fill = function() {
          ctx.save();
          ctx.shadowColor = '#4791ff';
          ctx.shadowBlur = 25;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          _fill.apply(this, arguments)
          ctx.restore();
      }
  }
  });

  // Plugin for adding text in the middle
  Chart.pluginService.register({
    beforeDraw: function(chart) {
      if (chart.config.options.elements.center) {
        // Get ctx from string
        var ctx = chart.chart.ctx;
  
        // Get options from the center object in options
        var centerConfig = chart.config.options.elements.center;
        var fontStyle = centerConfig.fontStyle || 'Arial';
        var txt = centerConfig.text;
        var backgroundColor = centerConfig.backgroundColor || '#424d78';
        var color = centerConfig.color || '#424d78';
        var maxFontSize = centerConfig.maxFontSize || 75;
        var sidePadding = centerConfig.sidePadding || 20;
        var sidePaddingCalculated = (sidePadding / 100) * (chart.innerRadius * 2)
        // Start with a base font of 30px
        ctx.font = "30px " + fontStyle;
  
        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = (chart.innerRadius * 2) - sidePaddingCalculated;
  
        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = (chart.innerRadius * 2);
  
        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, maxFontSize);
        var minFontSize = centerConfig.minFontSize;
        var lineHeight = centerConfig.lineHeight || 25;
        var wrapText = false;
  
        if (minFontSize === undefined) {
          minFontSize = 20;
        }
  
        if (minFontSize && fontSizeToUse < minFontSize) {
          fontSizeToUse = minFontSize;
          wrapText = true;
        }
  
        // Set font settings to draw it correctly.
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        var centerX = ((chart.chartArea.left + chart.chartArea.right) / 2);
        var centerY = ((chart.chartArea.top + chart.chartArea.bottom) / 2);
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;
  
        if (!wrapText) {
          ctx.fillText(txt, centerX, centerY);
          return;
        }
  
        var words = txt.split(' ');
        var line = '';
        var lines = [];
  
        // Break words up into multiple lines if necessary
        for (var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = ctx.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > elementWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
  
        // Move the center up depending on line height and number of lines
        centerY -= (lines.length / 2) * lineHeight;
  
        for (var n = 0; n < lines.length; n++) {
          ctx.fillText(lines[n], centerX, centerY);
          centerY += lineHeight;
        }
        //Draw text in center
        ctx.fillText(line, centerX, centerY);
      }
    }
  });


  let doughnutChart = new Chart(doughnut2, {
        type: 'RoundedDoughnut', //bar, pie, line, etc
        data: {
               datasets:[{
                          data: [60,40],
                          backgroundColor: ['#4791ff','#02bc77'],
                          borderWidth: 0,
                          borderAlign: 'inner',
                          }], 
               labels: ['Credit points gained','Actual rank', 'Next rank']                    
              },
        options: {
                    cutoutPercentage: 75,
                    responsive: false,
                    rotation: (-0.5 * Math.PI) + (145/180 * Math.PI),
                    legend: {
                      display: false,
                      position: 'bottom'
                 },
                 elements: {
                  center: {
                    text: '100',
                    color: 'white',
                    backgroundColor: '#424d78',
                    fontStyle: 'Arial', // Default is Arial
                    sidePadding: 20, // Default is 20 (as a percentage)
                    maxFontSize: 50,// Default is 20 (in px), set to false and text will not wrap.
                    lineHeight: 25 // Default is 25 (in px), used for when text wraps
                  },
                  plugins: {
			datalabels: {
				backgroundColor: 'rgba(0, 0, 0, 0.7)',
				borderColor: '#ffffff',
				color: function (context) {
					return context.dataset.backgroundColor;
				},
				font: function (context) {
					var w = context.chart.width;
					return {
						size: w < 512 ? 18 : 20
					}
				},
				align: 'start',
				anchor: 'start',
				offset: 10,
				borderRadius: 4,
				borderWidth: 1,
				formatter: function (value, context) {
					var i = context.dataIndex;
					var len = context.dataset.data.length - 1;
					if (i == len) {
						return null;
					}
					return value + ' mph';
				}
			}
		},
                }
                }});
    }


