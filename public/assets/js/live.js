
var data = {};
$('#country').change(function(){
    var country = $(this).val();
    data['name'] = country;
    data['format'] = "undefined";

    $('#loading').show();
    getData();
});


function getData() {
    $.ajax({
        url: 'https://covid-19-data.p.rapidapi.com/country',
        type: 'GET',
        data: data,
        dataType: 'json',
        headers: {
            "x-rapidapi-host": "covid-19-data.p.rapidapi.com",
            "x-rapidapi-key": "6bf8293a94msh5ff920d80804aa5p126b54jsn93f6f613ca60"
        },
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $('#loading').hide();
            $('#contentTable tbody tr').remove();
			var tbody = $('#contentTable tbody');
			var $tr = '';
           $.each(result, function (index, element) {
            let country = element.country;
            let confirmed = element.confirmed;
            let recovered = element.recovered;
            let deaths = element.deaths;

            $tr += '<tr>' +
							'<td>' + confirmed + '</td>' +
							'<td width="30%">' + recovered + '</td>' +
							'<td>' + deaths + '</td>' +
							'</tr>';
           });

           tbody.append($tr);
        },
        error: function (error) {
            $('#loading').hide();
            console.log("error", error);
        }
    });
}