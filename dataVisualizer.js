
// this is the file that we are calling it in the index.html 
// this first call dataTransformer.js and then visRenderer.js
// 
(function() {
	dataVisualizer = {};
	dataVisualizer.drawBarChart = function(dataList,labelAttribute,valueAttribute,selector,width,height,transform){
		d3.select(selector).selectAll("svg").remove();
		var transformedData = dataTransformer.getBarChartData(dataList,labelAttribute,valueAttribute);
		var labels = {
			"xAttr" : labelAttribute,
			"yAttr" : valueAttribute
		};
		visRenderer.drawVerticalBarChart(transformedData,labels,selector,width,height);
	}	

	dataVisualizer.drawScatterplot = function(dataList,xLabelAttribute,yLabelAttribute,selector,width,height,transform){
		d3.select(selector).selectAll("svg").remove();
		var transformedData = dataTransformer.getScatterplotData(dataList,xLabelAttribute,yLabelAttribute);
		var labels = {
			"xAttr" : xLabelAttribute,
			"yAttr" : yLabelAttribute
		};
		console.log(dataProcessor.getAttributeDetails('Retail Price'));
		visRenderer.drawScatterplot(transformedData,labels,selector,width,height);
	}	
})();