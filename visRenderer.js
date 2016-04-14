/**
 * Created by arjun010 on 2/28/16.
 */


function onlyUnique(value, index, self) { // This function returns an array with unique elements
    return self.indexOf(value) === index;
}

(function() {
    visRenderer = {};

    var histogramTooltip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        return d.y;
    });

    var barTooltip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        var displayStr = "";
        displayStr += "<strong>Label:</strong> <span style='color:gold'>" + d.label + "</span><br/>";
        displayStr += "<strong>Value:</strong> <span style='color:gold'>" + d.value + "</span>";
        return displayStr;
    });

    var scatterplotTooltip = d3.tip().attr('class', 'd3-tip').html(function(d) {
        var displayStr = "";
        displayStr += "<span style='color:gold'>" + d.label + "</span>";
        return displayStr;
    });

    var labelFontSizeMap = {
        "xs":"6px",
        "s":"8px",
        "m":"10px",
        "l":"12px"
    };
    var tickFontSizeMap = {
        "xs":"2px",
        "s":"4px",
        "m":"6px",
        "l":"12px"
    };
    var labelFontSize = "";
    var tickFontSize = "";

    function updateTextSizes(divWidth,divHeight){
        // if (divWidth==undefined || divHeight==undefined){
        //   ret
        // }
        var divSize = parseFloat((divWidth*divHeight)/10000);
        if(divSize<=6){
            labelFontSize = labelFontSizeMap['s'];
            tickFontSize = tickFontSizeMap['s'];
        }else if(divSize<=10){
            labelFontSize = labelFontSizeMap['m'];
            tickFontSize = tickFontSizeMap['m'];
        }else if(divSize>10){
            labelFontSize = labelFontSizeMap['l'];
            tickFontSize = tickFontSizeMap['l'];
        }
    }

    visRenderer.drawHistogram = function(values,labels,selector,divWidth,divHeight){
        updateTextSizes(divWidth,divHeight);
        var formatCount = d3.format(",.0f");

        var margin = {top: divHeight*0.1, right: divWidth*0.10, bottom: divHeight*0.15, left: divWidth*0.15},
            width = divWidth - margin.left - margin.right,
            height = divHeight - margin.top - margin.bottom;

        var x = d3.scale.linear()
            .domain([0, d3.max(values, function(d) { return d; })])
            .range([0, width]);

        // Generate a histogram using twenty uniformly-spaced bins.
        var data = d3.layout.histogram()
            .bins(x.ticks(20))
        (values);

        var y = d3.scale.linear()
            .domain([0, d3.max(data, function(d) { return d.y; })])
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(histogramTooltip);

        var bar = svg.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar")
            .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

        bar.append("rect")
            .attr("x", 1)
            .attr("width", x(data[0].dx) - 1)
            .attr("height", function(d) { return height - y(d.y); })
            .attr("fill","steelblue")
            .on('mouseover', histogramTooltip.show)
            .on('mouseout', histogramTooltip.hide);

        bar.append("text")
            .attr("dy", ".75em")
            .attr("y", 6)
            .attr("x", x(data[0].dx) / 2)
            .attr("text-anchor", "middle")
            .style('font-size',labelFontSize)
            .text(function(d) { return formatCount(d.y); });

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr("y",margin.bottom*0.75)
            .attr("x",width/2)
            .attr("dy", ".71em")
            .style('font-size',labelFontSize)
            .text(labels.xAttr);

        // console.log(tickFontSize)
        svg.selectAll('.tick')
            .selectAll('text')
            .style('font-size',tickFontSize);

        svg.selectAll('.axis')
            .style('font',''+tickFontSize+' sans-serif');
        svg.selectAll('.axis path')
            .style('fill','none')
            .style('stroke','#000')
            .style('shape-rendering','crispEdges');
        svg.selectAll('.axis line')
            .style('fill','none')
            .style('stroke','#000')
            .style('shape-rendering','crispEdges');
        svg.selectAll('.bar text')
            .style('font',''+tickFontSize+' sans-serif')
            .style('fill','white');
    }


    visRenderer.drawVerticalBarChart = function(data,labels,selector,divWidth,divHeight){

        updateTextSizes(divWidth,divHeight);
        var margin = {top: divHeight*0.1, right: divWidth*0.10, bottom: divHeight*0.15, left: divWidth*0.15},
            width = divWidth - margin.left - margin.right,
            height = divHeight - margin.top - margin.bottom;

        var color = d3.scale.category10();

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5);

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(barTooltip);

        x.domain(data.map(function(d) { return d.label; }));
        y.domain([0, d3.max(data, function(d) { return d.value; })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr("y",margin.bottom*0.75)
            .attr("x",width)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-size',labelFontSize)
            .text(labels.xAttr);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",0 - (margin.left*0.75))
            .attr("x",0-((height-margin.top-margin.bottom)/2))
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-size',labelFontSize)
            .text(labels.yAttr);

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.label); })
            .attr("width", x.rangeBand())
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return height - y(d.value); })
            .attr("fill",function(d){
                return color(d.category);
            })
            .on('mouseover', barTooltip.show)
            .on('mouseout', barTooltip.hide);

        // console.log(tickFontSize)
        // axes styling
        svg.selectAll('.axis')
            .style('font',''+tickFontSize+' sans-serif');

        svg.selectAll('.tick')
            .selectAll('text')
            .style('font',''+tickFontSize+' sans-serif');

        svg.selectAll('.axis path')
            .style('fill','none')
            .style('stroke','#000')
            .style('shape-rendering','crispEdges');
        svg.selectAll('.axis line')
            .style('fill','none')
            .style('stroke','#000')
            .style('shape-rendering','crispEdges');

    };



    visRenderer.drawPieChart = function(data,labels,selector,divWidth,divHeight){

        updateTextSizes(divWidth,divHeight);
        var margin = {top: divHeight*0.1, right: divWidth*0.10, bottom: divHeight*0.15, left: divWidth*0.15},
            width = divWidth - margin.left - margin.right,
            height = divHeight - margin.top - margin.bottom,
            radius = Math.min(width, height) / 2;

        var color = d3.scale.category20();

        var arc = d3.svg.arc().outerRadius(radius - 10).innerRadius(0);

        var labelArc = d3.svg.arc().outerRadius(radius - 40).innerRadius(radius - 40);

        var pie = d3.layout.pie().sort(null).value(function(d) { return d.value; });

        var svg = d3.select(selector).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


        var g = svg.selectAll(".arc")
                   .data(pie(data))
                   .enter()
                   .append("g")
                   .attr("class", "arc");

        g.append("path").attr("d", arc).style("fill", function(d) { return color(d.data.label); });

        g.append("text").attr("transform", function(d) { return "translate(" + labelArc.centroid(d) + ")"; })
                        .attr("dy", ".35em")
                        .text(function(d) { return d.data.label; });
    };




    visRenderer.drawScatterplot = function(data,labels,selector,divWidth,divHeight){
        updateTextSizes(divWidth,divHeight);
        var margin = {top: divHeight*0.1, right: divWidth*0.30, bottom: divHeight*0.15, left: divWidth*0.15},
            width = divWidth - margin.left - margin.right,
            height = divHeight - margin.top - margin.bottom;

         //console.log("hellow ",dataProcessor.getAttributeDetails(labels.xAttr));
        if(dataProcessor.getAttributeDetails(labels.xAttr)["isCategorical"]=="1")
        {
            var XExtentValue=[];
            for(i=0;i<data.length;i++)
            {
                 XExtentValue.push(data[i].xVal);
            }
            XExtentValue = XExtentValue.filter(onlyUnique);
            var x= YScaleGenerator("ordinal", width, XExtentValue);
        }
        else
        {
            var XExtentValue ;
            XExtentValue = d3.extent(data, function(d) { return d.xVal; });
            var x = XScaleGenerator("linear", width, XExtentValue);
        }
         


        if(dataProcessor.getAttributeDetails(labels.yAttr)["isCategorical"]=="1")
        {
            var YExtentValue=[];
            for(i=0;i<data.length;i++)
            {
                 YExtentValue.push(data[i].yVal);
            }
            YExtentValue = YExtentValue.filter(onlyUnique);
            var y= YScaleGenerator("ordinal", height, YExtentValue);
        }
        else
        {
            var YExtentValue ;
            YExtentValue = d3.extent(data, function(d) { return d.yVal; });
            var y = XScaleGenerator("linear", height, YExtentValue);
        }

        console.log(width, height, YExtentValue);
        

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(scatterplotTooltip);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr("y",margin.bottom*0.75)
            .attr("x",width)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-size',labelFontSize)
            .text(labels.xAttr);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",0 - (margin.left*0.75))
            .attr("x",0-((height-margin.top-margin.bottom)/2))
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-size',labelFontSize)
            .text(labels.yAttr);

        svg.selectAll(".dataPoint")
            .data(data)
            .enter().append("circle")
            .attr("class", "dataPoint")
            .style("stroke",'#ffffff')
            .style("opacity",0.7)
            .attr("r", 3.5)
            .attr("cx", function(d) { return x(d.xVal); })
            .attr("cy", function(d) { return y(d.yVal); })
            .style("fill", function(d) { return color(d.category); })
            .on('mouseover', scatterplotTooltip.show)
            .on('mouseout', scatterplotTooltip.hide);

        if(color.domain().length>1){
            var legend = svg.selectAll(".legend")
                .data(color.domain())
                .enter().append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", divWidth - margin.right)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", color);

            legend.append("text")
                .attr("x", divWidth - margin.right - 4)
                .attr("y", 9)
                .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) { return d; })
                .style('font',''+labelFontSize+' sans-serif');
        }

        // console.log(tickFontSize)
        // axes styling
        svg.selectAll('.axis')
            .style('font',''+tickFontSize+' sans-serif');

        svg.selectAll('.tick')
            .selectAll('text')
            .style('font',''+tickFontSize+' sans-serif');

        svg.selectAll('.axis path')
            .style('fill','none')
            .style('stroke','#000')
            .style('shape-rendering','crispEdges');
        svg.selectAll('.axis line')
            .style('fill','none')
            .style('stroke','#000')
            .style('shape-rendering','crispEdges');
    };

    visRenderer.drawLineChart = function(data,labels,selector,divWidth,divHeight){
        updateTextSizes(divWidth,divHeight);
        var margin = {top: divHeight*0.1, right: divWidth*0.30, bottom: divHeight*0.15, left: divWidth*0.15},
            width = divWidth - margin.left - margin.right,
            height = divHeight - margin.top - margin.bottom;

         //console.log("hellow ",dataProcessor.getAttributeDetails(labels.xAttr));
        if(dataProcessor.getAttributeDetails(labels.xAttr)["isCategorical"]=="1")
        {
            var XExtentValue=[];
            for(i=0;i<data.length;i++)
            {
                 XExtentValue.push(data[i].xVal);
            }
            XExtentValue = XExtentValue.filter(onlyUnique);
            var x= YScaleGenerator("ordinal", width, XExtentValue);
        }
        else
        {
            var XExtentValue ;
            XExtentValue = d3.extent(data, function(d) { return d.xVal; });
            var x = XScaleGenerator("linear", width, XExtentValue);
        }
         


        if(dataProcessor.getAttributeDetails(labels.yAttr)["isCategorical"]=="1")
        {
            var YExtentValue=[];
            for(i=0;i<data.length;i++)
            {
                 YExtentValue.push(data[i].yVal);
            }
            YExtentValue = YExtentValue.filter(onlyUnique);
            var y= YScaleGenerator("ordinal", height, YExtentValue);
        }
        else
        {
            var YExtentValue ;
            YExtentValue = d3.extent(data, function(d) { return d.yVal; });
            var y = XScaleGenerator("linear", height, YExtentValue);
        }

        var valueline = d3.svg.line()
            .x(function(d) { return x(d.xVal); })
            .y(function(d) { return y(d.yVal); });        

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = d3.select(selector).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            // .call(scatterplotTooltip);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append('text')
            .attr("y",margin.bottom*0.75)
            .attr("x",width)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-size',labelFontSize)
            .text(labels.xAttr);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",0 - (margin.left*0.75))
            .attr("x",0-((height-margin.top-margin.bottom)/2))
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style('font-size',labelFontSize)
            .text(labels.yAttr);
        
        svg.append("path")
            .attr("class", "line")
            .attr("d", valueline(data))
            .style("stroke", "steelblue")
            .style('stroke-width',2)
            .style("fill","none");
        
        // axes styling
        svg.selectAll('.axis')
            .style('font',''+tickFontSize+' sans-serif');

        svg.selectAll('.tick')
            .selectAll('text')
            .style('font',''+tickFontSize+' sans-serif');

        svg.selectAll('.axis path')
            .style('fill','none')
            .style('stroke','#000')
            .style('shape-rendering','crispEdges');
        svg.selectAll('.axis line')
            .style('fill','none')
            .style('stroke','#000')
            .style('shape-rendering','crispEdges');
    };

})();