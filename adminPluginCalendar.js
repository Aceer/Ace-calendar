//
// Admin Plugin Calendar v.1.0
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
		
		//----> Admin panel
		$('#pg-cal').before('<div id="pg-cal-admin"><div id="pg-cal-admin-head"><div class="pg-cal-btn-admin-change" id="pg-cal-btn-admin-change">Ändra</div></div><div id="pg-cal-admin-body"><div id="pg-cal-bodySelect"><div id="pg-cal-match">Träning<br><img src="img/cal-new-green1.gif" class="pg-cal-img pg-cal-clickDown pg-cal-green"/></div><div id="pg-cal-trainMatch">Match<br><img src="img/cal-new-blue1.gif" class="pg-cal-img pg-cal-clickDown pg-cal-blue"/></div><div id="pg-cal-info">Tränings match<br><img src="img/cal-new-red1.gif" class="pg-cal-img pg-cal-clickDown pg-cal-red"/></div><div id="pg-cal-train">Info<br><img src="img/cal-new-yellow1.gif" class="pg-cal-img pg-cal-clickDown pg-cal-yellow"/></div></div><div class="pg-cal-brLineH"></div><div id="pg-cal-addType"></div><div id="pg-cal-formLeft"></div><div id="pg-cal-formRight"></div><div id="pg-cal-clear"></div><div id="pg-cal-formSubmit">Klicka på ett datum för att lägga det.</div></div></div></div>');
		var $btn = $('#pg-cal-btn-admin-change').click(function(){
			$('#pg-cal-admin-body').slideToggle('slow', function(){
				$btn.toggleClass('pg-cal-btn-admin-change pg-cal-btn-admin-save');
				var t = $btn.text();
				$btn.text(t == 'Ändra' ? 'Spara' : 'Ändra');
				if($btn.text() != 'Spara'){
					newEvent = false;
					updateCal();
				}
			});
		});
		$('#pg-cal-bodySelect').bind('click', function(e){
			var addTypeText = $(e.target).closest('div').text();
				newEvent = true;
				$('#pg-cal-addType').text(addTypeText);
				$('#pg-cal-formRight').html('<label>Information:<br><textarea name="formText" form="calFormAddEvents" id="pg-cal-textarea"></textarea></label>');

				if(addTypeText == 'Info'){
					$('#pg-cal-formLeft').html('<label id="pg-cal-laHead">Rubrik:<br><input type="text" id="pg-cal-input-head"/></label>');
					$('#pg-cal-laHead').show();
					addEvent = 'yellow';
				}else{
					$('#pg-cal-formLeft').html('<label id="pg-cal-laStart">Start kl:<br><input type="text" name="startTime" id="pg-cal-input-start"/><br></label><label id="pg-cal-laEnd">Slut kl:<br><input type="text" name="endTime" id="pg-cal-input-end"/><br></label><label id="pg-cal-laPlace">Plats:<br><input type="text" name="place" id="pg-cal-input-place"/><br></label><label id="pg-cal-laVs">Mot:<br><input type="text" name="vs" id="pg-cal-vs"/></label><select id="pg-val-vsSelect"><option value="">Serie lag?</option><option value="Arsenal FC">Arsenal FC</option><option value="Chelsea FC">Chelsea FC</option><option value="Hull FC">Hull FC</option><option value="Aston villa">Aston villa</option></select>');
					if(addTypeText == 'Träning'){
						$('#pg-cal-laVs').hide();
						$('#pg-val-vsSelect').hide();
						addEvent = 'green';
					}else{
						$('#pg-cal-laHead').hide();
						$('#pg-cal-laVs').show();
						$('#pg-val-vsSelect').show()
							.bind('click',function() {
								vsText = $(this).val();
								$('#pg-cal-vs').val(vsText);
							});
						if(addTypeText == 'Match'){
							addEvent = 'blue';
						}else if(addTypeText == 'Tränings match'){
							addEvent = 'red';
						}
					}
				}			
			});
		
		//---- Cal event click
		$('#pg-cal-frame').bind('click', function(e){
			var calBtnClick = e.target,
				$calBtnClick = $(calBtnClick);
	
	
			console.log('frame click');
			
						if($calBtnClick.hasClass('pg-cal-delMe')){
							sp = label.text().trim().split(" "); // year month
							da = parseInt($calBtnClick.closest('td').find('.pg-cal-text').text()); // day
							mo = months.indexOf(sp[0]);
							obj = {temp:'y',ac:1,y:parseInt(sp[1]),m:mo,d:da,t:calType,h:inputHead,s:inputStart,e:inputEnd,p:inputPlace,v:inputVs,te:inputInfo};
							if($calBtnClick.closest('td').find('.pg-cal-bgImg').hasClass('pg-cal-tempEv')){
								obj.temp = 'y';
							}else{
								obj.temp = 'n';
							}
							addEventToCal(obj);
							$calBtnClick.closest('td').html(imgNoEvent+'<span class="pg-cal-text">'+da+'</span>');
							save = true;
						}
						
			if(calBtnClick.nodeName === 'IMG'){
				if($calBtnClick.hasClass('pg-cal-img')){
			
					$calBtnClick.toggleClass('pg-cal-clickDown pg-cal-clickUp');
					if($calBtnClick.hasClass('pg-cal-clickDown')){
						$calBtnClick.next('.pg-cal-infoBox').hide()
							.next('.pg-cal-delBox').hide();
					}else if($calBtnClick.hasClass('pg-cal-clickUp')){
						$calBtnClick.next('.pg-cal-infoBox').show();
							if($('#pg-cal-btn-admin-change').hasClass('pg-cal-btn-admin-save'))
								$calBtnClick.siblings('.pg-cal-delBox').show();
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
				}else{
					if(!$calBtnClick.hasClass('pg-cal-noDay') && !$calBtnClick.parent().hasClass('pg-cal-past') && newEvent){
						inputStart = $('#pg-cal-input-start').val();
						inputEnd = $('#pg-cal-input-end').val();
						inputPlace = $('#pg-cal-input-place').val();
						inputInfo = $('#pg-cal-textarea').val();
						inputVs = $('#pg-cal-vs').val();
						inputHead = $('#pg-cal-input-head').val();
						if(addEvent == 'green'){
							calType = 0;
							$calBtnClick.prop('class','').addClass('pg-cal-bgImg pg-cal-img pg-cal-clickDown pg-cal-green pg-cal-tempEv').prop('src',imgP+'cal-new-green1.gif')
								.after(addBoxes(calType,inputInfo,inputStart,inputEnd,inputPlace,inputVs,inputHead));
						}else if(addEvent == 'blue'){
							calType = 1;
							$calBtnClick.prop('class','').addClass('pg-cal-bgImg pg-cal-img pg-cal-clickDown pg-cal-blue pg-cal-tempEv').prop('src',imgP+'cal-new-blue1.gif')
								.after(addBoxes(calType,inputInfo,inputStart,inputEnd,inputPlace,inputVs,inputHead));
						}else if(addEvent == 'red'){
							calType = 2;
							$calBtnClick.prop('class','').addClass('pg-cal-bgImg pg-cal-img pg-cal-clickDown pg-cal-red pg-cal-tempEv').prop('src',imgP+'cal-new-red1.gif')
								.after(addBoxes(calType,inputInfo,inputStart,inputEnd,inputPlace,inputVs,inputHead));
						}else if(addEvent == 'yellow'){
							calType = 3;
							$calBtnClick.prop('class','').addClass('pg-cal-bgImg pg-cal-img pg-cal-clickDown pg-cal-yellow pg-cal-tempEv').prop('src',imgP+'cal-new-yellow1.gif')
								.after(addBoxes(calType,inputInfo,inputStart,inputEnd,inputPlace,inputVs,inputHead));
						} 
						
						sp = label.text().trim().split(" "); // year month
						da = parseInt($calBtnClick.siblings('span').text()); // day
						mo = months.indexOf(sp[0]);
						obj = {temp:'y',ac:2,y:parseInt(sp[1]),m:mo,d:da,t:calType,h:inputHead,s:inputStart,e:inputEnd,p:inputPlace,v:inputVs,te:inputInfo};//action(1:delete/2:insert):year:month:day...
						console.log('Add new day - addEventToCal(obj); '+obj);
						addEventToCal(obj);
						save = true; // When change month save the current calendar events
					}
				}
			}
		});
	}
	
	function addBoxes(eventType,inputInfo,inputStart,inputEnd,inputPlace,inputVs,inputHead){
		var boxRest,
			bStart = "Börjar: <b>"+inputStart+"</b><br>",
			bEnd = "Slutar: <b>"+inputEnd+"</b><br>",
			bPlace = "Plats: <b>"+inputPlace+"</b><br><br>",
			bVs = "Mot: <b>"+inputVs+"</b><br>",
			bInfo = inputInfo+"</div><div class='pg-cal-delBox pg-cal-delMe'><img src='"+imgP+"icon-s-remove.gif' class='pg-cal-delMe'/><b class='pg-cal-delMe'>Ta bort</b></div>";
			
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
	
	//---- Add the event to a temp array and when the users save call function addEventToCal()
	function addEventToCal(event){

		// CREATE THE LOOP
		if(event.temp === 'y' && event.ac === 1){
			for(var i=0; i<newCalEvents.length;i++){
				if(newCalEvents[i].y === event.y && newCalEvents[i].m === event.m && newCalEvents[i].d === event.d){
					newCalEvents.splice(i,1);
					nrNewEvents--;
				}
			}
		}else{
			newCalEvents[nrNewEvents++] = event;
		}
	}
	//----- When the users saves the calendar events
	function updateCal(){
		newCalEvents = JSON.stringify(newCalEvents);

		$.ajax({
			type:'POST',
			url:'calUpdateDB.php',
			data:{event:'update',value:newCalEvents},
			dataType:'json',
			success:function(data){
			
			},
		});
		nrNewEvents = 0;
		newCalEvents = [];
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