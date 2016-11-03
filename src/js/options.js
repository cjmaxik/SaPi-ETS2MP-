document.getElementById('timeUpdate').addEventListener('change', timeUpd);
function timeUpd() {
	$('#timeOut').text(($('#timeUpdate').val() == 0 ? '1' : $('#timeUpdate').val()) + chrome.i18n.getMessage("optSecShort"));
}

$(document).ready(function() {
    restore_options();

    $('#save').click(save_options);
    localizePage();
    // Semantic UI
    $('select.dropdown').dropdown();
    $('.ui.checkbox').checkbox();
    // End Semantic UI

    $('#enableBadge').on('change', function(event) {
        event.preventDefault();
        if(!$(this).prop("checked")) {
            $('#server_choose').slideUp('fast');
        } else {
            $('#server_choose').slideDown('fast');
        }
    });

    $('input, select').on('change', function(event) {
        event.preventDefault();
        $('#save').addClass('positive');
    });
});

function save_options() {
    $('.form').addClass('loading');
    $('#save').addClass('disabled');
	localStorage["setting:enableTick"] = $('#enableBadge').prop("checked") ? 1 : 0;
	localStorage["setting:chckNewVersion"] = $('#chckNewVer').prop("checked") ? 1 : 0;
	localStorage["setting:updateTime"] = 60;
    localStorage["setting:serverID"]   = $('#servers').val();
	localStorage["setting:sortServers"]   = $('#sortServers').prop("checked") ? 1 : 0;

	startTimer();

	setTimeout(function() {window.close()}, 1000);
}

function restore_options() {
	$('#enableBadge').prop("checked", localStorage['setting:enableTick'] == 1 ? true : false);
    if (localStorage['setting:enableTick']) {
        $('#server_choose').show();
    };
    $('#chckNewVer').prop("checked",  localStorage["setting:chckNewVersion"] == 1 ? true : false);
	$('#sortServers').prop("checked",  localStorage["setting:sortServers"] == 1 ? true : false);
	$('#timeUpdate').val(localStorage['setting:updateTime']);
	$('#timeOut').text((localStorage['setting:updateTime'] == 0 ? '1' : localStorage['setting:updateTime']) + chrome.i18n.getMessage("optSecShort"));

	getServerInfo(function() {
		$('#servers').text('');
		var id = 0;
		for(var index in this.response) {
			if (localStorage['setting:serverID'] == id)
				$('.text').text(this.response[index].name);
			var option = $('<option/>', { 'value': id}).text(this.response[index].name);
			if (!this.response[index].online)
				option.text(this.response[index].name + " (Offline").prop('disabled', true);
			$('#servers').append(option);
			id++;
		}
        $('#servers').val(localStorage['setting:serverID']);
        $('#servers').parent().removeClass('disabled').removeClass('loading');
	});
    $('.form').removeClass('loading');
}