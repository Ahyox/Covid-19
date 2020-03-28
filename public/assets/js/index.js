$(document).ready(function () {
    loadStates();
});
function loadStates() {
    firebase.database().ref('states/').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var id = childSnapshot.key;
            var state = childSnapshot.val();
            $('#state').append($('<option>', {
                value: id,
                text: state
            }));
        });
    });
}

$('#state').change(function () {
    var stateId = $(this).val();

    $('#lga').empty().append('<option value="">Please Select</option>');
    firebase.database().ref('lga/' + stateId).once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var id = childSnapshot.key;
            var lga = childSnapshot.val();
            $('#lga').append($('<option>', {
                value: id,
                text: lga
            }));
        });
    });
});

$('#report-case-btn').click(function () {
    $('#reportCaseDialog').show();
});

$('#onSubmitCase').click(function () {
    var state = $('#state option:selected').html();
    var lga = $('#lga option:selected').html();

    if (state === '') {
        $('#state').focus();
        return;
    } else if (lga === '') {
        $('#lga').focus();
        return;
    }

    //var address = lga.replace(" ", "+")+","+state;
    //console.log(address);
    submitData(state, lga);
    
});

function submitData(state, lga) {
    var reportData = {};

    reportData['report/' + state + '/' + lga.replace(" ", "_")] = true;
    firebase.database().ref().update(reportData)
        .then(function () {
            $('#state').val("");
            $('#lga').val("");
            alert("Case was successfully submited.");
            $('#reportCaseDialog').hide();
        })
        .catch(function (error) {
            alert("Report wasn't successful, please try again");
        });
}

$('#closeBtn').click(function(){
    $('#reportCaseDialog').hide();
});
