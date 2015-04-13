//
// Plugin Calendar v.1.0
//----------------------------------------
(function($){
$.fn.pluginCalendar = function() {
	var wrap, 
		label, 
		addEvent = '',
		newEvent = false,
		imgP = 'img/',
		nrNewEvents = 0,
		save = false,
		newCalEvents = [],
		calData = {},
		calType,
		inputStart=' ',inputEnd=' ',inputPlace=' ',inputInfo=' ',inputVs=' ',inputHead=' ',
		spanTxt = '<span class="pg-cal-text">',
		imgNoDay = '<img src="'+imgP+'cal-new.gif" class="pg-cal-bgImg pg-cal-noDay">',
		imgNoEvent = '<img src="'+imgP+'cal-new.gif" class="pg-cal-bgImg">',
		imgNoEvent2 = '<img src="'+imgP+'cal-new.gif" class="pg-cal-bgImg">',
		imgRed = '<img src="'+imgP+'cal-new-red1.gif" class="pg-cal-bgImg pg-cal-img pg-cal-clickDown pg-cal-red"/>',
		imgGreen = '<img src="'+imgP+'cal-new-green1.gif" class="pg-cal-bgImg pg-cal-img pg-cal-clickDown pg-cal-green"/>',
		imgBlue = '<img src="'+imgP+'cal-new-blue1.gif" class="pg-cal-bgImg pg-cal-img pg-cal-clickDown pg-cal-blue"/>',
		imgYellow = '<img src="'+imgP+'cal-new-yellow1.gif" class="pg-cal-bgImg pg-cal-img pg-cal-clickDown pg-cal-yellow"/>',
		ye,mo,da,he,st,en,te,mo, //year/month/day/head/start/end...
		options = $.extend({},$.fn.pluginCalendar.defaults, options),
		months = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "July", "Augusti", "September", "Oktober", "November", "December"]; 
		
		this.html('<div id="pg-cal"><div class="pg-cal-header"><span class="pg-cal-left-btn" id="pg-cal-prev">&lt;</span><span class="pg-cal-label" id="pg-cal-label">Januari 2015</span><span class="pg-cal-right-btn" id="pg-cal-next">&gt;</span></div><table id="pg-cal-days"><th>Mån</th><th>Tis</th><th>Ons</th><th>Tor</th><th>Fre</th><th>Lör</th><th>Sön</th></table><div id="pg-cal-frame"><table id="pg-cal-curr"><tbody><tr><td></td><td></td><td></td><td>1</td><td>2</td><td>3</td><td>4</td></tr><tr><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td></tr><tr><td>12</td><td id="pg-cal-today">13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td></tr><tr><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td><td>25</td></tr><tr><td>26</td><td>27</td><td>28</td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div></div>');

	//------ Setup the calendar
	function setup(newWrap){
		var sp,
			obj,
			vsText;
			
		getCalData();
		wrap     = $(newWrap || "#pg-cal"); 
		label    = wrap.find("#pg-cal-label"); 
		wrap.find("#pg-cal-prev").bind("click.calendar", function () { switchMonth(false); }); 
		wrap.find("#pg-cal-next").bind("click.calendar", function () { switchMonth(true);  }); 
		label.bind("click", function () { switchMonth(null, new Date().getMonth(), new Date().getFullYear()); });    
		label.click();
				
		//---- Cal event click
		$('#pg-cal-frame').bind('click', function(e){
			var calBtnClick = e.target,
				$calBtnClick = $(calBtnClick);

			if(calBtnClick.nodeName === 'IMG'){
				if($calBtnClick.hasClass('pg-cal-img')){
			
					$calBtnClick.toggleClass('pg-cal-clickDown pg-cal-clickUp');
					if($calBtnClick.hasClass('pg-cal-clickDown')){
						$calBtnClick.next('.pg-cal-infoBox').hide();
					}else if($calBtnClick.hasClass('pg-cal-clickUp')){
						$calBtnClick.next('.pg-cal-infoBox').show();
					}
					
					if($calBtnClick.hasClass('pg-cal-red')){
						if($calBtnClick.hasClass('pg-cal-clickDown'))
							$calBtnClick.prop('src', imgP+'cal-new-red1.gif');
						else
							$calBtnClick.prop('src', imgP+'cal-new-red2.gif');
					}	
					else if($calBtnClick.hasClass('pg-cal-green')){
						if($calBtnClick.hasClass('pg-cal-clickDown'))
							$calBtnClick.prop('src',imgP+'cal-new-green1.gif');
						else
							$calBtnClick.prop('src',imgP+'cal-new-green2.gif');

					}
					else if($calBtnClick.hasClass('pg-cal-blue')){
						if($calBtnClick.hasClass('pg-cal-clickDown'))
							$calBtnClick.prop('src',imgP+'cal-new-blue1.gif');
						else
							$calBtnClick.prop('src',imgP+'cal-new-blue2.gif');

					}
					else if($calBtnClick.hasClass('pg-cal-yellow')){
						if($calBtnClick.hasClass('pg-cal-clickDown'))
							$calBtnClick.prop('src',imgP+'cal-new-yellow1.gif');
						else
							$calBtnClick.prop('src',imgP+'cal-new-yellow2.gif');
					}
				}
			}
		});
	}

	//----- Get the calendar data from the DB
	// USE the plugins default (options.dbTable) if you use this script on many sites instead of the url.
	function getCalData(){	
		$.ajax({
			type:'GET',
			url:'calGetDataDB.php?type=getData',
			dataType:'json',
			async:false,
			timeout:30000,
			success:function(d){
				console.log('Resived data. Number of events = '+d.length);
				for(var i=0; i < d.length; i++){
				
					if(!calData[Number(d[i].year)])
						calData[Number(d[i].year)] = {};
					if(!calData[Number(d[i].year)][Number(d[i].month)])
						calData[Number(d[i].year)][Number(d[i].month)] = {};
					if(!calData[Number(d[i].year)][Number(d[i].month)][Number(d[i].day)]){
						calData[Number(d[i].year)][Number(d[i].month)][Number(d[i].day)] = {
							day:Number(d[i].day),
							type:Number(d[i].type),
							start:d[i].start,
							end:d[i].end,
							place:d[i].place,
							vs:d[i].vs,
							head:d[i].head,
							text:d[i].text,
						};
					}
				}
				return true;
			},
			error:function(e){
				console.log('Somthing went wrong');
				return false;
			},
		});
	}
	//----- Add the info box
	function addBoxes(eventType,inputInfo,inputStart,inputEnd,inputPlace,inputVs,inputHead){
		var boxRest,
			bStart = "Börjar: <b>"+inputStart+"</b><br>",
			bEnd = "Slutar: <b>"+inputEnd+"</b><br>",
			bPlace = "Plats: <b>"+inputPlace+"</b><br><br>",
			bVs = "Mot: <b>"+inputVs+"</b><br>",
			bInfo = inputInfo+"</div>";
			
		if(eventType == 0){
			boxHead = 'Tränning';
			boxRest = bStart+bEnd+bPlace+bInfo;
		}else if(eventType == 1){
			boxHead = 'Serie match';
			boxRest = bStart+bEnd+bPlace+bVs+bInfo;
		}else if(eventType == 2){
			boxHead = 'Trännings match';
			boxRest = bStart+bEnd+bPlace+bVs+bInfo;
		}else{
			boxHead = inputHead;
			boxRest = bInfo;
		}
		return "<div class='pg-cal-infoBox'><h3>"+boxHead+"</h3>"+boxRest;
	}
	//----- If the users change the month
	function switchMonth(next, month, year){
		var curr = label.text().trim().split(" "), 
			calendar, 
			$tempCal,
			tempM = parseInt(months.indexOf(curr[0]),10),
			tempY =  parseInt(curr[1], 10); 
		
			if(save){
				$tempCal = $('#pg-cal-curr').clone();
				createCal.cache[tempY][tempM] = {calendar : function(){ return $tempCal},label:curr[0]+' '+tempY}; 
				createCal.cache[tempY][tempM].calendar().addClass('jesus');
				save = false;
			}
		
			if(month >= 0){
				month = month;
				year = year;
			} else {
				month = ((next) ? ( (curr[0] === "December") ? 0 : months.indexOf(curr[0]) + 1 ) : ( (curr[0] === "Januari") ? 11 : months.indexOf(curr[0]) - 1 )); 
				year = ((next && month === 0) ? tempY + 1 : (!next && month === 11) ? tempY - 1 : tempY);
			}

		calendar =  createCal(year, month); 
		createCal.cache[year][month].calendar().prop('id','pg-cal-curr');

		$("#pg-cal-frame", wrap) 
			.find("#pg-cal-curr") 
				.removeAttr('id') 
				.prop('id','pg-cal-temp') 
			.end() 
			.prepend(calendar.calendar())
			.find("#pg-cal-temp").remove();			
		 
		$('#pg-cal-label').text(calendar.label);
	}
	
	//----- Creates the calendar
	function createCal(year,month){
		var day = 1, w, d, haveDays = true, haveEvents = false, 
			td = '<td>',
			thisYear = new Date().getFullYear(),
			thisMonth = new Date().getMonth(),
			thisDay = new Date().getDate().toString(),
			xCountD = 0,
			startDay = (new Date(year, month, day).getDay())-1, 
			daysInMonths = [31, (((year%4==0)&&(year%100!=0))||(year%400==0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], 
			calendar = [];
						
		if (createCal.cache[year]) { 
			if (createCal.cache[year][month]) { 
				return createCal.cache[year][month]; 
			} 
		} else {
			createCal.cache[year] = {};
		}
		
		if(typeof calData[year] != "undefined" && typeof calData[year][month] != "undefined")
			haveEvents = true;
			
		if(year < thisYear){
			td = '<td class="pg-cal-past">';
		}else{
			if(year == thisYear){
				if(month < thisMonth){
					td = '<td class="pg-cal-past">';
				}else if(month == thisMonth){
					xCountD = thisDay;
					td = '<td class="pg-cal-past">';
				}
			}
		}
			w = 0; 
			while (haveDays) {
				calendar[w] = []; 
				for (d = 0; d < 7; d++) { 
					if(day >= xCountD && xCountD != 0)
						td = '<td>';
					if(haveEvents){
						if(typeof calData[year][month][day] != 'undefined'){
								calType = calData[year][month][day].type;
								if(calType == 0)
									imgNoEvent = imgGreen;
								else if(calType == 1)
									imgNoEvent = imgBlue;
								else if(calType == 2)
									imgNoEvent = imgRed;
								else
									imgNoEvent = imgYellow;
									
								imgNoEvent = imgNoEvent+addBoxes(calType,calData[year][month][day].text,calData[year][month][day].start,calData[year][month][day].end,calData[year][month][day].place,calData[year][month][day].vs,calData[year][month][day].head); 
						}
					}
					if (w === 0) { 
						if (d === startDay) {
							calendar[w][d] = td+imgNoEvent+spanTxt+day+'</span>';
							day++; 
							startDay++;
						}else if(d == 6 && startDay == -1){
							calendar[w][6] = td+imgNoEvent+spanTxt+day+'</span>';
							day++
						}else{
							calendar[w][d] = td+imgNoDay;
						}
					} else if (day <= daysInMonths[month]) { 
						calendar[w][d] = td+imgNoEvent+spanTxt+day+'</span>';
						day++; 
					} else { 
						calendar[w][d] = td+imgNoDay; 
						haveDays = false; 
					} 
					if (day > daysInMonths[month]) { 
						haveDays = false; 
					} 
					imgNoEvent = imgNoEvent2;
				} 
				w++; 
			}
			//----- Add the HTML code  
			for (var i = 0; i < calendar.length; i++) { 
				calendar[i] = "<tr>" + calendar[i].join("</td>") + "</td></tr>"; 
			} 
			calendar = $("<table>" + calendar.join("") + "</table>").prop('id','pg-cal-curr'); 
			 
			$("td:empty", calendar).addClass("pg-cal-nil"); 
			if (month === new Date().getMonth()) { 
				$('td', calendar).filter(function () { return $(this).text() === new Date().getDate().toString(); }).attr('id','pg-cal-today'); 
			} 	
	
			createCal.cache[year][month] = { calendar : function () { return calendar.clone() }, label : months[month] + " " + year }; 
			return createCal.cache[year][month];
	}
	
	createCal.cache = {};
	
	$.fn.pluginCalendar.defaults = {
		'dbTable':'not_set',
	};
	
	return {
		setup: setup,
		switchMonth: switchMonth,
		createCal: createCal,
	};
}	
}(jQuery));