$(document).ready(function() {

    getServerInfo(function() {

        if (localStorage["setting:sortServers"] == 1) {
            this.response.sort(function(a, b) {
                return a.players - b.players
            });
            this.response.reverse();
        };

        for(var index in this.response) {
            var style = 'teal';
            var percent = parseInt(this.response[index].players * 100 / this.response[index].maxplayers);

            if (percent > 30 && percent <= 50) {
                style = 'green'
            } else if (percent > 50 && percent <= 90) {
                style = 'orange'
            } else if (percent > 90) {
                style = 'red'
            };

            if (!this.response[index].online) {
                style = 'white';
            };

			var item = $('<div/>', {"class": 'ui segment'})
				.append($('<div/>', {"class": 'ui top '+ style +' active attached progress', "data-percent": percent})
					.append($('<div/>', {"class": 'bar'})))
				.append($('<span/>').append($('<strong/>').text(this.response[index].game + ' ' + this.response[index].name))
					.append(this.response[index].online ? ": {0} / {1} (+ {2})".f(this.response[index].players, this.response[index].maxplayers, this.response[index].queue) : ": Offline"))
				.append($('<div/>', {"class": 'ui bottom '+ style +' active attached progress', "data-percent": percent})
					.append($('<div/>', {"class": 'bar'})));
			$('#main').append(item);
		}
		$('.progress').progress();
	});

	localizePage();

	$('a').click(function(event) {
        if ($(this).data('href')) {
		  chrome.tabs.create({url: $(this).data('href')});
        };
    });

    $('#go_to_options').on('click', function(event) {
        event.preventDefault();
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
        } else {
            window.open(chrome.runtime.getURL('src/options/index.html'), "_blank");
        }
    });
});