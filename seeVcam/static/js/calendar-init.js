(function(){
	var durationMinutes = 120;
	var interviewTitle = 'New Interview';
	var startDateTime = '';
	var endDateTime = '';

	$(document).ready(function () {

        $('#container').on('click','button.calendar',function(event){
        	event.preventDefault();
        	
        	$('#calendar-modal').modal();
        	$('#calendar-container').show();
        	$('#calendar').children().remove();
        	setTimeout(function() {init_calendar()}, 300);

        	//bind save event
        	$('#calendar-modal button.save-changes').click(function(){
        		if ((!!startDateTime) && (!!endDateTime)){
        			//fill date and timepicker correctly -- FIXME when they will be removed
        			var year = startDateTime.getFullYear().toString();
        			var month = (startDateTime.getMonth()+1).toString();
        			var day = startDateTime.getDate().toString();
        			var hours = startDateTime.getHours().toString();
        			var minutes = startDateTime.getMinutes().toString();
        			if (month.length==1) month = '0'+month;
        			if (day.length==1) day = '0'+day;
        			if (minutes.length==1) minutes = '0'+minutes;
        			if (hours.length==1) hours = '0'+hours;

        			$('.bfh-datepicker').val(year+'-'+month+'-'+day);
        			$('.bfh-timepicker').val(hours+':'+minutes);
        			$('#id_interview_duration').val(durationMinutes);

        			$('#calendar-modal').modal('hide');
        		}
        	})
        })
    })


	function init_calendar(){
		//get current duration and title
		var duration_el = $('select[name="interview_duration"]');
		if (duration_el.length) durationMinutes = parseInt(duration_el.val());
		var candidate_elem = $('input#id_candidate_name');
		if ((!!candidate_elem) && (!!candidate_elem.val())) interviewTitle = candidate_elem.val();

		//get current start date and duration
		var currentDate = $('.bfh-datepicker').val();
		var currentTime = $('.bfh-timepicker').val();
		var currentDuration = $('#id_interview_duration').val();
		if ((!!currentTime) && (!!currentDate) && (!!currentDuration)){
			startDateTime = new Date(currentDate+' '+currentTime);
			endDateTime = new Date(startDateTime);
			endDateTime.setMinutes(endDateTime.getMinutes()+parseInt(currentDuration));	
		} 

		var currentEventID = undefined;
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaDay'
			},
			editable: true,
			droppable: true,
			allDaySlot: false,
			events: "/static/json/testEvents.json",
			eventRender: function(ev){
				if (ev.currentEvent) currentEventID = ev._id;
			},
			eventClick: function(ev){
				//delete the new event if clicked
				if (ev.currentEvent){
					$('#calendar').fullCalendar('removeEvents',ev._id);
					currentEventID = undefined;
					startDateTime = '';
					endDateTime = '';
				}
			},
			dayClick: function(date, allDay, jsEvent, view) {
				if (allDay){
					//switch to agendaDay
					$('#calendar').fullCalendar('changeView','agendaDay');
					$('#calendar').fullCalendar('gotoDate',date.getFullYear(),date.getMonth(),date.getDate());
				}
				else{
					//we are already in agendaDay. The user has clicked in a hour frame
					endDateTime = new Date(date.getTime() + durationMinutes*60000);
					startDateTime = date
					if (!!currentEventID) $('#calendar').fullCalendar('removeEvents',currentEventID);
					var eventObj = {
						title:interviewTitle,
						start:startDateTime,
						end: endDateTime,
						allDay:false,
						editable:true,
						currentEvent:true,
						color: 'red'
					}
					$('#calendar').fullCalendar('renderEvent',eventObj,true);
				}
			},
			eventResize: function(ev){
				startDateTime = ev.start;
				endDateTime = ev.end;
				durationMinutes = (endDateTime- startDateTime)/60000;
			}
		});

		if ((!!startDateTime) && (!!endDateTime)){
			var eventObj = {
				title:interviewTitle,
				start:startDateTime,
				end: endDateTime,
				allDay:false,
				editable:true,
				currentEvent:true,
				color: 'red'
			}
			$('#calendar').fullCalendar('renderEvent',eventObj,true);
		}
		
	}
})()
