/*!
 * Servers & Users Info [TruckersMP]
 * https://github.com/cjmaxik/SaPi-Reborn
 *
 * Source code: Copyright © jackrv (aka Красный) [special for TruckersMP.ru]
 * Creative Commons «Attribution-ShareAlike (CC BY-SA)
 *
 * Forked and reborned by CJMAXiK [special for bigmp.ru]
 *
 * Last Edit: 03/11/2016
 */
// ==================================================================================
include(chrome.extension.getURL('/js/inject.js'));


var $tElement, JSON, _URL, _STEAMID, _TruckersMPID, _PERSONALNAME;

/**
 * Include js-code to user-profile pages:
 *     http(s)://steamcommunity.com/profiles/*", "http(s)://steamcommunity.com/id/*"
 * For execute user steamID
 */
function include(url) {
	var script = $('<script/>', {'src': url, 'type': 'text/javascript'});
	$('head').append(script);
}

/**
 * While all DOM loaded - run addInfo function
 * for add info about TruckersMP-user
*/
$(document).ready(function() {
	setTimeout(function() {
		if ($("#urlSaPi").val() !== undefined)
			addInfo();
	}, 500);
});

/**
 * Function load json-info about player
 *
 * @param {number} id Steam ID
 * @return {json} Load json-data into global variable JSON
 */
function getUserInfo(id, callback){
	var url = "https://api.truckersmp.com/v2/player/" + id;
	$.getJSON(url, function (data) {
		callback.call(data);
		JSON = data.response;
	});
}

/**
 * This function load user page (example: http://TruckersMP.com/index.php?page=profile&id=114711)
 * and search text "No punishments to display"  on it
 * Return False if text is found and True otherwise
 *
 * Warning!!! If fail load page - function return False also!
 *
 * @param {number} id TruckersMP ID
 * @return {boolean} Presence of bans
*/
function getBans(id) {
	var url = "https://api.truckersmp.com/v2/bans/" + id;
	$.getJSON(url, function (data) {
        console.log(data);
		if (data.response.length != 0) {
			$('#SaPi_TruckersMP').append($('<a/>', {"id": 'getAllBans', "href": '#getAllBans', "onclick": "getAllBans();return false"}).text(' (' + chrome.i18n.getMessage('injHaveBans') + ')'));
			$('#getAllBans').click(getAllBansSaPi);
		}
	});

}

/**
 * Function to append modal window with All player bans
 * Call while user click on #getAllBans button
 */
function getAllBansSaPi() {
	setTimeout(function() {
		$('#bInfo_full').text('');
		var table = $('<table/>', {"id": 'SaPi_Bans'});
		$.each($tElement, function(row, value) {
			var newRow = $('<tr/>');
			if (row == 0){
				$.each($(value).find('td'), function(cell, value) {
					newRow.append($('<th/>').text(chrome.i18n.getMessage('injBanModal_' + cell)));
				});
			}
			else {
				$.each($(value).find('td'), function(cell, value) {
					newRow.append($('<td/>').text($(value).text()));
				});
			}
			table.append(newRow);
		});
		$('#bInfo_full').append(table);
	}, 500);
}

/**
 * Function to append modal window with full info about player
 * Call while user click on #getMoreInfo button
 */
function getMoreInfoSaPi()
{
	setTimeout(function() {
		$('#pInfo_full').text('');
		var rows =[
			[chrome.i18n.getMessage('injInfModal_SteamLink'),	_URL],
			[chrome.i18n.getMessage('injInfModal_SteamID'),		_STEAMID],
			[chrome.i18n.getMessage('injInfModal_SteamName'),	_PERSONALNAME],
			[chrome.i18n.getMessage('injInfModal_TruckersMPID'),	JSON.id],
			[chrome.i18n.getMessage('injInfModal_ForumName'),	JSON.name],
			[chrome.i18n.getMessage('injInfModal_JoinDate'),	JSON.joinDate],
			[chrome.i18n.getMessage('injInfModal_ForumGroup'),	JSON.groupName],
			[chrome.i18n.getMessage('injInfModal_GameGroup'),	JSON.permissions.isGameAdmin ? 'Admin' : 'Player']
		];

		(function table(){
			var table = $('<table/>', {"id": 'SaPi_fInfo'});
			$.each(rows, function (row, value) {
				var newRow = $('<tr/>');
				newRow.append($('<td/>').append($('<strong/>').text(value[0] + ': ')));
				newRow.append($('<td/>').text(value[1]));
				table.append(newRow);
			})
			$('#pInfo_full').append(table);
		})();
	}, 750);
}

/**
 * Add info about Steam or TruckersMP
 *
 */
function addInfo() {
	_URL = $("#urlSaPi").val();
	if (_URL.indexOf('steamcommunity.com') != -1) {
		_STEAMID = $("#steamidSaPi").val();
		_PERSONALNAME = $("#personanameSaPi").val();
		infoInSteam(_STEAMID);
	}
	else if (_URL.indexOf("truckersmp.com") != -1) {
		_TruckersMPID = window.location.href.split('/').reverse()[0];
		infoInTruckersMP(_TruckersMPID);
	}
}

/**
 * Function add info about player on Steam page!
 * append DIV-container(class "SaPi") to "profile_header"
 */
function infoInSteam(id) {
	getUserInfo(id, function () {
		$('#containerSaPi').text('')
							.append($('<strong/>').text('STEAM ID: '))
							.append($('<a/>', {"href": 'http://steamcommunity.com/profiles/' + id}).text(id))
							.append('<br>')
							.append(this.error ? this.descriptor :
								$('<strong/>').text('TruckersMP ID: '))
							.append(this.error ? '' :
								$('<a/>', {"id": 'SaPi_TruckersMP', "href": 'https://truckersmp.com/user/' + this.response.id, "target": "_blank"})
									.text(this.response.id))
							.append('<br>')
							.append($('<a/>', {"id": 'getMoreInfo', "href": '#getMoreInfo', "onclick": "getMoreInfo();return false"}).text(chrome.i18n.getMessage('injGetMoreInf')));
        $('#getMoreInfo').click(getMoreInfoSaPi);
		getBans(this.response.id);
	})
}

/**
 * Function add info about player on TruckersMP page!
 * append DIV-container(class "SaPi") to "thead"
 */
function infoInTruckersMP(id) {
    var url = "https://api.truckersmp.com/v2/player/" + id;
	$.getJSON(url, function (data){
		steamID = data.response.steamID64;
		$('.SaPiSteam').text('');
		$('.SaPiSteam').append($('<a/>', {"href": 'http://steamcommunity.com/profiles/' + steamID, "text": 'Steam'}));
	});
}