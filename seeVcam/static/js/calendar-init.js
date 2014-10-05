(function(){
	var durationMinutes = 120;
	var interviewTitle = 'New Interview';
	var startDateTime = '';
	var endDateTime = '';

	$(document).ready(function () {

		
        $('#container').on('click','button.calendar',function(event){
        	event.preventDefault();

        	//add a class to the body to remove black background
        	$('#calendar-modal').on('show.bs.modal', function (e){
        		$('body').addClass('calendar-modal');
        	})
        	$('#calendar-modal').on('hidden.bs.modal', function (e){
        		$('body').removeClass('calendar-modal');
        	})

        	$('#calendar-modal').modal();
        	$('#calendar-container').show();
        	$('#calendar').children().remove();

        	setTimeout(function() {init_calendar()}, 0);

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
        			$('#id_interview_duration').val(durationMinutes.toString());
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

		//compute correct height
		var height = $(window).height()/10*8 -95;

		//vertically center the calendar
		$('#calendar-modal .modal-dialog').css('margin-top',$(window).height()/10)


		var currentEventID = undefined;
		$('#calendar').fullCalendar({
			header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,agendaWeek,agendaDay'
			},
			height: height,
			editable: true,
			droppable: true,
			allDaySlot: false,
			events: "/static/json/testEvents.json",
			eventRender: function(ev,element,view){
				if (ev.currentEvent){
					currentEventID = ev._id;
					if ((view.name=='agendaDay') || (view.name=='agendaWeek')){
						//add remove button
						element.append('<i class="fa fa-remove"></i>');
						element.find('i.fa-remove').on('click',function(){
							$('#calendar').fullCalendar('removeEvents',currentEventID);
							currentEventID = undefined;
							startDateTime = '';
							endDateTime = '';
						})
					}
				}
			},
			eventClick: function(ev,jsev,view){
				// if ((view.name=='agendaDay') && (ev.currentEvent)){
					// $('#calendar').fullCalendar('removeEvents',ev._id);
					// currentEventID = undefined;
					// startDateTime = '';
					// endDateTime = '';
				// }
				if (view.name=="month") {
					//go to agendaDay view
					$('#calendar').fullCalendar('changeView','agendaDay');
					$('#calendar').fullCalendar('gotoDate',ev.start.getFullYear(),ev.start.getMonth(),ev.start.getDate());
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
					//add a new event
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
			//render initial events
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
