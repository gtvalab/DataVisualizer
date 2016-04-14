(function() {
	dataTransformer = {};

	dataTransformer.getBarChartData = function(dataList,labelAttr,valueAttr,transform){
		transform = typeof transform !== 'undefined' ? transform : "AVG";
		
		var transformedList = [];
		var labelValueMap = {};
		for(var i in dataList){
			//console.log(i, dataList[i], labelAttr, valueAttr);
			var dataItem = dataList[i];
			var labelAttrVal = dataItem[labelAttr];
			var valueAttrVal = dataItem[valueAttr];

			if(Object.keys(labelValueMap).indexOf(labelVal)==-1){ // encountering label for first time
				labelValueMap[labelAttrVal] = {
					"valueSum":parseFloat(valueAttrVal),
					"count":1
				};
			}else{
				labelValueMap[labelAttrVal]["valueSum"]+=parseFloat(valueAttrVal);
				labelValueMap[labelAttrVal]["count"]+=1;
			}
		}

		if(transform=="AVG"){
			for(var labelVal in labelValueMap){
				transformedList.push({
					"label":labelVal,
					"value":parseFloat(labelValueMap[labelVal]['valueSum']/labelValueMap[labelVal]['count'])
				});
			}
		}

		return transformedList;
	}

	
	dataTransformer.getScatterplotData  = function(dataList,xAttr,yAttr,transform){
        
        var transformedList = [];
		var labelValueMap = {};
		for(var i in dataList){
			var dataItem = dataList[i];
			transformedList.push({
					"xVal": parseInt(dataItem[xAttr]),
					"label": dataItem["Name"],
					"yVal": dataItem[yAttr]
			});
		}
		console.log(transformedList);
        return transformedList;
	}



})();